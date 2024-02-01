import { useCallback, useMemo, useRef } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams } from 'react-router-dom'

import { Fields as Field } from '../../../generated/client'
import { useElectric } from '../../ElectricProvider'
import { TextField } from '../../components/shared/TextField'
import { TextFieldInactive } from '../../components/shared/TextFieldInactive'
import { DropdownFieldSimpleOptions } from '../../components/shared/DropdownFieldSimpleOptions'
import { DropdownField } from '../../components/shared/DropdownField'
import { SwitchField } from '../../components/shared/SwitchField'
import { getValueFromChange } from '../../modules/getValueFromChange'
import { WidgetType } from './WidgetType'
import { Header } from './Header'

import '../../form.css'

export const accountTables = ['projects', 'files']
const projectTables = [
  'action_reports',
  'actions',
  'checks',
  'goal_reports',
  'goals',
  'lists',
  'observation_sources',
  'observations',
  'persons',
  'place_reports',
  'places',
  'project_reports',
  'subproject_reports',
  'subprojects',
  'taxonomies',
]

const widgetsNeedingList = [
  '018ca1a1-9ea1-77a0-a89e-e7dfa92e2cfe',
  '018ca1a1-c94b-7d29-b21c-42053ade0411',
] // options-few, options-many

export const Component = () => {
  const { project_id, field_id } = useParams()

  const autoFocusRef = useRef<HTMLInputElement>(null)

  const { db } = useElectric()
  const { results } = useLiveQuery(
    db.fields.liveUnique({ where: { field_id } }),
  )

  const row: Field = results

  const fieldTypeWhere = useMemo(() => ({ deleted: false }), [])
  const fieldTypeOrderBy = useMemo(() => [{ sort: 'asc' }, { name: 'asc' }], [])

  const onChange = useCallback(
    (e, data) => {
      const { name, value } = getValueFromChange(e, data)
      db.fields.update({
        where: { field_id },
        data: { [name]: value },
      })
    },
    [db.fields, field_id],
  )

  const widgetNeedsList = useMemo(
    () => widgetsNeedingList.includes(row?.widget_type_id),
    [row],
  )

  if (!row) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-outer-container">
      <Header autoFocusRef={autoFocusRef} />
      <div className="form-container">
        <TextFieldInactive label="ID" name="field_id" value={row.field_id} />
        <DropdownFieldSimpleOptions
          label="Table"
          name="table_name"
          value={row.table_name ?? ''}
          onChange={onChange}
          options={project_id ? projectTables : accountTables}
          autoFocus
          ref={autoFocusRef}
          validationMessage={row.table_name ? undefined : 'Required'}
        />
        <TextField
          label="Name"
          name="name"
          value={row.name ?? ''}
          onChange={onChange}
          validationMessage={row.name ? undefined : 'Required'}
        />
        <TextField
          label="Label"
          name="field_label"
          value={row.field_label ?? ''}
          onChange={onChange}
        />
        <DropdownField
          label="Type"
          name="field_type_id"
          table="field_types"
          where={fieldTypeWhere}
          orderBy={fieldTypeOrderBy}
          value={row.field_type_id ?? ''}
          onChange={onChange}
          validationMessage={row.field_type_id ? undefined : 'Required'}
        />
        <WidgetType
          onChange={onChange}
          field_type_id={row.field_type_id}
          value={row.widget_type_id}
        />
        {widgetNeedsList && (
          <DropdownField
            label="List"
            name="list_id"
            table="lists"
            value={row.list_id ?? ''}
            onChange={onChange}
          />
        )}
        <TextField
          label="Preset value"
          name="preset"
          value={row.preset ?? ''}
          onChange={onChange}
        />
        <SwitchField
          label="Obsolete"
          name="obsolete"
          value={row.obsolete ?? false}
          onChange={onChange}
          validationMessage="If obsolete, existing data is shown but, this field will not be available for new records."
        />
      </div>
    </div>
  )
}
