import ajax from './ajax'

const BASE_URL = '/api/e-p-server/equipment-product'

export const reqListByEid=(equipmentId)=>ajax(BASE_URL+'/selByEid',{equipmentId})

export const reqUpdateEP=(data)=>ajax(BASE_URL+'/update',data,'POST')

export const reqDelEP=(id)=>ajax(BASE_URL+'/del',{id})

export const reqAddEP=(eps)=>ajax(BASE_URL+'/add',eps,'POST')

export const reqDelByEid=(equipmentId)=>ajax(BASE_URL+'/delByEid',{equipmentId})

export const reqListByPid=(productId)=>ajax(BASE_URL+'/selByPid',{productId})

export const reqDelByPid=(productId)=>ajax(BASE_URL+'/delByPid',{productId})
