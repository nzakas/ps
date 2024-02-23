import { useCallback, memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Node } from './Node'
import { Observations as Observation } from '../../../generated/client'

type Props = {
  project_id: string
  observation_source_id: string
  observation: Observation
  level?: number
}

export const ObservationNode = memo(
  ({ project_id, observation_source_id, observation, level = 6 }: Props) => {
    const location = useLocation()
    const navigate = useNavigate()

    const urlPath = location.pathname.split('/').filter((p) => p !== '')
    const isOpen =
      urlPath[0] === 'projects' &&
      urlPath[1] === project_id &&
      urlPath[2] === 'observation-sources' &&
      urlPath[3] === observation_source_id &&
      urlPath[4] === 'observations' &&
      urlPath[5] === observation.observation_id
    const isActive = isOpen && urlPath.length === level

    const baseUrl = `/projects/${project_id}/observation-sources/${observation_source_id}/observations`

    const onClickButton = useCallback(() => {
      if (isOpen) return navigate(baseUrl)
      navigate(`${baseUrl}/${observation.observation_id}`)
    }, [isOpen, navigate, baseUrl, observation.observation_id])

    // TODO: childrenCount
    return (
      <Node
        node={observation}
        level={level}
        isOpen={isOpen}
        isInActiveNodeArray={isOpen}
        isActive={isActive}
        childrenCount={0}
        to={`${baseUrl}/${observation.observation_id}`}
        onClickButton={onClickButton}
      />
    )
  },
)
