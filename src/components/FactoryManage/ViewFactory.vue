<template>
  <el-dialog title="详细" top="20px" :visible.sync="visible"
             :id="id" width="50%" :before-close="modalClose">
    <el-form ref="form" size="mini"
             :model="form" label-width="80px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-col :offset="3" :span="16">
          <el-form-item label="工厂名称">
            <el-input v-model="form.factoryName" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :offset="3" :span="16">
          <el-form-item label="工厂地址">
            <el-input v-model="form.factoryAddr" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="16" :offset="3">
          <el-form-item label="工厂网址">
            <el-input v-model="form.factoryUrl" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="16" :offset="3">
          <el-form-item label="工厂人数">
            <el-input v-model="form.factoryWorker" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="7" :offset="3">
          <el-form-item label="创建人">
            <el-input v-model="form.createUserName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间">
            <el-date-picker type="datetime" v-model="form.createTime" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="7" :offset="3">
          <el-form-item label="更新人">
            <el-input v-model="form.updateUserName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="更新时间">
            <el-date-picker type="datetime" v-model="form.updateTime" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="7" :offset="3">
          <el-form-item label="工厂状态">
            <el-radio v-model="form.factoryStatus" :label="0" disabled>正常</el-radio>
            <el-radio v-model="form.factoryStatus" :label="1" disabled>关闭</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="7" :offset="3">
          <el-form-item label="工厂图">
            <div class="avatar-uploader">
              <img v-if="form.factoryImgUrl" :src="`/api/resource-server/factory/${form.factoryImgUrl}`" class="avatar">
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="14" :offset="3">
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.bak" readonly></el-input>
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
  import {reqFactoryVoById} from '../../api/factory'

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
      let res = await reqFactoryVoById(this.id)
      console.log(res)
      let data = res.data
      this.form = data.factory
      this.form.createUserName = data.createUserName
      this.form.updateUserName = data.updateUserName
      this.loading = false
    },
    methods: {
      modalClose () {
        PubSub.publish('factory-dialog-close', 0)
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    width: 150px;
    height: 150px;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
</style>
