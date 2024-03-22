import axios from 'redaxios'
import { point, Point } from '@turf/helpers'
import proj4 from 'proj4'

import {
  Occurrence_imports as OccurrenceImport,
  Electric,
} from '../../../generated/client'

interface Props {
  occurrenceImport: OccurrenceImport
  db: Electric
  setNotification: (notification: string) => void
}

export const setGeometries = async ({
  occurrenceImport,
  db,
  setNotification,
}: Props) => {
  console.log(
    'occurrenceImport 2, setGeometries, occurrenceImport',
    occurrenceImport,
  )
  const system = occurrenceImport.crs?.split?.(':')?.[0]?.toLowerCase?.()
  const number = occurrenceImport.crs?.split?.(':')?.[1]
  // get proj4 definition from https://spatialreference.org/ref/${system}/${number}/proj4.txt
  const proj4Url = `https://spatialreference.org/ref/${system}/${number}/proj4.txt`
  let resp
  try {
    resp = await axios.get(proj4Url)
  } catch (error) {
    console.error('occurrenceImport 2, onBlurCrs, resp error:', error)
    if (error.status === 404) {
      // Tell user that the crs is not found
      return setNotification(
        `No definitions were found for crs '${occurrenceImport.crs}'`,
      )
    }
  }
  const defs = resp?.data
  console.log('occurrenceImport 2, setGeometries', {
    system,
    number,
    proj4Url,
    defs,
  })
  if (!defs) return

  console.log('occurrenceImport 2, setGeometries, defs', defs)

  proj4.defs([
    ['EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs +type=crs'],
    [occurrenceImport.crs, defs],
  ])

  // const occurrences = occurrenceImport?.occurrences ?? []
  const occurrences = await db.occurrences.findMany({
    where: { occurrence_import_id: occurrenceImport?.occurrence_import_id },
  })
  console.log('occurrenceImport 2, setGeometries, occurrences', occurrences)
  const occurrencesWithoutGeometry = occurrences?.filter((o) => !o.geometry)
  console.log(
    'occurrenceImport 2, setGeometries, occurrencesWithoutGeometry',
    occurrencesWithoutGeometry,
  )
  // unfortunately, updateMany can only be used to update many with a same value
  for (const o of occurrencesWithoutGeometry) {
    const coordinates = [
      o.data[occurrenceImport?.x_coordinate_field],
      o.data[occurrenceImport?.y_coordinate_field],
    ]
    console.log('occurrenceImport 2, setGeometries, coordinates', coordinates)
    const position = proj4(occurrenceImport.crs, 'EPSG:4326', coordinates)
    console.log('occurrenceImport 2, setGeometries, position', position)
    // console.log('occurrenceImport 2, onBlurCrs, position', position)
    // TODO: why is reversing needed? is it a bug?
    const geometry: Point = point(position.reverse())
    console.log('occurrenceImport 2, setGeometries, geometry', geometry)
    // console.log('occurrenceImport 2, onBlurCrs, geometry', geometry)
    db.occurrences.update({
      where: { occurrence_id: o.occurrence_id },
      data: { geometry },
    })
  }
}
