import React, { useEffect, useCallback, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useLiveQuery } from 'electric-sql/react'
import type { InputProps } from '@fluentui/react-components'

import { SwitchField } from '../SwitchField'
import { ErrorBoundary } from '../ErrorBoundary'
import { ColorPicker } from '../ColorPicker'
import {
  Vector_layers as VectorLayer,
  Vector_layer_displays as VectorLayerDisplay,
} from '../../../generated/client'
import { TextField } from '../TextField'
import { RadioGroupField } from '../RadioGroupField'
import { MarkerSymbolPicker } from './MarkerSymbolPicker'
import { SliderField } from '../SliderField'
import { css } from '../../../css'
import { useElectric } from '../../../ElectricProvider'
import { createVectorLayerDisplay } from '../../../modules/createRows'
import { getValueFromChange } from '../../../modules/getValueFromChange'

// was used to translate
// const markerTypeGerman = {
//   circle: 'Kreis',
//   marker: 'Symbol',
// }
const containerStyle = {
  margin: '25px -10px 0 -10px',
}
const titleRowStyle = {
  backgroundColor: 'rgba(248, 243, 254, 1)',
  flexShrink: 0,
  display: 'flex',
  height: '35px',
  justifyContent: 'space-between',
  padding: '0 10px',
  cursor: 'pointer',
  userSelect: 'none',
  position: 'sticky',
  top: '-11px',
  zIndex: 4,
}
const titleStyle = {
  fontWeight: 'bold',
  marginTop: 'auto',
  marginBottom: 'auto',
}
const fieldsContainerStyle = {
  padding: '15px 10px 10px 10px',
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
}

const lineCapValues = ['butt', 'round', 'square']
const lineJoinValues = ['arcs', 'bevel', 'miter', 'miter-clip', 'round']
const fillRuleValues = ['nonzero', 'evenodd']
const markerTypeValues = ['circle', 'marker']

interface Props {
  userMayEdit: boolean
  row: VectorLayer
}

// TODO: userMayEdit. Was: role in ['account_manager', 'project_manager']
export const VectorLayerDisplayForm = ({
  userMayEdit = true,
}: // row: layer
Props) => {
  const { db } = useElectric()!

  const { vector_layer_id, place_id, check_id, action_id, observation_id } =
    useParams()

  // TODO: only show stuff existing in the layer? BUT: manager should be able to set befor layer exists?
  // if so: get count for points, lines and polygons (fields exist in layer)

  const where = useMemo(
    () =>
      vector_layer_id
        ? { vector_layer_id }
        : check_id
        ? { check_id }
        : action_id
        ? { action_id }
        : observation_id
        ? { observation_id }
        : // place_id needs to come last because it can be hierarchically above the others
        place_id
        ? { place_id }
        : 'none',
    [vector_layer_id, place_id, check_id, action_id, observation_id],
  )
  const { results } = useLiveQuery(
    db.vector_layer_displays.liveFirst({ where }),
  )
  const row: VectorLayerDisplay = results

  const isFirstRender = useRef(true)
  // ensure new one is created if needed
  useEffect(() => {
    const run = async () => {
      // this should NOT run on first render as row is null then anyway
      if (isFirstRender.current) {
        isFirstRender.current = false
        return
      }
      // stop if row already exists
      if (row) return
      const newVLD = createVectorLayerDisplay(where)
      db.vector_layer_displays.create({ data: newVLD })
    }
    run()
  }, [where, db.vector_layer_displays, row])

  const onChange: InputProps['onChange'] = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, data) => {
      const { name, value } = getValueFromChange(e, data)
      db.vector_layer_displays.update({
        where: { vector_layer_display_id: row?.vector_layer_display_id },
        data: { [name]: value },
      })
    },
    [db.vector_layer_displays, row?.vector_layer_display_id],
  )

  if (!row) return null // no spinner as is null until enough data input

  return (
    <ErrorBoundary>
      <div style={containerStyle}>
        <div
          style={css({
            ...titleRowStyle,
            '&:first-of-type': {
              marginTop: '-10px',
            },
          })}
        >
          <div style={titleStyle}>Display</div>
        </div>
        <div style={fieldsContainerStyle}>
          <TextField
            label="Sort"
            name="sort"
            value={row.sort ?? ''}
            onChange={onChange}
            type="number"
            validationMessage="Add a sorting order here if sorting by label is not desired."
          />
          <SwitchField
            label="active"
            name="active"
            value={row.active}
            onChange={onChange}
          />
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
            label="Max number of features"
            name="max_features"
            value={row.max_features ?? ''}
            onChange={onChange}
            type="number"
            validationMessage="Drawing too many features can crash the app. Your mileage may vary."
          />
          <RadioGroupField
            name="marker_type"
            label="Punkt-Typ"
            list={markerTypeValues}
            value={row.marker_type}
            onChange={onChange}
            disabled={!userMayEdit}
          />
          {row.marker_type === 'circle' && (
            <TextField
              name="circle_marker_radius"
              label="Kreis-Radius in Bild-Punkten"
              value={row.circle_marker_radius}
              onChange={onChange}
              type="number"
              disabled={!userMayEdit}
            />
          )}
          {row.marker_type === 'marker' && (
            <>
              <MarkerSymbolPicker
                onChange={onChange}
                value={row.marker_symbol}
              />
              <TextField
                name="marker_size"
                label="Symbol: Grösse (in Bild-Punkten)"
                value={row.marker_size}
                onChange={onChange}
                type="number"
                disabled={!userMayEdit}
              />
            </>
          )}
          <ColorPicker
            id={`${row.id}/color`}
            label="Linien und Punkte: Farbe"
            onChange={onChange}
            color={row.color}
            name="color"
            disabled={!userMayEdit}
          />
          <SliderField
            label="Lines and Points: Opacity (%)"
            name="opacity_percent"
            value={row.opacity_percent ?? ''}
            onChange={onChange}
            max={100}
            min={0}
            step={5}
          />
          <TextField
            name="weight"
            label="Linien: Breite (in Bild-Punkten)"
            value={row.weight}
            onChange={onChange}
            type="number"
            disabled={!userMayEdit}
          />
          <RadioGroupField
            name="line_cap"
            value={row.line_cap}
            label="Linien: Abschluss"
            list={lineCapValues}
            onChange={onChange}
            disabled={!userMayEdit}
          />
          <RadioGroupField
            name="line_join"
            value={row.line_join}
            label="Linien: Ecken"
            list={lineJoinValues}
            onChange={onChange}
            disabled={!userMayEdit}
          />
          <TextField
            name="dash_array"
            label="Linien: Dash-Array"
            value={row.dash_array}
            onChange={onChange}
            disabled={!userMayEdit}
          />
          <TextField
            name="dash_offset"
            label="Linien: Dash-Offset"
            value={row.dash_offset}
            onChange={onChange}
            disabled={!userMayEdit}
          />
          <SwitchField
            label="(Umriss-)Linien zeichnen (Polygone und Kreise)"
            name="stroke"
            value={row.stroke}
            onChange={onChange}
          />
          <SwitchField
            label="Flächen füllen"
            name="fill"
            value={row.fill}
            onChange={onChange}
            disabled={!userMayEdit}
          />
          <ColorPicker
            id={`${row.id}/fill_color`}
            label="Füllung: Farbe"
            name="fill_color"
            onChange={onChange}
            color={row.fill_color}
            disabled={!userMayEdit}
          />
          <SliderField
            label="Fill: Opacity (%)"
            name="fill_opacity_percent"
            value={row.fill_opacity_percent ?? ''}
            onChange={onChange}
            max={100}
            min={0}
            step={5}
          />
          <RadioGroupField
            name="fill_rule"
            value={row.fill_rule}
            label="Füllung: Regel, um den Inhalt von Flächen zu bestimmen"
            list={fillRuleValues}
            onChange={onChange}
            disabled={!userMayEdit}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}