export const labelFromData = ({ data, table }) => {
  switch (table) {
    case 'widget_types':
      return data.widget_type
      break
    case 'widgets_for_fields':
      return data.widget_for_field_id
      break
    case 'files':
      return data.name ?? data.file_id
      break
    case 'messages':
      return data.date ?? data.message_id
      break
    case 'place_levels':
      return data.level ?? data.place_level_id
      break
    case 'units':
      return data.name ?? data.unit_id
      break
    case 'lists':
      return data.name ?? data.list_id
      break
    case 'list_values':
      return data.value ?? data.list_value_id
      break
    case 'taxonomies':
      return data.name ?? data.taxonomy_id
      break
    case 'taxa':
      return data.name ?? data.taxon_id
      break
    case 'project_users':
      return data.project_user_id
      break
    case 'project_reports':
      return data.year ?? data.project_report_id
      break
    case 'fields':
      return data.field_id
      break
    case 'observation_sources':
      return data.name ?? data.observation_source_id
      break
    case 'observations':
      return data.observation_id
      break
    case 'persons':
      return data.email ?? data.person_id
      break
    case 'places':
      // TODO: build virtual field from data.label, return that here
      return data.place_id
      break
    case 'place_users':
      return data.place_user_id
      break
    case 'subproject_taxa':
      return data.subproject_taxon_id
      break
    case 'subproject_reports':
      return data.year ?? data.subproject_report_id
      break
    case 'goals':
      return data.goal_id
      break
    case 'goal_reports':
      return data.goal_report_id
      break
    case 'goal_report_values':
      return data.goal_report_value_id
      break
    case 'subproject_users':
      return data.subproject_user_id
      break
    default:
      return undefined
  }
}
