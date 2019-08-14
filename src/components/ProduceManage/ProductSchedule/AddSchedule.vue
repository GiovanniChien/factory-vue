<template>
  <el-dialog title="添加"
             :visible.sync="visible" width="50%" :before-close="modalClose">
    <el-form ref="form" :rules="rules" size="mini"
             :model="form" label-width="80px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="工单号">
            <el-input v-model="form.scheduleSeq" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="计划编号" prop="planId">
            <el-select v-model="form.planId" placeholder="请选择计划" @change="handlePlanChange">
              <el-option v-for="(p,key) in plans" :key="key"
                         :label="p.plan.planSeq" :value="p.plan.id"></el-option>
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
      <el-row style="margin-top: 10px">
        <el-col :span="8">
          计划生产数量: {{planNum}}
        </el-col>
        <el-col :span="8">
          已生产数量: {{finishedNum}}
        </el-col>
        <el-col :span="8">
          正在生产数量: {{finishedNum}}
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="11">
          <el-form-item label="生产数量" prop="scheduleCount">
            <el-input v-model.number="form.scheduleCount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="11">
          <el-form-item label="生产设备" prop="equipmentId">
            <el-select v-model="form.equipmentId" placeholder="请选择设备">
              <el-option v-for="(e,key) in equipments" :key="key"
                         :label="e.equipmentSeq" :value="e.id"></el-option>
            </el-select>
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
  import {reqProductById} from '../../../api/product'
  import {reqScheduleSeq, reqInsert} from '../../../api/schedule'
  import {reqAllPlan} from '../../../api/plan'
  import {reqEquipmentByProductId} from '../../../api/equipment'

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
          scheduleSeq: '', //工单号，从后台自动获取
          planId: '',//订单Id
          productId: '',//产品id
          scheduleCount: '',//计划数量
          equipmentId: ''//生产设备
        },
        rules: {
          planId: [
            {type: 'number', required: true, message: '请选择', trigger: 'change'}
          ],
          scheduleCount: [
            {required: true, message: '请填写生产数量'},
            {type: 'number', message: '非法输入'}
          ],
          equipmentId: [
            {type: 'number', required: true, message: '请选择', trigger: 'change'}
          ]
        },
        loading: false,
        plans: [],
        product: {},//与选择的计划关联的产品
        finishedNum: '',//选择的计划已生产数量
        planNum: '',//选择的计划，计划生产的数量
        produceNum: '',//正在生产数量
        equipments: []//可以生产计划中相关产品的设备
      }
    },
    async mounted () {
      let res = await reqAllPlan(this.FactoryId)
      this.plans = res.data
      //console.log(this.plans)
      res = await reqScheduleSeq()
      this.form.scheduleSeq = res.data
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
            if (valid) {
              //console.log(this.form)
              this.loading = true
              let s = this.form
              s.createUserid = this.User.id
              s.updateUserid = this.User.id
              s.factoryId = this.FactoryId
              reqInsert(s)
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
          PubSub.publish('schedule-dialog-close', 1) //添加成功
        } else {
          PubSub.publish('schedule-dialog-close', 0) //添加失败或取消
        }
      },
      async handlePlanChange (val) {
        let p = this.plans.find((item) => item.plan.id === val)
        let data = await reqProductById(p.plan.productId)
        this.product = data.data
        this.form.productId = this.product.id
        this.finishedNum = p.finishedNum
        this.planNum = p.plan.planCount
        this.produceNum = p.produceNum
        this.equipments = await reqEquipmentByProductId(this.product.id)
      }
    }
  }
</script>

<style scoped>

</style>
