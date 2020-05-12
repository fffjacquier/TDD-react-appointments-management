import React, { useEffect, useState } from 'react'

import { AppointmentForm } from './AppointmentForm'

export const AppointmentFormLoader = (props) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  useEffect(() => {
    const fetchTimeSlots = async () => {
      const result = await window.fetch('/availableTimeSlots', {
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      })
      setAvailableTimeSlots(await result.json())
    }
    fetchTimeSlots()
  }, [])

  return <AppointmentForm {...props} availableTimeSlots={availableTimeSlots} />
}
