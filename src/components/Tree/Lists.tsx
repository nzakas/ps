import { useCallback, useMemo, memo } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { useElectric } from '../../ElectricProvider.tsx'
import { Node } from './Node.tsx'
import { ListNode } from './List.tsx'

interface Props {
  project_id: string
  level?: number
}

export const ListsNode = memo(({ project_id, level = 3 }: Props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { db } = useElectric()!
  const { results: lists = [] } = useLiveQuery(
    db.lists.liveMany({
      where: { project_id },
      orderBy: { label: 'asc' },
    }),
  )

  const listsNode = useMemo(
    () => ({ label: `Lists (${lists.length})` }),
    [lists.length],
  )

  const urlPath = location.pathname.split('/').filter((p) => p !== '')
  const isOpen =
    urlPath[0] === 'projects' &&
    urlPath[1] === project_id &&
    urlPath[2] === 'lists'
  const isActive = isOpen && urlPath.length === 3

  const baseUrl = `/projects/${project_id}`

  const onClickButton = useCallback(() => {
    if (isOpen) {
      return navigate({ pathname: baseUrl, search: searchParams.toString() })
    }
    navigate({ pathname: `${baseUrl}/lists`, search: searchParams.toString() })
  }, [baseUrl, isOpen, navigate, searchParams])

  return (
    <>
      <Node
        node={listsNode}
        level={level}
        isOpen={isOpen}
        isInActiveNodeArray={isOpen}
        isActive={isActive}
        childrenCount={lists.length}
        to={`${baseUrl}/lists`}
        onClickButton={onClickButton}
      />
      {isOpen &&
        lists.map((list) => (
          <ListNode key={list.list_id} project_id={project_id} list={list} />
        ))}
    </>
  )
})
