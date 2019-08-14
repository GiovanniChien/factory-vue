<template>
  <el-dialog title="添加"
             :visible.sync="visible" width="50%" :before-close="modalClose">
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
            <el-select v-model="form.orderId" placeholder="请选择订单" @change="handleOrderChange">
              <el-option v-for="(o,key) in orders" :key="key"
                         :label="o.orderSeq" :value="o.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品">
            <el-select v-model="form.productId" disabled>
              <el-option :label="product.productName" :value="product.id"></el-option>
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
        <el-form-item>
          <el-button type="primary" @click="onSubmit">添加</el-button>
          <el-button @click="modalClose">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {mapState} from 'vuex'
  import {reqAllOrder} from '../../../api/order'
  import {reqProductById} from '../../../api/product'
  import {reqPlanSeq,reqInsert} from '../../../api/plan'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState(['User', 'FactoryId'])
    },
    data () {
      return {
        form: {
          planSeq: '', //计划编号，从后台自动获取
          orderId: '',//订单Id
          productId: '',//产品id
          planCount: '',//计划数量
          deliveryDate: '',//交货日期
          planStartDate: '',//计划开始时间
          planEndDate: '',//计划结束时间
        },
        rules: {
          orderId: [
            {type: 'number', required: true, message: '请选择', trigger: 'change'}
          ]
        },
        loading: false,
        orders: [],
        product: {},//与选择的订单关联的产品
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
      let res = await reqAllOrder(this.FactoryId)
      this.orders = res.data
      res = await reqPlanSeq()
      this.form.planSeq = res.data
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
            if (valid) {
              //console.log(this.form)
              this.loading = true
              let p = this.form
              p.createUserid = this.User.id
              p.updateUserid = this.User.id
              p.factoryId = this.FactoryId
              reqInsert(p)
                .then((res) => {
                  this.loading = false
                  if (res.code === '10000') {
                    this.$message({
                      message: '添加成功',
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
                      message: '提交失败，请稍后再试',
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
          PubSub.publish('plan-dialog-close', 1) //添加成功
        } else {
          PubSub.publish('plan-dialog-close', 0) //添加失败或取消
        }
      },
      async handleOrderChange (val) {
        let o = this.orders.find((item) => item.id === val)
        let data = await reqProductById(o.productId)
        this.product = data.data
        this.form.productId = this.product.id
        this.form.planCount = o.productCount
        this.form.deliveryDate = o.endDate
      }
    }
  }
</script>

<style scoped>

</style>
