import { useEffect, useState, forwardRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLiveQuery } from 'electric-sql/react'

import './breadcrumb.css'
import { useElectric } from '../../../ElectricProvider'
import { idFieldFromTable } from '../../../modules/idFieldFromTable'
import { Menu } from './Menu'

export const tablesWithoutDeleted = ['root', 'docs', 'accounts', 'messages']

const isOdd = (num) => num % 2

const siblingStyle = {
  marginLeft: 7,
}

// forwarding refs is crucial for the overflow menu to work
// https://github.com/microsoft/fluentui/issues/27652#issuecomment-1520447241
export const BreadcrumbForData = forwardRef(
  ({ match, forOverflowMenu }, ref) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const { text, table, sibling } = match?.handle?.crumb?.(match) ?? {}
    const className =
      location.pathname === match.pathname
        ? `breadcrumbs__crumb${forOverflowMenu ? '__menu-item' : ''} is-active`
        : `breadcrumbs__crumb${forOverflowMenu ? '__menu-item' : ''} link`

    const path = match.pathname.split('/').filter((p) => p !== '')
    const placesCount = path.filter((p) => p.includes('places')).length
    const levelWanted = placesCount < 2 ? 1 : 2

    const idField = idFieldFromTable(table)
    // filter by parents
    const filterParams = {}
    if (!tablesWithoutDeleted.includes(table)) {
      filterParams.deleted = false
    }

    // Add only the last to the filter
    // Wanted to get it from params. But not useable because also contains lower level ids!!!
    // so need to get it from path which does NOT contain lower levels
    // if length is divisable by two, then it is a parent id
    const indexOfParentId =
      path.length > 1
        ? isOdd(path.length)
          ? path.length - 2
          : path.length - 1
        : undefined
    const parentId = indexOfParentId ? path[indexOfParentId] : undefined
    // need to get the name from the parents as in path is altered
    // for instance: place_report_values > values
    const parentIdName = Object.keys(match.params)
      .find((key) => match.params[key] === parentId)
      ?.replace('place_id2', 'place_id')
    const placesCountInPath = path.filter((p) => p.includes('places')).length
    if (parentIdName && parentId) {
      if (table === 'places' && placesCountInPath === 2) {
        filterParams.parent_id = match.params.place_id
      } else if (table === 'places') {
        filterParams[parentIdName] = parentId
        filterParams.parent_id = null
      } else {
        filterParams[parentIdName] = parentId
      }
    }
    // fields exist in root and in projects
    if (table === 'fields' && !parentId) {
      filterParams.project_id = null
    }
    const queryParam = { where: filterParams, orderBy: { label: 'asc' } }
    // TODO: test including
    // if (table === 'projects') {
    //   queryParam.include = { subprojects: true }
    // }
    // if (table === 'subprojects') {
    //   queryParam.include = { projects: true }
    // }
    // TODO: include referenced tables needed for the label
    // TODO: this results in zod error: invalid type. expected string, received null
    // https://github.com/electric-sql/electric/issues/782
    // if (table.endsWith('_values')) {
    //   queryParam.include = { units: true }
    // }

    const { db } = useElectric()!
    const queryTable = table === 'root' || table === 'docs' ? 'projects' : table

    // console.log('BreadcrumbForData', {
    //   queryTable,
    //   table,
    //   filterParams,
    //   queryParam,
    //   db,
    // })

    const { results } = useLiveQuery(db[queryTable]?.liveMany(queryParam))

    const navs = (results ?? []).map((result) => ({
      path: `${match.pathname}/${result[idField]}`,
      text: result.label ?? result[idField],
    }))

    const [label, setLabel] = useState(text)
    useEffect(() => {
      const get = async () => {
        switch (table) {
          case 'places': {
            const placeLevels =
              (await db.place_levels?.findMany({
                where: {
                  project_id: match.params.project_id,
                  deleted: false,
                  level: levelWanted,
                },
              })) ?? []
            const levelRow = placeLevels[0]
            const label =
              levelRow?.name_plural ?? levelRow?.name_short ?? 'Places'
            setLabel(label)
            break
          }
          case 'subprojects': {
            const project = await db.projects?.findUnique({
              where: { project_id: match.params.project_id },
            })
            const label = project?.subproject_name_plural ?? 'Subprojects'
            setLabel(label)
            break
          }
          default:
            break
        }
      }
      get()
    }, [db, levelWanted, match, match.params, match.params.project_id, table])

    // console.log('BreadcrumbForData', {
    //   table,
    //   params: match.params,
    //   text,
    //   label,
    //   results,
    //   pathname: match.pathname,
    //   filterParams,
    //   idField,
    //   path,
    //   parentId,
    //   parentIdName,
    // })

    return (
      <div
        className={className}
        onClick={() =>
          navigate({
            pathname: match.pathname,
            search: searchParams.toString(),
          })
        }
        ref={ref}
      >
        <div className="text">{label}</div>
        {!!sibling && <div style={siblingStyle}>{sibling}</div>}
        <Menu navs={navs} />
      </div>
    )
  },
)
