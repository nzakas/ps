import nearestPoint from '@turf/nearest-point' // https://turfjs.org/docs/#nearestPoint
import pointsWithinPolygon from '@turf/points-within-polygon' // https://turfjs.org/docs/#pointsWithinPolygon
import { featureCollection, point, points } from '@turf/helpers'

import {
  Electric,
  Vector_layers as VectorLayer,
  Places as Place,
} from '../../../generated/client'

interface Props {
  db: Electric
  authUser: { email: string }
  layer: VectorLayer
  latLng: [number, number]
  occurrenceId: uuid
}

export const assignToNearestDroppable = async ({
  db,
  authUser,
  layer,
  latLng,
  occurrenceId,
}: Props) => {
  console.log('hello assignToNearestDroppable', { latLng })
  let latLngPoint
  try {
    latLngPoint = point([latLng.lng, latLng.lat])
  } catch (error) {
    console.log('hello assignToNearestDroppable', { error })
  }
  console.log('hello assignToNearestDroppable', { latLngPoint })
  let latLngPoints
  try {
    latLngPoints = points([[latLng.lng, latLng.lat]])
    console.log('hello assignToNearestDroppable', { latLngPoints })
  } catch (error) {
    console.log('hello assignToNearestDroppable', { error })
  }
  // TODO: best would be to query using PostGIS functions...
  // 1. get droppable layer
  const appState = await db.app_states.findFirst({
    where: { user_email: authUser?.email },
  })
  const droppableLayer = appState?.droppable_layer
  console.log('hello assignToNearestDroppable', { appState, droppableLayer })
  // 2. get all features from droppable layer
  const places: Place[] = await db.places.findMany({
    where: {
      parent_id: droppableLayer === 'places1' ? null : { not: null },
      geometry: { not: null },
    },
  })
  console.log('hello assignToNearestDroppable', { places })
  // 3. get the nearest feature
  // 3.1 direct using nearestPoint
  // let nearestPlace
  // try {
  //   nearestPlace = nearestPoint(
  //     latLngPoint,
  //     featureCollection(places.map((p) => p.geometry)),
  //   )
  // } catch (error) {
  //   // Error: coord must be GeoJSON Point or an Array of numbers
  //   console.log('hello assignToNearestDroppable', { error })
  // }
  // console.log('hello assignToNearestDroppable', {
  //   nearestPlace,
  // })
  // 3.2 find out if the latLng is inside a feature: https://turfjs.org/docs/#pointsWithinPolygon
  const placesCoveringLatLng = []
  for (const place of places) {
    let pointsWithin
    try {
      pointsWithin = pointsWithinPolygon(latLngPoints, place.geometry)
    } catch (error) {
      // an error occurres if geometry is not polygon, so ignore
    }
    const isInside = pointsWithin?.features?.length > 0
    console.log('hello assignToNearestDroppable', {
      pointsWithin,
      place,
      isInside,
    })
    // if isInside, assign, then return
    if (!isInside) continue
    placesCoveringLatLng.push(place)
  }
  if (placesCoveringLatLng.length) {
    if (placesCoveringLatLng.length === 1) {
      const place = placesCoveringLatLng[0]
      // 3.2.1: assign to place
      db.occurrences.update({
        where: { occurrence_id: occurrenceId },
        data: { place_id: place.place_id },
      })
    }
    // TODO: multiple places cover the drop point
    // TODO: need to ask user to choose
  }

  // 3.3 if not, find the nearest feature
  // 3.3.1: find nearest center of mass? https://turfjs.org/docs/#centerOfMass, https://turfjs.org/docs/#nearestPoint
  // 3.3.2: better but more work: create outline of all features, then find nearest outline? https://turfjs.org/docs/#pointToLineDistance
}
