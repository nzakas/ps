import { memo } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useCorbadoSession } from '@corbado/react'

import {
  Tile_layers as TileLayer,
  Ui_options as UiOption,
} from '../../../../generated/client'
import { WMS } from './WMS'
// import { WMTSOffline } from './WMTSOffline'
import { LocalMap } from './LocalMap'
import { useElectric } from '../../../../ElectricProvider'

interface Props {
  layer: TileLayer
}

export const TileLayerComponent = memo(({ layer }: Props) => {
  const { user: authUser } = useCorbadoSession()

  const { db } = useElectric()!
  const { results } = useLiveQuery(
    db.app_states.liveFirst({
      where: { authenticated_email: authUser.email },
      select: { local_map_show: true },
    }),
  )
  const uiOption: UiOption = results
  const showLocalMap = uiOption?.local_map_show?.[layer.id]?.show ?? false

  if (layer.type === 'wmts') {
    return (
      <>
        {showLocalMap && <LocalMap layer={layer} />}
        {/* TODO: get offline wmts to work */}
        {/* <WMTSOffline layer={layer} /> */}
      </>
    )
  } else {
    return <WMS layer={layer} />
  }
})
