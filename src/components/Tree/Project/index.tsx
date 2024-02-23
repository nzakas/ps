import { useCallback, memo } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'

import { Node } from '../Node'
import { Projects as Project } from '../../../generated/client'
import { SubprojectsNode } from '../Subprojects'
import { ProjectReportsNode } from '../ProjectReports'
import { PersonsNode } from '../Persons'
import { ListsNode } from '../Lists'
import { TaxonomiesNode } from '../Taxonomies'
import { UnitsNode } from '../Units'
import { TileLayersNode } from '../TileLayers'
import { VectorLayersNode } from '../VectorLayers'
import { ProjectUsersNode } from '../ProjectUsers'
import { PlaceLevelsNode } from '../PlaceLevels'
import { FieldsNode } from '../Fields'
import { ObservationSourcesNode } from '../ObservationSources'
import { FilesNode } from '../Files'
import { Editing } from './Editing'

type Props = {
  project: Project
  level?: number
}
export const ProjectNode = memo(({ project, level = 2 }: Props) => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const urlPath = location.pathname.split('/').filter((p) => p !== '')
  const isOpen =
    urlPath[0] === 'projects' && params.project_id === project.project_id
  const isActive = isOpen && urlPath.length === 2

  const onClickButton = useCallback(() => {
    if (isOpen) return navigate('/projects')
    navigate(`/projects/${project.project_id}`)
  }, [isOpen, navigate, project.project_id])

  return (
    <>
      <Node
        node={project}
        level={level}
        isOpen={isOpen}
        isInActiveNodeArray={isOpen}
        isActive={isActive}
        childrenCount={10}
        to={`/projects/${project.project_id}`}
        onClickButton={onClickButton}
        sibling={<Editing />}
      />
      {isOpen && (
        <>
          <SubprojectsNode project_id={project.project_id} />
          <ProjectReportsNode project_id={project.project_id} />
          <PersonsNode project_id={project.project_id} />
          <ListsNode project_id={project.project_id} />
          <TaxonomiesNode project_id={project.project_id} />
          <UnitsNode project_id={project.project_id} />
          <TileLayersNode project_id={project.project_id} />
          <VectorLayersNode project_id={project.project_id} />
          <ProjectUsersNode project_id={project.project_id} />
          <PlaceLevelsNode project_id={project.project_id} />
          <FieldsNode project_id={project.project_id} />
          <ObservationSourcesNode project_id={project.project_id} />
          <FilesNode project_id={project.project_id} level={3} />
        </>
      )}
    </>
  )
})
