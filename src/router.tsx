import { createBrowserRouter, Link } from 'react-router-dom'

import { Header } from './components/Header'
import { ErrorPage } from './routes/error'

export const router = createBrowserRouter([
  {
    element: <Header />,
    children: [
      {
        path: '/',
        element: null,
        errorElement: <ErrorPage />,
        handle: {
          crumb: () => ({ url: '/', text: 'Home' }),
          crumbData: { url: '/', text: 'Home' },
          to: () => (
            <>
              <Link to="/users">Users</Link>
              <Link to="/accounts">Accounts</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/field-types">Field Types</Link>
              <Link to="/widget-types">Widget Types</Link>
              <Link to="/widgets-for-fields">Widgets For Fields</Link>
              <Link to="/files">Files</Link>
              <Link to="/messages">Messages</Link>
              <Link to="/docs">Docs</Link>
            </>
          ),
        },
        children: [
          {
            index: true,
            lazy: () => import('./routes/home'),
          },
          {
            path: 'users',
            element: null,
            handle: {
              crumb: () => ({ url: '/users', text: 'Users' }),
            },
            children: [
              {
                index: true,
                lazy: () => import('./routes/users'),
              },
              {
                path: ':user_id',
                lazy: () => import('./routes/user'),
                handle: {
                  crumb: () => ({ url: '/users/:user_id', text: 'User' }),
                },
              },
            ],
          },
          {
            path: 'accounts',
            element: null,
            handle: {
              crumb: () => ({ url: '/accounts', text: 'Accounts' }),
            },
            children: [
              { index: true, lazy: () => import('./routes/accounts') },
              {
                path: ':account_id',
                lazy: () => import('./routes/account'),
                handle: {
                  crumb: (match) => ({
                    url: `/accounts/${match.params.account_id}`,
                    text: 'Account',
                  }),
                },
              },
            ],
          },
          {
            path: 'projects',
            element: null,
            handle: {
              crumb: () => ({ url: '/projects', text: 'Projects' }),
            },
            children: [
              { index: true, lazy: () => import('./routes/projects') },
              {
                path: ':project_id',
                element: null,
                handle: {
                  crumb: (match) => ({
                    url: `/projects/${match.params.project_id}`,
                    text: match.params.project_id,
                  }),
                  to: (match) => (
                    <>
                      <Link
                        to={`/projects/${match.params.project_id}/subprojects`}
                      >
                        Subprojects
                      </Link>
                      <Link
                        to={`/projects/${match.params.project_id}/place-levels`}
                      >
                        Place Levels
                      </Link>
                      <Link to={`/projects/${match.params.project_id}/units`}>
                        Units
                      </Link>
                      <Link to={`/projects/${match.params.project_id}/lists`}>
                        Lists
                      </Link>
                      <Link
                        to={`/projects/${match.params.project_id}/taxonomies`}
                      >
                        Taxonomies
                      </Link>
                      <Link to={`/projects/${match.params.project_id}/users`}>
                        Users
                      </Link>
                      <Link to={`/projects/${match.params.project_id}/reports`}>
                        Reports
                      </Link>
                      <Link to={`/projects/${match.params.project_id}/fields`}>
                        Fields
                      </Link>
                      <Link
                        to={`/projects/${match.params.project_id}/observation-sources`}
                      >
                        Observation Sources
                      </Link>
                      <Link to={`/projects/${match.params.project_id}/persons`}>
                        Persons
                      </Link>
                    </>
                  ),
                },
                children: [
                  { index: true, lazy: () => import('./routes/project') },
                  {
                    path: 'subprojects',
                    element: null,
                    handle: {
                      crumb: () => ({
                        url: '/subprojects',
                        text: 'Subprojects',
                      }),
                    },
                    children: [
                      {
                        index: true,
                        lazy: () => import('./routes/subprojects'),
                      },
                      {
                        path: ':subproject_id',
                        element: null,
                        handle: {
                          crumb: (match) => (
                            <>
                              <div>&rArr;</div>
                              <Link
                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}`}
                              >
                                {match.params.subproject_id}
                              </Link>
                            </>
                          ),
                          to: (match) => (
                            <>
                              <Link
                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places`}
                              >
                                Places
                              </Link>
                              <Link
                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/users`}
                              >
                                Users
                              </Link>
                              <Link
                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/taxa`}
                              >
                                Taxa
                              </Link>
                              <Link
                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/reports`}
                              >
                                Reports
                              </Link>
                              <Link
                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/goals`}
                              >
                                Goals
                              </Link>
                            </>
                          ),
                        },
                        children: [
                          {
                            index: true,
                            lazy: () => import('./routes/subproject'),
                          },
                          {
                            path: 'places',
                            element: null,
                            handle: {
                              crumb: (match) => (
                                <>
                                  <div>&rArr;</div>
                                  <Link
                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places`}
                                  >
                                    Places
                                  </Link>
                                </>
                              ),
                            },
                            children: [
                              {
                                index: true,
                                lazy: () => import('./routes/places'),
                              },
                              {
                                path: ':place_id',
                                element: null,
                                handle: {
                                  crumb: (match) => (
                                    <>
                                      <div>&rArr;</div>
                                      <Link
                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}`}
                                      >
                                        {match.params.place_id}
                                      </Link>
                                    </>
                                  ),
                                  to: (match) => (
                                    <>
                                      <Link
                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/checks`}
                                      >
                                        Checks
                                      </Link>
                                      <Link
                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions`}
                                      >
                                        Actions
                                      </Link>
                                      <Link
                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/reports`}
                                      >
                                        Reports
                                      </Link>
                                      <Link
                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/users`}
                                      >
                                        Users
                                      </Link>
                                    </>
                                  ),
                                },
                                children: [
                                  {
                                    index: true,
                                    lazy: () => import('./routes/place'),
                                  },
                                  {
                                    path: 'checks',
                                    element: null,
                                    handle: {
                                      crumb: (match) => (
                                        <>
                                          <div>&rArr;</div>
                                          <Link
                                            to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/checks`}
                                          >
                                            Checks
                                          </Link>
                                        </>
                                      ),
                                    },
                                    children: [
                                      {
                                        index: true,
                                        lazy: () => import('./routes/checks'),
                                      },
                                      {
                                        path: ':check_id',
                                        element: null,
                                        handle: {
                                          crumb: (match) => (
                                            <>
                                              <div>&rArr;</div>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/checks/${match.params.check_id}`}
                                              >
                                                {match.params.check_id}
                                              </Link>
                                            </>
                                          ),
                                          to: (match) => (
                                            <>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/checks/${match.params.check_id}/values`}
                                              >
                                                Values
                                              </Link>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/checks/${match.params.check_id}/taxa`}
                                              >
                                                Taxa
                                              </Link>
                                            </>
                                          ),
                                        },
                                        children: [
                                          {
                                            index: true,
                                            lazy: () =>
                                              import('./routes/check'),
                                          },
                                          {
                                            path: 'values',
                                            element: null,
                                            handle: {
                                              crumb: (match) => (
                                                <>
                                                  <div>&rArr;</div>
                                                  <Link
                                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/checks/${match.params.check_id}/values`}
                                                  >
                                                    Values
                                                  </Link>
                                                </>
                                              ),
                                            },
                                            children: [
                                              {
                                                index: true,
                                                lazy: () =>
                                                  import(
                                                    './routes/checkValues'
                                                  ),
                                              },
                                              {
                                                path: ':check_value_id',
                                                lazy: () =>
                                                  import('./routes/checkValue'),
                                                handle: {
                                                  crumb: (match) => (
                                                    <>
                                                      <div>&rArr;</div>
                                                      <Link
                                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/checks/${match.params.check_id}/values/${match.params.check_value_id}`}
                                                      >
                                                        {
                                                          match.params
                                                            .check_value_id
                                                        }
                                                      </Link>
                                                    </>
                                                  ),
                                                },
                                              },
                                            ],
                                          },
                                          {
                                            path: 'taxa',
                                            element: null,
                                            handle: {
                                              crumb: (match) => (
                                                <>
                                                  <div>&rArr;</div>
                                                  <Link
                                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/checks/${match.params.check_id}/taxa`}
                                                  >
                                                    Taxa
                                                  </Link>
                                                </>
                                              ),
                                            },
                                            children: [
                                              {
                                                index: true,
                                                lazy: () =>
                                                  import('./routes/checkTaxa'),
                                              },
                                              {
                                                path: ':check_taxon_id',
                                                lazy: () =>
                                                  import('./routes/checkTaxon'),
                                                handle: {
                                                  crumb: (match) => (
                                                    <>
                                                      <div>&rArr;</div>
                                                      <Link
                                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/checks/${match.params.check_id}/taxa/${match.params.check_taxon_id}`}
                                                      >
                                                        {
                                                          match.params
                                                            .check_taxon_id
                                                        }
                                                      </Link>
                                                    </>
                                                  ),
                                                },
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    path: 'actions',
                                    element: null,
                                    handle: {
                                      crumb: (match) => (
                                        <>
                                          <div>&rArr;</div>
                                          <Link
                                            to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions`}
                                          >
                                            Actions
                                          </Link>
                                        </>
                                      ),
                                    },
                                    children: [
                                      {
                                        index: true,
                                        lazy: () => import('./routes/actions'),
                                      },
                                      {
                                        path: ':action_id',
                                        element: null,
                                        handle: {
                                          crumb: (match) => (
                                            <>
                                              <div>&rArr;</div>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions/${match.params.action_id}`}
                                              >
                                                {match.params.action_id}
                                              </Link>
                                            </>
                                          ),
                                          to: (match) => (
                                            <>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions/${match.params.action_id}/values`}
                                              >
                                                Values
                                              </Link>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions/${match.params.action_id}/reports`}
                                              >
                                                Reports
                                              </Link>
                                            </>
                                          ),
                                        },
                                        children: [
                                          {
                                            index: true,
                                            lazy: () =>
                                              import('./routes/action'),
                                          },
                                          {
                                            path: 'values',
                                            element: null,
                                            handle: {
                                              crumb: (match) => (
                                                <>
                                                  <div>&rArr;</div>
                                                  <Link
                                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions/${match.params.action_id}/values`}
                                                  >
                                                    Values
                                                  </Link>
                                                </>
                                              ),
                                            },
                                            children: [
                                              {
                                                index: true,
                                                lazy: () =>
                                                  import(
                                                    './routes/actionValues'
                                                  ),
                                              },
                                              {
                                                path: ':action_value_id',
                                                lazy: () =>
                                                  import(
                                                    './routes/actionValue'
                                                  ),
                                                handle: {
                                                  crumb: (match) => (
                                                    <>
                                                      <div>&rArr;</div>
                                                      <Link
                                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions/${match.params.action_id}/values/${match.params.action_value_id}`}
                                                      >
                                                        {
                                                          match.params
                                                            .action_value_id
                                                        }
                                                      </Link>
                                                    </>
                                                  ),
                                                },
                                              },
                                            ],
                                          },
                                          {
                                            path: 'reports',
                                            element: null,
                                            handle: {
                                              crumb: (match) => (
                                                <>
                                                  <div>&rArr;</div>
                                                  <Link
                                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions/${match.params.action_id}/reports`}
                                                  >
                                                    Reports
                                                  </Link>
                                                </>
                                              ),
                                            },
                                            children: [
                                              {
                                                index: true,
                                                lazy: () =>
                                                  import(
                                                    './routes/actionReports'
                                                  ),
                                              },
                                              {
                                                path: ':action_report_id',
                                                element: null,
                                                handle: {
                                                  crumb: (match) => (
                                                    <>
                                                      <div>&rArr;</div>
                                                      <Link
                                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions/${match.params.action_id}/reports/${match.params.action_report_id}`}
                                                      >
                                                        {
                                                          match.params
                                                            .action_report_id
                                                        }
                                                      </Link>
                                                    </>
                                                  ),
                                                  to: (match) => (
                                                    <>
                                                      <Link
                                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions/${match.params.action_id}/reports/${match.params.action_report_id}/values`}
                                                      >
                                                        Values
                                                      </Link>
                                                    </>
                                                  ),
                                                },
                                                children: [
                                                  {
                                                    index: true,
                                                    lazy: () =>
                                                      import(
                                                        './routes/actionReport'
                                                      ),
                                                  },
                                                  {
                                                    path: 'values',
                                                    element: null,
                                                    handle: {
                                                      crumb: (match) => (
                                                        <>
                                                          <div>&rArr;</div>
                                                          <Link
                                                            to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions/${match.params.action_id}/reports/${match.params.action_report_id}/values`}
                                                          >
                                                            Values
                                                          </Link>
                                                        </>
                                                      ),
                                                    },
                                                    children: [
                                                      {
                                                        index: true,
                                                        lazy: () =>
                                                          import(
                                                            './routes/actionReportValues'
                                                          ),
                                                      },
                                                      {
                                                        path: ':action_report_value_id',
                                                        lazy: () =>
                                                          import(
                                                            './routes/actionReportValue'
                                                          ),
                                                        handle: {
                                                          crumb: (match) => (
                                                            <>
                                                              <div>&rArr;</div>
                                                              <Link
                                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/actions/${match.params.action_id}/reports/${match.params.action_report_id}/values/${match.params.action_report_value_id}`}
                                                              >
                                                                {
                                                                  match.params
                                                                    .action_report_value_id
                                                                }
                                                              </Link>
                                                            </>
                                                          ),
                                                        },
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    path: 'reports',
                                    element: null,
                                    handle: {
                                      crumb: (match) => (
                                        <>
                                          <div>&rArr;</div>
                                          <Link
                                            to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/reports`}
                                          >
                                            Reports
                                          </Link>
                                        </>
                                      ),
                                    },
                                    children: [
                                      {
                                        index: true,
                                        lazy: () =>
                                          import('./routes/placeReports'),
                                      },
                                      {
                                        path: ':place_report_id',
                                        element: null,
                                        handle: {
                                          crumb: (match) => (
                                            <>
                                              <div>&rArr;</div>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/reports/${match.params.place_report_id}`}
                                              >
                                                {match.params.place_report_id}
                                              </Link>
                                            </>
                                          ),
                                          to: (match) => (
                                            <>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/reports/${match.params.place_report_id}/values`}
                                              >
                                                Values
                                              </Link>
                                            </>
                                          ),
                                        },
                                        children: [
                                          {
                                            index: true,
                                            lazy: () =>
                                              import('./routes/placeReport'),
                                          },
                                          {
                                            path: 'values',
                                            element: null,
                                            handle: {
                                              crumb: (match) => (
                                                <>
                                                  <div>&rArr;</div>
                                                  <Link
                                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/reports/${match.params.place_report_id}/values`}
                                                  >
                                                    Values
                                                  </Link>
                                                </>
                                              ),
                                            },
                                            children: [
                                              {
                                                index: true,
                                                lazy: () =>
                                                  import(
                                                    './routes/placeReportValues'
                                                  ),
                                              },
                                              {
                                                path: ':place_report_value_id',
                                                lazy: () =>
                                                  import(
                                                    './routes/placeReportValue'
                                                  ),
                                                handle: {
                                                  crumb: (match) => (
                                                    <>
                                                      <div>&rArr;</div>
                                                      <Link
                                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/reports/${match.params.place_report_id}/values/${match.params.place_report_value_id}`}
                                                      >
                                                        {
                                                          match.params
                                                            .place_report_value_id
                                                        }
                                                      </Link>
                                                    </>
                                                  ),
                                                },
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    path: 'users',
                                    element: null,
                                    handle: {
                                      crumb: (match) => (
                                        <>
                                          <div>&rArr;</div>
                                          <Link
                                            to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/users`}
                                          >
                                            Users
                                          </Link>
                                        </>
                                      ),
                                    },
                                    children: [
                                      {
                                        index: true,
                                        lazy: () =>
                                          import('./routes/placeUsers'),
                                      },
                                      {
                                        path: ':place_user_id',
                                        lazy: () =>
                                          import('./routes/placeUser'),
                                        handle: {
                                          crumb: (match) => (
                                            <>
                                              <div>&rArr;</div>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/places/${match.params.place_id}/users/${match.params.place_user_id}`}
                                              >
                                                {match.params.place_user_id}
                                              </Link>
                                            </>
                                          ),
                                        },
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            path: 'users',
                            element: null,
                            handle: {
                              crumb: (match) => (
                                <>
                                  <div>&rArr;</div>
                                  <Link
                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/users`}
                                  >
                                    Users
                                  </Link>
                                </>
                              ),
                            },
                            children: [
                              {
                                index: true,
                                lazy: () => import('./routes/subprojectUsers'),
                              },
                              {
                                path: ':subproject_user_id',
                                lazy: () => import('./routes/subprojectUser'),
                                handle: {
                                  crumb: (match) => (
                                    <>
                                      <div>&rArr;</div>
                                      <Link
                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/users/${match.params.subproject_user_id}`}
                                      >
                                        {match.params.subproject_user_id}
                                      </Link>
                                    </>
                                  ),
                                },
                              },
                            ],
                          },
                          {
                            path: 'taxa',
                            element: null,
                            handle: {
                              crumb: (match) => (
                                <>
                                  <div>&rArr;</div>
                                  <Link
                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/taxa`}
                                  >
                                    Taxa
                                  </Link>
                                </>
                              ),
                            },
                            children: [
                              {
                                index: true,
                                lazy: () => import('./routes/subprojectTaxa'),
                              },
                              {
                                path: ':subproject_taxon_id',
                                lazy: () => import('./routes/subprojectTaxon'),
                                handle: {
                                  crumb: (match) => (
                                    <>
                                      <div>&rArr;</div>
                                      <Link
                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/taxa/${match.params.subproject_taxon_id}`}
                                      >
                                        {match.params.subproject_taxon_id}
                                      </Link>
                                    </>
                                  ),
                                },
                              },
                            ],
                          },
                          {
                            path: 'reports',
                            element: null,
                            handle: {
                              crumb: (match) => (
                                <>
                                  <div>&rArr;</div>
                                  <Link
                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/reports`}
                                  >
                                    Reports
                                  </Link>
                                </>
                              ),
                            },
                            children: [
                              {
                                index: true,
                                lazy: () =>
                                  import('./routes/subprojectReports'),
                              },
                              {
                                path: ':subproject_report_id',
                                lazy: () => import('./routes/subprojectReport'),
                                handle: {
                                  crumb: (match) => (
                                    <>
                                      <div>&rArr;</div>
                                      <Link
                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/reports/${match.params.subproject_report_id}`}
                                      >
                                        {match.params.subproject_report_id}
                                      </Link>
                                    </>
                                  ),
                                },
                              },
                            ],
                          },
                          {
                            path: 'goals',
                            element: null,
                            handle: {
                              crumb: (match) => (
                                <>
                                  <div>&rArr;</div>
                                  <Link
                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/goals`}
                                  >
                                    Goals
                                  </Link>
                                </>
                              ),
                            },
                            children: [
                              {
                                index: true,
                                lazy: () => import('./routes/goals'),
                              },
                              {
                                path: ':goal_id',
                                element: null,
                                handle: {
                                  crumb: (match) => (
                                    <>
                                      <div>&rArr;</div>
                                      <Link
                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/goals/${match.params.goal_id}`}
                                      >
                                        {match.params.goal_id}
                                      </Link>
                                    </>
                                  ),
                                  to: (match) => (
                                    <>
                                      <Link
                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/goals/${match.params.goal_id}/reports`}
                                      >
                                        Reports
                                      </Link>
                                    </>
                                  ),
                                },
                                children: [
                                  {
                                    index: true,
                                    lazy: () => import('./routes/goal'),
                                  },
                                  {
                                    path: 'reports',
                                    element: null,
                                    handle: {
                                      crumb: (match) => (
                                        <>
                                          <div>&rArr;</div>
                                          <Link
                                            to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/goals/${match.params.goal_id}/reports`}
                                          >
                                            Reports
                                          </Link>
                                        </>
                                      ),
                                    },
                                    children: [
                                      {
                                        index: true,
                                        lazy: () =>
                                          import('./routes/goalReports'),
                                      },
                                      {
                                        path: ':goal_report_id',
                                        element: null,
                                        handle: {
                                          crumb: (match) => (
                                            <>
                                              <div>&rArr;</div>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/goals/${match.params.goal_id}/reports/${match.params.goal_report_id}`}
                                              >
                                                {match.params.goal_report_id}
                                              </Link>
                                            </>
                                          ),
                                          to: (match) => (
                                            <>
                                              <Link
                                                to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/goals/${match.params.goal_id}/reports/${match.params.goal_report_id}/values`}
                                              >
                                                Values
                                              </Link>
                                            </>
                                          ),
                                        },
                                        children: [
                                          {
                                            index: true,
                                            lazy: () =>
                                              import('./routes/goalReport'),
                                          },
                                          {
                                            path: 'values',
                                            element: null,
                                            handle: {
                                              crumb: (match) => (
                                                <>
                                                  <div>&rArr;</div>
                                                  <Link
                                                    to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/goals/${match.params.goal_id}/reports/${match.params.goal_report_id}/values`}
                                                  >
                                                    Values
                                                  </Link>
                                                </>
                                              ),
                                            },
                                            children: [
                                              {
                                                index: true,
                                                lazy: () =>
                                                  import(
                                                    './routes/goalReportValues'
                                                  ),
                                              },
                                              {
                                                path: ':goal_report_value_id',
                                                lazy: () =>
                                                  import(
                                                    './routes/goalReportValue'
                                                  ),
                                                handle: {
                                                  crumb: (match) => (
                                                    <>
                                                      <div>&rArr;</div>
                                                      <Link
                                                        to={`/projects/${match.params.project_id}/subprojects/${match.params.subproject_id}/goals/${match.params.goal_id}/reports/${match.params.goal_report_id}/values/${match.params.goal_report_value_id}`}
                                                      >
                                                        {
                                                          match.params
                                                            .goal_report_value_id
                                                        }
                                                      </Link>
                                                    </>
                                                  ),
                                                },
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'place-levels',
                    element: null,
                    handle: {
                      crumb: (match) => (
                        <>
                          <div>&rArr;</div>
                          <Link
                            to={`/projects/${match.params.project_id}/place-levels`}
                          >
                            Place Levels
                          </Link>
                        </>
                      ),
                    },
                    children: [
                      {
                        index: true,
                        lazy: () => import('./routes/placeLevels'),
                      },
                      {
                        path: ':place_level_id',
                        lazy: () => import('./routes/placeLevel'),
                        handle: {
                          crumb: (match) => (
                            <>
                              <div>&rArr;</div>
                              <Link
                                to={`/projects/${match.params.project_id}/place-levels/${match.params.place_level_id}`}
                              >
                                {match.params.place_level_id}
                              </Link>
                            </>
                          ),
                        },
                      },
                    ],
                  },
                  {
                    path: 'units',
                    element: null,
                    handle: {
                      crumb: (match) => (
                        <>
                          <div>&rArr;</div>
                          <Link
                            to={`/projects/${match.params.project_id}/units`}
                          >
                            Units
                          </Link>
                        </>
                      ),
                    },
                    children: [
                      { index: true, lazy: () => import('./routes/units') },
                      {
                        path: ':unit_id',
                        lazy: () => import('./routes/unit'),
                        handle: {
                          crumb: (match) => (
                            <>
                              <div>&rArr;</div>
                              <Link
                                to={`/projects/${match.params.project_id}/units/${match.params.unit_id}`}
                              >
                                {match.params.unit_id}
                              </Link>
                            </>
                          ),
                        },
                      },
                    ],
                  },
                  {
                    path: 'lists',
                    element: null,
                    handle: {
                      crumb: (match) => (
                        <>
                          <div>&rArr;</div>
                          <Link
                            to={`/projects/${match.params.project_id}/lists`}
                          >
                            Lists
                          </Link>
                        </>
                      ),
                    },
                    children: [
                      { index: true, lazy: () => import('./routes/lists') },
                      {
                        path: ':list_id',
                        element: null,
                        handle: {
                          crumb: (match) => (
                            <>
                              <div>&rArr;</div>
                              <Link
                                to={`/projects/${match.params.project_id}/lists/${match.params.list_id}`}
                              >
                                {match.params.list_id}
                              </Link>
                            </>
                          ),
                          to: (match) => (
                            <>
                              <Link
                                to={`/projects/${match.params.project_id}/lists/${match.params.list_id}/values`}
                              >
                                Values
                              </Link>
                            </>
                          ),
                        },
                        children: [
                          {
                            index: true,
                            lazy: () => import('./routes/list'),
                          },
                          {
                            path: 'values',
                            element: null,
                            handle: {
                              crumb: (match) => (
                                <>
                                  <div>&rArr;</div>
                                  <Link
                                    to={`/projects/${match.params.project_id}/lists/${match.params.list_id}/values`}
                                  >
                                    Values
                                  </Link>
                                </>
                              ),
                            },
                            children: [
                              {
                                index: true,
                                lazy: () => import('./routes/listValues'),
                              },
                              {
                                path: ':list_value_id',
                                lazy: () => import('./routes/listValue'),
                                handle: {
                                  crumb: (match) => (
                                    <>
                                      <div>&rArr;</div>
                                      <Link
                                        to={`/projects/${match.params.project_id}/lists/${match.params.list_id}/values/${match.params.list_value_id}`}
                                      >
                                        {match.params.list_value_id}
                                      </Link>
                                    </>
                                  ),
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'taxonomies',
                    element: null,
                    handle: {
                      crumb: (match) => (
                        <>
                          <div>&rArr;</div>
                          <Link
                            to={`/projects/${match.params.project_id}/taxonomies`}
                          >
                            Taxonomies
                          </Link>
                        </>
                      ),
                    },
                    children: [
                      {
                        index: true,
                        lazy: () => import('./routes/taxonomies'),
                      },
                      {
                        path: ':taxonomy_id',
                        element: null,
                        handle: {
                          crumb: (match) => (
                            <>
                              <div>&rArr;</div>
                              <Link
                                to={`/projects/${match.params.project_id}/taxonomies/${match.params.taxonomy_id}`}
                              >
                                {match.params.taxonomy_id}
                              </Link>
                            </>
                          ),
                          to: (match) => (
                            <>
                              <Link
                                to={`/projects/${match.params.project_id}/taxonomies/${match.params.taxonomy_id}/taxa`}
                              >
                                Taxa
                              </Link>
                            </>
                          ),
                        },
                        children: [
                          {
                            index: true,
                            lazy: () => import('./routes/taxonomy'),
                          },
                          {
                            path: 'taxa',
                            element: null,
                            handle: {
                              crumb: (match) => (
                                <>
                                  <div>&rArr;</div>
                                  <Link
                                    to={`/projects/${match.params.project_id}/taxonomies/${match.params.taxonomy_id}/taxa`}
                                  >
                                    Taxa
                                  </Link>
                                </>
                              ),
                            },
                            children: [
                              {
                                index: true,
                                lazy: () => import('./routes/taxa'),
                              },
                              {
                                path: ':taxon_id',
                                lazy: () => import('./routes/taxon'),
                                handle: {
                                  crumb: (match) => (
                                    <>
                                      <div>&rArr;</div>
                                      <Link
                                        to={`/projects/${match.params.project_id}/taxonomies/${match.params.taxonomy_id}/taxa/${match.params.taxon_id}`}
                                      >
                                        {match.params.taxon_id}
                                      </Link>
                                    </>
                                  ),
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'users',
                    element: null,
                    handle: {
                      crumb: (match) => (
                        <>
                          <div>&rArr;</div>
                          <Link
                            to={`/projects/${match.params.project_id}/users`}
                          >
                            Users
                          </Link>
                        </>
                      ),
                    },
                    children: [
                      {
                        index: true,
                        lazy: () => import('./routes/projectUsers'),
                      },
                      {
                        path: ':project_user_id',
                        lazy: () => import('./routes/projectUser'),
                        handle: {
                          crumb: (match) => (
                            <>
                              <div>&rArr;</div>
                              <Link
                                to={`/projects/${match.params.project_id}/users/${match.params.project_user_id}`}
                              >
                                {match.params.project_user_id}
                              </Link>
                            </>
                          ),
                        },
                      },
                    ],
                  },
                  {
                    path: 'reports',
                    element: null,
                    handle: {
                      crumb: (match) => (
                        <>
                          <div>&rArr;</div>
                          <Link
                            to={`/projects/${match.params.project_id}/reports`}
                          >
                            Reports
                          </Link>
                        </>
                      ),
                    },
                    children: [
                      {
                        index: true,
                        lazy: () => import('./routes/projectReports'),
                      },
                      {
                        path: ':project_report_id',
                        lazy: () => import('./routes/projectReport'),
                        handle: {
                          crumb: (match) => (
                            <>
                              <div>&rArr;</div>
                              <Link
                                to={`/projects/${match.params.project_id}/reports/${match.params.project_report_id}`}
                              >
                                {match.params.project_report_id}
                              </Link>
                            </>
                          ),
                        },
                      },
                    ],
                  },
                  {
                    path: 'fields',
                    element: null,
                    handle: {
                      crumb: (match) => (
                        <>
                          <div>&rArr;</div>
                          <Link
                            to={`/projects/${match.params.project_id}/fields`}
                          >
                            Fields
                          </Link>
                        </>
                      ),
                    },
                    children: [
                      { index: true, lazy: () => import('./routes/fields') },
                      {
                        path: ':field_id',
                        lazy: () => import('./routes/field'),
                        handle: {
                          crumb: (match) => (
                            <>
                              <div>&rArr;</div>
                              <Link
                                to={`/projects/${match.params.project_id}/fields/${match.params.field_id}`}
                              >
                                {match.params.field_id}
                              </Link>
                            </>
                          ),
                        },
                      },
                    ],
                  },
                  {
                    path: 'observation-sources',
                    element: null,
                    handle: {
                      crumb: (match) => (
                        <>
                          <div>&rArr;</div>
                          <Link
                            to={`/projects/${match.params.project_id}/observation-sources`}
                          >
                            Observation Sources
                          </Link>
                        </>
                      ),
                    },
                    children: [
                      {
                        index: true,
                        lazy: () => import('./routes/observationSources'),
                      },
                      {
                        path: ':observation_source_id',
                        element: null,
                        handle: {
                          crumb: (match) => (
                            <>
                              <div>&rArr;</div>
                              <Link
                                to={`/projects/${match.params.project_id}/observation-sources/${match.params.observation_source_id}`}
                              >
                                {match.params.observation_source_id}
                              </Link>
                            </>
                          ),
                          to: (match) => (
                            <>
                              <Link
                                to={`/projects/${match.params.project_id}/observation-sources/${match.params.observation_source_id}/observations`}
                              >
                                Observations
                              </Link>
                            </>
                          ),
                        },
                        children: [
                          {
                            index: true,
                            lazy: () => import('./routes/observationSource'),
                          },
                          {
                            path: 'observations',
                            lazy: () => import('./routes/observations'),
                            handle: {
                              crumb: (match) => (
                                <>
                                  <div>&rArr;</div>
                                  <Link
                                    to={`/projects/${match.params.project_id}/observation-sources/${match.params.observation_source_id}/observations`}
                                  >
                                    Observations
                                  </Link>
                                </>
                              ),
                            },
                            children: [
                              {
                                index: true,
                                lazy: () => import('./routes/observations'),
                              },
                              {
                                path: ':observation_id',
                                lazy: () => import('./routes/observation'),
                                handle: {
                                  crumb: (match) => (
                                    <>
                                      <div>&rArr;</div>
                                      <Link
                                        to={`/projects/${match.params.project_id}/observation-sources/${match.params.observation_source_id}/observations/${match.params.observation_id}`}
                                      >
                                        {match.params.observation_id}
                                      </Link>
                                    </>
                                  ),
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'persons',
                    element: null,
                    handle: {
                      crumb: (match) => (
                        <>
                          <div>&rArr;</div>
                          <Link
                            to={`/projects/${match.params.project_id}/persons`}
                          >
                            Persons
                          </Link>
                        </>
                      ),
                    },
                    children: [
                      { index: true, lazy: () => import('./routes/persons') },
                      {
                        path: ':person_id',
                        lazy: () => import('./routes/person'),
                        handle: {
                          crumb: (match) => (
                            <>
                              <div>&rArr;</div>
                              <Link
                                to={`/projects/${match.params.project_id}/persons/${match.params.person_id}`}
                              >
                                {match.params.person_id}
                              </Link>
                            </>
                          ),
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: 'field-types',
            element: null,
            handle: {
              crumb: () => (
                <>
                  <div>&rArr;</div>
                  <Link to="/field-types">Field Types</Link>
                </>
              ),
            },
            children: [
              { index: true, lazy: () => import('./routes/fieldTypes') },
              {
                path: ':field_type',
                lazy: () => import('./routes/fieldType'),
                handle: {
                  crumb: (match) => (
                    <>
                      <div>&rArr;</div>
                      <Link to={`/field-types/${match.params.field_type}`}>
                        {match.params.field_type}
                      </Link>
                    </>
                  ),
                },
              },
            ],
          },
          {
            path: 'widget-types',
            element: null,
            handle: {
              crumb: () => (
                <>
                  <div>&rArr;</div>
                  <Link to="/widget-types">Widget Types</Link>
                </>
              ),
            },
            children: [
              { index: true, lazy: () => import('./routes/widgetTypes') },
              {
                path: ':widget_type',
                lazy: () => import('./routes/widgetType'),
                handle: {
                  crumb: (match) => (
                    <>
                      <div>&rArr;</div>
                      <Link to={`/widget-types/${match.params.widget_type}`}>
                        {match.params.widget_type}
                      </Link>
                    </>
                  ),
                },
              },
            ],
          },
          {
            path: 'widgets-for-fields',
            element: null,
            handle: {
              crumb: () => (
                <>
                  <div>&rArr;</div>
                  <Link to="/widgets-for-fields">Widgets For Fields</Link>
                </>
              ),
            },
            children: [
              { index: true, lazy: () => import('./routes/widgetsForFields') },
              {
                path: ':widget_for_field_id',
                lazy: () => import('./routes/widgetForField'),
                handle: {
                  crumb: (match) => (
                    <>
                      <div>&rArr;</div>
                      <Link
                        to={`/widgets-for-fields/${match.params.widget_for_field_id}`}
                      >
                        {match.params.widget_for_field_id}
                      </Link>
                    </>
                  ),
                },
              },
            ],
          },
          {
            path: 'files',
            element: null,
            handle: {
              crumb: () => (
                <>
                  <div>&rArr;</div>
                  <Link to="/files">Files</Link>{' '}
                </>
              ),
            },
            children: [
              { index: true, lazy: () => import('./routes/files') },
              {
                path: ':file_id',
                lazy: () => import('./routes/file'),
                handle: {
                  crumb: (match) => (
                    <>
                      <div>&rArr;</div>
                      <Link to={`/files/${match.params.file_id}`}>
                        {match.params.file_id}
                      </Link>
                    </>
                  ),
                },
              },
            ],
          },
          {
            path: 'messages',
            element: null,
            handle: {
              crumb: () => (
                <>
                  <div>&rArr;</div>
                  <Link to="/messages">Messages</Link>
                </>
              ),
            },
            children: [
              { index: true, lazy: () => import('./routes/messages') },
              {
                path: ':message_id',
                lazy: () => import('./routes/message'),
                handle: {
                  crumb: (match) => (
                    <>
                      <div>&rArr;</div>
                      <Link to={`/messages/${match.params.message_id}`}>
                        {match.params.message_id}
                      </Link>
                    </>
                  ),
                },
              },
            ],
          },
          {
            path: 'docs',
            lazy: () => import('./routes/docs'),
            handle: {
              crumb: () => (
                <>
                  <div>&rArr;</div>
                  <Link to="/docs">Docs</Link>
                </>
              ),
            },
          },
        ],
      },
    ],
  },
])
