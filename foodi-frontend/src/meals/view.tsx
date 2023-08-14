import React, { useEffect, useState } from 'react'
import { API } from '../api'
import Form from './form'
import { type Meal } from './meal'

interface TableRowProps {
  children?: React.ReactNode
}

const TableRow: React.FC<TableRowProps> = ({ children }) => {
  return <tr className="striped--near-white">{children}</tr>
}
interface TableHeaderProps {
  children?: React.ReactNode
}

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <th className="pv2 ph3 tl f6 fw6 ttu">{children}</th>
}

interface TableDataProps {
  children?: React.ReactNode
}

const TableData: React.FC<TableDataProps> = ({ children }) => {
  return <td className="pv2 ph3">{children}</td>
}

export default function MealView(): JSX.Element {
  const [meals, setMeals] = useState<Meal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  console.log(meals)

  useEffect(() => {
    fetch(API + '/v1/meals')
      .then((resp) => {
        if (resp.ok) {
          resp
            .json()
            .then((json) => {
              setMeals(json)
            })
            .catch((e) => {
              console.error(e)
            })
        }
      })
      .catch((e) => {
        setError(e.toString())
        console.error(e)
      })
  }, [])

  return (
    <div className="sans-serif fl w-50 pa2 pv2">
      <div className="pa3">
        {error !== undefined && <div className="red">{error}</div>}
        <table className="collapse pv2 ph3 mt4 fl pa2 w-100">
          <tbody>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Time</TableHeader>
            </TableRow>
            {meals?.map((meal: Meal) => (
              <TableRow key={meal.id}>
                <TableData>{meal.id}</TableData>
                <TableData>{meal.name}</TableData>
                <TableData>{meal.time}</TableData>
              </TableRow>
            ))}
          </tbody>
        </table>
        <div>
          <a
            className="f6 grow no-underline br-pill ba bw1 ph3 pv2 ma3 dib hot-pink"
            href="#0"
            onClick={() => {
              setShowForm(true)
            }}
          >
            Add new meal
          </a>
        </div>
      </div>
      {showForm && (
        <Form
          onSubmit={(meal) => {
            setShowForm(false)
            setMeals([...meals, meal])
          }}
        />
      )}
    </div>
  )
}
