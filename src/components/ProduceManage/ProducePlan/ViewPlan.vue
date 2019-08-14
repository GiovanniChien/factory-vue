<template>
  <el-dialog title="详细"
             :visible.sync="visible" :id="id" width="60%" :before-close="modalClose">
    <el-form ref="form" size="mini"
             :model="form" label-width="100px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="计划编号">
            <el-input v-model="form.planSeq" readOnly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="订单编号" prop="orderId">
            <el-input v-model="form.orderSeq" readOnly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品">
            <el-input v-model="form.productName" readOnly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="计划数量">
            <el-input v-model="form.planCount" readOnly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="交货日期">
            <el-date-picker type="date" v-model="form.deliveryDate" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="计划开始时间">
            <el-date-picker v-model="form.planStartDate" type="date" readonly></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="计划结束时间">
            <el-date-picker v-model="form.planEndDate" type="date" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="9">
          <el-form-item label="创建人">
            <el-input v-model="form.createUserRealName" readOnly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="创建时间">
            <el-date-picker type="datetime" v-model="form.createTime" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="9">
          <el-form-item label="更新人">
            <el-input v-model="form.updateUserRealName" readOnly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="更新时间">
            <el-date-picker type="datetime" v-model="form.updateTime" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="14" :offset="3" style="text-align: center">
        <el-button @click="modalClose" type="primary" size="mini">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {reqPlanVo} from '../../../api/plan'

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
        form: {},
        loading: false
      }
    },
    async mounted () {
      this.loading = true
      let res = await reqPlanVo(this.id)
      console.log(res)
      let data = res.data
      console.log(data)
      this.form = data.plan
      this.form.createUserRealName = data.createUserRealName
      this.form.updateUserRealName = data.updateUserRealName
      this.form.productName = data.productName
      this.form.orderSeq = data.plan.productOrder.orderSeq
      this.loading = false
    },
    methods: {
      modalClose () {
        PubSub.publish('plan-dialog-close', 0)
      }
    }
  }
</script>

<style scoped>

</style>
