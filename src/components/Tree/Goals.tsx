import { useCallback, useMemo } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useElectric } from '../../ElectricProvider'
import { Node } from './Node'
import { Goals as Goal } from '../../../generated/client'
import { GoalNode } from './Goal'

export const GoalsNode = ({ project_id, subproject_id, level = 5 }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const { db } = useElectric()!
  const { results } = useLiveQuery(
    db.goals.liveMany({
      where: { deleted: false, subproject_id },
      orderBy: { label: 'asc' },
    }),
  )
  const goals: Goal[] = results ?? []

  const goalsNode = useMemo(
    () => ({
      label: `Goals (${goals.length})`,
    }),
    [goals.length],
  )

  const urlPath = location.pathname.split('/').filter((p) => p !== '')
  const isOpen =
    urlPath[0] === 'projects' &&
    urlPath[1] === project_id &&
    urlPath[2] === 'subprojects' &&
    urlPath[3] === subproject_id &&
    urlPath[4] === 'goals'
  const isActive = isOpen && urlPath.length === level

  const onClickButton = useCallback(() => {
    if (isOpen)
      return navigate(`/projects/${project_id}/subprojects/${subproject_id}`)
    navigate(`/projects/${project_id}/subprojects/${subproject_id}/goals`)
  }, [isOpen, navigate, project_id, subproject_id])

  return (
    <>
      <Node
        node={goalsNode}
        level={level}
        isOpen={isOpen}
        isInActiveNodeArray={isOpen}
        isActive={isActive}
        childrenCount={goals.length}
        to={`/projects/${project_id}/subprojects/${subproject_id}/goals`}
        onClickButton={onClickButton}
      />
      {isOpen &&
        goals.map((goal) => (
          <GoalNode
            key={goal.goal_id}
            project_id={project_id}
            subproject_id={subproject_id}
            goal={goal}
            level={level + 1}
          />
        ))}
    </>
  )
}
