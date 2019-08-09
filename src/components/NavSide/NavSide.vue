<template>
  <div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :unique-opened="true"
      style="min-height: 700px;margin-left: 20px">
      <el-menu-item index="1" @click="$router.push('/home/production')">
        <i class="iconfont icon-chanpin"></i>
        <span slot="title">产品管理</span>
      </el-menu-item>
      <el-menu-item index="2" @click="$router.push('/home/equipment')">
        <i class="iconfont icon-yiqishebeiguanli"></i>
        <span slot="title">设备管理</span>
      </el-menu-item>
      <el-menu-item index="3" @click="$router.push('/home/order')">
        <i class="iconfont icon-dingdan"></i>
        <span slot="title">订单管理</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="iconfont icon-shengchanguanli"></i>
          <span>生产管理</span>
        </template>
        <el-menu-item index="1-1" @click="$router.push('/home/produce_plan')">生产计划管理</el-menu-item>
        <el-menu-item index="1-2" @click="$router.push('/home/produce_schedule')">生产调度管理</el-menu-item>
        <el-menu-item index="1-3" @click="$router.push('/home/produce_order')">生产订单管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="5" v-show="isAdmin" @click="$router.push('/home/staff')">
        <i class="iconfont icon-yuangong"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
      <el-menu-item index="6" v-show="isAdmin" @click="$router.push('/home/factory')">
        <i class="iconfont icon-gongchangchejianguanli"></i>
        <span slot="title">工厂管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    computed: {
      ...mapState(['User']),
      isAdmin () {
        return this.User.roleId === 0
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>

</style>
