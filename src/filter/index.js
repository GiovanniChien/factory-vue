/*
全局过滤器
 */
import {format} from 'date-fns'

let formatDateFull = (date) => format(date, 'YYYY-MM-DD HH:mm:ss')

let formatDate = (date) => format(date, 'YYYY-MM-DD')

export {formatDate, formatDateFull}
