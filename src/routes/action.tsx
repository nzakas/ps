import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams, useNavigate } from 'react-router-dom'
import { Switch } from '@fluentui/react-components'

import { Actions as Action } from '../../../generated/client'
import { action as createActionPreset } from '../modules/dataPresets'
import { useElectric } from '../ElectricProvider'
import { TextFieldInactive } from '../components/shared/TextFieldInactive'
import { DateField } from '../components/shared/DateField'
import { getValueFromChange } from '../modules/getValueFromChange'
import { FormMenu } from '../components/FormMenu'

import '../form.css'

export const Component = () => {
  const { project_id, subproject_id, place_id, action_id } = useParams()
  const navigate = useNavigate()

  const { db } = useElectric()
  const { results } = useLiveQuery(
    () => db.actions.liveUnique({ where: { action_id } }),
    [action_id],
  )

  const addRow = useCallback(async () => {
    const newAction = createActionPreset()
    await db.actions.create({
      data: { ...newAction, place_id },
    })
    navigate(
      `/projects/${project_id}/subprojects/${subproject_id}/places/${place_id}/actions/${newAction.action_id}`,
    )
  }, [db.actions, navigate, place_id, project_id, subproject_id])

  const deleteRow = useCallback(async () => {
    await db.actions.delete({
      where: {
        action_id,
      },
    })
    navigate(
      `/projects/${project_id}/subprojects/${subproject_id}/places/${place_id}/actions`,
    )
  }, [action_id, db.actions, navigate, place_id, project_id, subproject_id])

  const row: Action = results

  const onChange = useCallback(
    (e, data) => {
      const { name, value } = getValueFromChange(e, data)
      db.actions.update({
        where: { action_id },
        data: { [name]: value },
      })
    },
    [db.actions, action_id],
  )

  if (!row) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-container">
      <FormMenu addRow={addRow} deleteRow={deleteRow} tableName="action" />
      <TextFieldInactive label="ID" name="action_id" value={row.action_id} />
      <DateField
        label="Date"
        name="date"
        value={row.date}
        onChange={onChange}
      />
      <Switch
        label="relevant for reports"
        name="relevant_for_reports"
        checked={row.relevant_for_reports ?? false}
        onChange={onChange}
      />
    </div>
  )
}
