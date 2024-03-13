import { useCallback, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useElectric } from '../../ElectricProvider'
import { createSubprojectUser } from '../../modules/createRows'
import { FormHeader } from '../../components/FormHeader'

export const Header = memo(({ autoFocusRef }) => {
  const { subproject_id, subproject_user_id } = useParams()
  const navigate = useNavigate()

  const { db } = useElectric()!

  const addRow = useCallback(async () => {
    const subprojectUser = createSubprojectUser()
    await db.subproject_users.create({
      data: { ...subprojectUser, subproject_id },
    })
    navigate(`../${subprojectUser.subproject_user_id}`)
    autoFocusRef.current?.focus()
  }, [autoFocusRef, db.subproject_users, navigate, subproject_id])

  const deleteRow = useCallback(async () => {
    await db.subproject_users.delete({ where: { subproject_user_id } })
    navigate('..')
  }, [db.subproject_users, navigate, subproject_user_id])

  const toNext = useCallback(async () => {
    const subprojectUsers = await db.subproject_users.findMany({
      where: { deleted: false, subproject_id },
      orderBy: { label: 'asc' },
    })
    const len = subprojectUsers.length
    const index = subprojectUsers.findIndex(
      (p) => p.subproject_user_id === subproject_user_id,
    )
    const next = subprojectUsers[(index + 1) % len]
    navigate(`../${next.subproject_user_id}`)
  }, [db.subproject_users, navigate, subproject_id, subproject_user_id])

  const toPrevious = useCallback(async () => {
    const subprojectUsers = await db.subproject_users.findMany({
      where: { deleted: false, subproject_id },
      orderBy: { label: 'asc' },
    })
    const len = subprojectUsers.length
    const index = subprojectUsers.findIndex(
      (p) => p.subproject_user_id === subproject_user_id,
    )
    const previous = subprojectUsers[(index + len - 1) % len]
    navigate(`../${previous.subproject_user_id}`)
  }, [db.subproject_users, navigate, subproject_id, subproject_user_id])

  return (
    <FormHeader
      title="Subproject User"
      addRow={addRow}
      deleteRow={deleteRow}
      toNext={toNext}
      toPrevious={toPrevious}
      tableName="subproject user"
    />
  )
})
