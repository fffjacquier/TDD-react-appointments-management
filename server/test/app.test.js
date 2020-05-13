import request from 'supertest'
import { buildApp } from '../src/app'
import { Appointments } from '../src/appointments'
import { Customers } from '../src/customers'

describe('app', () => {
  let originalFunctions = {}

  function app(customers = [], appointments = []) {
    return buildApp(customers, appointments)
  }

  function spyOn(object, method, spy) {
    originalFunctions[object] = originalFunctions[object] || {}
    originalFunctions[object][method] = object[method]
    object[method] = spy
  }

  function removeSpy(object, method) {
    object[method] = originalFunctions[object][method]
  }

  const appointment = {
    startsAt: new Date().setHours(9, 0, 0, 0),
    service: 'Blow-dry',
  }

  it.skip('serves an index page', async () => {
    await request(app()).get('/').expect(200)
  })

  describe('POST customers', () => {
    let addSpy = jest.fn()
    let isValidSpy = jest.fn()

    beforeEach(() => {
      spyOn(Customers.prototype, 'add', addSpy)
      spyOn(Customers.prototype, 'isValid', isValidSpy)
      isValidSpy.mockReturnValue(true)
    })

    afterEach(() => {
      removeSpy(Customers.prototype, 'add')
      removeSpy(Customers.prototype, 'isValidSpy')
    })

    const customer = {
      firstName: 'Ashley',
      lastName: 'Jones',
      phoneNumber: '123456789',
    }

    it.skip('saves a customer', async () => {
      await request(app()).post('/customers').send(customer).expect(201)
    })

    it.skip('passes customer to customer module', async () => {
      await request(app()).post('/customers').send(customer)

      expect(addSpy).toHaveBeenCalledWith(customer)
    })

    it.skip('returns the result of the add call', async () => {
      const result = { id: 123 }
      addSpy.mockReturnValue(result)
      await request(app())
        .post('/customers')
        .then((response) => {
          expect(response.body).toEqual(result)
        })
    })

    describe('invalid customer', () => {
      let error = { field: 'error' }
      let errorsSpy = jest.fn()

      beforeEach(() => {
        spyOn(Customers.prototype, 'errors', errorsSpy)
        isValidSpy.mockReturnValue(false)
        errorsSpy.mockReturnValue(error)
      })

      afterEach(() => {
        removeSpy(Customers.prototype, 'errors')
      })

      it.skip('returns 422 for an invalid customer', async () => {
        await request(app()).post('/customers').send(customer).expect(422)
      })

      it.skip('calls errors for an invalid customer', async () => {
        await request(app()).post('/customers').send(customer)

        expect(errorsSpy).toHaveBeenCalledWith(customer)
      })

      it.skip('returns errors', async () => {
        await request(app())
          .post('/customers')
          .send(customer)
          .then((response) =>
            expect(response.body).toEqual({
              errors: { field: 'error' },
            })
          )
      })
    })
  })

  describe('availableTimeSlots', () => {
    let timeSlotSpy = jest.fn()

    beforeEach(() => {
      spyOn(Appointments.prototype, 'getTimeSlots', timeSlotSpy)
    })

    afterEach(() => {
      removeSpy(Appointments.prototype, 'getTimeSlots')
    })

    it.skip('gets appointments', async () => {
      await request(app()).get('/availableTimeSlots').expect(200)
    })

    it.skip('returns all time slots from appointments', async () => {
      const timeSlots = [1, 2, 3]
      timeSlotSpy.mockReturnValueOnce(timeSlots)
      await request(app())
        .get('/availableTimeSlots')
        .then((response) => {
          expect(response.body).toEqual(timeSlots)
        })
    })
  })

  describe('POST appointments', () => {
    let addSpy = jest.fn()
    let isValidSpy = jest.fn()
    let errorsSpy = jest.fn()

    beforeEach(() => {
      spyOn(Appointments.prototype, 'add', addSpy)
      spyOn(Appointments.prototype, 'isValid', isValidSpy)
      isValidSpy.mockReturnValue(true)
    })

    afterEach(() => {
      removeSpy(Appointments.prototype, 'add')
      removeSpy(Appointments.prototype, 'isValid')
    })

    it.skip('saves an appointment', async () => {
      await request(app()).post('/appointments').send(appointment).expect(201)
    })

    it.skip('passes appointment request to appointments module', async () => {
      await request(app()).post('/appointments').send(appointment)

      expect(addSpy).toHaveBeenCalledWith(appointment)
    })

    it.skip('validates appointment requests', async () => {
      await request(app()).post('/appointments').send(appointment)

      expect(isValidSpy).toHaveBeenCalledWith(appointment)
    })

    describe('invalid appointment', () => {
      let error = { field: 'error' }

      beforeEach(() => {
        spyOn(Appointments.prototype, 'errors', errorsSpy)
        isValidSpy.mockReturnValue(false)
        errorsSpy.mockReturnValue(error)
      })

      afterEach(() => {
        removeSpy(Appointments.prototype, 'errors')
      })

      it.skip('returns 422 for an invalid appointment', async () => {
        await request(app()).post('/appointments').send(appointment).expect(422)
      })

      it.skip('calls errors for an invalid appointment', async () => {
        await request(app()).post('/appointments').send(appointment)

        expect(errorsSpy).toHaveBeenCalledWith(appointment)
      })

      it.skip('returns errors', async () => {
        await request(app())
          .post('/appointments')
          .send(appointment)
          .then((response) =>
            expect(response.body).toEqual({
              errors: { field: 'error' },
            })
          )
      })
    })
  })

  describe('GET appointments', () => {
    let appointmentsSpy = jest.fn()
    let customersSpy = jest.fn()

    beforeEach(() => {
      spyOn(Appointments.prototype, 'getAppointments', appointmentsSpy)
      spyOn(Customers.prototype, 'all', customersSpy)
    })

    afterEach(() => {
      removeSpy(Appointments.prototype, 'getAppointments')
      removeSpy(Customers.prototype, 'all')
    })

    it.skip('get appointments', async () => {
      await request(app())
        .get('/appointments/123-456')
        .send(appointment)
        .expect(200)
    })

    it.skip('passes from and to times through to appointments when retrieving appointments', async () => {
      const allCustomers = [{ id: 0 }, { id: 1 }]
      customersSpy.mockReturnValue(allCustomers)
      await request(app()).get('/appointments/123-456')

      expect(appointmentsSpy).toHaveBeenCalledWith(123, 456, allCustomers)
    })

    it.skip('returns the result of calling getAppointments', async () => {
      const allAppointments = [{ startsAt: 123 }, { startsAt: 456 }]
      appointmentsSpy.mockReturnValue(allAppointments)

      await request(app())
        .get('/appointments/123-456')
        .then((response) => {
          expect(response.body).toEqual(allAppointments)
        })
    })
  })

  describe('GET /customers', () => {
    let searchSpy = jest.fn()

    beforeEach(() => {
      spyOn(Customers.prototype, 'search', searchSpy)
    })

    afterEach(() => {
      removeSpy(Customers.prototype, 'search')
    })

    it.skip('passes parameters on to customer search', async () => {
      await request(app()).get(
        '/customers?limit=10&after=6&searchTerm=A&orderBy=firstName&orderDirection=asc'
      )

      expect(searchSpy).toHaveBeenCalledWith({
        limit: 10,
        after: 6,
        searchTerms: ['A'],
        orderBy: 'firstName',
        orderDirection: 'asc',
      })
    })

    it.skip('does not pass unknown search terms', async () => {
      await request(app()).get('/customers?test=test')

      expect(searchSpy).toHaveBeenCalledWith({})
    })

    it.skip('passes multiple search terms', async () => {
      await request(app()).get('/customers?searchTerm=A&searchTerm=B')

      expect(searchSpy).toHaveBeenCalledWith({
        searchTerms: ['A', 'B'],
      })
    })

    it.skip('passes result back to user', async () => {
      const results = [{ id: 0 }, { id: 1 }]
      searchSpy.mockReturnValue(results)
      await request(app())
        .get('/customers')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(results)
        })
    })
  })

  describe('POST graphql', () => {
    describe('customers query', () => {
      let searchSpy = jest.fn()
      let appointmentsSpy = jest.fn()

      beforeEach(() => {
        spyOn(Appointments.prototype, 'forCustomer', appointmentsSpy)
        spyOn(Customers.prototype, 'search', searchSpy)
      })

      afterEach(() => {
        removeSpy(Appointments.prototype, 'forCustomer')
        removeSpy(Customers.prototype, 'search')
      })

      it.skip('returns all customers', async () => {
        searchSpy.mockReturnValue([
          { id: '123', firstName: 'test', lastName: 'test' },
          { id: '234', firstName: 'another', lastName: 'another' },
        ])
        await request(app())
          .post('/graphql?')
          .send({ query: '\n\n{ customers { id firstName } }\n\n' })
          .then((response) => {
            const data = response.body.data
            expect(data.customers).toEqual([
              { id: '123', firstName: 'test' },
              { id: '234', firstName: 'another' },
            ])
          })
      })

      it.skip('appends appointment information to customers', async () => {
        searchSpy.mockReturnValue([
          { id: '123', firstName: 'test', lastName: 'test' },
        ])
        appointmentsSpy.mockReturnValue([{ startsAt: 123456 }])
        await request(app())
          .post('/graphql?')
          .send({
            query: '\n\n{ customers { appointments { startsAt } } }\n\n',
          })
          .then((response) => {
            const data = response.body.data
            expect(data.customers).toEqual([
              { appointments: [{ startsAt: '123456' }] },
            ])
          })
      })

      it.skip('calls forCustomer for each customer id', async () => {
        searchSpy.mockReturnValue([
          { id: '123', firstName: 'test', lastName: 'test' },
          { id: '234', firstName: 'another', lastName: 'another' },
        ])
        await request(app())
          .post('/graphql?')
          .send({
            query: '\n\n{ customers { appointments { startsAt } } }\n\n',
          })
          .then((_) => {
            expect(appointmentsSpy).toHaveBeenCalledWith('123')
            expect(appointmentsSpy).toHaveBeenLastCalledWith('234')
          })
      })
    })

    describe('customer query', () => {
      let customersSpy = jest.fn()
      let appointmentsSpy = jest.fn()

      beforeEach(() => {
        spyOn(Appointments.prototype, 'forCustomer', appointmentsSpy)
        spyOn(Customers.prototype, 'all', customersSpy)
        customersSpy.mockReturnValue({ '5': { firstName: 'Daniel', id: '5' } })
      })

      afterEach(() => {
        removeSpy(Appointments.prototype, 'forCustomer')
        removeSpy(Customers.prototype, 'all')
      })

      it.skip('call customers.all', async () => {
        await request(app())
          .post('/graphql?')
          .send({ query: '\n\n{ customer(id: 5) { id } }\n\n' })
          .then((_) => {
            expect(customersSpy).toHaveBeenCalled()
          })
      })

      it.skip('selects the customer with the given id', async () => {
        await request(app())
          .post('/graphql?')
          .send({ query: '\n\n{ customer(id: 5) { id firstName } }\n\n' })
          .then((response) => {
            const data = response.body.data
            expect(data.customer.id).toEqual('5')
            expect(data.customer.firstName).toEqual('Daniel')
          })
      })

      it.skip('calls appointments.forCustomer for the given customer', async () => {
        await request(app())
          .post('/graphql?')
          .send({ query: '\n\n{ customer(id: 5) { id } }\n\n' })
          .then((_) => {
            expect(appointmentsSpy).toHaveBeenCalledWith('5')
          })
      })

      it.skip('appends the appointment to the customer', async () => {
        appointmentsSpy.mockReturnValue([{ startsAt: 123 }])
        await request(app())
          .post('/graphql?')
          .send({
            query: '\n\n{ customer(id: 5) { appointments { startsAt } } }\n\n',
          })
          .then((response) => {
            const data = response.body.data
            expect(data.customer.appointments).toEqual([{ startsAt: '123' }])
          })
      })
    })

    describe('availableTimeSlots query', () => {
      let getTimeSlotsSpy = jest.fn(() => [{ startsAt: 123 }])

      beforeEach(() => {
        spyOn(Appointments.prototype, 'getTimeSlots', getTimeSlotsSpy)
      })

      afterEach(() => {
        removeSpy(Appointments.prototype, 'getTimeSlots')
      })

      it.skip('calls appointments.getTimeSlots', async () => {
        await request(app())
          .post('/graphql?')
          .send({ query: '\n\n{ availableTimeSlots { startsAt } }\n\n' })
          .then((response) => {
            expect(getTimeSlotsSpy).toHaveBeenCalled()
          })
      })

      it.skip('returns the time slot data', async () => {
        await request(app())
          .post('/graphql?')
          .send({ query: '\n\n{ availableTimeSlots { startsAt } }\n\n' })
          .then((response) => {
            const data = response.body.data
            expect(data.availableTimeSlots).toEqual([{ startsAt: '123' }])
          })
      })
    })

    describe('appointments query', () => {
      const allCustomers = [{ id: 1 }, { id: 2 }]
      let appointmentsSlotsSpy = jest.fn(() => [{ startsAt: 123 }])
      let customerSpy = jest.fn(() => allCustomers)

      beforeEach(() => {
        spyOn(Customers.prototype, 'all', customerSpy)
        spyOn(Appointments.prototype, 'getAppointments', appointmentsSlotsSpy)
      })

      afterEach(() => {
        removeSpy(Appointments.prototype, 'getAppointments')
        removeSpy(Customers.prototype, 'all')
      })

      it.skip('calls appointments.getAppointments', async () => {
        await request(app())
          .post('/graphql?')
          .send({
            query:
              '\n\n{ appointments(from: "123", to: "234") { startsAt } }\n\n',
          })
          .then((response) => {
            expect(appointmentsSlotsSpy).toHaveBeenCalledWith(
              123,
              234,
              allCustomers
            )
          })
      })

      it.skip('returns the appointment data', async () => {
        await request(app())
          .post('/graphql?')
          .send({
            query:
              '\n\n{ appointments(from: "123", to: "234") { startsAt } }\n\n',
          })
          .then((response) => {
            const data = response.body.data
            expect(data.appointments).toEqual([{ startsAt: '123' }])
          })
      })
    })

    describe('addAppointment mutation', () => {
      let validSpy = jest.fn(() => true)
      let addSpy = jest.fn(() => ({ startsAt: 123, customer: 1 }))
      let errorsSpy = jest.fn()

      beforeEach(() => {
        spyOn(Appointments.prototype, 'isValid', validSpy)
        spyOn(Appointments.prototype, 'errors', errorsSpy)
        spyOn(Appointments.prototype, 'add', addSpy)
      })

      afterEach(() => {
        removeSpy(Appointments.prototype, 'isValid')
        removeSpy(Appointments.prototype, 'errors')
        removeSpy(Appointments.prototype, 'add')
      })

      const query = `mutation {
        addAppointment(appointment: { startsAt: "123", customer: 1 }) {
          startsAt
        }
      }`

      it.skip('saves the appointment if it is valid', async () => {
        await request(app())
          .post('/graphql?')
          .send({ query })
          .then((response) => {
            expect(addSpy).toHaveBeenLastCalledWith({
              startsAt: 123,
              customer: '1',
            })
          })
      })

      it.skip('returns the same appointment', async () => {
        await request(app())
          .post('/graphql?')
          .send({ query })
          .then((response) => {
            const data = response.body.data
            expect(data.addAppointment).toEqual({
              startsAt: '123',
            })
          })
      })

      it.skip('returns errors if appointment is not valid', async () => {
        validSpy.mockReturnValue(false)
        errorsSpy.mockReturnValue({ field: 'desc' })
        await request(app())
          .post('/graphql?')
          .send({ query })
          .then((response) => {
            expect(response.body).toEqual({
              errors: [
                {
                  message: 'desc',
                  path: ['addAppointment', 'field'],
                },
              ],
            })
          })
      })
    })

    describe('addCustomer mutation', () => {
      let validSpy = jest.fn(() => true)
      let addSpy = jest.fn(() => ({ id: '123' }))
      let errorsSpy = jest.fn()

      beforeEach(() => {
        spyOn(Customers.prototype, 'isValid', validSpy)
        spyOn(Customers.prototype, 'errors', errorsSpy)
        spyOn(Customers.prototype, 'add', addSpy)
      })

      afterEach(() => {
        removeSpy(Customers.prototype, 'isValid')
        removeSpy(Customers.prototype, 'errors')
        removeSpy(Customers.prototype, 'add')
      })

      const query = `mutation {
        addCustomer(customer: {
          firstName: "Ashley",
          lastName: "Jones",
          phoneNumber: "123" }) {
          id
        }
      }`

      it.skip('saves the customer if it is valid', async () => {
        await request(app())
          .post('/graphql?')
          .send({ query })
          .then((response) => {
            expect(addSpy).toHaveBeenLastCalledWith({
              firstName: 'Ashley',
              lastName: 'Jones',
              phoneNumber: '123',
            })
          })
      })

      it.skip('returns the customer id', async () => {
        await request(app())
          .post('/graphql?')
          .send({ query })
          .then((response) => {
            const data = response.body.data
            expect(data.addCustomer).toEqual({ id: '123' })
          })
      })

      it.skip('returns errors if customer is not valid', async () => {
        validSpy.mockReturnValue(false)
        errorsSpy.mockReturnValue({ field: 'desc' })
        await request(app())
          .post('/graphql?')
          .send({ query })
          .then((response) => {
            expect(response.body).toEqual({
              errors: [
                {
                  message: 'desc',
                  path: ['addCustomer', 'field'],
                },
              ],
            })
          })
      })
    })
  })
})
