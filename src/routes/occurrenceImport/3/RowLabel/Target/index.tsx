import { Droppable } from 'react-beautiful-dnd'

import TargetElements from './TargetElements'
import { LabelElement } from '..'

const containerStyle = {
  margin: 0,
  marginRight: 8,
  outline: '1px dotted lightgrey',
  borderRadius: 4,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderCollapse: 'collapse',
  boxSizing: 'border-box',
  flexGrow: 1,
}
// was inside container:
// > div {
//   flex-grow: 1;
//   height: 100%;
//   width: 100%;
//   display: flex;
//   flex-direction: column;
// }
const droppableStyle = {
  flexGrow: 1,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}
const titleContainerStyle = {
  padding: 8,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 0,
  userSelect: 'none',
}
const titleStyle = {
  margin: 0,
}
const explainerStyle = {
  fontSize: 'x-small',
  margin: 0,
  color: 'grey',
}

/**
 * Have two versions:
 * 1. editing
 *    - (horizontal?) list of draggable fields
 *    - text field element to drag between field elements and input some text
 *    - drop area, horizontally sortable
 *      edit creates array of: {field: field_id, text: 'field', index: 1}
 *      or
 *         have a table 'table_row_label_parts' with fields: table_id, sort, type, value
 *         and in class Table a get function to fetch the table's row label or use https://github.com/ignasbernotas/dexie-relationships
 *         No, because: new table needs to be policied and synced. Much easier to have a jsonb field in already synced table
 * 2. presentation: only the drop area
 * 3. remind user to first define the fields
 */

interface Props {
  label: LabelElement[]
}

export const Target = ({ label }: Props) => {
  return (
    <div style={containerStyle}>
      <Droppable
        droppableId="target"
        direction="horizontal"
        style={droppableStyle}
      >
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <div style={titleContainerStyle}>
              <h4 style={titleStyle}>Datensatz-Beschriftung</h4>
              <p style={explainerStyle}>
                Hier bestimmen Sie, wie Datensätze beschriftet werden.
              </p>
              <p style={explainerStyle}>
                Ziehen Sie Felder hierhin. Der jeweilige Wert des Felds wird
                dann für die Beschriftung verwendet.
              </p>
              <p style={explainerStyle}>
                Sie können mehrere Felder kombinieren. Und mit dem
                Zeichen-Werkzeug (Trenn-)Zeichen platzieren.
              </p>
            </div>
            <TargetElements
              label={label}
              isDraggingOver={snapshot.isDraggingOver}
              provided={provided}
            />
          </div>
        )}
      </Droppable>
    </div>
  )
}
