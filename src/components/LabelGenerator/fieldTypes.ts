export const generateFieldtypeLabel = async (db) => {
  const columns = await db.raw({
    sql: 'PRAGMA table_xinfo(field_types)',
  })
  const hasLabel = columns.some((column) => column.name === 'label')
  if (!hasLabel) {
    await db.raw({
      sql: 'ALTER TABLE field_types ADD COLUMN label text GENERATED ALWAYS AS (field_type)',
    })
    await db.raw({
      sql: 'CREATE INDEX IF NOT EXISTS field_types_label_idx ON field_types(label)',
    })
  }
  // console.log('LabelGenerator, field_types:', {
  //   columns,
  //   hasLabel,
  // })
}
