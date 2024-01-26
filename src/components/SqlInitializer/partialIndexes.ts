export const generatePartialIndexes = async (db) => {
  await db.unsafeExec({
    sql: `
          CREATE INDEX if not exists users_deleted_idx ON users(deleted) WHERE deleted;
          CREATE INDEX if not exists projects_deleted_idx ON projects(deleted) WHERE deleted;
          CREATE INDEX if not exists place_levels_deleted_idx ON place_levels(deleted) WHERE deleted;
          CREATE INDEX if not exists subprojects_deleted_idx ON subprojects(deleted) WHERE deleted;
          CREATE INDEX if not exists project_users_deleted_idx ON project_users(deleted) WHERE deleted;
          CREATE INDEX if not exists subproject_users_deleted_idx ON subproject_users(deleted) WHERE deleted;
          CREATE INDEX if not exists persons_deleted_idx ON persons(deleted) WHERE deleted;
          CREATE INDEX if not exists taxonomies_obsolete_idx ON taxonomies(obsolete) WHERE obsolete;
          CREATE INDEX if not exists taxonomies_deleted_idx ON taxonomies(deleted) WHERE deleted;
          CREATE INDEX if not exists taxa_obsolete_idx ON taxa(obsolete) WHERE obsolete;
          CREATE INDEX if not exists taxa_deleted_idx ON taxa(deleted) WHERE deleted;
          CREATE INDEX if not exists subproject_taxa_deleted_idx ON subproject_taxa(deleted) WHERE deleted;
          CREATE INDEX if not exists lists_obsolete_idx ON lists(obsolete) WHERE obsolete;
          CREATE INDEX if not exists lists_deleted_idx ON lists(deleted) WHERE deleted;
          CREATE INDEX if not exists list_values_obsolete_idx ON list_values(obsolete) WHERE obsolete;
          CREATE INDEX if not exists list_values_deleted_idx ON list_values(deleted) WHERE deleted;
          CREATE INDEX if not exists units_deleted_idx ON units(deleted) WHERE deleted;
          CREATE INDEX if not exists places_deleted_idx ON places(deleted) WHERE deleted;
          CREATE INDEX if not exists actions_relevant_for_reports_idx ON actions(relevant_for_reports) WHERE relevant_for_reports;
          CREATE INDEX if not exists actions_deleted_idx ON actions(deleted) WHERE deleted;
          CREATE INDEX if not exists action_values_deleted_idx ON action_values(deleted) WHERE deleted;
          CREATE INDEX if not exists action_reports_deleted_idx ON action_reports(deleted) WHERE deleted;
          CREATE INDEX if not exists action_report_values_deleted_idx ON action_report_values(deleted) WHERE deleted;
          CREATE INDEX if not exists checks_relevant_for_reports_idx ON checks(relevant_for_reports) WHERE relevant_for_reports;
          CREATE INDEX if not exists checks_deleted_idx ON checks(deleted) WHERE deleted;
          CREATE INDEX if not exists check_values_deleted_idx ON check_values(deleted) WHERE deleted;
          CREATE INDEX if not exists check_taxa_deleted_idx ON check_taxa(deleted) WHERE deleted;
          CREATE INDEX if not exists place_reports_deleted_idx ON place_reports(deleted) WHERE deleted;
          CREATE INDEX if not exists place_report_values_deleted_idx ON place_report_values(deleted) WHERE deleted;
          CREATE INDEX if not exists observation_sources_deleted_idx ON observation_sources(deleted) WHERE deleted;
          CREATE INDEX if not exists observations_deleted_idx ON observations(deleted) WHERE deleted;
          CREATE INDEX if not exists place_users_deleted_idx ON place_users(deleted) WHERE deleted;
          CREATE INDEX if not exists goals_deleted_idx ON goals(deleted) WHERE deleted;
          CREATE INDEX if not exists goal_reports_deleted_idx ON goal_reports(deleted) WHERE deleted;
          CREATE INDEX if not exists goal_report_values_deleted_idx ON goal_report_values(deleted) WHERE deleted;
          CREATE INDEX if not exists subproject_reports_deleted_idx ON subproject_reports(deleted) WHERE deleted;
          CREATE INDEX if not exists project_reports_deleted_idx ON project_reports(deleted) WHERE deleted;
          -- CREATE INDEX if not exists files_deleted_idx ON files(deleted) WHERE deleted;
          CREATE INDEX if not exists field_types_deleted_idx ON field_types(deleted) WHERE deleted;
          CREATE INDEX if not exists widget_types_deleted_idx ON widget_types(deleted) WHERE deleted;
          CREATE INDEX if not exists widgets_for_fields_deleted_idx ON widgets_for_fields(deleted) WHERE deleted;
          CREATE INDEX if not exists ON fields fields_obsolete_idx USING btree(obsolete) WHERE obsolete;
          CREATE INDEX if not exists ON fields fields_deleted_idx USING btree(deleted) WHERE deleted;
          CREATE INDEX if not exists ON gbif_occurrence_downloads gbif_occurrence_downloads_deleted_idx USING btree(deleted) WHERE deleted;
          CREATE INDEX if not exists ON tile_layers tile_layers_deleted_idx USING btree(deleted) WHERE deleted;
          CREATE INDEX if not exists ON vector_layers vector_layers_deleted_idx USING btree(deleted) WHERE deleted;
    `,
  })
  // console.log('partialIndexes, result:', result)
}
