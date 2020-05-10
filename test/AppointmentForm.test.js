import React from 'react'
import ReactTestUtils from 'react-dom/test-utils'
import { createContainer } from './domers'
import { AppointmentForm } from '../src/AppointmentForm'

describe('AppointmentForm', () => {
  let render, container

  beforeEach(() => {
    ;({ render, container } = createContainer())
  })

  const form = (id) => container.querySelector(`form[id="${id}"]`)
  const field = (name) => form('appointment').elements[name]
  const labelFor = (elt) => container.querySelector(`label[for="${elt}"]`)
  const findOption = (select, text) => {
    const options = Array.from(select.childNodes)
    return options.find((option) => option.textContent === text)
  }

  it('renders a form', () => {
    render(<AppointmentForm />)
    expect(form('appointment')).not.toBeNull()
  })

  describe('service field', () => {
    it('renders as a select box', () => {
      render(<AppointmentForm />)
      expect(field('service')).not.toBeNull()
      expect(field('service').tagName).toEqual('SELECT')
    })

    it('initially has a blank value chosen', () => {
      render(<AppointmentForm />)
      const firstNode = field('service').childNodes[0]
      expect(firstNode.value).toEqual('')
      expect(firstNode.selected).toBeTruthy()
    })

    it('lists all salon services', () => {
      const selectableServices = ['Cut', 'Colors']
      render(<AppointmentForm services={selectableServices} />)
      const options = Array.from(field('service').childNodes)
      const services = options.map((node) => node.textContent)
      expect(services).toEqual(expect.arrayContaining(selectableServices))
    })

    it('preselects the existing value', () => {
      const services = ['Cut', 'Colors']
      render(<AppointmentForm services={services} service="Cut" />)
      const option = findOption(field('service'), 'Cut')
      expect(option.selected).toBeTruthy()
    })

    it('renders a label', () => {
      render(<AppointmentForm />)
      expect(labelFor('service')).not.toBeNull()
      expect(labelFor('service').textContent).toEqual('Pick a service')
    })

    it('assigns an id that matches the label id', () => {
      render(<AppointmentForm />)
      expect(field('service').id).toEqual('service')
    })

    it('saves existing value when submitted', async () => {
      expect.hasAssertions()
      render(
        <AppointmentForm
          service="Cut"
          onSubmit={({ service }) => expect(service).toEqual('Cut')}
        />
      )
      await ReactTestUtils.Simulate.submit(form('appointment'))
    })
    it('saves new as submitted', async () => {
      expect.hasAssertions()
      const val = 'Colors'
      render(
        <AppointmentForm
          service="Cut"
          onSubmit={({ service }) => expect(service).toEqual(val)}
        />
      )
      await ReactTestUtils.Simulate.change(field('service'), {
        target: { value: val, name: 'service' },
      })
      await ReactTestUtils.Simulate.submit(form('appointment'))
    })
  })

  describe('time slot table', () => {
    const timeslotTable = () => container.querySelector('table#timeslots')
    const startsAtField = (index) =>
      container.querySelectorAll(`input[name="startsAt"]`)[index]

    it('renders a table for time slots', () => {
      render(<AppointmentForm />)
      expect(timeslotTable()).not.toBeNull()
    })

    it('renders a time slot for every half hour between open and close times', () => {
      render(<AppointmentForm salonOpensAt={9} salonClosesAt={11} />)
      const timesOfDay = timeslotTable().querySelectorAll('tbody >* th')
      expect(timesOfDay).toHaveLength(4)
      expect(timesOfDay[0].textContent).toEqual('09:00')
      expect(timesOfDay[1].textContent).toEqual('09:30')
      expect(timesOfDay[3].textContent).toEqual('10:30')
    })

    it('renders an empty cell at start of header row', () => {
      render(<AppointmentForm />)
      const headerRow = timeslotTable().querySelector('thead > tr')
      expect(headerRow.firstChild.textContent).toEqual('')
    })

    it('renders a week of available dates', () => {
      const today = new Date(2018, 11, 1)
      render(<AppointmentForm today={today} />)
      const dates = timeslotTable().querySelectorAll(
        'thead >* th:not(:first-child)'
      )
      expect(dates).toHaveLength(7)
      expect(dates[1].textContent).toEqual('Sun 02')
      expect(dates[6].textContent).toEqual('Fri 07')
    })

    it('renders a radio button for each time slot', () => {
      const today = new Date()
      const availableTimeslots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) },
      ]
      render(
        <AppointmentForm
          availableTimeslots={availableTimeslots}
          today={today}
        />
      )
      const cells = timeslotTable().querySelectorAll('td')
      expect(cells[0].querySelector('input[type="radio"]')).not.toBeNull()
      expect(cells[7].querySelector('input[type="radio"]')).not.toBeNull()
    })

    it('does not render radio buttons for unavailable time slots', () => {
      render(<AppointmentForm availableTimeslots={[]} />)
      const timesOfDay = timeslotTable().querySelectorAll('input')
      expect(timesOfDay).toHaveLength(0)
    })

    it('sets radio button values to the index of the corresponding appointment', () => {
      const today = new Date()
      const availableTimeslots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) },
      ]
      render(
        <AppointmentForm
          availableTimeslots={availableTimeslots}
          today={today}
        />
      )
      expect(startsAtField(0).value).toEqual(
        availableTimeslots[0].startsAt.toString()
      )
      expect(startsAtField(1).value).toEqual(
        availableTimeslots[1].startsAt.toString()
      )
    })

    it('preselects the existing value', () => {
      const today = new Date()
      const availableTimeslots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) },
      ]
      render(
        <AppointmentForm
          availableTimeslots={availableTimeslots}
          today={today}
          startsAt={availableTimeslots[0].startsAt}
        />
      )
      expect(startsAtField(0).checked).toBeTruthy()
    })

    it('saves new value when submitted', () => {
      const today = new Date()
      const availableTimeslots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) },
      ]
      expect.hasAssertions()
      render(
        <AppointmentForm
          availableTimeslots={availableTimeslots}
          today={today}
          startsAt={availableTimeslots[0].startsAt}
          onSubmit={({ startsAt }) => {
            expect(startsAt).toEqual(availableTimeslots[1].startsAt)
          }}
        />
      )
      ReactTestUtils.Simulate.change(startsAtField(1), {
        target: {
          value: availableTimeslots[1].startsAt.toString(),
          name: 'startsAt',
        },
      })
      ReactTestUtils.Simulate.submit(form('appointment'))
    })
  })
})
