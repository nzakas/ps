import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useNavigate } from 'react-router-dom'

import { Projects as Project } from '../../../generated/client'
import { createProject } from '../modules/createRows'
import { useElectric } from '../ElectricProvider'
import { ListViewHeader } from '../components/ListViewHeader'
import { Row } from '../components/shared/Row'
import { upsertTableVectorLayersForProject } from '../modules/upsertTableVectorLayersForProject'

import '../form.css'

export const Component = () => {
  const navigate = useNavigate()

  const { db } = useElectric()!
  const { results: projects = [] } = useLiveQuery(
    db.projects.liveMany({
      where: { deleted: false },
      orderBy: { label: 'asc' },
    }),
  )

  const add = useCallback(async () => {
    const data = await createProject({ db })
    await db.projects.create({ data })
    // add vector_layers and vector_layer_displays for tables with geometry
    await upsertTableVectorLayersForProject({ db, project_id: data.project_id })
    navigate(`/projects/${data.project_id}`)
  }, [db, navigate])

  return (
    <div className="list-view">
      <ListViewHeader title="Projects" addRow={add} tableName="project" />
      <div className="list-container">
        {projects.map((project: Project) => (
          <Row
            key={project.project_id}
            label={project.label}
            to={`/projects/${project.project_id}`}
          />
        ))}
      </div>
    </div>
  )
}
