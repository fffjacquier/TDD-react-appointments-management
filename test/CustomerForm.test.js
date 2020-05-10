import React from 'react'
import ReactTestUtils from 'react-dom/test-utils'

import { createContainer } from './domers'
import { CustomerForm } from '../src/CustomerForm'

describe('CustomerForm', () => {
  let render
  let container
  const form = (id) => container.querySelector(`form[id=${id}]`)
  const expectInputFieldTypeText = (field) => {
    expect(field).not.toBeNull()
    expect(field.tagName).toEqual('INPUT')
    expect(field.type).toEqual('text')
  }
  const field = (name) => form('customer').elements[name]
  const labelFor = (formElt) =>
    container.querySelector(`label[for="${formElt}"]`)

  beforeEach(() => {
    ;({ render, container } = createContainer())
  })

  it('renders a form', () => {
    render(<CustomerForm />)
    expect(form('customer')).not.toBeNull()
  })

  const itRendersAsTetxBox = (name) => {
    it('renders as a text box', () => {
      render(<CustomerForm />)
      expectInputFieldTypeText(field(name))
    })
  }
  const itIncludesExistingValue = (name) => {
    it('includes existing value', () => {
      render(<CustomerForm {...{ [name]: 'value' }} />)
      expect(field(name).value).toEqual('value')
    })
  }
  const itRendersALabel = (name, val) => {
    it('renders a label', () => {
      render(<CustomerForm />)
      expect(labelFor(name)).not.toBeNull()
      expect(labelFor(name).textContent).toEqual(val)
    })
  }
  const itAssignsIdMatchingLabelId = (name) => {
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm />)
      expect(field(name).id).toEqual(name)
    })
  }
  const itSavesAsSubmitted = (name, val) => {
    it('saves when submitted', async () => {
      expect.hasAssertions()
      render(
        <CustomerForm
          {...{ [name]: val }}
          onSubmit={(props) => expect(props[name]).toEqual(val)}
        />
      )
      await ReactTestUtils.Simulate.submit(form('customer'))
    })
  }
  const itSavesNewAsSubmitted = (name, val) => {
    it('saves new as submitted', async () => {
      expect.hasAssertions()
      render(
        <CustomerForm
          {...{ [name]: 'oldvalue' }}
          onSubmit={(props) => expect(props[name]).toEqual(val)}
        />
      )
      await ReactTestUtils.Simulate.change(field(name), {
        target: { value: val, name },
      })
      await ReactTestUtils.Simulate.submit(form('customer'))
    })
  }

  describe('First name field', () => {
    itRendersAsTetxBox('firstName')
    itIncludesExistingValue('firstName')
    itRendersALabel('firstName', 'First name')
    itAssignsIdMatchingLabelId('firstName')
    itSavesAsSubmitted('firstName', 'Joe')
    itSavesNewAsSubmitted('firstName', 'test')
  })
  describe('Last name field', () => {
    itRendersAsTetxBox('lastName')
    itIncludesExistingValue('lastName')
    itRendersALabel('lastName', 'Last name')
    itAssignsIdMatchingLabelId('lastName')
    itSavesAsSubmitted('lastName', 'Joe')
    itSavesNewAsSubmitted('lastName', 'test')
  })
  describe('Phone number field', () => {
    itRendersAsTetxBox('phoneNumber')
    itIncludesExistingValue('phoneNumber')
    itRendersALabel('phoneNumber', 'Phone number')
    itAssignsIdMatchingLabelId('phoneNumber')
    itSavesAsSubmitted('phoneNumber', '123456789')
    itSavesNewAsSubmitted('phoneNumber', '098765432')
  })

  it('has a submit button', () => {
    render(<CustomerForm />)
    const submitButton = container.querySelector('input[type="submit"]')
    expect(submitButton).not.toBeNull()
  })
})
