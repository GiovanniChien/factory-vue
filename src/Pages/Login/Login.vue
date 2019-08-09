<template>
  <div class="wrap" style="width: 360px;height: 260px;">
    <div class="title">智慧工厂</div>
    <el-form :model="form" status-icon ref="form" label-width="100px"
             @keyup.enter.native="login" class="demo-ruleForm">
      <el-form-item label="用户名">
        <el-input type="text" v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.userPasswd"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="login">登录</el-button>
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
    created () {
      // let lett = this;
      // document.onkeydown = function(e) {
      //   let key = window.event.keyCode;
      //   if (key === 13) {
      //     lett.login();
      //   }
      // }
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
          this.$store.dispatch('setFactoryId', result.data.factoryId)
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
  html {
    width: 100%;
    height: 100%;
  }

  .wrap {
    position: relative;
    padding: 50px 100px 40px 40px;
    margin: 0 auto;
    top: 180px; /*偏移*/
    border: 1px solid #a0cfff;
    border-radius: 10px;
  }

  .title {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 40px;
    margin-left: 40px;
  }
</style>
