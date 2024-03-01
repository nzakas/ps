export const dataFromChart = async ({ db, chart, subproject_id }) => {
  const subjects = chart.chart_subjects
  const names = subjects.map((subject) => subject.name)

  const dataPerSubject = {}

  for (const subject of subjects) {
    const tableName = subject.table_name
    const name = subject.name

    switch (tableName) {
      case 'checks': {
        const places = await db.places.findMany({
          where: { subproject_id, deleted: false },
        })
        const placeIds = places.map((place) => place.place_id)
        const checks = await db.checks.findMany({
          where: { place_id: { in: placeIds }, deleted: false },
        })
        // use reduce to count checks per year
        const data = checks.reduce((acc, check) => {
          const year = check.date?.getFullYear?.()
          if (!acc[year]) acc[year] = 0
          acc[year]++

          return acc
        }, {})
        dataPerSubject[name] = data
        break
      }
      case 'actions': {
        const places = await db.places.findMany({
          where: { subproject_id, deleted: false },
        })
        const placeIds = places.map((place) => place.place_id)
        const actions = await db.actions.findMany({
          where: { place_id: { in: placeIds }, deleted: false },
        })
        // use reduce to count checks per year
        const data = actions.reduce((acc, check) => {
          const year = check.date?.getFullYear?.()
          if (!acc[year]) acc[year] = 0
          acc[year]++

          return acc
        }, {})
        dataPerSubject[name] = data
        break
      }
      default:
        break
    }
  }

  console.log('hello dataFromChart, dataPerSubject:', dataPerSubject)
  const years = Object.values(dataPerSubject).reduce(
    (acc, data) => [...acc, ...Object.keys(data).map((k) => +k)],
    [],
  )

  console.log('hello dataFromChart, years:', years)
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)
  const yearRange = Array(maxYear - minYear + 1)
    .fill()
    .map((element, i) => minYear + i)
  console.log('hello dataFromChart, yearRange:', yearRange)

  const data = yearRange.map((year) => {
    const yearsData = { year }
    for (const name of names) {
      if (!dataPerSubject[name]?.[year]) continue
      yearsData[name] = dataPerSubject[name]?.[year]
    }

    return yearsData
  })
  console.log('hello dataFromChart, data:', data)

  return { data, years }
}
