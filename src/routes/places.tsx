import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import { Places as Place } from '../../../generated/client'
import { place as createPlacePreset } from '../modules/dataPresets'
import { useElectric } from '../ElectricProvider'
import { ListViewMenu } from '../components/ListViewMenu'
import '../form.css'

export const Component = () => {
  const navigate = useNavigate()
  const { subproject_id, project_id, place_id } = useParams()

  const { db } = useElectric()
  const where = { deleted: false }
  if (place_id) {
    where.parent_id = place_id
  }
  const { results } = useLiveQuery(db.places.liveMany({ where }))

  const add = useCallback(async () => {
    const newPlace = createPlacePreset()
    const data = { ...newPlace, subproject_id }
    if (place_id) {
      data.parent_id = place_id
      data.level = 2
    }
    await db.places.create({
      data,
    })
    navigate(
      `/projects/${project_id}/subprojects/${subproject_id}/places/${
        place_id ? `${place_id}/places/` : ''
      }${newPlace.place_id}`,
    )
  }, [db.places, navigate, place_id, project_id, subproject_id])

  const places: Place[] = results ?? []

  return (
    <div className="form-container">
      <ListViewMenu addRow={add} tableName="place" />
      {places.map((place: Place, index: number) => (
        <p key={index} className="item">
          <Link
            to={`/projects/${project_id}/subprojects/${subproject_id}/places/${
              place_id ? `${place_id}/places/` : ''
            }${place.place_id}`}
          >
            {place.label ?? place.place_id}
          </Link>
        </p>
      ))}
    </div>
  )
}
