/*
包含请求user模块的api，返回值为promise对象
 */
import ajax from './ajax'

const BASE_URL = '/api/user-server'

export const reqPwdLogin = ({userName, userPasswd}) =>
  ajax(BASE_URL + '/login-pwd', {
    userName,
    userPasswd
  }, 'POST')

export const reqUserList = ({page, pageSize, factoryId}) => ajax(BASE_URL + '/user/list', {page, pageSize, factoryId})

export const reqInsert = (user) => ajax(BASE_URL + '/user/insert', user, 'POST')

export const reqDelUser = ({id, updateUserid}) =>
  ajax(BASE_URL + '/user/del', {id, updateUserid}, 'POST')

export const reqUserById = (id) => ajax(BASE_URL + '/user/get', {id})

export const reqUserListByName = ({page, q, pageSize, factoryId}) =>
  ajax(BASE_URL + '/user/search', {page, q, pageSize, factoryId})

export const reqUpdate = (user) => ajax(BASE_URL + '/user/update', user, 'POST')

export const reqUserVoById = (id) => ajax(BASE_URL + '/user/show', {id})
