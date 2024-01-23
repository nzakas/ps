import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Node } from './Node'
import { SubprojectTaxa as SubprojectTaxon } from '../../../generated/client'

export const SubprojectTaxonNode = ({
  project_id,
  subproject_id,
  subprojectTaxon,
  level = 6,
}: {
  project_id: string
  subproject_id: string
  subprojectTaxon: SubprojectTaxon
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
    urlPath[4] === 'taxa' &&
    urlPath[5] === subprojectTaxon.subproject_taxon_id
  const isActive = isOpen && urlPath.length === level

  const onClickButton = useCallback(() => {
    if (isOpen)
      return navigate(
        `/projects/${project_id}/subprojects/${subproject_id}/taxa`,
      )
    navigate(
      `/projects/${project_id}/subprojects/${subproject_id}/taxa/${subprojectTaxon.subproject_taxon_id}`,
    )
  }, [
    isOpen,
    navigate,
    subprojectTaxon.subproject_taxon_id,
    project_id,
    subproject_id,
  ])

  return (
    <Node
      node={subprojectTaxon}
      level={level}
      isOpen={isOpen}
      isInActiveNodeArray={isOpen}
      isActive={isActive}
      childrenCount={0}
      to={`/projects/${project_id}/subprojects/${subproject_id}/taxa/${subprojectTaxon.subproject_taxon_id}`}
      onClickButton={onClickButton}
    />
  )
}