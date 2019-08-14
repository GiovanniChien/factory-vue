<template>
  <el-dialog title="添加" top="20px"
             :visible.sync="visible" width="40%" :before-close="modalClose">
    <el-form ref="form" :rules="rules" size="mini"
             :model="form" label-width="80px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="密码" prop="userPasswd">
          <el-input v-model="form.userPasswd"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="工号" prop="userJobNum">
          <el-input v-model="form.userJobNum"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="姓名" prop="userRealName">
          <el-input v-model="form.userRealName"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="手机号" prop="userPhoneNum">
          <el-input v-model="form.userPhoneNum"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="form.userEmail"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="用户权限">
          <el-radio v-model="form.roleId" label="0">超级管理员</el-radio>
          <el-radio v-model="form.roleId" label="1">普通管理员</el-radio>
        </el-form-item>
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
  import {reqInsert} from '../../api/user'

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
          userName: '', //用户名
          userPasswd: '',//密码
          userJobNum: '',//工号
          userPhoneNum: '',//手机号
          userRealName: '',//姓名
          userEmail: '',//邮箱
          roleId: '1',//用户权限
        },
        rules: {
          userName: [
            {type: 'string', required: true, message: '请填写用户名', trigger: 'blur'}
          ],
          userPasswd: [
            {type: 'string', required: true, message: '请填写用户密码', trigger: 'blur'}
          ],
          userJobNum: [
            {type: 'string', required: true, message: '请填写用户工号', trigger: 'blur'}
          ],
          userPhoneNum: [
            {pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号'}
          ],
          userEmail: [
            {pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱'}
          ]
        },
        loading: false
      }
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
            if (valid) {
              //console.log(this.form)
              this.loading = true
              let u = this.form
              u.createUserid = this.User.id
              u.updateUserid = this.User.id
              u.factoryId = this.FactoryId
              reqInsert(u)
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
          PubSub.publish('staff-dialog-close', 1) //添加成功
        } else {
          PubSub.publish('staff-dialog-close', 0) //添加失败或取消
        }
      }
    }
  }
</script>

<style scoped>

</style>
