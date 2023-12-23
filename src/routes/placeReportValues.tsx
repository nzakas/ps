import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { uuidv7 } from '@kripod/uuidv7'
import { Link, useParams } from 'react-router-dom'

import { PlaceReportValues as PlaceReportValue } from '../../../generated/client'
import { useElectric } from '../ElectricProvider'
import '../form.css'

export const Component = () => {
  const { subproject_id, project_id, place_id, place_report_id } = useParams()

  const { db } = useElectric()
  const { results } = useLiveQuery(db.place_report_values.liveMany())

  const add = useCallback(async () => {
    await db.place_report_values.create({
      data: {
        place_report_value_id: uuidv7(),
        place_report_id,
        deleted: false,
        // TODO: add account_id
      },
    })
  }, [db.place_report_values, place_report_id])

  const placeReportValues: PlaceReportValue[] = results ?? []

  return (
    <div className="form-container">
      <div className="controls">
        <button className="button" onClick={add}>
          Add
        </button>
      </div>
      {placeReportValues.map(
        (placeReportValue: PlaceReportValue, index: number) => (
          <p key={index} className="item">
            <Link
              to={`/projects/${project_id}/subprojects/${subproject_id}/places/${place_id}/reports/${place_report_id}/values/${placeReportValue.place_report_value_id}`}
            >
              {placeReportValue.place_report_value_id}
            </Link>
          </p>
        ),
      )}
    </div>
  )
}
