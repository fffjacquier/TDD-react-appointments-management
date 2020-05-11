import React, { useState } from 'react'

const Error = () => <div className="error">An error occurred during save.</div>

export const CustomerForm = ({ firstName, lastName, phoneNumber, onSave }) => {
  const [error, setError] = useState(false)
  const [customer, setCustomer] = useState({ firstName, lastName, phoneNumber })

  const handleChange = ({ target }) => {
    setCustomer((customer) => ({
      ...customer,
      [target.name]: target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await window.fetch('/customers', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    })
    if (result.ok) {
      const customerWithId = await result.json()
      onSave(customerWithId)
    }
    !result.ok && setError(true)
  }

  return (
    <form id="customer" onSubmit={handleSubmit}>
      {error ? <Error /> : null}
      <label htmlFor="firstName">First name</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={firstName}
        onChange={handleChange}
        readOnly
      />
      <label htmlFor="lastName">Last name</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={lastName}
        onChange={handleChange}
        readOnly
      />
      <label htmlFor="phoneNumber">Phone number</label>
      <input
        type="text"
        id="phoneNumber"
        name="phoneNumber"
        value={phoneNumber}
        onChange={handleChange}
        readOnly
      />
      <input type="submit" value="Add" />
    </form>
  )
}
CustomerForm.defaultProps = {
  onSave: () => {},
}
