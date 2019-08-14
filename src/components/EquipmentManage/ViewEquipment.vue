<template>
  <el-dialog title="详情" top="20px"
             :visible.sync="visible" :id="id" width="60%" :before-close="modalClose">
    <el-form ref="form" size="mini"
             :model="form" label-width="100px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-form-item label="设备编号">
          <el-input v-model="form.equipmentSeq" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="设备名称">
          <el-input v-model="form.equipmentName" readonly></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="设备状态">
          <el-tag :type="form.equipmentStatus===10?'success':(form.equipmentStatus===20?'info':'danger')">
            {{form.equipmentStatus===10?'启用':(form.equipmentStatus===20?'停用':'故障')}}
          </el-tag>
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
        <el-form-item label="设备图">
          <div class="avatar-uploader">
            <img v-if="form.equipmentImgUrl" :src="`/api/resource-server/equipment/${form.equipmentImgUrl}`" class="avatar">
          </div>
        </el-form-item>
      </el-row>
      <el-row v-for="(domain,index) in domains" :key="index">
        <el-col :span="10">
          <el-form-item label="可生产产品">
            <el-select v-model="domain.productId" size="mini" disabled>
              <el-option v-for="(item,index) in productList" :key="index" :label="item.productName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产能">
            <el-input v-model.number="domain.yield"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-select v-model="domain.unit" size="mini" disabled>
            <el-option label="/天" :value="10"></el-option>
            <el-option label="/月" :value="20"></el-option>
            <el-option label="/年" :value="30"></el-option>
            <el-option label="/小时" :value="40"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="text-align: center">
        <el-button @click="modalClose" type="primary" size="mini">确定</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {mapState} from 'vuex'
  import {reqGetEquipmentById} from '../../api/equipment'
  import {reqAllProduct} from '../../api/product'
  import {reqListByEid} from '../../api/ep'

  export default {
    name: 'view-equipment',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      id: {type: String}
    },
    computed: {
      ...mapState(['User', 'FactoryId'])
    },
    data () {
      return {
        form: {},
        loading: false,
        domains:[],
        productList:[]
      }
    },
    async mounted () {
      this.loading = true
      let res=await reqAllProduct(this.FactoryId)
      this.productList=res.data

      let res1 = await reqGetEquipmentById(this.id)
      let jsonMap = res1.data
      this.form = jsonMap.equipment
      this.form.createUserName = jsonMap.createUserName
      this.form.updateUserName = jsonMap.updateUserName

      let list=await reqListByEid(this.id)
      this.domains=list
      this.loading = false
    },
    methods: {
      modalClose () {
        PubSub.publish('equipment-dialog-close', 0)
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
