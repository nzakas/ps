import { memo, useMemo } from 'react'
import { Dropdown, Field, Option } from '@fluentui/react-components'
import { useLiveQuery } from 'electric-sql/react'
import axios from 'redaxios'

import { useElectric } from '../../ElectricProvider'
import { Layer_options as LayerOption } from '../../generated/client'

export const DropdownFieldFromLayerOptions = memo(
  ({
    name,
    label,
    tile_layer_id,
    vector_layer_id,
    value,
    onChange,
    validationMessage,
    validationState = 'none',
    row,
  }) => {
    const { db } = useElectric()
    const { results = [] } = useLiveQuery(
      db.layer_options.liveMany({
        where: {
          ...(tile_layer_id ? { tile_layer_id } : {}),
          ...(vector_layer_id ? { vector_layer_id } : {}),
          field: name,
        },
        select: { value: true, label: true },
        orderBy: { label: 'asc' },
      }),
    )
    const layerOptions: LayerOption[] = results
    const options = useMemo(
      () => layerOptions.map(({ value, label }) => ({ value, label })),
      [layerOptions],
    )
    const selectedOptions = useMemo(
      () => options.filter((option) => option.value === value.value),
      [value.value, options],
    )
    const labelWithCount = label
      ? options?.length
        ? `${label} (${options.length})`
        : label
      : '(no label provided)'

    return (
      <Field
        label={labelWithCount}
        validationMessage={validationMessage}
        validationState={validationState}
      >
        <Dropdown
          name={name}
          value={selectedOptions?.[0]?.label ?? ''}
          selectedOptions={selectedOptions}
          onOptionSelect={async (e, data) => {
            onChange({
              target: {
                name,
                value: { label: data.optionText, value: data.optionValue },
              },
            })
            // set the label too
            if (row) {
              onChange({
                target: {
                  name: 'label',
                  value: data.optionText,
                },
              })
            }
            // TODO: download the legend image
            // 1. query the layer_options table for the legend_url
            const legendUrl = layerOptions.find(
              (option) => option.value === data.optionValue,
            )?.legend_url
            // 2. download the legend image
            try {
              res = await axios.get(legendUrl, {
                responseType: 'blob',
              })
            } catch (error) {
              // error can also be caused by timeout
              console.error(
                `error fetching legend for layer '${data.optionText}':`,
                error,
              )
              return false
            }
            // 3. store it in tile_layers.wms_legend
            if (res.data) {
              onChange({
                target: {
                  name: 'wms_legend',
                  value: res.data,
                },
              })
            }
          }}
          appearance="underline"
        >
          {options.map((option) => {
            return (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            )
          })}
        </Dropdown>
      </Field>
    )
  },
)
