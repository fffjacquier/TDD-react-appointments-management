import React from 'react'
import ReactTestUtils, { act } from 'react-dom/test-utils'
import 'whatwg-fetch'

import { createContainer } from './domers'
import {
  fetchResponseError,
  fetchResponseOk,
  replaceBodyOf,
} from './spyHelpers'
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
    jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk({}))
  })

  afterEach(() => {
    window.fetch.mockRestore()
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
    it('saves when submitted', () => {
      render(<CustomerForm {...{ [name]: val }} />)
      ReactTestUtils.Simulate.submit(form('customer'))

      expect(replaceBodyOf(window.fetch)).toMatchObject({
        [name]: val,
      })
    })
  }
  const itSavesNewAsSubmitted = (name, val) => {
    it('saves new as submitted', async () => {
      render(<CustomerForm {...{ [name]: 'oldvalue' }} />)
      ReactTestUtils.Simulate.change(field(name), {
        target: { value: val, name },
      })
      await ReactTestUtils.Simulate.submit(form('customer'))

      expect(replaceBodyOf(window.fetch)).toMatchObject({
        [name]: val,
      })
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
    itSavesAsSubmitted('lastName', 'Boss')
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

  it('calls fetch with the right properties when submitting data', async () => {
    render(<CustomerForm />)
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'))
    })

    expect(window.fetch).toHaveBeenCalledWith(
      '/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      })
    )
  })

  it('notifies onSave when form is submitted', async () => {
    const customer = { id: 123 }
    window.fetch.mockReturnValue(fetchResponseOk(customer))

    const saveSpy = jest.fn()

    render(<CustomerForm onSave={saveSpy} />)
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'))
    })

    expect(saveSpy).toHaveBeenCalledWith(customer)
  })

  it('does not notify onSave if the Post request returns an error', async () => {
    window.fetch.mockReturnValue(fetchResponseError())
    const saveSpy = jest.fn()

    render(<CustomerForm onSave={saveSpy} />)
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'))
    })
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn()

    render(<CustomerForm />)
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'), {
        preventDefault: preventDefaultSpy,
      })
    })
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('renders error message when fetch call fails', async () => {
    window.fetch.mockReturnValue(fetchResponseError())

    render(<CustomerForm />)
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'))
    })

    const errorElement = container.querySelector('.error')
    expect(errorElement).not.toBeNull()
    expect(errorElement.textContent).toMatch('error occurred')
  })
})
