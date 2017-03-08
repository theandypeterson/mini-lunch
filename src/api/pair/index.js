import { get } from '../server'
// var request = require('request');
// export const BASE_URL = 'http://localhost:3000';

export function pickPair (id) {
  return new Promise((resolve, reject) => {
    return get(`/pair?id=${id}`)
    .then(json => {
      return resolve(json.data)
    }, err => {
      return reject(new Error('WEHHHHH'))
    })
  })
}

export function getAllAtoms() {
  return new Promise((resolve, reject) => {
    return get('/atoms')
    .then(json => {
      console.log('json: ', json);
      return resolve(json.data);
    }, err => {
      return reject(new Error('WOWOWOWOWOWO'));
    });
  });
}
