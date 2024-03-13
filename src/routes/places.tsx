import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams, useNavigate } from 'react-router-dom'

import {
  createPlace,
  createVectorLayer,
  createVectorLayerDisplay,
} from '../modules/createRows'
import { useElectric } from '../ElectricProvider'
import { ListViewHeader } from '../components/ListViewHeader'
import { Row } from '../components/shared/Row'
import { LayerMenu } from '../components/shared/LayerMenu'

import '../form.css'

export const Component = () => {
  const navigate = useNavigate()
  const { project_id, subproject_id, place_id } = useParams()

  const { db } = useElectric()!

  const { results: places = [] } = useLiveQuery(
    db.places.liveMany({
      where: { deleted: false, parent_id: place_id ?? null, subproject_id },
      orderBy: { label: 'asc' },
    }),
  )

  const { results: placeLevel } = useLiveQuery(
    db.place_levels.liveFirst({
      where: {
        deleted: false,
        project_id,
        level: place_id ? 2 : 1,
      },
      orderBy: { label: 'asc' },
    }),
  )
  const placeNameSingular = placeLevel?.name_singular ?? 'Place'
  const placeNamePlural = placeLevel?.name_plural ?? 'Places'

  const add = useCallback(async () => {
    const data = await createPlace({
      db,
      project_id,
      subproject_id,
      parent_id: place_id ?? null,
      level: place_id ? 2 : 1,
    })
    await db.places.create({ data })
    // need to create a corresponding vector layer and vector layer display
    const vectorLayer = createVectorLayer({
      project_id,
      type: place_id ? 'places2' : 'places1',
      label: placeNamePlural,
    })
    const newVectorLayer = await db.vector_layers.create({ data: vectorLayer })
    const newVLD = createVectorLayerDisplay({
      vector_layer_id: newVectorLayer.vector_layer_id,
    })
    db.vector_layer_displays.create({ data: newVLD })

    navigate(data.place_id)
  }, [db, navigate, placeNamePlural, place_id, project_id, subproject_id])

  return (
    <div className="list-view">
      <ListViewHeader
        title={placeNamePlural}
        addRow={add}
        tableName={placeNameSingular}
        menus={
          <LayerMenu
            table="places"
            level={place_id ? 2 : 1}
            placeNamePlural={placeNamePlural}
          />
        }
      />
      <div className="list-container">
        {places.map(({ place_id, label }) => (
          <Row key={place_id} to={place_id} label={label ?? place_id} />
        ))}
      </div>
    </div>
  )
}
