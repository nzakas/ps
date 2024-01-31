import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams, useNavigate } from 'react-router-dom'

import { createPlace } from '../../modules/createRows'
import { useElectric } from '../../ElectricProvider'
import { FormHeader } from '../../components/FormHeader'

import '../../form.css'

type Props = {
  autoFocusRef: React.RefObject<HTMLInputElement>
}
export const FormHeaderComponent = ({ autoFocusRef }: Props) => {
  const navigate = useNavigate()
  const { project_id, subproject_id, place_id, place_id2 } = useParams()

  const { db } = useElectric()!
  const { results: placeLevels } = useLiveQuery(
    db.place_levels.liveMany({
      where: {
        deleted: false,
        project_id,
        level: place_id2 ? 2 : 1,
      },
    }),
  )
  const placeNameSingular = placeLevels?.[0]?.name_singular ?? 'Place'

  const baseUrl = `/projects/${project_id}/subprojects/${subproject_id}/places${
    place_id2 ? `/${place_id}/places` : ''
  }`

  const addRow = useCallback(async () => {
    const data = await createPlace({
      db,
      project_id,
      subproject_id,
      parent_id: place_id2 ? place_id : null,
      level: place_id2 ? 2 : 1,
    })
    await db.places.create({ data })
    navigate(`${baseUrl}/${data.place_id}`)
    autoFocusRef.current?.focus()
  }, [
    autoFocusRef,
    baseUrl,
    db,
    navigate,
    place_id,
    place_id2,
    project_id,
    subproject_id,
  ])

  const deleteRow = useCallback(async () => {
    await db.places.delete({
      where: { place_id },
    })
    navigate(baseUrl)
  }, [baseUrl, db.places, navigate, place_id])

  const toNext = useCallback(async () => {
    const places = await db.places.findMany({
      where: {
        deleted: false,
        parent_id: place_id2 ? place_id : null,
        subproject_id,
      },
      orderBy: { label: 'asc' },
    })
    const len = places.length
    const index = places.findIndex((p) => p.place_id === place_id)
    const next = places[(index + 1) % len]
    navigate(`${baseUrl}/${next.place_id}`)
  }, [baseUrl, db.places, navigate, place_id, place_id2, subproject_id])

  const toPrevious = useCallback(async () => {
    const places = await db.places.findMany({
      where: {
        deleted: false,
        parent_id: place_id2 ? place_id : null,
        subproject_id,
      },
      orderBy: { label: 'asc' },
    })
    const len = places.length
    const index = places.findIndex((p) => p.place_id === place_id)
    const previous = places[(index + len - 1) % len]
    navigate(`${baseUrl}/${previous.place_id}`)
  }, [baseUrl, db.places, navigate, place_id, place_id2, subproject_id])

  return (
    <FormHeader
      title={placeNameSingular}
      addRow={addRow}
      deleteRow={deleteRow}
      toNext={toNext}
      toPrevious={toPrevious}
      tableName={placeNameSingular}
    />
  )
}