import React, { createRef } from 'react'
import { RouterProvider } from 'react-router-dom'
import { FluentProvider } from '@fluentui/react-components'
import { CorbadoProvider, useCorbadoSession } from '@corbado/react'

import * as LR from '@uploadcare/blocks'
LR.FileUploaderRegular.shadowStyles = /* CSS */ `
  :host lr-copyright {
    display: none;
  }
  :host lr-simple-btn {
    display: none;
  }
`
LR.registerBlocks(LR)

import { styleSheet } from './css'
import 'allotment/dist/style.css'
import './style.css'

import { useElectric } from './ElectricProvider'
import { ElectricWrapper as ElectricProvider } from './ElectricWrapper'
import { lightTheme } from './modules/theme'
import { router } from './router'
import { SqlInitializer } from './components/SqlInitializer'
import { Syncer } from './components/Syncer'
import { UploaderContext } from './UploaderContext'
import { AuthSetter } from './components/AuthSetter'

const CORBADO_PROJECT_ID = import.meta.env.ELECTRIC_CORBADO_PROJECT_ID

const routerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
}

const RouterProviderWithDb = () => {
  const { db } = useElectric()!
  const { user: authUser } = useCorbadoSession()
  // confirmed: this only runs once
  // console.log('RouterProviderWithDb', { db })

  return (
    <RouterProvider
      router={router({ db, authUser })}
      future={{ v7_startTransition: true }}
    />
  )
}

export default function App() {
  // console.log('App, theme:', customLightTheme)
  const uploaderRef = createRef<HTMLElement | null>(null)

  return (
    <CorbadoProvider
      projectId={CORBADO_PROJECT_ID}
      // add more config options here (styling, language, etc.)
    >
      <ElectricProvider>
        <lr-upload-ctx-provider
          ref={uploaderRef}
          ctx-name="uploadcare-uploader"
        ></lr-upload-ctx-provider>
        <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
        <FluentProvider theme={lightTheme}>
          <div style={routerContainerStyle}>
            <SqlInitializer />
            <Syncer />
            <AuthSetter />
            <UploaderContext.Provider value={uploaderRef}>
              <RouterProviderWithDb />
            </UploaderContext.Provider>
          </div>
        </FluentProvider>
      </ElectricProvider>
    </CorbadoProvider>
  )
}
