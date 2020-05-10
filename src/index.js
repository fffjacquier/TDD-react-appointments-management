import React from 'react'
import ReactDOM from 'react-dom'
import { AppointmentForm } from './AppointmentForm'
import { AppointmentsDayView } from './AppointmentsDayView'
import { CustomerForm } from './CustomerForm'
import { sampleAvailableTimeSlots } from './data'

ReactDOM.render(
  <AppointmentForm availableTimeslots={sampleAvailableTimeSlots} />,
  document.getElementById('root')
)
