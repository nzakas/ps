import { useLiveQuery } from 'electric-sql/react'

import { useElectric } from '../../../ElectricProvider'
import {
  Vector_layer_displays as VectorLayerDisplay,
  Places as Place,
} from '../../../generated/client'
import { TableLayer } from './TableLayer'

type Props = {
  display: VectorLayerDisplay
}

export const Places2 = ({ display }: Props) => {
  const { db } = useElectric()!

  // TODO: query only inside current map bounds using places.bbox
  const { results = [] } = useLiveQuery(
    db.places.liveMany({
      where: { parent_id: { not: null }, geometry: { not: null } },
    }),
  )
  const places: Place[] = results

  // a geometry is built as FeatureCollection Object: https://datatracker.ietf.org/doc/html/rfc7946#section-3.3
  // properties need to go into every feature
  const data = places.map((p) => {
    // add p's properties to all features:
    // somehow there is a data property with empty object as value???
    // TODO: make properties more readable for user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { geometry: geom, bbox, data, ...placeProperties } = p
    const geometry = { ...p.geometry }
    geometry.features.forEach((f) => {
      f.properties = placeProperties ?? {}
    })
    return p.geometry
  })
  // console.log('hello Places2, data:', data)

  if (!data?.length) return null
  if (!display) return null

  return <TableLayer data={data} display={display} />
}
