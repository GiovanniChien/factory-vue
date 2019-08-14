<template>
  <el-dialog title="详情" top="20px" :visible.sync="visible" :id="id" width="40%" :before-close="modalClose">
    <el-form ref="form" size="mini"
             :model="form" label-width="80px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-form-item label="产品编号">
          <el-input v-model="form.productNum" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="产品名称">
          <el-input v-model="form.productName" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="10">
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
        <el-col :span="10">
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
        <el-form-item label="产品图">
          <div class="avatar-uploader">
            <img v-if="form.productImgUrl" :src="`/api/resource-server/product/${form.productImgUrl}`" class="avatar">
          </div>
        </el-form-item>
      </el-row>
      <el-row style="text-align: center">
        <el-button @click="modalClose" type="primary" size="mini">确定</el-button>
      </el-row>

    </el-form>
  </el-dialog>
</template>

<script>
  import {reqProductDetail} from '../../api/product'

  export default {
    name: 'view-product',
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
      let res = await reqProductDetail(this.id)
      let data = res.data
      this.form = data.product
      this.form.createUserName = data.createUserName
      this.form.updateUserName = data.updateUserName
      this.loading = false
    },
    methods: {
      modalClose () {
        PubSub.publish('product-dialog-close', 0)
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
