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

export const reqDelFac = ({id, updateUserid}) =>
  ajax(BASE_URL + '/del', {id, updateUserid}, 'POST')

export const reqInsert = (factory) => ajax(BASE_URL + '/insert', factory, 'POST')

export const reqUpdate = (factory) => ajax(BASE_URL + '/update', factory, 'POST')

export const reqFactoryListByName = ({page, q, pageSize}) => ajax(BASE_URL + '/search', {page, q, pageSize})

export const reqFactoryVoById = (id) => ajax(BASE_URL + '/show', {id})
