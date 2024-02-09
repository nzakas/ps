import { useLiveQuery } from 'electric-sql/react'

import { useElectric } from '../../../ElectricProvider'
import { Places1 } from './Places1'
import { Places2 } from './Places2'
import { Checks1 } from './Checks1'
import { Checks2 } from './Checks2'
import { Actions1 } from './Actions1'
import { Actions2 } from './Actions2'

const layerToComponent = {
  places1: Places1,
  places2: Places2,
  checks1: Checks1,
  checks2: Checks2,
  actions1: Actions1,
  actions2: Actions2,
}

export const TableLayers = () => {
  const { db } = useElectric()!

  const { results: vectorLayerDisplayResults = [] } = useLiveQuery(
    db.vector_layer_displays.liveMany({
      where: { data_table: { not: null }, active: true },
    }),
  )

  return vectorLayerDisplayResults.map((display) => {
    const Component = layerToComponent[display.data_table]

    return <Component key={display.vector_layer_display_id} display={display} />
  })
}
