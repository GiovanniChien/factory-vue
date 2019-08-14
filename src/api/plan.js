/*
订单计划相关api
 */
import ajax from './ajax'

const BASE_URL = '/api/order-server/plan'

export const reqPlanList = (form) => ajax(`${BASE_URL}/list`, {form}, 'POST')

export const reqDel = ({id, updateUserid, orderId}) =>
  ajax(BASE_URL + '/del', {id, updateUserid, orderId}, 'POST')

export const reqPlanSeq = () => ajax(BASE_URL + '/plan_seq')

export const reqInsert = (plan) => ajax(BASE_URL + '/insert', plan, 'POST')

export const reqPlanDetailById = (id) => ajax(BASE_URL + '/detail', {id})

export const reqPlanVo = (id) => ajax(BASE_URL + '/show', {id})

export const reqUpdate = (plan) => ajax(BASE_URL + '/update', plan, 'POST')

export const reqAllPlan = (factoryId) => ajax(BASE_URL + '/all', {factoryId})

export const reqByOrderId = (orderId) => ajax(BASE_URL + '/p_by_o', {orderId})
