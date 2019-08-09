import Vue from 'vue'
import Router from 'vue-router'

import Login from '../Pages/Login/Login'
import Home from '../Pages/Home/Home'
import StaffManage from '../Pages/Home/StaffManage/StaffManage'
import FactoryManage from '../Pages/Home/FactoryManage/FactoryManage'
import ProductionManage from '../Pages/Home/ProductionManage/ProductionManage'
import EquipmentManage from '../Pages/Home/EquipmentManage/EquipmentManage'
import OrderManage from '../Pages/Home/OrderManage/OrderManage'
import ProduceOrder from '../Pages/Home/ProduceManage/ProduceOrder/ProduceOrder'
import ProducePlan from '../Pages/Home/ProduceManage/ProducePlan/ProducePlan'
import ProduceSchedule from '../Pages/Home/ProduceManage/ProduceSchedule/ProduceSchedule'
import Welcome from '../Pages/Home/Welcome/Welcome'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: 'staff',
          component: StaffManage
        },
        {
          path: 'factory',
          component: FactoryManage
        },
        {
          path: 'production',
          component: ProductionManage
        },
        {
          path: 'equipment',
          component: EquipmentManage
        },
        {
          path: 'order',
          component: OrderManage
        },
        {
          path: 'produce_plan',
          component: ProducePlan
        },
        {
          path: 'produce_order',
          component: ProduceOrder
        },
        {
          path: 'produce_schedule',
          component: ProduceSchedule
        },
        {
          path: '/',
          component: Welcome
        }
      ]
    }
  ]
})
