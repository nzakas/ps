import { useCallback, memo } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams } from 'react-router-dom'

import { ListViewHeader } from '../components/ListViewHeader'
import { Row } from '../components/shared/Row'
import { createChartSubject } from '../modules/createRows'

import '../form.css'

import { useElectric } from '../ElectricProvider'

export const Component = memo(() => {
  const { project_id, subproject_id, place_id, place_id2, chart_id } =
    useParams()

  const { db } = useElectric()!
  const { results: chartSubjects = [] } = useLiveQuery(
    db.chart_subjects.liveMany({
      where: { chart_id, deleted: false },
      orderBy: { label: 'asc' },
    }),
  )

  const baseUrl = `${project_id ? `/projects/${project_id}` : ''}${
    subproject_id ? `/subprojects/${subproject_id}` : ''
  }${place_id ? `/places/${place_id}` : ''}${
    place_id2 ? `/places/${place_id2}` : ''
  }/charts/${chart_id}/subjects`

  const addRow = useCallback(async () => {
    const data = createChartSubject({ chart_id })
    await db.chart_subjects.create({ data })
    navigate(`${baseUrl}/${data.chart_subject_id}`)
    autoFocusRef.current?.focus()
  }, [baseUrl, chart_id, db.chart_subjects])

  // TODO: get uploader css locally if it should be possible to upload charts
  // offline to sqlite
  return (
    <div className="list-view">
      <ListViewHeader
        title="Chart Subjects"
        tableName="chart subject"
        addRow={addRow}
      />
      <div className="list-container">
        {chartSubjects.map(({ chart_subject_id, label }) => (
          <Row
            key={chart_subject_id}
            label={label}
            to={`${baseUrl}/${chart_subject_id}`}
          />
        ))}
      </div>
    </div>
  )
})
