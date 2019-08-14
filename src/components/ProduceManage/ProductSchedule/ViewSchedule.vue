<template>
  <el-dialog title="详细"
             :visible.sync="visible" :id="id" width="60%" :before-close="modalClose">
    <el-form ref="form" size="mini"
             :model="form" label-width="100px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-top: 10px">
        <el-col :span="11">
          <el-form-item label="工单号">
            <el-input v-model="form.schedule.scheduleSeq" readOnly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="11">
          <el-form-item label="计划编号">
            <el-input v-model="form.schedule.productPlan.planSeq" readOnly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品">
            <el-input v-model="form.productName" readOnly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="11">
          <el-form-item label="生产数量">
            <el-input v-model.number="form.schedule.scheduleCount" readOnly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="11">
          <el-form-item label="生产设备">
            <el-input v-model.number="form.equipmentSeq" readOnly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="9">
          <el-form-item label="开始时间">
            <el-date-picker type="date" v-model="form.schedule.startDate" readonly></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="结束时间">
            <el-date-picker type="date" v-model="form.schedule.endDate" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="9">
          <el-form-item label="创建人">
            <el-input v-model="form.createUserRealName" readOnly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="创建时间">
            <el-date-picker type="datetime" v-model="form.schedule.createTime" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="9">
          <el-form-item label="更新人">
            <el-input v-model="form.updateUserRealName" readOnly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="更新时间">
            <el-date-picker type="datetime" v-model="form.schedule.updateTime" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {reqScheduleVo} from '../../../api/schedule'

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
      let res = await reqScheduleVo(this.id)
      let data = res.data
      console.log(data)
      this.form = data
      this.loading = false
    },
    methods: {
      modalClose () {
        PubSub.publish('schedule-dialog-close', 0)
      }
    }
  }
</script>

<style scoped>

</style>
