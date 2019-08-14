<template>
  <el-dialog title="详细" :top="orderInfo.orderStatus===40||orderInfo.orderStatus===50?'20px':'15vh'"
             :visible.sync="visible"
             :id="id" width="90%" :before-close="modalClose" v-loading="loading">
    <div style="margin-left: 80px;margin-right: 80px">
      <div>
        <span style="font-size:20px;width: 40%;display: inline-block">订单基本信息</span>
        <span
          style="text-align: right;width: 60%;display: inline-block;float: right">{{orderInfo.orderStatus|OrderStatus}}</span>
      </div>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="8">订单编号:{{orderInfo.orderSeq}}</el-col>
        <el-col :span="8">订单来源:{{orderInfo.orderSource}}</el-col>
        <el-col :span="8">订单产品:{{orderInfo.productName}}</el-col>
      </el-row>
      <el-row style="margin-top: 25px">
        <el-col :span="8">订单数量:{{orderInfo.productCount}}</el-col>
        <el-col :span="8">订单截止日期:{{orderInfo.endDate|formatDate}}</el-col>
        <el-col :span="8">创建日期:{{orderInfo.createTime|formatDate}}</el-col>
      </el-row>
      <el-divider></el-divider>
      <div v-if="orderInfo.orderStatus !== 10">
        <div v-if="orderInfo.orderStatus===30" style="margin-bottom: 30px">
          <div style="margin-top:50px">
            <span style="font-size:20px;width: 40%;display: inline-block">拒单信息</span>
          </div>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="12">拒单人:{{orderInfo.updateUserRealName}}</el-col>
            <el-col :span="12">拒单时间:{{orderInfo.updateTime|formatDate}}</el-col>
          </el-row>
        </div>
        <div v-if="orderInfo.orderStatus===20" style="margin-bottom: 30px">
          <div style="margin-top:50px">
            <span style="font-size:20px;width: 40%;display: inline-block">接单信息</span>
          </div>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="12">接单人:{{orderInfo.updateUserRealName}}</el-col>
            <el-col :span="12">接单时间:{{orderInfo.updateTime|formatDate}}</el-col>
          </el-row>
        </div>
        <div v-if="orderInfo.orderStatus===40||orderInfo.orderStatus===50">
          <div style="margin-top:50px">
            <span style="font-size:20px;width: 40%;display: inline-block">生产计划安排</span>
          </div>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="8">生产计划编号:{{planInfo.planSeq}}</el-col>
            <el-col :span="8">产品:{{planInfo.planSeq!==''?orderInfo.productName:''}}</el-col>
            <el-col :span="8">计划数量:{{planInfo.planCount}}</el-col>
          </el-row>
          <el-row style="margin-top: 25px">
            <el-col :span="8">计划开始时间:{{planInfo.planStartDate|formatDate}}</el-col>
            <el-col :span="8">计划结束时间:{{planInfo.planEndDate|formatDate}}</el-col>
            <el-col :span="8">计划状态:{{planInfo.planStatus|PlanStatus}}</el-col>
          </el-row>
          <el-divider></el-divider>
          <div style="margin-top:50px">
            <span style="font-size:20px;width: 40%;display: inline-block">工单安排</span>
          </div>
          <el-divider></el-divider>
          <el-table
            :data="scheduleTable"
            border
            style="width: 100%">
            <el-table-column
              prop="schedule.scheduleSeq"
              label="工单号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="equipmentSeq"
              label="设备序列号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="schedule.scheduleCount"
              label="生产数量">
            </el-table-column>
            <el-table-column
              prop="schedule.startDate"
              label="起始日期">
              <template slot-scope="scope">
                {{scope.row.schedule.startDate|formatDate|LocalDateFormat}}
              </template>
            </el-table-column>
            <el-table-column
              prop="schedule.endDate"
              label="结束日期">
              <template slot-scope="scope">
                {{scope.row.schedule.endDate|formatDate|LocalDateFormat}}
              </template>
            </el-table-column>
            <el-table-column
              prop="schedule.scheduleStatus"
              label="工单状态">
              <template slot-scope="scope">
                {{scope.row.schedule.scheduleStatus|ScheduleStatus}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {reqOrderVoById} from '../../api/order'
  import {reqByOrderId} from '../../api/plan'
  import {reqScheduleByPlanId} from '../../api/schedule'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      id: {type: String}
    },
    data () {
      return {
        orderInfo: {},  //订单基本信息
        planInfo: {},//相关计划信息
        loading: false,
        scheduleTable: [], //工单表
      }
    },
    async mounted () {
      this.loading = true
      let res = await reqOrderVoById(this.id)
      this.orderInfo = res.data.order
      this.orderInfo.createUserRealName = res.data.createUserRealName
      this.orderInfo.updateUserRealName = res.data.updateUserRealName
      this.orderInfo.productName = res.data.productName
      if (this.orderInfo.orderStatus === 40 || this.orderInfo.orderStatus === 50) {
        let planData = await reqByOrderId(this.orderInfo.id)
        this.planInfo = planData.data
        let scheduleData = await reqScheduleByPlanId(this.planInfo.id)
        console.log(scheduleData)
        this.scheduleTable = scheduleData.data
      }
      this.loading = false
    },
    methods: {
      modalClose () {
        PubSub.publish('order-dialog-close', 0)
      }
    },
    filters: {
      OrderStatus (val) {
        /*10：未接单  20：已接单  30：已拒绝
         40：生产中  50：订单完成*/
        let res = ''
        switch (val) {
          case 10:
            res = '未接单'
            break
          case 20:
            res = '已接单'
            break
          case 30:
            res = '已拒绝'
            break
          case 40:
            res = '生产中'
            break
          case 50:
            res = '订单完成'
            break
        }
        return res
      },
      PlanStatus (val) {
        let res = ''
        switch (val) {
          case 10:
            res = '未启动'
            break
          case 20:
            res = '已启动'
            break
          case 30:
            res = '已完成'
            break
        }
        return res
      },
      ScheduleStatus (val) {
        let res = ''
        switch (val) {
          case 10:
            res = '未开始'
            break
          case 20:
            res = '生产中'
            break
          case 30:
            res = '已完成'
            break
        }
        return res
      },
      LocalDateFormat (val) {
        if (val.toString().substring(0, 4) === '1970') return '——'
      }
    }
  }
</script>

<style scoped>

</style>
