import { useCallback, useMemo } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams, useNavigate } from 'react-router-dom'

import { ActionValues as ActionValue } from '../../../generated/client'
import { actionValue as createActionValuePreset } from '../modules/dataPresets'
import { useElectric } from '../ElectricProvider'
import { TextField } from '../components/shared/TextField'
import { TextFieldInactive } from '../components/shared/TextFieldInactive'
import { getValueFromChange } from '../modules/getValueFromChange'
import { DropdownField } from '../components/shared/DropdownField'
import { FormMenu } from '../components/FormMenu'

import '../form.css'

export const Component = () => {
  const { project_id, subproject_id, place_id, action_id, action_value_id } =
    useParams()
  const navigate = useNavigate()

  const { db } = useElectric()
  const { results } = useLiveQuery(
    () => db.action_values.liveUnique({ where: { action_value_id } }),
    [action_value_id],
  )

  const addRow = useCallback(async () => {
    const newActionValue = createActionValuePreset()
    await db.action_values.create({
      data: {
        ...newActionValue,
        action_id,
      },
    })
    navigate(
      `/projects/${project_id}/subprojects/${subproject_id}/places/${place_id}/actions/${action_id}/values/${newActionValue.action_value_id}`,
    )
  }, [
    action_id,
    db.action_values,
    navigate,
    place_id,
    project_id,
    subproject_id,
  ])

  const deleteRow = useCallback(async () => {
    await db.action_values.delete({
      where: {
        action_value_id,
      },
    })
    navigate(
      `/projects/${project_id}/subprojects/${subproject_id}/places/${place_id}/actions/${action_id}/values`,
    )
  }, [
    action_id,
    action_value_id,
    db.action_values,
    navigate,
    place_id,
    project_id,
    subproject_id,
  ])

  const row: ActionValue = results

  const unitWhere = useMemo(() => ({ use_for_action_values: true }), [])

  const onChange = useCallback(
    (e, data) => {
      const { name, value } = getValueFromChange(e, data)
      db.action_values.update({
        where: { action_value_id },
        data: { [name]: value },
      })
    },
    [db.action_values, action_value_id],
  )

  if (!row) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-container">
      <FormMenu
        addRow={addRow}
        deleteRow={deleteRow}
        tableName="goal report value"
      />
      <TextFieldInactive
        label="ID"
        name="action_value_id"
        value={row.action_value_id ?? ''}
      />
      <DropdownField
        label="Unit"
        name="unit_id"
        table="units"
        where={unitWhere}
        value={row.unit_id ?? ''}
        onChange={onChange}
      />
      <TextField
        label="Value (integer)"
        name="value_integer"
        type="number"
        value={row.value_integer ?? ''}
        onChange={onChange}
      />
      <TextField
        label="Value (numeric)"
        name="value_numeric"
        type="number"
        value={row.value_numeric ?? ''}
        onChange={onChange}
      />
      <TextField
        label="Value (text)"
        name="value_text"
        value={row.value_text ?? ''}
        onChange={onChange}
      />
    </div>
  )
}
