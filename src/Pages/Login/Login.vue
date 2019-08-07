<template>
  <div>
    <el-form :model="form" status-icon ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名">
        <el-input type="text" v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.userPasswd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {reqPwdLogin} from '../../api/user'

  export default {
    data () {
      return {
        form: {
          userName: '',
          userPasswd: ''
        }
      }
    },
    methods: {
      async login () {
        if (this.form.userName == null || this.form.userName.length === 0
          || this.form.userPasswd == null || this.form.userPasswd.length === 0) {
          this.$message({
            type: 'info',
            message: '用户名和密码不能为空!'
          })
          return
        }
        let result = await reqPwdLogin({userName: this.form.userName, userPasswd: this.form.userPasswd})
        if (result.code === '10000') {
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.$store.dispatch('setUser', result.data)
          // sessionStorage.setItem('Flag', 'login')
          // sessionStorage.setItem('userName', result.data.userName)
          // sessionStorage.setItem('userPasswd', result.data.userPasswd)
          // sessionStorage.setItem('roleId', result.data.roleId)
          // sessionStorage.setItem('factoryId', result.data.factoryId)
          this.$router.replace({path: '/home'})
        } else {
          this.$message({
            message: result.msg,
            type: 'error'
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
