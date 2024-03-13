import { useCallback, useRef, useState } from 'react'
import { Button, Field } from '@fluentui/react-components'

const uploadInputStyle = {
  display: 'none',
}

export const UploadButton = () => {
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback((file: File) => {
    console.log('file', file)
    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result
      if (typeof content !== 'string') {
        return
      }
      console.log('content', content)
    }
    // TODO: do something with the content
    reader.readAsText(file)
  }, [])

  const onUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      processFile(file)
    },
    [processFile],
  )

  const onClickUploadButton = useCallback(
    () => uploadInputRef.current?.click(),
    [],
  )

  const onDragEnter = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    setIsDragging(true)
  }, [])
  const onDragLeave = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    setIsDragging(false)
  }, [])
  // onDragOver is needed to prevent the browser from asking the user to save file as
  const onDragOver = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
  }, [])
  const onDrop = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      setIsDragging(false)
      const dt = e.dataTransfer
      const file = dt.files?.[0]
      if (!file) return
      processFile(file)
    },
    [processFile],
  )

  return (
    <Field
      validationMessage="Click to choose or drop a file. Accepts .csv, .json, .tsv, .xlsx, .xls, .ods."
      validationState="none"
    >
      <input
        label="Upload"
        type="file"
        onChange={onUpload}
        accept=".csv, .json, .tsv, .xlsx, .xls, .ods"
        ref={uploadInputRef}
        style={uploadInputStyle}
      />
      <Button
        onClick={onClickUploadButton}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          backgroundColor: isDragging
            ? 'rgba(103, 216, 101, 0.2)'
            : 'transparent',
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        Upload file containing occurrences
      </Button>
    </Field>
  )
}
