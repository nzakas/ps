// wrapper.tsx
import React, { useEffect, useState } from 'react'
import { ElectricDatabase, electrify } from 'electric-sql/wa-sqlite'
import { Electric, schema } from './generated/client'
import { uniqueTabId } from 'electric-sql/util'
import { LIB_VERSION } from 'electric-sql/version'

import { ElectricProvider } from './ElectricProvider'

import { authToken } from './auth'

export const ElectricWrapper = ({ children }) => {
  const [electric, setElectric] = useState<Electric>()

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const config = {
        debug: import.meta.env.DEV,
        url: import.meta.env.ELECTRIC_SERVICE,
      }

      const { tabId } = uniqueTabId()
      const scopedDbName = `basic-${LIB_VERSION}-${tabId}.db`

      const conn = await ElectricDatabase.init(scopedDbName)
      const electric = await electrify(conn, schema, config)
      await electric.connect(authToken())

      if (!isMounted) {
        return
      }

      setElectric(electric)
    }

    init()

    return () => {
      isMounted = false
    }
  }, [])

  if (electric === undefined) {
    return null
  }

  return <ElectricProvider db={electric}>{children}</ElectricProvider>
}
