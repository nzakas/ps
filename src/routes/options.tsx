import { useLiveQuery } from 'electric-sql/react'
import { useElectric } from '../ElectricProvider'
import { ListViewHeader } from '../components/ListViewHeader'
import { Row } from '../components/shared/Row'
import '../form.css'

import { user_id } from '../components/SqlInitializer'
import { Ui_options as UiOption } from '../generated/client'

interface UiOptionResult {
  results: UiOption
}

export const Component = () => {
  const { db } = useElectric()!
  const { results: uiOption }: UiOptionResult = useLiveQuery(
    db.ui_options.liveUnique({
      where: { user_id },
    }),
  )

  return (
    <div className="list-view">
      <ListViewHeader title="Options" tableName="option" />
      <div className="list-container">
        <Row label={uiOption?.label} to={`/options/${uiOption?.user_id}`} />
      </div>
    </div>
  )
}
