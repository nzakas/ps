import { createBrowserRouter } from 'react-router-dom'

import { Root } from './routes/root'
import { User } from './routes/user'
import { Accounts } from './routes/accounts'
import { Projects } from './routes/projects'
import { FieldTypes } from './routes/fieldTypes'
import { WidgetTypes } from './routes/widgetTypes'
import { WidgetsForFields } from './routes/widgetsForFields'
import { ErrorPage } from './routes/error'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'users', element: <User /> },
      { path: 'accounts', element: <Accounts /> },
      { path: 'projects', element: <Projects /> },
      { path: 'field-types', element: <FieldTypes /> },
      { path: 'widget-types', element: <WidgetTypes /> },
      { path: 'widgets-for-fields', element: <WidgetsForFields /> },
    ],
  },
])
