import { useLiveQuery } from 'electric-sql/react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import { Persons as Person } from '../../../generated/client'
import { useElectric } from '../ElectricProvider'
import { person as createPersonPreset } from '../modules/dataPresets'
import '../form.css'

export const Component = () => {
  const navigate = useNavigate()
  const { project_id } = useParams<{ project_id: string }>()

  const { db } = useElectric()
  const { results } = useLiveQuery(db.persons.liveMany())

  const add = async () => {
    const newPerson = createPersonPreset()
    await db.persons.create({
      data: newPerson,
    })
    navigate(`/projects/${project_id}/persons/${newPerson.person_id}`)
  }

  const clear = async () => {
    await db.persons.deleteMany()
  }

  const persons: Person[] = results ?? []

  return (
    <div className="form-container">
      <div className="controls">
        <button className="button" onClick={add}>
          Add
        </button>
        <button className="button" onClick={clear}>
          Clear
        </button>
      </div>
      {persons.map((person: Person, index: number) => (
        <p key={index} className="item">
          <Link to={`/projects/${project_id}/persons/${person.person_id}`}>
            {person.label ?? person.person_id}
          </Link>
        </p>
      ))}
    </div>
  )
}
