/*
包含请求factory模块的ajax请求
 */
import ajax from './ajax'

const BASE_URL = '/api/factory-server'

export const reqFactoryById = (id) => ajax(BASE_URL + '/factory', {id})

export const reqAllFactory = () => ajax(BASE_URL + '/all')

export const reqFactoryList = (page, pageSize) => ajax(BASE_URL + '/list', {page, pageSize})

export const reqUpdateStatus = ({id, factoryStatus, updateUserid}) =>
  ajax(BASE_URL + '/update_status', {id, factoryStatus, updateUserid}, 'POST')
