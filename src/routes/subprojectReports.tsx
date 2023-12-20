import { useLiveQuery } from 'electric-sql/react'
import { uuidv7 } from '@kripod/uuidv7'
import { Link, useParams } from 'react-router-dom'

import { SubprojectReports as SubprojectReport } from '../../../generated/client'
import { useElectric } from '../ElectricProvider'
import '../form.css'

export const Component = () => {
  const { subproject_id, project_id } = useParams<{
    subproject_id: string
    project_id: string
  }>()
  const { db } = useElectric()!
  const { results } = useLiveQuery(db.subproject_reports.liveMany())

  const add = async () => {
    await db.subproject_reports.create({
      data: {
        subproject_report_id: uuidv7(),
        subproject_id,
        deleted: false,
        // TODO: add account_id
      },
    })
  }

  const clear = async () => {
    await db.subproject_reports.deleteMany()
  }

  const subprojectReports: SubprojectReport[] = results ?? []

  return (
    <div className="form-container">
      <div className="controls">
        <button className="button" onClick={add}>
          Add
        </button>
        <button className="button" onClick={clear}>
          Clear
        </button>
      </div>
      {subprojectReports.map(
        (subprojectReport: SubprojectReport, index: number) => (
          <p key={index} className="item">
            <Link
              to={`/projects/${project_id}/subprojects/${subproject_id}/reports/${subprojectReport.subproject_report_id}`}
            >
              {subprojectReport.subproject_report_id}
            </Link>
          </p>
        ),
      )}
    </div>
  )
}
