import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams, useNavigate } from 'react-router-dom'
import { Field, RadioGroup, Radio, Switch } from '@fluentui/react-components'

import { Projects as Project } from '../../../generated/client'
import { project as createProjectPreset } from '../modules/dataPresets'
import { useElectric } from '../ElectricProvider'
import { TextField } from '../components/shared/TextField'
import { TextFieldInactive } from '../components/shared/TextFieldInactive'
import { getValueFromChange } from '../modules/getValueFromChange'
import { FormMenu } from '../components/FormMenu'

import '../form.css'

export const Component = () => {
  const { project_id } = useParams()
  const navigate = useNavigate()

  const { db } = useElectric()
  const { results } = useLiveQuery(
    () => db.projects.liveUnique({ where: { project_id } }),
    [project_id],
  )

  const addRow = useCallback(async () => {
    const newProject = createProjectPreset()
    await db.projects.create({
      data: newProject,
    })
    navigate(`/projects/${newProject.project_id}`)
  }, [db.projects, navigate])

  const deleteRow = useCallback(async () => {
    await db.projects.delete({
      where: {
        project_id,
      },
    })
    navigate(`/projects`)
  }, [db.projects, navigate, project_id])

  const row: Project = results

  const onChange = useCallback(
    (e, data) => {
      const { name, value } = getValueFromChange(e, data)
      db.projects.update({
        where: { project_id },
        data: { [name]: value },
      })
    },
    [db.projects, project_id],
  )

  if (!row) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-container">
      <FormMenu addRow={addRow} deleteRow={deleteRow} tableName="project" />
      <TextFieldInactive label="ID" name="project_id" value={row.project_id} />
      <TextField
        label="Name"
        name="name"
        value={row.name ?? ''}
        onChange={onChange}
      />
      <Field label="Type">
        <RadioGroup
          layout="horizontal"
          value={row.type ?? ''}
          name="type"
          onChange={onChange}
        >
          <Radio label="Species" value="species" />
          <Radio label="Biotope" value="biotope" />
        </RadioGroup>
      </Field>
      <TextField
        label="Name of subproject (singular)"
        name="subproject_name_singular"
        value={row.subproject_name_singular ?? ''}
        onChange={onChange}
      />
      <TextField
        label="Name of subproject (plural)"
        name="subproject_name_plural"
        value={row.subproject_name_plural ?? ''}
        onChange={onChange}
      />
      <TextField
        label="Order subproject by (field name)"
        name="subproject_order_by"
        value={row.subproject_order_by ?? ''}
        onChange={onChange}
      />
      <Field label="Value(s) to use when values exist on multiple place levels">
        <RadioGroup
          layout="horizontal"
          value={row.values_on_multiple_levels ?? ''}
          name="values_on_multiple_levels"
          onChange={onChange}
        >
          <Radio label="first level" value="first" />
          <Radio label="second level" value="second" />
          <Radio label="all levels" value="all" />
        </RadioGroup>
      </Field>
      <Field label="Value(s) to use when multiple action values exist on the same place level">
        <RadioGroup
          layout="horizontal"
          value={row.multiple_action_values_on_same_level ?? ''}
          name="multiple_action_values_on_same_level"
          onChange={onChange}
        >
          <Radio label="first" value="first" />
          <Radio label="last" value="last" />
          <Radio label="all" value="all" />
        </RadioGroup>
      </Field>
      <Field label="Value(s) to use when multiple check Values exist on the same place level">
        <RadioGroup
          layout="horizontal"
          value={row.multiple_check_values_on_same_level ?? ''}
          name="multiple_check_values_on_same_level"
          onChange={onChange}
        >
          <Radio label="first" value="first" />
          <Radio label="last" value="last" />
          <Radio label="all" value="all" />
        </RadioGroup>
      </Field>
      <Switch
        label="Enable uploading files to projects"
        name="files_active_projects"
        checked={row.files_active_projects ?? false}
        onChange={onChange}
      />
      <Switch
        label="Enable uploading files to project reports"
        name="files_active_projects_reports"
        checked={row.files_active_projects_reports ?? false}
        onChange={onChange}
      />
      <Switch
        label="Enable uploading files to subprojects"
        name="files_active_subprojects"
        checked={row.files_active_subprojects ?? false}
        onChange={onChange}
      />
      <Switch
        label="Enable uploading files to subproject reports"
        name="files_active_subproject_reports"
        checked={row.files_active_subproject_reports ?? false}
        onChange={onChange}
      />
      <Switch
        label="Enable uploading files to places"
        name="files_active_places"
        checked={row.files_active_places ?? false}
        onChange={onChange}
      />
      <Switch
        label="Enable uploading files to actions"
        name="files_active_actions"
        checked={row.files_active_actions ?? false}
        onChange={onChange}
      />
      <Switch
        label="Enable uploading files to checks"
        name="files_active_checks"
        checked={row.files_active_checks ?? false}
        onChange={onChange}
      />
      <Switch
        label="Enable uploading files to check reports"
        name="files_active_check_reports"
        checked={row.files_active_check_reports ?? false}
        onChange={onChange}
      />
    </div>
  )
}
