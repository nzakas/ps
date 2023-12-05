import React, { useState, useEffect } from 'react'
import { makeElectricContext } from 'electric-sql/react'
import { uniqueTabId } from 'electric-sql/util'
import { ElectricDatabase, electrify } from 'electric-sql/wa-sqlite'

import { authToken } from './auth'
import { DEBUG_MODE, ELECTRIC_URL } from './config'
import { Electric, schema } from './generated/client'
export const { ElectricProvider, useElectric } = makeElectricContext<Electric>()

export function ElectricWrapper({ children }) {
  const [electric, setElectric] = useState<Electric>()

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const config = {
        auth: {
          token: authToken(),
        },
        debug: DEBUG_MODE,
        url: ELECTRIC_URL,
      }

      const { tabId } = uniqueTabId()
      const tabScopedDbName = `electric-${tabId}.db`

      const conn = await ElectricDatabase.init(tabScopedDbName, '')
      const electric = await electrify(conn, schema, config)

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

  // console.log('ElectricWrapper, electric', electric)

  if (electric === undefined) {
    return null
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a
    // typescript error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { db: electric })
    }
    return child
  })

  return <ElectricProvider db={electric}>{childrenWithProps}</ElectricProvider>
}
