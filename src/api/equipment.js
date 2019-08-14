/*
包含请求equipment模块的api，返回值为promise对象
 */
import ajax from './ajax'

const BASE_URL = '/api'

export const reqGetEquipmentById = (id) => ajax(BASE_URL + '/e-p-server/equipment/getById', {id})

export const reqDelEquipmentById = (equipment) => ajax(BASE_URL + '/e-p-server/equipment/del', equipment,'POST')

export const reqEquipmentList = (currPage, pageNum,factoryId) => ajax((BASE_URL) + '/e-p-server/equipment/list', {
  currPage,
  pageNum,
  factoryId
})

export const reqEquipmentAdd = (jsonMap) => ajax((BASE_URL) + '/e-p-server/equipment/add', jsonMap, 'POST')

export const reqEquipmentUpdate = (jsonMap) => ajax((BASE_URL) + '/e-p-server/equipment/update', jsonMap, 'POST')

export const reqEquipmentSearch=(currPage,pageSize,name,factoryId)=>ajax((BASE_URL)+"/e-p-server/equipment/search",{currPage,pageSize,name,factoryId})

//后加的
export const reqEquipmentByProductId = (productId) => ajax(BASE_URL + '/e-p-server/equipment-product/e_by_p', {productId})

export const reqStatistic = (factoryId) => ajax(BASE_URL + '/e-p-server/equipment/statistics', {factoryId})
