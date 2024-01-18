import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { FluentProvider } from '@fluentui/react-components'
import { hooks, css } from './css'

import './style.css'
import {
  ElectricWrapper as ElectricProvider,
  useElectric,
} from './ElectricProvider'
import { lightTheme } from './modules/theme'
import { router } from './router'
import { SqlInitializer } from './components/SqlInitializer'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const RouterProviderWithDb = () => {
  const { db } = useElectric()!
  // confirmed: this only runs once
  // console.log('RouterProviderWithDb', { db })

  return (
    <RouterProvider router={router(db)} future={{ v7_startTransition: true }} />
  )
}

export default function App() {
  // console.log('App, theme:', customLightTheme)

  return (
    <ElectricProvider>
      <style dangerouslySetInnerHTML={{ __html: hooks }} />
      <SqlInitializer />
      <FluentProvider theme={lightTheme}>
        <div
          style={css({
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          })}
        >
          <RouterProviderWithDb />
        </div>
      </FluentProvider>
    </ElectricProvider>
  )
}
