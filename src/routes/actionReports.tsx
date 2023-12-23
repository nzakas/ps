import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { uuidv7 } from '@kripod/uuidv7'
import { Link, useParams } from 'react-router-dom'

import { ActionReports as ActionReport } from '../../../generated/client'
import { useElectric } from '../ElectricProvider'
import '../form.css'

export const Component = () => {
  const { subproject_id, project_id, place_id, action_id } = useParams()

  const { db } = useElectric()
  const { results } = useLiveQuery(db.action_reports.liveMany())

  const add = useCallback(async () => {
    await db.action_reports.create({
      data: {
        action_report_id: uuidv7(),
        action_id,
        deleted: false,
        // TODO: add account_id
      },
    })
  }, [action_id, db.action_reports])

  const actionReports: ActionReport[] = results ?? []

  return (
    <div className="form-container">
      <div className="controls">
        <button className="button" onClick={add}>
          Add
        </button>
      </div>
      {actionReports.map((actionReport: ActionReport, index: number) => (
        <p key={index} className="item">
          <Link
            to={`/projects/${project_id}/subprojects/${subproject_id}/places/${place_id}/actions/${action_id}/reports/${actionReport.action_report_id}`}
          >
            {actionReport.action_report_id}
          </Link>
        </p>
      ))}
    </div>
  )
}
