import { useCallback, useMemo, memo } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { useElectric } from '../../ElectricProvider.tsx'
import { Node } from './Node'
import { SubprojectUserNode } from './SubprojectUser'

interface Props {
  project_id: string
  subproject_id: string
  level?: number
}

export const SubprojectUsersNode = memo(
  ({ project_id, subproject_id, level = 5 }: Props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const { db } = useElectric()!
    const { results: subprojectUsers = [] } = useLiveQuery(
      db.subproject_users.liveMany({
        where: { subproject_id },
        orderBy: { label: 'asc' },
      }),
    )

    const subprojectUsersNode = useMemo(
      () => ({ label: `Users (${subprojectUsers.length})` }),
      [subprojectUsers.length],
    )

    const urlPath = location.pathname.split('/').filter((p) => p !== '')
    const isOpen =
      urlPath[0] === 'projects' &&
      urlPath[1] === project_id &&
      urlPath[2] === 'subprojects' &&
      urlPath[3] === subproject_id &&
      urlPath[4] === 'users'
    const isActive = isOpen && urlPath.length === level

    const baseUrl = `/projects/${project_id}/subprojects/${subproject_id}`

    const onClickButton = useCallback(() => {
      if (isOpen) {
        return navigate({ pathname: baseUrl, search: searchParams.toString() })
      }
      navigate({
        pathname: `${baseUrl}/users`,
        search: searchParams.toString(),
      })
    }, [baseUrl, isOpen, navigate, searchParams])

    return (
      <>
        <Node
          node={subprojectUsersNode}
          level={level}
          isOpen={isOpen}
          isInActiveNodeArray={isOpen}
          isActive={isActive}
          childrenCount={subprojectUsers.length}
          to={`${baseUrl}/users`}
          onClickButton={onClickButton}
        />
        {isOpen &&
          subprojectUsers.map((subprojectUser) => (
            <SubprojectUserNode
              key={subprojectUser.subproject_user_id}
              project_id={project_id}
              subproject_id={subproject_id}
              subprojectUser={subprojectUser}
            />
          ))}
      </>
    )
  },
)
