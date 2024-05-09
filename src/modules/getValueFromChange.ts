export const getValueFromChange = (e, data) => {
  const targetType = e.target.type
  const name = e.target.name

  switch (targetType) {
    case 'checkbox':
      return { value: data?.checked, name }
    case 'radio':
      return { value: data?.value, name }
    case 'change':
      return { value: data?.value, name }
    case 'number':
      return {
        value: isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber,
        name,
      }
    case 'range':
      return {
        value: isNaN(e.target.valueAsNumber) ? null : data?.valueAsNumber,
        name,
      }
    default:
      return { value: e.target.value ?? null, name }
  }
}
