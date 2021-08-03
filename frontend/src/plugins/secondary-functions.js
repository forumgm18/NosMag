import { v4 as uuidv4 } from 'uuid'
// export default ({ app }, inject) => {
//   inject('generateUUID', uuidv4())
// }


export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  // inject('hello', msg => console.log(`Hello ${msg}!`))
  inject('generateUUID', uuidv4())
  inject('inRange', (n, min, max) => {return min <= n && n <= max})
  inject('sale', (price, oldprice) => { return Math.floor((1 - parseInt(price, 10) / parseInt(oldprice, 10)) * 100)})
}
