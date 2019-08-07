/*
包含请求user模块的api，返回值为promise对象
 */
import ajax from './ajax'

const BASE_URL = '/api'

export const reqPwdLogin = ({userName, userPasswd}) =>
  ajax(BASE_URL + '/user-server/login-pwd', {
    userName,
    userPasswd
  }, 'POST')
