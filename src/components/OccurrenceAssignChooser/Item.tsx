import { memo, useCallback } from 'react'
import { MenuItem } from '@fluentui/react-components'

import { useElectric } from '../../ElectricProvider.tsx'

interface Props {
  place: { place_id: string; label: string; distance: number }
  occurrenceId: uuid
  appStateId: uuid
}

export const Item = memo(({ place, occurrenceId, appStateId }: Props) => {
  // if multiple places are close to the dropped location,
  // assignToNearestDroppable will set an array of: place_id's, labels and distances
  // if so, a dialog will open to choose the place to assign
  const { db } = useElectric()!

  const onClick = useCallback(async () => {
    await db.occurrences.update({
      where: { occurrence_id: occurrenceId },
      data: { place_id: place.place_id, not_to_assign: null },
    })
    // reset state
    db.app_states.update({
      where: { app_state_id: appStateId },
      data: { places_to_assign_occurrence_to: null },
    })
  }, [appStateId, db.app_states, db.occurrences, occurrenceId, place])

  return (
    <MenuItem onClick={onClick}>{`${
      place.label
    } (${new Intl.NumberFormat().format(
      Math.round(place.distance * 1000),
    )}m)`}</MenuItem>
  )
})
