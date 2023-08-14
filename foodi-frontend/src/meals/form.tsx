import React, { useState } from 'react'
import { API } from '../api'
import { type Meal } from './meal'

interface FormProps {
  onSubmit: (meal: Meal) => void
}

export default function Form({ onSubmit }: FormProps): JSX.Element {
  const [name, setName] = useState<string | undefined>(undefined)
  const [time, setTime] = useState<Date>(new Date())
  const [error, setError] = useState<string | undefined>(undefined)

  const submit = (): void => {
    fetch(API + '/v1/meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, time }),
    })
      .then((resp) => {
        resp
          .json()
          .then((meal) => {
            onSubmit(meal)
          })
          .catch((e) => {
            console.error(e)
          })
      })
      .catch((e) => {
        setError(e.toString())
        console.error(e)
      })
  }

  return (
    <div className="contain fl pa2 w-100">
      <form className="pa4 black-80 shadow-1">
        <div className="measure pv1">
          <label htmlFor="name" className="f6 b db mb2">
            Name of meal
          </label>
          <input
            id="name"
            className="input-reset ba b--black-20 pa2 mb2 db w-100"
            type="text"
            aria-describedby="name-desc"
            onChange={(event) => {
              setName(event.target.value)
            }}
            value={name}
          />
          <small id="name-desc" className="f6 black-60 db mb2">
            What did you eat?
          </small>
        </div>
        <div className="measure">
          <label htmlFor="time" className="f6 b db mb2">
            Time of meal
          </label>
          <input
            id="time"
            className="input-reset ba b--black-20 pa2 mb2 db w-100"
            type="text"
            aria-describedby="name-desc"
            value={time.toISOString()}
            onChange={(event) => {
              setTime(new Date(Date.parse(event.target.value)))
            }}
          />
          <small id="name-desc" className="f6 black-60 db mb2">
            When did you eat?
          </small>
        </div>
        <div className="pv1">
          <a
            className="f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib white bg-hot-pink"
            href="#0"
            onClick={(event) => {
              submit()
            }}
          >
            + Save!
          </a>
        </div>
        {error !== undefined && <div className="red">{error}</div>}
      </form>
    </div>
  )
}
