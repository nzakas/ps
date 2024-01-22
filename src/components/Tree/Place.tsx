import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Node } from './Node'
import { Places as Place } from '../../../generated/client'
import { ActionsNode } from './Actions'
import { PlaceReportsNode } from './PlaceReports'
import { PlaceUsersNode } from './PlaceUsers'

export const PlaceNode = ({
  project_id,
  subproject_id,
  place,
  level = 6,
}: {
  project_id: string
  subproject_id: string
  place: Place
  level: number
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const urlPath = location.pathname.split('/').filter((p) => p !== '')
  const isOpen =
    urlPath[0] === 'projects' &&
    urlPath[1] === project_id &&
    urlPath[2] === 'subprojects' &&
    urlPath[3] === subproject_id &&
    urlPath[4] === 'places' &&
    urlPath[5] === place.place_id
  const isActive = isOpen && urlPath.length === level

  const onClickButton = useCallback(() => {
    if (isOpen)
      return navigate(
        `/projects/${project_id}/subprojects/${subproject_id}/places`,
      )
    navigate(
      `/projects/${project_id}/subprojects/${subproject_id}/places/${place.place_id}`,
    )
  }, [isOpen, navigate, place.place_id, project_id, subproject_id])

  return (
    <>
      <Node
        node={place}
        level={level}
        isOpen={isOpen}
        isInActiveNodeArray={isOpen}
        isActive={isActive}
        childrenCount={10}
        to={`/projects/${project_id}/subprojects/${subproject_id}/places/${place.place_id}`}
        onClickButton={onClickButton}
      />
      {isOpen && (
        <>
          <ActionsNode
            project_id={project_id}
            subproject_id={subproject_id}
            place_id={place.place_id}
          />
          <PlaceReportsNode
            project_id={project_id}
            subproject_id={subproject_id}
            place_id={place.place_id}
          />
          <PlaceUsersNode
            project_id={project_id}
            subproject_id={subproject_id}
            place_id={place.place_id}
          />
        </>
      )}
    </>
  )
}
