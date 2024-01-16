import { useCallback, useState } from 'react'
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
  Overflow,
  useIsOverflowItemVisible,
  useOverflowMenu,
} from '@fluentui/react-components'
import { useMatches, useNavigate } from 'react-router-dom'
import { useResizeDetector } from 'react-resize-detector'

import { BreadcrumbForData } from './BreadcrumbForData'
import { BreadcrumbForFolder } from '../BreadcrumbForFolder'
import { BsCaretDown } from 'react-icons/bs'
import { Matches } from './Matches'
import './breadcrumbs.css'

const OverflowMenuItem: React.FC = ({ id, match, upRerenderInteger }) => {
  const navigate = useNavigate()
  const isVisible = useIsOverflowItemVisible(id)

  const onClick = useCallback(() => {
    // console.log('OverflowMenuItem, onClick')
    navigate(match.pathname)
    // somehow nav icon is not rendered without this
    upRerenderInteger()
  }, [match.pathname, navigate, upRerenderInteger])
  const { table, folder } = match?.handle?.crumb?.(match) ?? {}

  if (isVisible) {
    return null
  }

  return (
    <MenuItem onClick={onClick}>
      {table === 'root' || folder === false ? (
        <BreadcrumbForFolder match={match} forOverflowMenu />
      ) : (
        <BreadcrumbForData match={match} forOverflowMenu />
      )}
    </MenuItem>
  )
}

const OverflowMenu: React.FC = ({ matches, upRerenderInteger }) => {
  const { ref, overflowCount, isOverflowing } = useOverflowMenu()

  if (!isOverflowing) {
    return null
  }

  return (
    <Menu openOnHover>
      <MenuTrigger>
        <MenuButton
          className="menu-button"
          ref={ref}
          menuIcon={<BsCaretDown />}
        >
          +{overflowCount}
        </MenuButton>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {matches.map((match) => {
            return (
              <OverflowMenuItem
                key={match.id}
                id={match.id}
                match={match}
                upRerenderInteger={upRerenderInteger}
              />
            )
          })}
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

// problem: menu is not rendered after width changes
// solution: rerender after width changes
export const BreadcrumbsOverflowing = () => {
  const unfilteredMatches = useMatches()

  const [rerenderInteger, setRerenderInteger] = useState(0)
  const upRerenderInteger = useCallback(() => {
    setRerenderInteger((i) => i + 1)
  }, [])

  const matches = unfilteredMatches.filter((match) => match.handle?.crumb)
  const { width, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 100,
    refreshOptions: { leading: false, trailing: true },
  })

  return (
    <Overflow ref={ref} overflowDirection="start" padding={20}>
      <div className="resizable-area">
        <OverflowMenu matches={matches} upRerenderInteger={upRerenderInteger} />
        <Matches
          rerenderInteger={rerenderInteger}
          upRerenderInteger={upRerenderInteger}
          matches={matches}
          width={width}
        />
      </div>
    </Overflow>
  )
}
