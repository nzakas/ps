import { useCallback, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsCaretDown } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import './breadcrumb.css'
import { navs } from '../../router'

export const Breadcrumb = ({ match }) => {
  const navigate = useNavigate()

  const { text, table, folder } = match?.handle?.crumb?.(match) ?? {}
  const className =
    location.pathname === match.pathname
      ? 'breadcrumbs__crumb is-active'
      : 'breadcrumbs__crumb link'

  const myNavs = useMemo(() => {
    if (table === 'home' || folder === false) {
      // TODO:
      switch (table) {
        case 'home':
          return navs({ path: '/', match })
          break
        case 'projects':
          return navs({ path: 'project_id', match })
          break
        case 'subprojects':
          return navs({ path: 'subproject_id', match })
          break
        case 'places':
          return navs({ path: 'place_id', match })
          break
        case 'checks':
          return navs({ path: 'check_id', match })
          break
        case 'actions':
          return navs({ path: 'action_id', match })
          break
        case 'action_reports':
          return navs({ path: 'action_report_id', match })
          break
        case 'place_reports':
          return navs({ path: 'place_report_id', match })
          break
        case 'goals':
          return navs({ path: 'goal_id', match })
          break
        case 'goal_reports':
          return navs({ path: 'goal_report_id', match })
          break
        case 'lists':
          return navs({ path: 'list_id', match })
          break
        case 'taxonomies':
          return navs({ path: 'taxonomy_id', match })
          break
        case 'observation_sources':
          return navs({ path: 'observation_source_id', match })
          break
        default:
          return []
          break
      }
    } else {
      console.log('Breadcrumb, should fetch data for table', table)
    }
  }, [folder, match, table])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const closeMenu = useCallback(() => setAnchorEl(null), [])

  // New Idea: active (last) crumb should _not_ be a link
  // Pass Objects with { text, link } to crumb
  // Add arrows between crumbs
  const onClick = useCallback(({ e, table, folder, match }) => {
    e.stopPropagation()
    console.log('clicked', { match, table, folder })
    setAnchorEl(e.currentTarget)
  }, [])

  console.log('Breadcrumb, myNavs', myNavs)

  return (
    <>
      <div className={className} onClick={() => navigate(match.pathname)}>
        <div className="text">{text}</div>
        {myNavs?.length > 0 && (
          <IconButton
            onClick={(e) => onClick({ e, table, folder, match })}
            className="icon"
          >
            <BsCaretDown />
          </IconButton>
        )}
      </div>
      {myNavs?.length > 0 && (
        <Menu
          id="breadcrumb-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={closeMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {myNavs.map(({ path, text }, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                navigate(path)
                setAnchorEl(null)
              }}
            >
              {text}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  )
}
