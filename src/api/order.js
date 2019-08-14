/*
订单相关api
 */
import ajax from './ajax'

const BASE_URL = '/api/order-server/order'

export const reqAllOrder = (factoryId) => ajax(BASE_URL + '/all', {factoryId})

export const reqOrderList = (form) => ajax(`${BASE_URL}/list`, {form}, 'POST')

export const reqUpdateStatus = ({id, orderStatus, updateUserid}) =>
  ajax(BASE_URL + '/update_status', {id, orderStatus, updateUserid}, 'POST')

export const reqDel = ({id, updateUserid}) =>
  ajax(BASE_URL + '/del', {id, updateUserid}, 'POST')

export const reqOrderSeq = () => ajax(BASE_URL + '/order_seq')

export const reqInsert = (order) => ajax(BASE_URL + '/insert', order, 'POST')

export const reqOrderVoById = (id) => ajax(BASE_URL + '/show', {id})

export const reqStatisticOrderStatus = (factoryId) => ajax(BASE_URL + '/statistic', {factoryId})

export const reqStatisticOrderByMonth = (factoryId) => ajax(BASE_URL + '/statistic_month', {factoryId})
