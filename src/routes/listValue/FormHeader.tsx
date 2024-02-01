import { useCallback, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { createListValue } from '../../modules/createRows'
import { useElectric } from '../../ElectricProvider'
import { FormHeader } from '../../components/FormHeader'

export const FormHeaderComponent = memo(({ autoFocusRef }) => {
  const { project_id, list_id, list_value_id } = useParams()
  const navigate = useNavigate()

  const { db } = useElectric()

  const baseUrl = `/projects/${project_id}/lists/${list_id}/values`

  const addRow = useCallback(async () => {
    const listValue = createListValue()
    await db.list_values.create({
      data: { ...listValue, list_id },
    })
    navigate(`${baseUrl}/${listValue.list_value_id}`)
    autoFocusRef.current?.focus()
  }, [autoFocusRef, baseUrl, db.list_values, list_id, navigate])

  const deleteRow = useCallback(async () => {
    await db.list_values.delete({
      where: {
        list_value_id,
      },
    })
    navigate(baseUrl)
  }, [baseUrl, db.list_values, list_value_id, navigate])

  const toNext = useCallback(async () => {
    const listValues = await db.list_values.findMany({
      where: { deleted: false, list_id },
      orderBy: { label: 'asc' },
    })
    const len = listValues.length
    const index = listValues.findIndex((p) => p.list_value_id === list_value_id)
    const next = listValues[(index + 1) % len]
    navigate(`${baseUrl}/${next.list_value_id}`)
  }, [baseUrl, db.list_values, list_id, list_value_id, navigate])

  const toPrevious = useCallback(async () => {
    const listValues = await db.list_values.findMany({
      where: { deleted: false, list_id },
      orderBy: { label: 'asc' },
    })
    const len = listValues.length
    const index = listValues.findIndex((p) => p.list_value_id === list_value_id)
    const previous = listValues[(index + len - 1) % len]
    navigate(`${baseUrl}/${previous.list_value_id}`)
  }, [baseUrl, db.list_values, list_id, list_value_id, navigate])

  return (
    <FormHeader
      title="List Value"
      addRow={addRow}
      deleteRow={deleteRow}
      toNext={toNext}
      toPrevious={toPrevious}
      tableName="list value"
    />
  )
})