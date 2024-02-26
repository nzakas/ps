import { useCallback, memo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import { useElectric } from '../../ElectricProvider'
import { FormHeader } from '../../components/FormHeader'

export const Header = memo(() => {
  const {
    project_id,
    subproject_id,
    place_id,
    place_id2,
    action_id,
    check_id,
    file_id,
  } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isPreview = pathname.endsWith('preview')

  console.log('hello fileHeader', { pathname, isPreview })

  const { db } = useElectric()!

  // TODO: if is preview, add preview to the url
  const baseUrl = `${project_id ? `/projects/${project_id}` : ''}${
    subproject_id ? `/subprojects/${subproject_id}` : ''
  }${place_id ? `/places/${place_id}` : ''}${
    place_id2 ? `/places/${place_id2}` : ''
  }${action_id ? `/actions/${action_id}` : ''}${
    check_id ? `/checks/${check_id}` : ''
  }/files`

  const uploaderCtx = document.querySelector('#uploaderctx')
  const addRow = useCallback(async () => uploaderCtx.initFlow(), [uploaderCtx])

  const deleteRow = useCallback(async () => {
    await db.files.delete({ where: { file_id } })
    navigate(baseUrl)
  }, [db.files, file_id, navigate, baseUrl])

  const toNext = useCallback(async () => {
    const files = await db.files.findMany({
      where: {
        deleted: false,
        subproject_id,
      },
      orderBy: { label: 'asc' },
    })
    const len = files.length
    const index = files.findIndex((p) => p.file_id === file_id)
    const next = files[(index + 1) % len]
    navigate(`${baseUrl}/${next.file_id}${isPreview ? '/preview' : ''}`)
  }, [db.files, subproject_id, navigate, baseUrl, isPreview, file_id])

  const toPrevious = useCallback(async () => {
    const files = await db.files.findMany({
      where: {
        deleted: false,
        project_id,
        subproject_id,
      },
      orderBy: { label: 'asc' },
    })
    const len = files.length
    const index = files.findIndex((p) => p.file_id === file_id)
    const previous = files[(index + len - 1) % len]
    navigate(`${baseUrl}/${previous.file_id}${isPreview ? '/preview' : ''}`)
  }, [
    db.files,
    project_id,
    subproject_id,
    navigate,
    baseUrl,
    isPreview,
    file_id,
  ])

  return (
    <FormHeader
      title="File"
      addRow={addRow}
      deleteRow={deleteRow}
      toNext={toNext}
      toPrevious={toPrevious}
      tableName="file"
    />
  )
})
