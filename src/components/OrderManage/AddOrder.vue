<template>
  <el-dialog title="添加"
             :visible.sync="visible" width="60%" :before-close="modalClose">
    <el-form ref="form" :rules="rules" size="mini"
             :model="form" label-width="100px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="订单编号">
            <el-input v-model="form.orderSeq" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="订单来源">
            <el-input v-model="form.orderSource" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="11">
          <el-form-item label="产品" prop="productId">
            <el-select v-model="form.productId">
              <el-option v-for="(p,index) in products" :key="index"
                         :label="p.productName" :value="p.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品数量" prop="productCount">
            <el-input v-model.number="form.productCount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="9">
          <el-form-item label="订单截止时间">
            <el-date-picker type="date" v-model="form.endDate" :picker-options="pickerOptions"></el-date-picker>
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
  import {reqAllProduct} from '../../api/product'
  import {reqOrderSeq, reqInsert} from '../../api/order'

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
          orderSeq: '',//订单编号
          orderSource: '线下订单',//订单来源
          productId: '',//产品id
          productCount: '',//产品数量
          endDate: '',//交货日期
        },
        rules: {
          productId: [
            {type: 'number', required: true, message: '请选择', trigger: 'change'}
          ],
          productCount: [
            {required: true, message: '请填写产品数量'},
            {type: 'number', message: '非法输入'}
          ]
        },
        loading: false,
        products: [],
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      }
    },
    async mounted () {
      let res = await reqAllProduct(this.FactoryId)
      this.products = res.data
      res = await reqOrderSeq()
      this.form.orderSeq = res.data
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
            if (valid) {
              //console.log(this.form)
              this.loading = true
              let o = this.form
              o.createUserid = this.User.id
              o.updateUserid = this.User.id
              o.factoryId = this.FactoryId
              reqInsert(o)
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
          PubSub.publish('order-dialog-close', 1) //添加成功
        } else {
          PubSub.publish('order-dialog-close', 0) //添加失败或取消
        }
      }
    }
  }
</script>

<style scoped>

</style>
