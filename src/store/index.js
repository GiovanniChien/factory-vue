/*
vuex核心配置
 */
import Vue from 'vue'
import Vuex from 'vuex'
import {reqAllFactory} from '../api/factory'

Vue.use(Vuex)

//状态
const state = {
  User: {},
  FactoryId: 0,
  FactoryList: []
}

const getters = {}

const actions = {
  setUser ({commit}, user) {
    commit('userLogin', user)
  },
  setFactoryId ({commit}, factoryId) {
    commit('associateFactory', factoryId)
  },
  async setFactoryList ({commit}) {
    let result = await reqAllFactory()
    commit('modifyList', result.data)
  },
  logout ({commit}) {
    commit('logout')
  }
}

const mutations = {
  userLogin (state, user) {
    state.User = user
  },
  associateFactory (state, factoryId) {
    state.FactoryId = factoryId
  },
  logout (state) {
    state.User = {}
  },
  modifyList (state, factoryList) {
    state.FactoryList = factoryList
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
