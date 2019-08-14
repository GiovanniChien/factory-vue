<template>
  <el-dialog title="修改"
             :visible.sync="visible" :id="id" width="50%" :before-close="modalClose">
    <el-form ref="form" :rules="rules" size="mini"
             :model="form" label-width="80px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="计划编号">
            <el-input v-model="form.planSeq" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="订单编号" prop="orderId">
            <el-select v-model="form.orderId" disabled>
              <el-option :label="orderSeq" :value="form.orderId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品">
            <el-select v-model="form.productId" disabled>
              <el-option :label="productName" :value="form.productId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="计划数量">
            <el-input v-model="form.planCount" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="交货日期">
            <el-date-picker type="date" v-model="form.deliveryDate" disabled></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item required>
            <el-date-picker v-model="form.planStartDate" type="date"
                            placeholder="计划开始时间" :picker-options="pickerOptions0">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item required>
            <el-date-picker v-model="form.planEndDate" type="date"
                            placeholder="计划结束时间" :picker-options="pickerOptions1">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;text-align: center">
        <el-col :span="14" :offset="3" style="text-align: center">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">修改</el-button>
            <el-button @click="modalClose">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {mapState} from 'vuex'
  import {reqPlanDetailById, reqUpdate} from '../../../api/plan'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      id: {type: String}
    },
    computed: {
      ...mapState(['User', 'FactoryList'])
    },
    data () {
      return {
        form: {},
        rules: {
          orderId: [
            {type: 'number', required: true, message: '请选择', trigger: 'change'}
          ]
        },
        loading: false,
        productName: '',
        orderSeq: '',
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.form.planEndDate !== '') {
              return time.getTime() < Date.now() - 8.64e7 || time.getTime() > this.form.planEndDate
            } else {
              return time.getTime() < Date.now() - 8.64e7
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            return time.getTime() < this.form.planStartDate
              || time.getTime() < Date.now() - 8.64e7 || time.getTime() > this.form.deliveryDate
          }
        },
      }
    },
    async mounted () {
      let res = await reqPlanDetailById(this.id)
      console.log(res)
      this.form = res.data.plan
      console.log(this.form)
      this.productName = res.data.productName
      this.orderSeq = res.data.plan.productOrder.orderSeq
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
            if (valid) {
              this.loading = true
              let p = this.form
              p.updateUserid = this.User.id
              reqUpdate(p)
                .then((res) => {
                  this.loading = false
                  if (res.code === '10000') {
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    })
                    this.modalClose(1)
                  } else if (res.code === '10001') {
                    this.$message({
                      message: res.msg,
                      type: 'warning'
                    })
                  } else {
                    this.$message({
                      message: '修改失败，请稍后再试',
                      type: 'error'
                    })
                    this.modalClose()
                  }
                })
                .catch((error) => {
                  this.loading = false
                  this.$message({
                    message: '网络崩溃了，请稍后再试',
                    type: 'error'
                  })
                  this.modalClose()
                })
            } else {
              return false
            }
          }
        )
      },
      modalClose (msg) {
        if (msg === 1) {
          PubSub.publish('plan-dialog-close', 2) //修改成功
        } else {
          PubSub.publish('plan-dialog-close', 0) //修改失败或取消
        }
      }
    }
  }
</script>

<style scoped>

</style>
