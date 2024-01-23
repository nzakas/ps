import { useCallback, useMemo } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useElectric } from '../../ElectricProvider'
import { Node } from './Node'
import { Actions as Action } from '../../../generated/client'
import { ActionNode } from './Action'

export const ActionsNode = ({
  project_id,
  subproject_id,
  place_id,
  place,
  level = 7,
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const { db } = useElectric()!
  const { results } = useLiveQuery(
    db.actions.liveMany({
      where: { deleted: false, place_id: place.place_id },
      orderBy: { label: 'asc' },
    }),
  )
  const actions: Action[] = results ?? []

  const actionsNode = useMemo(
    () => ({
      label: `Actions (${actions.length})`,
    }),
    [actions.length],
  )

  const urlPath = location.pathname.split('/').filter((p) => p !== '')
  const isOpenBase =
    urlPath[0] === 'projects' &&
    urlPath[1] === project_id &&
    urlPath[2] === 'subprojects' &&
    urlPath[3] === subproject_id &&
    urlPath[4] === 'places' &&
    urlPath[5] === (place_id ?? place.place_id)
  const isOpen = place_id
    ? isOpenBase &&
      urlPath[6] === 'places' &&
      urlPath[7] === place.place_id &&
      urlPath[8] === 'actions'
    : isOpenBase && urlPath[6] === 'actions'
  const isActive = isOpen && urlPath.length === level

  const baseUrl = `/projects/${project_id}/subprojects/${subproject_id}/places/${
    place_id ?? place.place_id
  }${place_id ? `/places/${place.place_id}` : ''}`

  const onClickButton = useCallback(() => {
    if (isOpen) return navigate(baseUrl)
    navigate(`${baseUrl}/actions`)
  }, [baseUrl, isOpen, navigate])

  return (
    <>
      <Node
        node={actionsNode}
        level={level}
        isOpen={isOpen}
        isInActiveNodeArray={isOpen}
        isActive={isActive}
        childrenCount={actions.length}
        to={`${baseUrl}/actions`}
        onClickButton={onClickButton}
      />
      {isOpen &&
        actions.map((action) => (
          <ActionNode
            key={action.action_id}
            project_id={project_id}
            subproject_id={subproject_id}
            place_id={place_id}
            place={place}
            action={action}
            level={level + 1}
          />
        ))}
    </>
  )
}