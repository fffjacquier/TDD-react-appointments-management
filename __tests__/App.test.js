import React from 'react'
import {
  createShallowRenderer,
  type,
  className,
  childrenOf,
  click,
  id,
} from './shallowHelpers'
import { App } from '../src/App'
import { CustomerForm } from '../src/CustomerForm'
import { AppointmentFormLoader } from '../src/AppointmentFormLoader'
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader'

describe('App', () => {
  let render, elementMatching, child

  beforeEach(() => {
    ;({ render, elementMatching, child } = createShallowRenderer())
  })

  it('initially show the AppointmentDayViewLoader', () => {
    render(<App />)
    expect(elementMatching(type(AppointmentsDayViewLoader))).toBeDefined()
  })

  it('has a button bar as the first child', () => {
    render(<App />)
    expect(child(0).type).toEqual('div')
    expect(child(0).props.className).toEqual('button-bar')
  })

  it('has a button to initiate add customer and appointment action', () => {
    render(<App />)
    const buttons = childrenOf(elementMatching(className('button-bar')))
    expect(buttons[0].type).toEqual('button')
    expect(buttons[0].props.children).toEqual('Add customer and appointment')
  })

  const clickAddCustomer = () => {
    render(<App />)
    click(elementMatching(id('addCustomer')))
  }

  it('displays the customer form when button is clicked', async () => {
    clickAddCustomer()
    expect(elementMatching(type(CustomerForm))).toBeDefined()
  })

  it('hides the AppointmentsDayViewLoader when button is clicked', async () => {
    clickAddCustomer()
    expect(elementMatching(type(AppointmentsDayViewLoader))).not.toBeDefined()
  })

  it('hides the button bar when CustomerForm is displayed', async () => {
    clickAddCustomer()
    expect(elementMatching(className('button-bar'))).not.toBeTruthy()
  })

  const saveCustomer = (customer) =>
    elementMatching(type(CustomerForm)).props.onSave(customer)

  it('displays the AppointmentFormLoader after the CustomerForm is submitted', async () => {
    clickAddCustomer()
    saveCustomer()

    expect(elementMatching(type(AppointmentFormLoader))).toBeDefined()
  })

  it('passes the customer to the AppointmentForm', () => {
    const customer = { id: 123 }
    clickAddCustomer()
    saveCustomer(customer)
    expect(elementMatching(type(AppointmentFormLoader)).props.customer).toBe(
      customer
    )
  })

  const saveAppointment = () =>
    elementMatching(type(AppointmentFormLoader)).props.onSave()

  it('renders AppointmentsDayVIewLoader after AppointmentForm is submitted', async () => {
    clickAddCustomer()
    saveCustomer()
    saveAppointment()
    expect(elementMatching(type(AppointmentsDayViewLoader))).toBeDefined()
  })
})
