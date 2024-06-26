import { useRef, memo } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useCorbado } from '@corbado/react'

import { Header } from './Header.tsx'
import { Form } from './Form.tsx'
import { Chart } from './Chart/index.tsx'
import { useElectric } from '../../ElectricProvider.tsx'

import '../../form.css'

// if editing, show form
// if not editing, show chart
export const Component = memo(() => {
  const autoFocusRef = useRef<HTMLInputElement>(null)

  const { user: authUser } = useCorbado()

  const { db } = useElectric()!
  const { results: appState } = useLiveQuery(
    db.app_states.liveFirst({ where: { user_email: authUser?.email } }),
  )
  const designing = appState?.designing

  // prevent Chart from being very shortly loaded while designing is undefined
  return (
    <div className="form-outer-container">
      <Header autoFocusRef={autoFocusRef} />
      {designing !== undefined &&
        (designing ? <Form autoFocusRef={autoFocusRef} /> : <Chart />)}
    </div>
  )
})
