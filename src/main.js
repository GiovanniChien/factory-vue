// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  store
})

// router.beforeEach((from, to, next) => {
//   if (to.meta.requireAuth) { // 判断跳转的路由是否需要登录
//     let getFlag = sessionStorage.getItem('Flag')
//
//     //如果登录标志存在且为login，即用户已登录
//     if (getFlag === 'login') {
//       //获取用户登录信息
//       let user = {
//         userName: sessionStorage.getItem('userName'),
//         userPasswd: sessionStorage.getItem('userPasswd'),
//         roleId: sessionStorage.getItem('roleId'),
//         factoryId: sessionStorage.getItem('factoryId')
//       }
//       console.log(user)
//       //更新vuex登录状态
//       store.state.User = user
//       //正常跳转
//       next()
//       //如果登录标志不存在，即未登录
//     } else {
//       next({
//         path: '/login',
//       })
//     }
//   } else {
//     next()
//   }
// })

