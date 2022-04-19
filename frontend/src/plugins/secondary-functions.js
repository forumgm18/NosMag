import { v4 as uuidv4 } from 'uuid'
import {declensionEndings} from '@/utils/main-scripts'
import {
  contentError,
  searchHighlight,
  linkToInternalFormat,
  parseJsonStrToNumbers,
} from '@/utils/main-scripts'

export default ({ app }, inject) => {
  inject('generateUUID', () => {return uuidv4()})
  inject('inRange', (n, min, max) => {return min <= n && n <= max})
  inject('sale', (price, oldprice) => { return Math.floor((1 - parseInt(price, 10) / parseInt(oldprice, 10)) * 100)})
  inject('compareNumeric', (a, b) => { return a - b })
  inject('parseJsonStrToNumbers', v => {
    return parseJsonStrToNumbers(v)
  })
  // inject('numFeedbacks', (value) => { return declensionEndings( value,['отзыв','отзыва','отзывов'] )})
  inject('declensionEndings', (value, type) => { 
    const otzyv = ['отзыв','отзыва','отзывов']
    const raz = ['раз','раза','раз']
    if (Array.isArray(type)) {
      return declensionEndings( value, type)
    }
    switch(type) {
      case 'otzyv': 
          return declensionEndings( value, otzyv)
      case 'raz': 
          return declensionEndings( value, raz)
      default: 
          return value
    }
  })
  inject('contentError', (value) => { return contentError(value)})
  inject('isLinkExternal', (value) => { return value.startsWith('http')})
  inject('linkToInternalFormat', (value) => { return linkToInternalFormat(value)})
  inject('searchHighlight', (searchStr, text) => { return searchHighlight(searchStr, text)})

}