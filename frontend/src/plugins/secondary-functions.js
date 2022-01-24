import { v4 as uuidv4 } from 'uuid'
import {declensionEndings} from '@/utils/main-scripts'
import {contentError, searchHighlight} from '@/utils/main-scripts'

export default ({ app }, inject) => {
  inject('generateUUID', () => {return uuidv4()})
  inject('inRange', (n, min, max) => {return min <= n && n <= max})
  inject('sale', (price, oldprice) => { return Math.floor((1 - parseInt(price, 10) / parseInt(oldprice, 10)) * 100)})
  inject('compareNumeric', (a, b) => { return a - b })
  inject('numFeedbacks', (value) => { return declensionEndings( value,['отзыв','отзыва','отзывов'] )})
  inject('contentError', (value) => { return contentError(value)})
  inject('searchHighlight', (searchStr, text) => { return searchHighlight(searchStr, text)})

}