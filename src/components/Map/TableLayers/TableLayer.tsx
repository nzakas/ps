import { useState, memo, useCallback, useMemo } from 'react'
import { GeoJSON, useMapEvent } from 'react-leaflet'
import * as ReactDOMServer from 'react-dom/server'
import * as icons from 'react-icons/md'
import { useLiveQuery } from 'electric-sql/react'
import { useCorbadoSession } from '@corbado/react'

import { vectorLayerDisplayToProperties } from '../../../modules/vectorLayerDisplayToProperties'
import { Popup } from '../Popup'
import {
  vector_layers as VectorLayer,
  Places as Place,
  Actions as Action,
  Checks as Check,
  Occurrences as Occurrence,
} from '../../../generated/client'
import { ErrorBoundary } from '../MapErrorBoundary'
import { useElectric } from '../../../ElectricProvider'
import { assignToNearestDroppable } from './assignToNearestDroppable'

interface Props {
  data: Place[] | Action[] | Check[] | Occurrence[]
  layer: VectorLayer
  form?: React.FC
}

export const TableLayer = memo(({ data, layer }: Props) => {
  const { user: authUser } = useCorbadoSession()
  const { db } = useElectric()!

  const layerNameForState = layer?.label?.replace?.(/ /g, '-')?.toLowerCase?.()
  const { results: appState } = useLiveQuery(
    db.app_states.liveFirst({ where: { user_email: authUser?.email } }),
  )
  const draggableLayers = useMemo(
    () => appState?.draggable_layers ?? [],
    [appState?.draggable_layers],
  )
  const isDraggable = draggableLayers.includes(layerNameForState)
  // const droppableLayer = appState?.droppable_layer

  // adapt to multiple vector_layer_displays
  const vectorLayerDisplays = layer.vector_layer_displays
  const firstDisplay = vectorLayerDisplays?.[0]

  const displayFromFeature = useCallback(
    (feature) => {
      // display_by_property_field is _not_ under the data property
      // as passing the data object to feature.properties lead to errors
      const displayToUse = (vectorLayerDisplays ?? []).find(
        (vld) =>
          vld.display_property_value ===
          feature.properties?.[layer?.display_by_property_field],
      )

      return displayToUse ?? firstDisplay
    },
    [firstDisplay, layer?.display_by_property_field, vectorLayerDisplays],
  )

  const map = useMapEvent('zoomend', () => setZoom(map.getZoom()))
  const [zoom, setZoom] = useState(map.getZoom())

  if (!appState) return null
  if (!firstDisplay) return null
  if (!layer) return null
  // include only if zoom between min_zoom and max_zoom
  if (layer.min_zoom !== undefined && zoom < layer.min_zoom) return null
  if (layer.max_zoom !== undefined && zoom > layer.max_zoom) return null
  if (!data?.length) return null

  const mapSize = map.getSize()

  return (
    <ErrorBoundary layer={layer}>
      <GeoJSON
        key={`${data.length ?? 0}/${JSON.stringify(firstDisplay)}`}
        data={data}
        // style by properties, use a function that receives the feature: https://stackoverflow.com/a/66106512/712005
        style={(feature) => {
          // need to choose display to pass in
          const displayToUse = displayFromFeature(feature)

          return vectorLayerDisplayToProperties({
            vectorLayerDisplay: displayToUse,
          })
        }}
        pointToLayer={(feature, latlng) => {
          const displayToUse = displayFromFeature(feature)

          if (displayToUse.marker_type === 'circle') {
            const marker = L.circleMarker(latlng, {
              ...displayToUse,
              radius: displayToUse.circle_marker_radius ?? 8,
            })

            if (!isDraggable) return marker
            // Problem: circleMarker has not draggable property
            // see: https://stackoverflow.com/a/43417693/712005

            // extract trackCursor as a function so this specific
            // "mousemove" listener can be removed on "mouseup" versus
            // all listeners if we were to use map.off("mousemove")
            const trackCursor = (e) => {
              marker.setLatLng(e.latlng)
            }

            marker.on('mousedown', function () {
              map.dragging.disable()
              map.on('mousemove', trackCursor)
            })

            marker.on('mouseup', function (e) {
              map.dragging.enable()
              map.off('mousemove', trackCursor)
              console.log(
                'hello TableLayer circleMarker on marker mouseup, LatLng: ',
                e.latlng,
              )
              // TODO: assign to nearest droppable object
              assignToNearestDroppable({
                db,
                authUser,
                layer,
                latLng: e.latlng,
                occurrenceId: marker.feature.properties?.occurrence_id,
              })
            })

            return marker
          }

          const IconComponent = icons[displayToUse.marker_symbol]

          const marker = IconComponent
            ? L.marker(latlng, {
                icon: L.divIcon({
                  html: ReactDOMServer.renderToString(
                    <IconComponent
                      style={{
                        color: displayToUse.color ?? '#cc756b',
                        fontSize: displayToUse.marker_size ?? 16,
                      }}
                    />,
                  ),
                }),
                draggable: isDraggable,
              })
            : L.marker(latlng, {
                draggable: isDraggable,
              })

          marker.on('dragend', (e) => {
            const position = marker.getLatLng()
            console.log('hello TableLayer marker on dragend', {
              position,
              isDraggable,
              e,
              latlng: e?.target?.getLatLng(),
            })
            // TODO: assign to nearest droppable object
            assignToNearestDroppable({
              db,
              authUser,
              layer,
              latLng: position,
              occurrenceId: marker.feature.properties?.occurrence_id,
            })
          })

          return marker
        }}
        onEachFeature={(feature, _layer) => {
          if (!feature) return
          // draggable markers pop up on dragend (mouseup)
          if (isDraggable) return

          const layersData = [
            {
              label: feature.label,
              properties: Object.entries(feature?.properties ?? {}).map(
                ([key, value]) => {
                  // if value is a date, format it
                  // the date object blows up
                  if (value instanceof Date) {
                    return [key, value.toLocaleString('de-CH')]
                  }
                  return [key, value]
                },
              ),
            },
          ]
          // TODO: idea
          // open form in iframe
          // but: electric-sql syncing errors...
          // const src =
          //   'http://localhost:5173/projects/018cfcf7-6424-7000-a100-851c5cc2c878/subprojects/018cfd27-ee92-7000-b678-e75497d6c60e/places/018dacec-eef1-7000-8801-353c1a84c65b?onlyForm=true'
          // this would definitely work better with qwick
          const popupContent = ReactDOMServer.renderToString(
            <Popup
              layersData={layersData}
              mapSize={mapSize}
              // src={src}
            />,
          )
          _layer.bindPopup(popupContent)
        }}
      />
    </ErrorBoundary>
  )
})
