export const buildNavs = async ({ table, params, db }) => {
  // console.log('navs:', { table, params, db })

  switch (table) {
    case 'root':
      return [
        { path: '/projects', text: 'Projects' },
        { path: '/users', text: 'Users' },
        { path: '/accounts', text: 'Accounts' },
        { path: '/field-types', text: 'Field Types' },
        { path: '/widget-types', text: 'Widget Types' },
        { path: '/widgets-for-fields', text: 'Widgets For Fields' },
        { path: '/files', text: 'Files' },
        { path: '/messages', text: 'Messages' },
        { path: '/docs', text: 'Docs' },
      ]
      break
    case `projects`:
      return [
        {
          path: `/projects/${params.project_id}/subprojects`,
          text: 'Subprojects',
        },
        {
          path: `/projects/${params.project_id}/reports`,
          text: 'Reports',
        },
        {
          path: `/projects/${params.project_id}/persons`,
          text: 'Persons',
        },
        { path: `/projects/${params.project_id}/lists`, text: 'Lists' },
        {
          path: `/projects/${params.project_id}/taxonomies`,
          text: 'Taxonomies',
        },
        { path: `/projects/${params.project_id}/units`, text: 'Units' },
        { path: `/projects/${params.project_id}/users`, text: 'Users' },
        {
          path: `/projects/${params.project_id}/place-levels`,
          text: 'Place Levels',
        },
        { path: `/projects/${params.project_id}/fields`, text: 'Fields' },
        {
          path: `/projects/${params.project_id}/observation-sources`,
          text: 'Observation Sources',
        },
      ]
    case 'subprojects': {
      // need to fetch how places are named
      const project_id =
        params.project_id ?? '99999999-9999-9999-9999-999999999999'
      // findUnique does not work for non primary keys
      const placeLevels = await db?.place_levels?.findMany({
        where: { project_id, deleted: false, level: 1 },
      })
      const placeLevel = placeLevels?.[0] ?? {}
      const placeName =
        placeLevel?.name_plural ?? placeLevel?.name_short ?? 'Places'

      return [
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places`,
          text: placeName,
        },
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/reports`,
          text: 'Reports',
        },
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/goals`,
          text: 'Goals',
        },
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/taxa`,
          text: 'Taxa',
        },
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/users`,
          text: 'Users',
        },
      ]
    }
    case 'places':
      // TODO:
      // add second place level if exists
      // name it as defined in place_levels
      return [
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places/${params.place_id}/checks`,
          text: 'Checks',
        },
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places/${params.place_id}/actions`,
          text: 'Actions',
        },
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places/${params.place_id}/reports`,
          text: 'Reports',
        },
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places/${params.place_id}/users`,
          text: 'Users',
        },
      ]
    case 'checks':
      return [
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places/${params.place_id}/checks/${params.check_id}/values`,
          text: 'Values',
        },
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places/${params.place_id}/checks/${params.check_id}/taxa`,
          text: 'Taxa',
        },
      ]
    case 'actions':
      return [
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places/${params.place_id}/actions/${params.action_id}/values`,
          text: 'Values',
        },
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places/${params.place_id}/actions/${params.action_id}/reports`,
          text: 'Reports',
        },
      ]
    case 'action_reports':
      return [
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places/${params.place_id}/actions/${params.action_id}/reports/${params.action_report_id}/values`,
          text: 'Values',
        },
      ]
    case 'place_reports':
      return [
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/places/${params.place_id}/reports/${params.place_report_id}/values`,
          text: 'Values',
        },
      ]
    case 'goals':
      return [
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/goals/${params.goal_id}/reports`,
          text: 'Reports',
        },
      ]
    case 'goal_reports':
      return [
        {
          path: `/projects/${params.project_id}/subprojects/${params.subproject_id}/goals/${params.goal_id}/reports/${params.goal_report_id}/values`,
          text: 'Values',
        },
      ]
    case 'lists':
      return [
        {
          path: `/projects/${params.project_id}/lists/${params.list_id}/values`,
          text: 'Values',
        },
      ]
    case 'taxonomies':
      return [
        {
          path: `/projects/${params.project_id}/taxonomies/${params.taxonomy_id}/taxa`,
          text: 'Taxa',
        },
      ]
    case 'observation_sources':
      return [
        {
          path: `/projects/${params.project_id}/observation-sources/${params.observation_source_id}/observations`,
          text: 'Observations',
        },
      ]
    default: {
      return null
    }
  }
}
