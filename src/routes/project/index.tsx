import { useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Tab, TabList } from '@fluentui/react-components'
import type { SelectTabData, SelectTabEvent } from '@fluentui/react-components'
import { useLiveQuery } from 'electric-sql/react'
import { useCorbadoSession } from '@corbado/react'

import { Header } from './Header'
import { Form } from './Form'
import { Design } from './Design'
import { useElectric } from '../../ElectricProvider.tsx'

import '../../form.css'

export const Component = () => {
  const autoFocusRef = useRef<HTMLInputElement>(null)

  const { user: authUser } = useCorbadoSession()

  const { db } = useElectric()!

  const { results: appState } = useLiveQuery(
    db.app_states.liveFirst({ where: { user_email: authUser?.email } }),
  )
  const designing = appState?.designing ?? false

  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('projectTab') ?? 'form'
  const onTabSelect = useCallback(
    (event: SelectTabEvent, data: SelectTabData) =>
      setSearchParams({ projectTab: data.value }),
    [setSearchParams],
  )

  return (
    <div className="form-outer-container">
      <Header autoFocusRef={autoFocusRef} />
      <TabList selectedValue={tab} onTabSelect={onTabSelect}>
        <Tab id="form" value="form">
          Form
        </Tab>
        {designing && (
          <Tab id="design" value="design">
            Design
          </Tab>
        )}
        <Tab id="charts" value="charts">
          Charts
        </Tab>
      </TabList>
      {tab === 'form' && <Form autoFocusRef={autoFocusRef} />}
      {tab === 'design' && designing && <Design />}
      {tab === 'charts' && (
        <div
          role="tabpanel"
          aria-labelledby="charts"
          className="form-container"
        >
          <div>charts</div>
        </div>
      )}
    </div>
  )
}
