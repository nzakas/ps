import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams, useNavigate } from 'react-router-dom'
import { Switch } from '@fluentui/react-components'

import { Subprojects as Subproject } from '../../../generated/client'
import { subproject as createSubprojectPreset } from '../modules/dataPresets'
import { useElectric } from '../ElectricProvider'
import { TextField } from '../components/shared/TextField'
import { TextFieldInactive } from '../components/shared/TextFieldInactive'
import { getValueFromChange } from '../modules/getValueFromChange'
import { FormMenu } from '../components/FormMenu'

import '../form.css'

export const Component = () => {
  const { project_id, subproject_id } = useParams()
  const navigate = useNavigate()

  const { db } = useElectric()
  const { results } = useLiveQuery(
    db.subprojects.liveUnique({ where: { subproject_id } }),
  )

  const addRow = useCallback(async () => {
    const newSubproject = createSubprojectPreset()
    await db.subprojects.create({
      data: {
        ...newSubproject,
        project_id,
        // TODO: add account_id
      },
    })
    navigate(
      `/projects/${project_id}/subprojects/${newSubproject.subproject_id}`,
    )
  }, [db.subprojects, navigate, project_id])

  const deleteRow = useCallback(async () => {
    await db.subprojects.delete({
      where: {
        subproject_id,
      },
    })
    navigate(`/projects/${project_id}/subprojects`)
  }, [db.subprojects, navigate, project_id, subproject_id])

  const row: Subproject = results

  const onChange = useCallback(
    (e, data) => {
      const { name, value } = getValueFromChange(e, data)
      db.subprojects.update({
        where: { subproject_id },
        data: { [name]: value },
      })
    },
    [db.subprojects, subproject_id],
  )

  if (!row) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-container">
      <FormMenu
        addRow={addRow}
        deleteRow={deleteRow}
        tableName="subproject" // TODO: use subproject_name_singular
      />
      <TextFieldInactive
        label="ID"
        name="subproject_id"
        value={row.subproject_id ?? ''}
      />
      <TextField
        label="Name"
        name="name"
        value={row.name ?? ''}
        onChange={onChange}
      />
      <TextField
        label="Since year"
        name="since_year"
        value={row.since_year ?? ''}
        type="number"
        onChange={onChange}
      />
      <Switch
        label="Enable uploading files to subprojects"
        name="files_active"
        checked={row.files_active ?? false}
        onChange={onChange}
      />
    </div>
  )
}
