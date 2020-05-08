import React from 'react'
import ReactDOM from 'react-dom'
import { AppointmentsDayView } from './Appointment'
import { sample } from './data'

ReactDOM.render(
  <AppointmentsDayView appointments={sample} />,
  document.getElementById('root')
)
