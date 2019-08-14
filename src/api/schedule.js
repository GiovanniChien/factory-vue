/*
订单调度相关api
 */

import ajax from './ajax'

const BASE_URL = '/api/order-server/schedule'

export const reqScheduleList = (form) => ajax(`${BASE_URL}/list`, {form}, 'POST')

export const reqDel = ({id, updateUserid, planId}) =>
  ajax(BASE_URL + '/del', {id, updateUserid, planId}, 'POST')

export const reqScheduleSeq = () => ajax(BASE_URL + '/schedule_seq')

export const reqInsert = (schedule) => ajax(BASE_URL + '/insert', schedule, 'POST')

export const reqUpdateStatus = ({id, scheduleStatus, updateUserid, planId}) =>
  ajax(BASE_URL + '/update_status', {id, scheduleStatus, updateUserid, planId}, 'POST')

export const reqScheduleVo = (id) => ajax(BASE_URL + '/show', {id})

export const reqScheduleByPlanId = (planId) => ajax(BASE_URL + '/s_by_p', {planId})
