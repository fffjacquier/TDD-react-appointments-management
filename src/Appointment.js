import React, { useState } from 'react'

const appointmentTimeOfDay = (startsAt) => {
  const [h, m] = new Date(startsAt).toTimeString().split(':')
  return `${h}:${m}`
}

export const Appointment = ({ customer: { firstName } }) => (
  <div>{firstName}</div>
)

export const AppointmentsDayView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(0)

  return (
    <div id="appointmentsDayView">
      <ol>
        {appointments.map((a, i) => (
          <li key={a.startsAt}>
            <button type="button" onClick={(e) => setSelectedAppointment(i)}>
              {appointmentTimeOfDay(a.startsAt)}
            </button>
          </li>
        ))}
      </ol>
      {appointments.length ? (
        <Appointment {...appointments[selectedAppointment]} />
      ) : (
        <p>No appointments today.</p>
      )}
    </div>
  )
}
