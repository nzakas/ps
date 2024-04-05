import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams } from 'react-router-dom'
import type { InputProps } from '@fluentui/react-components'

import { useElectric } from '../ElectricProvider'
import { TextFieldInactive } from '../components/shared/TextFieldInactive'
import { SwitchField } from '../components/shared/SwitchField'
import { getValueFromChange } from '../modules/getValueFromChange'
import { FormHeader } from '../components/FormHeader'
import { Loading } from '../components/shared/Loading'

import '../form.css'

export const Component = () => {
  const { user_id } = useParams()

  const { db } = useElectric()!
  const { results: row } = useLiveQuery(
    db.app_state.liveUnique({ where: { user_id } }),
  )

  const onChange: InputProps['onChange'] = useCallback(
    (e, data) => {
      const { name, value } = getValueFromChange(e, data)
      db.app_state.update({
        where: { user_id },
        data: { [name]: value },
      })
    },
    [db.app_state, user_id],
  )

  if (!row) return <Loading />

  return (
    <div className="form-outer-container">
      <FormHeader title="Options" tableName="options" />
      <div className="form-container">
        <SwitchField
          label="Breadcrumbs overflowing"
          name="breadcrumbs_overflowing"
          value={row.breadcrumbs_overflowing ?? false}
          onChange={onChange}
          validationMessage="If true, breadcrumbs will only use a single line. When they overflow, the overflowing breadcrumbs will be collected in a menu on the left"
          autoFocus
        />
        <SwitchField
          label="Navs overflowing"
          name="navs_overflowing"
          value={row.navs_overflowing ?? false}
          onChange={onChange}
          validationMessage="If true, navs will only use a single line. When they overflow, the overflowing navs will be collected in a menu on the left"
        />
      </div>
    </div>
  )
}
