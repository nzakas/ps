import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Node } from './Node'
import { Actions as Action, Places as Place } from '../../../generated/client'
import { ActionValuesNode } from './ActionsValues'
import { ActionReportsNode } from './ActionsReports'

export const ActionNode = ({
  project_id,
  subproject_id,
  place_id,
  action,
  place,
  level = 8,
}: {
  project_id: string
  subproject_id: string
  action: Action
  place: Place
  level: number
}) => {
  const location = useLocation()
  const navigate = useNavigate()

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
      urlPath[8] === 'actions' &&
      urlPath[9] === action.action_id
    : isOpenBase && urlPath[6] === 'actions' && urlPath[7] === action.action_id
  const isActive = isOpen && urlPath.length === level

  const baseUrl = `/projects/${project_id}/subprojects/${subproject_id}/places/${
    place_id ?? place.place_id
  }${place_id ? `/places/${place.place_id}` : ''}/actions`

  const onClickButton = useCallback(() => {
    if (isOpen) return navigate(baseUrl)
    navigate(`${baseUrl}/${action.action_id}`)
  }, [isOpen, navigate, baseUrl, action.action_id])

  return (
    <>
      <Node
        node={action}
        level={level}
        isOpen={isOpen}
        isInActiveNodeArray={isOpen}
        isActive={isActive}
        childrenCount={10}
        to={`${baseUrl}/${action.action_id}`}
        onClickButton={onClickButton}
      />
      {isOpen && (
        <>
          <ActionValuesNode
            project_id={project_id}
            subproject_id={subproject_id}
            place_id={place_id}
            action_id={action.action_id}
          />
          <ActionReportsNode
            project_id={project_id}
            subproject_id={subproject_id}
            place_id={place_id}
            action_id={action.action_id}
          />
        </>
      )}
    </>
  )
}