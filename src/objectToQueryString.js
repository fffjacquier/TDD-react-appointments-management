export const objectToQueryString = (obj) => {
  const queryString = Object.keys(obj)
    .filter((k) => obj[k] && obj[k] !== '')
    .map((k) => `${k}=${encodeURIComponent(obj[k])}`)
    .join('&')

  return queryString ? '?' + queryString : ''
}
