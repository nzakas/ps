import { useCallback, useRef } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams, useNavigate } from 'react-router-dom'

import { Vector_layers as VectorLayer } from '../../../generated/client'
import { createVectorLayer } from '../../modules/createRows'
import { useElectric } from '../../ElectricProvider'
import { TextFieldInactive } from '../../components/shared/TextFieldInactive'
import { TextField } from '../../components/shared/TextField'
import { SwitchField } from '../../components/shared/SwitchField'
import { RadioGroupField } from '../../components/shared/RadioGroupField'
import { SliderField } from '../../components/shared/SliderField'
import { getValueFromChange } from '../../modules/getValueFromChange'
import { FormHeader } from '../../components/FormHeader'
import { css } from '../../css'
import { constants } from '../../modules/constants'

import '../../form.css'

const titleRowStyle = {
  margin: '0 -10px 15px -10px',
  backgroundColor: 'rgba(248, 243, 254, 1)',
  flexShrink: 0,
  display: 'flex',
  height: constants.titleRowHeight,
  justifyContent: 'space-between',
  padding: '0 10px',
  cursor: 'pointer',
  userSelect: 'none',
  position: 'sticky',
  top: '-10px',
  zIndex: 4,
}
const titleStyle = {
  fontWeight: 'bold',
  marginTop: 'auto',
  marginBottom: 'auto',
}

export const Component = () => {
  const { project_id, vector_layer_id } = useParams()
  const navigate = useNavigate()

  const autoFocusRef = useRef<HTMLInputElement>(null)

  const { db } = useElectric()
  const { results } = useLiveQuery(
    db.vector_layers.liveUnique({ where: { vector_layer_id } }),
  )

  const baseUrl = `/projects/${project_id}/vector-layers`

  const addRow = useCallback(async () => {
    const vectorLayer = createVectorLayer({ project_id })
    await db.vector_layers.create({ data: vectorLayer })
    navigate(`${baseUrl}/${vectorLayer.vector_layer_id}`)
    autoFocusRef.current?.focus()
  }, [baseUrl, db.vector_layers, navigate, project_id])

  const deleteRow = useCallback(async () => {
    await db.vector_layers.delete({
      where: { vector_layer_id },
    })
    navigate(baseUrl)
  }, [baseUrl, db.vector_layers, navigate, vector_layer_id])

  const toNext = useCallback(async () => {
    const vectorLayers = await db.vector_layers.findMany({
      where: { deleted: false, project_id },
      orderBy: { label: 'asc' },
    })
    const len = vectorLayers.length
    const index = vectorLayers.findIndex(
      (p) => p.vector_layer_id === vector_layer_id,
    )
    const next = vectorLayers[(index + 1) % len]
    navigate(`${baseUrl}/${next.vector_layer_id}`)
  }, [baseUrl, db.vector_layers, navigate, project_id, vector_layer_id])

  const toPrevious = useCallback(async () => {
    const vectorLayers = await db.vector_layers.findMany({
      where: { deleted: false, project_id },
      orderBy: { label: 'asc' },
    })
    const len = vectorLayers.length
    const index = vectorLayers.findIndex(
      (p) => p.vector_layer_id === vector_layer_id,
    )
    const previous = vectorLayers[(index + len - 1) % len]
    navigate(`${baseUrl}/${previous.vector_layer_id}`)
  }, [baseUrl, db.vector_layers, navigate, project_id, vector_layer_id])

  const row: VectorLayer = results

  const onChange = useCallback(
    (e, data) => {
      const { name, value } = getValueFromChange(e, data)
      db.vector_layers.update({
        where: { vector_layer_id },
        data: { [name]: value },
      })
    },
    [db.vector_layers, vector_layer_id],
  )

  if (!row) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-outer-container">
      <FormHeader
        title="Vector Layer"
        addRow={addRow}
        deleteRow={deleteRow}
        toNext={toNext}
        toPrevious={toPrevious}
        tableName="vector layer"
      />
      <div className="form-container">
        <TextFieldInactive
          label="ID"
          name="vector_layer_id"
          value={row.vector_layer_id}
        />
        <TextField
          label="Label"
          name="label"
          value={row.label ?? ''}
          onChange={onChange}
          autoFocus
          ref={autoFocusRef}
        />
        <TextField
          label="Sort"
          name="sort"
          value={row.sort ?? ''}
          onChange={onChange}
          type="number"
          validationMessage="Add a sorting order here if alphabetically by label is not desired."
        />
        <SwitchField
          label="active"
          name="active"
          value={row.active}
          onChange={onChange}
        />
        <RadioGroupField
          label="Type"
          name="type"
          list={['wfs', 'upload']}
          value={row.type ?? ''}
          onChange={onChange}
        />
        {row?.type === 'wfs' && (
          <>
            <div
              style={css({
                ...titleRowStyle,
                '&:first-of-type': {
                  marginTop: '-10px',
                },
              })}
            >
              <div style={titleStyle}>WFS konfigurieren</div>
            </div>
            <TextField
              label="Url"
              name="url"
              value={row.url ?? ''}
              onChange={onChange}
            />
          </>
        )}
        <TextField
          label="Max Zoom"
          name="max_zoom"
          value={row.max_zoom ?? ''}
          onChange={onChange}
          type="number"
          max={19}
          min={0}
          validationMessage="Zoom can be between 0 and 19"
        />
        <TextField
          label="Min Zoom"
          name="min_zoom"
          value={row.min_zoom ?? ''}
          onChange={onChange}
          type="number"
          max={19}
          min={0}
          validationMessage="Zoom can be between 0 and 19"
        />
        <TextField
          label="Type name"
          name="type_name"
          value={row.type_name ?? ''}
          onChange={onChange}
        />
        <TextField
          label="WFS version"
          name="wfs_version"
          value={row.wfs_version ?? ''}
          onChange={onChange}
          validationMessage="often 1.1.0 or 2.0.0"
        />
        <TextField
          label="Output format"
          name="output_format"
          value={row.output_format ?? ''}
          onChange={onChange}
          validationMessage="TODO: needs explanation"
        />
        <SliderField
          label="Opacity (%)"
          name="opacity_percent"
          value={row.opacity_percent ?? ''}
          onChange={onChange}
          max={100}
          min={0}
          step={5}
        />
        <TextField
          label="Max number of features"
          name="max_features"
          value={row.max_features ?? ''}
          onChange={onChange}
          type="number"
          validationMessage="Drawing too many features can crash the app. Your mileage my vary."
        />
        <TextFieldInactive
          label="Feature count"
          name="feature_count"
          value={row.feature_count}
        />
        <TextFieldInactive
          label="Point count"
          name="point_count"
          value={row.point_count}
        />
        <TextFieldInactive
          label="Line count"
          name="line_count"
          value={row.line_count}
        />
        <TextFieldInactive
          label="Polygon count"
          name="polygon_count"
          value={row.polygon_count}
        />
      </div>
    </div>
  )
}