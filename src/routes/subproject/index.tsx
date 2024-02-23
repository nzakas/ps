import { useCallback, useRef } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Tab, TabList } from '@fluentui/react-components'
import type { SelectTabData, SelectTabEvent } from '@fluentui/react-components'

import { useElectric } from '../../ElectricProvider'
import { Header } from './Header'
import { SubprojectForm } from './Form'

import '../../form.css'

export const Component = () => {
  const { subproject_id } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') ?? 'form'
  const onTabSelect = useCallback(
    (event: SelectTabEvent, data: SelectTabData) =>
      setSearchParams({ tab: data.value }),
    [setSearchParams],
  )

  const autoFocusRef = useRef<HTMLInputElement>(null)

  // const { db } = useElectric()!
  // const { results: row } = useLiveQuery(
  //   db.subprojects.liveUnique({ where: { subproject_id } }),
  // )

  return (
    <div className="form-outer-container">
      <Header autoFocusRef={autoFocusRef} />
      <TabList selectedValue={tab} onTabSelect={onTabSelect}>
        <Tab id="form" value="form">
          Form
        </Tab>
        <Tab id="files" value="files">
          Files
        </Tab>
        <Tab id="analysis" value="analysis">
          Analysis
        </Tab>
      </TabList>
      {tab === 'form' && (
        <div role="tabpanel" aria-labelledby="form">
          <SubprojectForm autoFocusRef={autoFocusRef} />
        </div>
      )}
      {tab === 'files' && (
        <div role="tabpanel" aria-labelledby="files" className="form-container">
          <div>files</div>
        </div>
      )}
      {tab === 'analysis' && (
        <div
          role="tabpanel"
          aria-labelledby="analysis"
          className="form-container"
        >
          <div>analysis</div>
        </div>
      )}
    </div>
  )
}
