import { objectToQueryString } from '../src/objectToQueryString'

describe('objectToQueryString', () => {
  it('returns empty string if no params is passed', () => {
    expect(objectToQueryString({})).toEqual('')
  })

  it('returns a key/value pair as key=value string', () => {
    expect(objectToQueryString({ key: 'value' })).toEqual('?key=value')
  })

  it('returns multiple key/value pairs', () => {
    expect(objectToQueryString({ a: 'z', b: 'y', c: 'x' })).toEqual(
      '?a=z&b=y&c=x'
    )
  })

  it('removes empty values', () => {
    expect(objectToQueryString({ k: '' })).toEqual('')
  })

  it('removes undefined values', () => {
    expect(objectToQueryString({ k: undefined })).toEqual('')
  })

  it('url encode values', () => {
    expect(objectToQueryString({ k: ' ' })).toEqual('?k=%20')
  })
})
