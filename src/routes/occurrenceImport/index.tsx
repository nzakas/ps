import { useCallback, useRef } from 'react'
import { useLiveQuery } from 'electric-sql/react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Tab, TabList, InputProps } from '@fluentui/react-components'

import { useElectric } from '../../ElectricProvider'
import { getValueFromChange } from '../../modules/getValueFromChange'
import { Header } from './Header'
import { One } from './1'
import { Two } from './2'
import { Five } from './5'

import '../../form.css'

const tabNumberStyle = {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: 'grey',
  color: 'white',
  fontSize: '0.7em',
  fontWeight: 'bold',
}

export const Component = () => {
  const { occurrence_import_id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabString = searchParams.get('occurrence-import-tab')
  const tab = tabString ? +tabString : 1

  const autoFocusRef = useRef<HTMLInputElement>(null)

  const { db } = useElectric()!
  const { results: occurrenceImport } = useLiveQuery(
    db.occurrence_imports.liveUnique({
      where: { occurrence_import_id },
      include: { occurrences: true },
    }),
  )
  const occurrences = occurrenceImport?.occurrences ?? []
  // const occurrenceFields = Object.keys(occurrences[0] ?? {})
  const occurrenceFields = Object.keys(
    JSON.parse(occurrences?.[0]?.data ?? '{}'),
  )

  const onChange: InputProps['onChange'] = useCallback(
    (e, data) => {
      const { name, value } = getValueFromChange(e, data)
      db.occurrence_imports.update({
        where: { occurrence_import_id },
        data: { [name]: value },
      })
    },
    [db.occurrence_imports, occurrence_import_id],
  )

  const onTabSelect = useCallback(
    (e, data) => {
      searchParams.set('occurrence-import-tab', data.value)
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams],
  )

  const tabStyle = useCallback(
    (tabValue) => ({
      ...tabNumberStyle,
      ...(tab === tabValue
        ? { backgroundColor: 'black' }
        : tab > tabValue
        ? { backgroundColor: 'var(--colorCompoundBrandStrokeHover)' }
        : {}),
    }),
    [tab],
  )

  console.log('OccurrenceImport Route:', {
    occurrenceImport,
    occurrenceFields,
    occurrences,
  })

  // TODO:
  // show stepper-like tabs on new import:
  // 1. basics/data: name, attribution, file
  // 2. geometry: mode (coordinates or geometry), field(s) and projection
  // 3. date: choose how to extract date from fields
  // 4. label: choose how to create label from fields
  // 5. identification: choose id field, previous import and how to extend it
  // 6. execute import (only visible before import)
  // - stepper titles begin with a number in a circle
  // - completed steps: circle is gren
  // - uncompleted steps: circle is grey, title is normal
  // - current step: circle is blue, title is bold
  // - the next stepper can not be accessed before the previous is completed

  return (
    <div className="form-outer-container">
      <Header autoFocusRef={autoFocusRef} />
      <TabList selectedValue={tab} onTabSelect={onTabSelect}>
        <Tab id="1" value={1} icon={<div style={tabStyle(1)}>1</div>}>
          Data
        </Tab>
        <Tab id="2" value={2} icon={<div style={tabStyle(2)}>2</div>}>
          Geometry
        </Tab>
        <Tab id="3" value={3} icon={<div style={tabStyle(3)}>3</div>}>
          Date
        </Tab>
        <Tab id="4" value={4} icon={<div style={tabStyle(4)}>4</div>}>
          Label
        </Tab>
        <Tab id="5" value={5} icon={<div style={tabStyle(5)}>5</div>}>
          Identification
        </Tab>
        <Tab
          id="6"
          value={6}
          icon={<div style={tabStyle(6)}>6</div>}
          disabled={!occurrenceImport?.id_field}
        >
          Import
        </Tab>
      </TabList>
      <div className="form-container">
        {tab === 1 && (
          <One
            occurrenceImport={occurrenceImport}
            onChange={onChange}
            autoFocusRef={autoFocusRef}
          />
        )}
        {tab === 2 && (
          <Two
            occurrenceImport={occurrenceImport}
            occurrenceFields={occurrenceFields}
            onChange={onChange}
          />
        )}
        {tab === 5 && (
          <Five
            occurrenceImport={occurrenceImport}
            occurrenceFields={occurrenceFields}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  )
}
