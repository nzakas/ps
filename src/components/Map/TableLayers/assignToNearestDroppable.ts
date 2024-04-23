import pointsWithinPolygon from '@turf/points-within-polygon' // https://turfjs.org/docs/#pointsWithinPolygon
import convex from '@turf/convex' // https://turfjs.org/docs/#convex
import polygonToLine from '@turf/polygon-to-line' // https://turfjs.org/docs/#polygonToLine
import pointToLineDistance from '@turf/point-to-line-distance'
import distance from '@turf/distance'
import { getType } from '@turf/invariant'
import buffer from '@turf/buffer'
import { point, points } from '@turf/helpers'
import { Map } from '@types/leaflet'

import {
  Electric,
  Vector_layers as VectorLayer,
  Places as Place,
} from '../../../generated/client'
import { createNotification } from '../../../modules/createRows'

interface Props {
  db: Electric
  authUser: { email: string }
  layer: VectorLayer
  latLng: [number, number]
  occurrenceId: uuid
  map: Map
}

export const assignToNearestDroppable = async ({
  db,
  authUser,
  latLng,
  occurrenceId,
  map,
}: Props) => {
  let latLngPoint
  try {
    latLngPoint = point([latLng.lng, latLng.lat])
  } catch (error) {
    console.log('hello assignToNearestDroppable', { error })
  }
  let latLngPoints
  try {
    latLngPoints = points([[latLng.lng, latLng.lat]])
  } catch (error) {
    console.log('hello assignToNearestDroppable', { error })
  }
  // TODO: best would be to query using PostGIS functions...
  // 1. get droppable layer
  const appState = await db.app_states.findFirst({
    where: { user_email: authUser?.email },
  })
  const droppableLayer = appState?.droppable_layer
  // 2. get all features from droppable layer
  const places: Place[] = await db.places.findMany({
    where: {
      parent_id: droppableLayer === 'places1' ? null : { not: null },
      geometry: { not: null },
    },
  })

  // 3. get the nearest feature

  // 3.1 direct using nearestPoint
  //     does not work because of the error: coord must be GeoJSON Point or an Array of numbers

  // 3.2 find out if the latLng is inside a feature: https://turfjs.org/docs/#pointsWithinPolygon
  //     Because of featureCollection, use the convex hull: https://turfjs.org/docs/#convex
  const idsOfPlacesContainingLatLng = []
  for (const place of places) {
    console.log(
      'hello assignToNearestDroppable distance 1, place label:',
      place.label,
    )
    console.log(
      'hello assignToNearestDroppable distance 2, geometry:',
      place.geometry,
    )
    // TODO: convexed only works for polygons
    // so buffer the geometry by a small value first
    let bufferedGeometry
    try {
      bufferedGeometry = buffer(place.geometry, 0.000001)
    } catch (error) {
      console.log('hello assignToNearestDroppable 3', { error })
    }
    console.log(
      'hello assignToNearestDroppable distance 4, bufferedGeometry:',
      bufferedGeometry,
    )
    let convexedGeometry
    try {
      convexedGeometry = convex(bufferedGeometry)
    } catch (error) {
      console.log('hello assignToNearestDroppable 5', { error })
    }
    console.log(
      'hello assignToNearestDroppable distance 5, convexedGeometry:',
      convexedGeometry,
    )
    let pointsWithin
    try {
      pointsWithin = pointsWithinPolygon(latLngPoints, convexedGeometry)
    } catch (error) {
      // an error occurres if geometry is not polygon, so ignore
      console.log('hello assignToNearestDroppable 6', { error })
    }
    console.log(
      'hello assignToNearestDroppable distance 7, pointsWithin:',
      pointsWithin,
    )
    const isInside = pointsWithin?.features?.length > 0
    // if isInside, assign, then return
    if (!isInside) continue
    idsOfPlacesContainingLatLng.push(place.place_id)
  }

  // 3.3 if not, find the nearest feature
  // 3.3.1: find nearest center of mass? https://turfjs.org/docs/#centerOfMass, https://turfjs.org/docs/#nearestPoint
  // 3.3.2: better but more work:
  //        create convex outline of all places (https://turfjs.org/docs/#convex),
  //        convert that to a line (https://turfjs.org/docs/#polygonToLine),
  //        for every occurrence find nearest outline (https://turfjs.org/docs/#pointToLineDistance)
  //        choose closest
  //        ISSUE: convex does not work for points are straight lines (https://github.com/Turfjs/turf/issues/2449)
  //        Solution: buffer the feature collection before convexing
  //        alternative solution: https://github.com/Turfjs/turf/issues/1743
  const placeIdsWithDistance = places.map((place) => {
    const placeContainsOccurrence = idsOfPlacesContainingLatLng.includes(
      place.place_id,
    )
    if (placeContainsOccurrence) {
      return { place_id: place.place_id, distance: 0 }
    }

    let bufferedGeometry
    try {
      bufferedGeometry = buffer(place.geometry, 0.000001)
    } catch (error) {
      console.log('hello assignToNearestDroppable 8', { error })
    }
    console.log(
      'hello assignToNearestDroppable distance 9, bufferedGeometry:',
      bufferedGeometry,
    )
    let convexedGeometry
    try {
      convexedGeometry = convex(bufferedGeometry)
    } catch (error) {
      console.log('hello assignToNearestDroppable 10', { error })
    }
    console.log(
      'hello assignToNearestDroppable distance 11, convexedGeometry:',
      convexedGeometry,
    )
    let hullLine
    try {
      hullLine = polygonToLine(convexedGeometry)
    } catch (error) {
      console.log('hello assignToNearestDroppable distance 12', { error })
    }
    console.log(
      'hello assignToNearestDroppable distance 13, hullLine:',
      hullLine,
    )
    let distance
    try {
      distance = pointToLineDistance(latLngPoint, hullLine)
    } catch (error) {
      console.log('hello assignToNearestDroppable distance 14', { error })
    }
    console.log(
      'hello assignToNearestDroppable distance 15, distance:',
      distance,
    )
    return { place_id: place.place_id, distance }
  })
  // get width of map in kilometres
  const mapBounds = map.getBounds()
  const mapNorthEast = mapBounds.getNorthEast()
  const mapNorthWest = mapBounds.getNorthWest()
  const mapWidth = distance(
    point([mapNorthEast.lng, mapNorthEast.lat]),
    point([mapNorthWest.lng, mapNorthWest.lat]),
  )
  const minDistance = mapWidth / 15
  const placeIdsWithMinDistances = placeIdsWithDistance.filter(
    (d) => d.distance < minDistance,
  )
  console.log('hello assignToNearestDroppable distance 14', {
    mapWidth,
    minDistance,
    placeIdsWithMinDistances,
    placeIdsWithDistance,
  })

  if (!placeIdsWithMinDistances.length) {
    // tell user no place found to assign to
    const data = createNotification({
      message: 'No place found to assign to',
      type: 'error',
    })
    db.notifications.create({ data })
  }

  // TODO: really? Maybe better to always confirm?
  if (
    placeIdsWithMinDistances.length === 1 &&
    !appState.confirm_assigning_to_single_target
  ) {
    console.log(
      'hello assignToNearestDroppable 15, assigning as single place found inside min distance',
    )
    const place_id = placeIdsWithMinDistances[0]?.place_id
    // 3.2.1: assign to place
    db.occurrences.update({
      where: { occurrence_id: occurrenceId },
      data: { place_id, not_to_assign: false },
    })
    return
  }
  // TODO: why is point not found?
  // TODO: why does circle tool create a point?
  // TODO: add option to assign without asking
  // multiple places cover the drop point
  // need to ask user to choose
  const placesToAssignOccurrenceTo = {
    occurrence_id: occurrenceId,
    places: placeIdsWithMinDistances.map((p) => ({
      ...p,
      label: places.find((place) => place.place_id === p.place_id)?.label,
    })),
  }
  db.app_states.update({
    where: { app_state_id: appState?.app_state_id },
    data: { places_to_assign_occurrence_to: placesToAssignOccurrenceTo },
  })
}
