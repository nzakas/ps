import { useCallback, useRef } from 'react'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'
import { MapContainer } from 'react-leaflet'
import { useResizeDetector } from 'react-resize-detector'
import { useLiveQuery } from 'electric-sql/react'
import 'leaflet/dist/leaflet.css'
// import 'leaflet-draw/dist/leaflet.draw.css'

import { user_id } from '../SqlInitializer'
import { Ui_options as UiOption } from '../../../generated/client'
import { useElectric } from '../../ElectricProvider'
import { TileLayers } from './TileLayers'

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

export const Map = () => {
  const { db } = useElectric()!
  const { results } = useLiveQuery(
    db.ui_options.liveUnique({ where: { user_id } }),
  )
  const uiOption: UiOption = results
  const showMap = uiOption?.show_map ?? true
  const tileLayerSorter = uiOption?.tile_layer_sorter ?? ''
  // const vectorLayerSorter = uiOption?.vector_layer_sorter ?? ''

  const mapRef = useRef()

  const onResize = useCallback(() => {
    if (!showMap) return
    // console.log('hello Map.onResize')
    mapRef.current?.leafletElement?.invalidateSize()
  }, [mapRef, showMap])
  const { ref: resizeRef } = useResizeDetector({
    onResize,
    refreshMode: 'debounce',
    refreshRate: 300,
    refreshOptions: { trailing: true },
  })

  // const bounds = [
  //   [47.159, 8.354],
  //   [47.696, 8.984],
  // ]
  const position = [51.505, -0.09]

  // console.log('hello Map')

  return (
    <div style={mapContainerStyle} ref={resizeRef}>
      <MapContainer
        className="map-container"
        style={mapContainerStyle}
        // maxZoom={22}
        // minZoom={0}
        // bounds={bounds}
        center={position}
        zoom={13}
        ref={mapRef}
      >
        <TileLayers key={`${tileLayerSorter}/tileLayers`} />
      </MapContainer>
    </div>
  )
}
