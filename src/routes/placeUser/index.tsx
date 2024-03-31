import { useCallback, useRef } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams } from 'react-router-dom'
import type { InputProps } from '@fluentui/react-components'

import { useElectric } from '../../ElectricProvider'
import { TextFieldInactive } from '../../components/shared/TextFieldInactive'
import { DropdownField } from '../../components/shared/DropdownField'
import { RadioGroupField } from '../../components/shared/RadioGroupField'
import { getValueFromChange } from '../../modules/getValueFromChange'
import { Header } from './Header'
import { Loading } from '../../components/shared/Loading'

import '../../form.css'

const userWhere = { deleted: false }

export const Component = () => {
  const { place_user_id } = useParams()

  const autoFocusRef = useRef<HTMLInputElement>(null)

  const { db } = useElectric()!
  const { results: row } = useLiveQuery(
    db.place_users.liveUnique({ where: { place_user_id } }),
  )

  const onChange: InputProps['onChange'] = useCallback(
    (e, data) => {
      const { name, value } = getValueFromChange(e, data)
      db.place_users.update({
        where: { place_user_id },
        data: { [name]: value },
      })
    },
    [db.place_users, place_user_id],
  )

  if (!row) return <Loading />

  return (
    <div className="form-outer-container">
      <Header autoFocusRef={autoFocusRef} />
      <div className="form-container">
        <TextFieldInactive
          label="ID"
          name="place_user_id"
          value={row.place_user_id}
        />
        <DropdownField
          label="User"
          name="user_id"
          table="users"
          where={userWhere}
          value={row.user_id ?? ''}
          onChange={onChange}
          autoFocus
          ref={autoFocusRef}
        />
        <RadioGroupField
          label="Role"
          name="role"
          list={['reader', 'editor', 'manager']}
          value={row.role ?? ''}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
