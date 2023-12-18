import { useCallback } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { uuidv7 } from '@kripod/uuidv7'
import { useParams, useNavigate } from 'react-router-dom'
import { Form } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import {
  Button,
  Field,
  Input,
  RadioGroup,
  Radio,
} from '@fluentui/react-components'

import { Projects as Project } from '../../../generated/client'

import '../User.css'

import { useElectric } from '../ElectricProvider'
import { TextField } from '../components/shared/TextField'
import { TextFieldInactive } from '../components/shared/TextFieldInactive'

export const Component = () => {
  const { project_id } = useParams()
  const navigate = useNavigate()
  const { db } = useElectric()
  const { results } = useLiveQuery(
    () => db.projects.liveUnique({ where: { project_id } }),
    [project_id],
  )

  const addRow = async () => {
    const project_id = uuidv7()
    await db.projects.create({
      data: {
        project_id,
        type: 'species',
        subproject_name_singular: 'Art',
        subproject_name_plural: 'Arten',
        values_on_multiple_levels: 'first',
        multiple_action_values_on_same_level: 'all',
        multiple_check_values_on_same_level: 'last',
        files_active: true,
      },
    })
    navigate(`/projects/${project_id}`)
  }

  const deleteRow = async () => {
    await db.projects.delete({
      where: {
        project_id,
      },
    })
    navigate(`/projects`)
  }

  const row: Project = results

  const onChangeFluent = useCallback(
    (e, data) => {
      // console.log('onChangeFluent', { [e.target.name]: e.target.value, data })
      db.projects.update({
        where: { project_id },
        data: { [e.target.name]: data.value },
      })
    },
    [db.projects, project_id],
  )

  if (!row) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-container">
      <div className="controls">
        <Button
          size="large"
          icon={<PlusOutlined />}
          onClick={addRow}
          title="Add new project"
        />
        <Button
          size="large"
          icon={<MinusOutlined />}
          onClick={deleteRow}
          title="Delete project"
        />
      </div>
      <TextFieldInactive label="ID" name="project_id" value={row.project_id} />
      <TextField
        label="Name"
        name="name"
        value={row.name ?? ''}
        onChange={onChangeFluent}
      />
      <Field label="Type">
        <RadioGroup
          layout="horizontal"
          value={row.type ?? ''}
          name="type"
          onChange={onChangeFluent}
        >
          <Radio label="Species" value="species" />
          <Radio label="Biotope" value="biotope" />
        </RadioGroup>
      </Field>
      <TextField
        label="Name of subproject (singular)"
        name="subproject_name_singular"
        value={row.subproject_name_singular ?? ''}
        onChange={onChangeFluent}
      />
      <TextField
        label="Name of subproject (plural)"
        name="subproject_name_plural"
        value={row.subproject_name_plural ?? ''}
        onChange={onChangeFluent}
      />
      <TextField
        label="Order subproject by (field name)"
        name="subproject_order_by"
        value={row.subproject_order_by ?? ''}
        onChange={onChangeFluent}
      />
      <Field label="Value(s) to use when Values exist on multiple place levels">
        <RadioGroup
          layout="horizontal"
          value={row.values_on_multiple_levels ?? ''}
          name="values_on_multiple_levels"
          onChange={onChangeFluent}
        >
          <Radio label="first level" value="first" />
          <Radio label="second level" value="second" />
          <Radio label="all levels" value="all" />
        </RadioGroup>
      </Field>
      <Field label="Value(s) to use when multiple action Values exist on the same place level">
        <RadioGroup
          layout="horizontal"
          value={row.multiple_action_values_on_same_level ?? ''}
          name="multiple_action_values_on_same_level"
          onChange={onChangeFluent}
        >
          <Radio label="first" value="first" />
          <Radio label="last" value="last" />
          <Radio label="all" value="all" />
        </RadioGroup>
      </Field>

      {/* 
        <Form.Item
          label="Value(s) to use when multiple check Values exist on the same place level"
          name="multiple_check_values_on_same_level"
        >
          <Radio.Group value="horizontal">
            <Radio.Button value="first">first</Radio.Button>
            <Radio.Button value="last">last</Radio.Button>
            <Radio.Button value="all">all</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="files_active"
          label="activate files"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item> */}
    </div>
  )
}
