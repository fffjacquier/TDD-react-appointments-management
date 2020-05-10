import React, { useState, useCallback } from 'react'

const timeIncrements = (num, start, inc) => {
  return Array(num)
    .fill(start)
    .map((s, i) => s + i * inc)
}
const dailyslots = (opensAt, closesAt) => {
  // 2 slots by hour
  const slots = (closesAt - opensAt) * 2
  const startTime = new Date().setHours(opensAt, 0, 0, 0)
  const increment = 1000 * 60 * 30
  return timeIncrements(slots, startTime, increment)
}

const weeklyDates = (startDate) => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0)
  const increment = 1000 * 60 * 60 * 24
  return timeIncrements(7, midnight, increment)
}

const toTimeValue = (timestamp) =>
  new Date(timestamp).toTimeString().substring(0, 5)

const toShortDate = (timestamp) => {
  const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(' ')
  return `${day} ${dayOfMonth}`
}

const convertToTimestamp = (date, slot) => {
  const t = new Date(slot)
  return new Date(date).setHours(
    t.getHours(),
    t.getMinutes(),
    t.getSeconds(),
    t.getMilliseconds()
  )
}

const RadioButtonIfAvailable = ({
  availableTimeslots,
  date,
  slot,
  checkedTimeslot,
  handleChange,
}) => {
  const startsAt = convertToTimestamp(date, slot)
  if (availableTimeslots.some((availSlot) => availSlot.startsAt === startsAt)) {
    const isChecked = startsAt === checkedTimeslot
    return (
      <input
        type="radio"
        name="startsAt"
        value={startsAt}
        checked={isChecked}
        onChange={handleChange}
      />
    )
  }
  return null
}

const TimeslotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeslots,
  checkedTimeslot,
  handleChange,
}) => {
  const timeslots = dailyslots(salonOpensAt, salonClosesAt)
  const weekdates = weeklyDates(today)
  return (
    <table id="timeslots">
      <thead>
        <tr>
          <th />
          {weekdates.map((d) => (
            <th key={d}>{toShortDate(d)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeslots.map((slot) => (
          <tr key={slot}>
            <th>{toTimeValue(slot)}</th>
            {weekdates.map((date) => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeslots={availableTimeslots}
                  date={date}
                  slot={slot}
                  checkedTimeslot={checkedTimeslot}
                  handleChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const AppointmentForm = ({
  services = [],
  service,
  onSubmit,
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeslots,
  startsAt,
}) => {
  const [appointment, setAppointment] = useState({ service, startsAt })
  const handleChange = ({ target: { value } }) => {
    setAppointment((appointment) => ({
      ...appointment,
      service: value,
    }))
  }

  const handleStartsAtChange = useCallback(({ target: { value } }) => {
    setAppointment((appointment) => ({
      ...appointment,
      startsAt: parseInt(value),
    }))
  }, [])

  return (
    <form id="appointment" onSubmit={() => onSubmit(appointment)}>
      <label htmlFor="service">Pick a service</label>
      <select
        id="service"
        name="service"
        value={service}
        onChange={handleChange}
      >
        <option />
        {services.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <TimeslotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeslots={availableTimeslots}
        checkedTimeslot={appointment.startsAt}
        handleChange={handleStartsAtChange}
      />
      <input type="submit" value="Add" />
    </form>
  )
}
AppointmentForm.defaultProps = {
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
  availableTimeslots: [],
  services: ['Cut', 'Blow-dry', 'Beard', 'Colors', 'Extensions'],
}
