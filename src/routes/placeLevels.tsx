import { useLiveQuery } from 'electric-sql/react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import { PlaceLevels as PlaceLevel } from '../../../generated/client'
import { useElectric } from '../ElectricProvider'
import { placeLevel as createPlaceLevelPreset } from '../modules/dataPresets'
import '../form.css'

export const Component = () => {
  const { project_id } = useParams()
  const navigate = useNavigate()

  const { db } = useElectric()
  const { results } = useLiveQuery(
    () => db.place_levels.liveMany({ where: { project_id, deleted: false } }),
    [project_id],
  )

  const add = async () => {
    const newPlaceLevel = createPlaceLevelPreset()
    await db.place_levels.create({
      data: {
        ...newPlaceLevel,
        project_id,
      },
    })
    navigate(
      `/projects/${project_id}/place-levels/${newPlaceLevel.place_level_id}`,
    )
  }

  const clear = async () => {
    await db.place_levels.deleteMany()
  }

  const placeLevels: PlaceLevel[] = results ?? []

  return (
    <div className="form-container">
      <div className="controls">
        <button className="button" onClick={add}>
          Add
        </button>
        <button className="button" onClick={clear}>
          Clear
        </button>
      </div>
      {placeLevels.map((placeLevel: PlaceLevel, index: number) => (
        <p key={index} className="item">
          <Link
            to={`/projects/${project_id}/place-levels/${placeLevel.place_level_id}`}
          >
            {placeLevel.label ?? placeLevel.place_level_id}
          </Link>
        </p>
      ))}
    </div>
  )
}
