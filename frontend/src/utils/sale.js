export default function sale(price, oldprice) {
  const np = parseInt(price, 10)
  const op = parseInt(oldprice, 10)
  // return Math.floor(100 - (np / op) * 100)
  return Math.floor((1 - np / op) * 100)
}
