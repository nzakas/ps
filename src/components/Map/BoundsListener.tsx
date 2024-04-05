import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useLiveQuery } from 'electric-sql/react'
import { useCorbadoSession } from '@corbado/react'

import { useElectric } from '../../ElectricProvider'

// Problem: when setting bounds from a form query, map is not available
// Solution: use BoundsListener to set bounds from here where map is available
export const BoundsListener = () => {
  const map = useMap()

  const { user: authUser } = useCorbadoSession()

  const { db } = useElectric()!
  const { results: uiOption } = useLiveQuery(
    db.app_states.liveFirst({ where: { authenticated_email: authUser.email } }),
  )
  const mapBounds = uiOption?.map_bounds

  useEffect(() => {
    if (mapBounds) {
      map.fitBounds(mapBounds)
    }
  }, [map, mapBounds])

  return null
}
