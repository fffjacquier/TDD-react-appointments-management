import React from 'react'
import ReactDOM from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils'

import { Appointment, AppointmentsDayView } from '../src/Appointment'

let container
let customer

describe('Appointment', () => {
  beforeEach(() => {
    container = document.createElement('div')
  })

  const render = (component) => ReactDOM.render(component, container)

  it('renders the customer first name', () => {
    customer = { firstName: 'Francois' }
    render(<Appointment customer={customer} />)

    expect(container.textContent).toMatch('Francois')
  })

  it('renders another customer first name', () => {
    customer = { firstName: 'Joel' }
    render(<Appointment customer={customer} />)

    expect(container.textContent).toMatch('Joel')
  })
})

describe('AppointmentsDayView', () => {
  let container
  const today = new Date()
  const appointments = [
    { startsAt: today.setHours(12, 0), customer: { firstName: 'Francois' } },
    { startsAt: today.setHours(13, 0), customer: { firstName: 'Joel' } },
  ]

  beforeEach(() => {
    container = document.createElement('div')
  })

  const render = (component) => ReactDOM.render(component, container)

  it('renders a div with the right id', () => {
    render(<AppointmentsDayView appointments={appointments} />)
    expect(container.querySelector('div#appointmentsDayView')).not.toBeNull()
  })

  it('renders multiple appointments in an ol element', () => {
    render(<AppointmentsDayView appointments={appointments} />)
    expect(container.querySelector('ol')).not.toBeNull()
    expect(container.querySelector('ol').children).toHaveLength(2)
  })

  it('renders each appointment in an li', () => {
    render(<AppointmentsDayView appointments={appointments} />)
    expect(container.querySelectorAll('li')).toHaveLength(2)
    expect(container.querySelectorAll('li')[0].textContent).toEqual('12:00')
    expect(container.querySelectorAll('li')[1].textContent).toEqual('13:00')
  })

  it('initially shows a message sayinh there are no appointments today', () => {
    render(<AppointmentsDayView appointments={[]} />)
    expect(container.textContent).toMatch('No appointments today.')
  })

  it('selects the first appointment by default', () => {
    render(<AppointmentsDayView appointments={appointments} />)
    expect(container.textContent).toMatch('Francois')
  })

  it('has a button element in each li', () => {
    render(<AppointmentsDayView appointments={appointments} />)
    expect(container.querySelectorAll('li > button')).toHaveLength(2)
    expect(container.querySelectorAll('li > button')[0].type).toEqual('button')
  })

  it('renders another appointment when clicked', () => {
    render(<AppointmentsDayView appointments={appointments} />)
    const button = container.querySelectorAll('button')[1]
    ReactTestUtils.Simulate.click(button)
    expect(container.textContent).toMatch('Joel')
  })
})
