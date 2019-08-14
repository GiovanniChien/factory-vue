<template>
  <el-dialog title="修改" top="20px" :visible.sync="visible"
             :id="id" width="40%" :before-close="modalClose">
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
          <el-radio :disabled="id===User.id.toString()" v-model="form.roleId" :label="0">超级管理员</el-radio>
          <el-radio :disabled="id===User.id.toString()" v-model="form.roleId" :label="1">普通管理员</el-radio>
        </el-form-item>
      </el-row>
      <el-row style="margin-top: 10px" v-if="form.roleId===1">
        <el-form-item label="关联工厂" prop="factoryId">
          <el-select v-model="form.factoryId" placeholder="请选择关联的工厂">
            <el-option v-for="(item,key) in FactoryList" :key="key"
                       :label="item.factoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
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
  import {reqUserById, reqUpdate} from '../../api/user'

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
    async mounted () {
      let res = await reqUserById(this.id)
      this.form = res.data
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
            if (valid) {
              this.loading = true
              let u = this.form
              u.updateUserid = this.User.id
              reqUpdate(u)
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
          PubSub.publish('staff-dialog-close', 2) //修改成功
        } else {
          PubSub.publish('staff-dialog-close', 0) //修改失败或取消
        }
      }
    }
  }
</script>

<style scoped>

</style>
