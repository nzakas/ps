import { useEffect, useState } from 'react'
import { useMatches, useLocation } from 'react-router-dom'

import { DataNavs } from './DataNavs'
import { ToNavs } from './ToNavs'

export const NavsWrapping = () => {
  const location = useLocation()
  const matches = useMatches()

  const thisPathsMatches = matches.filter(
    (match) => match.pathname === location.pathname && match.handle,
  )

  const [tos, setTos] = useState([])
  useEffect(() => {
    const fetch = async () => {
      const tos = []
      for (const match of thisPathsMatches) {
        const to = await match?.handle?.to?.(match)
        if (!to) continue
        tos.push(to)
      }

      return setTos(tos.filter((to) => Boolean(to)))
    }
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // console.log('Navs', {
  //   matches,
  //   tos,
  //   thisPathsMatches,
  //   pathname: location.pathname,
  // })

  return (
    <nav className="navs">
      {tos?.length ? (
        <ToNavs tos={tos} />
      ) : (
        <DataNavs matches={thisPathsMatches} />
      )}
    </nav>
  )
}
