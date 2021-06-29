// function generateUUID()
// {
//   let d = Math.floor(10000000000000*Math.random())// + Math.floor(100*Math.random())
//   // console.log('d:', d)
//   let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     let r = (d + Math.random()*16)%16 | 0
//     d = Math.floor(d/16)
//     return (c=='x' ? r : (r&0x3|0x8)).toString(16)
//   })
//   return uuid
// }

// function newToken() {
//   return {
//     session_id: generateUUID(),
//     ttl: 60*60*24*30
//   }
// }

import { v4 as uuidv4 } from 'uuid'
export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  // inject('hello', msg => console.log(`Hello ${msg}!`))
  inject('generateUUID', uuidv4())
}
