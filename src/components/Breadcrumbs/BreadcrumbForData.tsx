import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'electric-sql/react'

import './breadcrumb.css'
import { MenuComponent } from './Menu'
import { useElectric } from '../../ElectricProvider'
import { idFieldFromTable } from '../../modules/idFieldFromTable'

export const tablesWithoutDeleted = ['root', 'docs', 'accounts', 'messages']

export const Breadcrumb = ({ match }) => {
  const navigate = useNavigate()

  const { text, table } = match?.handle?.crumb?.(match) ?? {}
  const className =
    location.pathname === match.pathname
      ? 'breadcrumbs__crumb is-active'
      : 'breadcrumbs__crumb link'

  const path = match.pathname.split('/')
  path.shift()
  const placesCount = path.filter((p) => p.includes('places')).length
  const levelWanted = placesCount < 2 ? 1 : 2

  const idField = idFieldFromTable(table)
  // filter by parents
  const filterParams = {}
  if (!tablesWithoutDeleted.includes(table)) {
    filterParams.deleted = false
  }

  const parentFilterParamsArray = Object.entries(match.params).filter(
    ([key, value]) => key !== idField, // eslint-disable-line @typescript-eslint/no-unused-vars
  )
  // Add only the last to the filter
  const parentFilter = parentFilterParamsArray.at(-1)
  const grandParentFilter = parentFilterParamsArray.at(-2)
  if (parentFilter) {
    if (grandParentFilter && grandParentFilter[0] === 'places') {
      filterParams['parent_id'] = parentFilter[1]
    } else {
      filterParams[parentFilter[0]] = parentFilter[1]
    }
  }
  if (table === 'places') {
    filterParams.level = levelWanted
  }
  const queryParam = { where: filterParams }
  // if (table === 'projects') {
  //   queryParam.include = { subprojects: true }
  // }
  // if (table === 'subprojects') {
  //   queryParam.include = { projects: true }
  // }
  // include referenced tables needed for the label
  // TODO: this results in zod error: invalid type. expected string, received null
  // https://github.com/electric-sql/electric/issues/782
  // if (table.endsWith('_values')) {
  //   queryParam.include = { units: true }
  // }

  const { db } = useElectric()
  const queryTable = table === 'root' || table === 'docs' ? 'projects' : table

  const { results } = useLiveQuery(db[queryTable]?.liveMany(queryParam))

  const myNavs = (results ?? []).map((result) => ({
    path: `${match.pathname}/${result[idField]}`,
    text: result.label ?? result[idField],
  }))

  const [label, setLabel] = useState(text)
  useEffect(() => {
    const get = async () => {
      if (table !== 'places') return
      const placeLevels =
        (await db.place_levels?.findMany({
          where: {
            project_id: match.params.project_id,
            deleted: false,
            level: levelWanted,
          },
        })) ?? []
      const levelRow = placeLevels[0]
      const label = levelRow?.name_plural ?? levelRow?.name_short ?? 'Places'
      setLabel(label)
    }
    get()
  }, [db, levelWanted, match, match.params, match.params.project_id, table])

  // console.log('BreadcrumbForData', {
  //   myNavs,
  //   match,
  //   results,
  //   idField,
  //   // parentFilterParamsArray,
  //   table,
  //   queryTable,
  //   // filterParams,
  //   queryParam,
  //   // error,
  //   // parentFilter,
  // })

  return (
    <>
      <div className={className} onClick={() => navigate(match.pathname)}>
        <div className="text">{label}</div>
        {myNavs?.length > 0 && <MenuComponent navs={myNavs} />}
      </div>
    </>
  )
}
