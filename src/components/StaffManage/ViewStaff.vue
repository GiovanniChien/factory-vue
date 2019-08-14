<template>
  <el-dialog title="详细" top="20px" :visible.sync="visible"
             :id="id" width="60%" :before-close="modalClose">
    <el-form ref="form" size="mini"
             :model="form" label-width="80px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="密码" prop="userPasswd">
          <el-input v-model="form.userPasswd" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="工号" prop="userJobNum">
          <el-input v-model="form.userJobNum" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="姓名" prop="userRealName">
          <el-input v-model="form.userRealName" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="手机号" prop="userPhoneNum">
          <el-input v-model="form.userPhoneNum" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="form.userEmail" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="用户权限">
          <el-radio disabled v-model="form.roleId" :label="0">超级管理员</el-radio>
          <el-radio disabled v-model="form.roleId" :label="1">普通管理员</el-radio>
        </el-form-item>
      </el-row>
      <el-row style="margin-top: 10px" v-if="form.roleId===1">
        <el-form-item label="关联工厂">
          <el-input v-model="form.factoryName" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="9">
          <el-form-item label="创建人">
            <el-input v-model="form.createUserRealName" readonly></el-input>
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
            <el-input v-model="form.updateUserRealName" readonly></el-input>
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
  import {reqUserVoById} from '../../api/user'

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
      let res = await reqUserVoById(this.id)
      console.log(res)
      let data = res.data
      console.log(data)
      this.form = data.user
      this.form.createUserRealName = data.createUserRealName
      this.form.updateUserRealName = data.updateUserRealName
      this.form.factoryName = data.factoryName
      this.loading = false
    },
    methods: {
      modalClose () {
        PubSub.publish('staff-dialog-close', 0)
      }
    }
  }
</script>

<style scoped>

</style>
