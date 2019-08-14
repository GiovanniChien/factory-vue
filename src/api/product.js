import ajax from './ajax'

const BASE_URL = '/api'

export const reqProductList = (currPage, pageSize, factoryId) => ajax(BASE_URL + '/e-p-server/product/list', {
  currPage,
  pageSize,
  factoryId
})

export const reqProductDetail=(id)=>ajax(BASE_URL+'/e-p-server/product/get',{id})

export const reqUpdateProduct=(product)=>ajax(BASE_URL+'/e-p-server/product/update',product,'POST')

export const reqDelProduct=(product)=>ajax(BASE_URL+'/e-p-server/product/del',product,'POST')

export const reqAddProduct=(product)=>ajax(BASE_URL+'/e-p-server/product/add',product,'POST')

export const reqProductSearch = (currPage,pageSize,factoryId,name) => ajax(BASE_URL + '/e-p-server/product/search',{currPage,pageSize,factoryId,name})
//后加的
export const reqAllProduct = (factoryId) => ajax(BASE_URL + '/e-p-server/product/all', {factoryId})

export const reqProductById = (id) => ajax(BASE_URL + '/e-p-server/product/product', {id})
