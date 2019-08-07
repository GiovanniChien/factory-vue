/*
vuex核心配置
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//状态
const state = {
  User: {}
}

const getters = {}

const actions = {
  setUser ({commit}, user) {
    commit('userLogin', user)
  }
}

const mutations = {
  userLogin (state, user) {
    state.User = user
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
