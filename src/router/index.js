import Vue from 'vue'
import Router from 'vue-router'

import Login from '../Pages/Login/Login'
import Home from '../Pages/Home/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})
