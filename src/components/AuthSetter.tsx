import { memo, useEffect } from 'react'
import { useCorbadoSession } from '@corbado/react'
import { useLiveQuery } from 'electric-sql/react'

import { useElectric } from '../ElectricProvider'

export const AuthSetter = memo(() => {
  const { user: authUser } = useCorbadoSession()

  const { db } = useElectric()!
  const { results: dbUser } = useLiveQuery(
    db.users.liveFirst({
      where: { email: authUser?.email },
      // if app_states is included, dbUser is undefined
      // but works with accounts??!!
      // include: { app_states: true },
    }),
  )
  const { results: appState } = useLiveQuery(
    db.app_states.liveFirst({
      where: { user_id: dbUser?.user_id },
    }),
  )
  console.log('hello AuthSetter.tsx', { dbUser, authUser, appState })

  useEffect(() => {
    // set app_states.authenticated_email if not yet set
    if (
      authUser?.email &&
      dbUser?.user_id &&
      appState &&
      !appState?.authenticated_email
    ) {
      // console.log(
      //   'hello AuthSetter.tsx, useEffect, setting appState.authenticated_email',
      // )
      db.app_states.update({
        where: { app_state_id: appState.app_state_id },
        data: { authenticated_email: authUser.email },
      })
    }
  }, [appState, authUser, db.app_states, dbUser])

  return null
})
