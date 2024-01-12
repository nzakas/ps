export const generateGoalReportValueLabel = async (db) => {
  // when any data is changed, update label using units name
  const triggers = await db.raw({
    sql: `select name from sqlite_master where type = 'trigger';`,
  })
  const goalReportValuesLabelTriggerExists = triggers.some(
    (column) => column.name === 'goal_report_values_label_trigger',
  )
  if (!goalReportValuesLabelTriggerExists) {
    const result = await db.raw({
      sql: `
      CREATE TRIGGER IF NOT EXISTS goal_report_values_label_trigger
        AFTER UPDATE ON goal_report_values
      BEGIN
        UPDATE goal_report_values SET label = concat(
          units.name,
          ': ',
          coalesce(NEW.value_integer, NEW.value_numeric, NEW.value_text)
        )
        FROM(
        SELECT
          name
        FROM
          units
        WHERE
          unit_id = NEW.unit_id) AS units
        WHERE
          goal_report_values.goal_report_value_id = NEW.goal_report_value_id;
      END;`,
    })
    console.log('TriggerGenerator, goal_report_values, result:', result)
  }
}
