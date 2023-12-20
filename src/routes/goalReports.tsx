import { useLiveQuery } from 'electric-sql/react'
import { uuidv7 } from '@kripod/uuidv7'
import { Link, useParams } from 'react-router-dom'

import { GoalReports as GoalReport } from '../../../generated/client'
import { useElectric } from '../ElectricProvider'
import '../form.css'

export const Component = () => {
  const { subproject_id, project_id, goal_id } = useParams<{
    subproject_id: string
    goal_id: string
  }>()
  const { db } = useElectric()!
  const { results } = useLiveQuery(db.goal_reports.liveMany())

  const add = async () => {
    await db.goal_reports.create({
      data: {
        goal_report_id: uuidv7(),
        goal_id,
        deleted: false,
        // TODO: add account_id
      },
    })
  }

  const clear = async () => {
    await db.goal_reports.deleteMany()
  }

  const goals: GoalReport[] = results ?? []

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
      {goals.map((goalReport: GoalReport, index: number) => (
        <p key={index} className="item">
          <Link
            to={`/projects/${project_id}/subprojects/${subproject_id}/goals/${goal_id}/reports/${goalReport.goal_report_id}`}
          >
            {goalReport.goal_report_id}
          </Link>
        </p>
      ))}
    </div>
  )
}
