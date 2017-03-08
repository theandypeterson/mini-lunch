import 'whatwg-fetch'
export const BASE_URL = '/api'
export function get (path) {
  return fetch(BASE_URL + path, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
}
