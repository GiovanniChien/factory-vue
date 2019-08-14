<template>
  <el-dialog title="编辑设备" top="40px"
             :visible.sync="visible" width="40%" :before-close="modalClose">
    <el-form ref="form" :rules="rules" size="mini"
             :model="form" label-width="120px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="form.equipmentName"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="设备号" prop="equipmentSeq">
          <el-input v-model.number="form.equipmentSeq"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="设备状态">
          <el-radio v-model="form.equipmentStatus" :label="10">启用</el-radio>
          <el-radio v-model="form.equipmentStatus" :label="20">停用</el-radio>
          <el-radio v-model="form.equipmentStatus" :label="30">故障</el-radio>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="设备图">
          <el-upload
            class="avatar-uploader"
            action="/api/resource-server/upload/equipment"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            v-model="form.equipmentImgUrl">
            <img v-if="form.equipmentImgUrl" :src="`/api/resource-server/equipment/${form.equipmentImgUrl}`" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row v-for="(domain,index) in form.domains" :key="index">
        <el-col :span="10">
          <el-form-item label="可生产产品" :prop="'domains.'+index+'.productId'" :rules="[
            {required: true, message: '请选择产品', trigger: 'change'}
          ]">
            <el-select v-model="domain.productId" size="mini">
              <el-option v-for="(item,index) in productList" :key="index" :label="item.productName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产能" :prop="'domains.'+index+'.yield'" :rules="[
            {required: true, message: '请填写设备产能', trigger: 'blur'},
            {type: 'number', message: '非法输入', trigger: 'blur'}
          ]">
            <el-input v-model.number="domain.yield"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-select v-model="domain.unit" size="mini">
            <el-option label="/天" :value="10"></el-option>
            <el-option label="/月" :value="20"></el-option>
            <el-option label="/年" :value="30"></el-option>
            <el-option label="/小时" :value="40"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="mini" @click="removeDomain(index)">删除</el-button>
        </el-col>
      </el-row>
      <el-row style="text-align: center">
        <el-button type="primary" size="mini" @click="addDomain">添加</el-button>
        <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
        <el-button size="mini" @click="modalClose">取消</el-button>
      </el-row>

    </el-form>
  </el-dialog>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {mapState} from 'vuex'
  import {reqGetEquipmentById, reqEquipmentUpdate} from '../../api/equipment'
  import {reqAllProduct} from '../../api/product'
  import {reqListByEid, reqUpdateEP, reqDelEP} from '../../api/ep'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      id: {type: String}
    },
    computed: {
      ...mapState(['User', 'FactoryId'])
    },
    data () {
      return {
        form: {
          equipmentName:'',
          equipmentSeq:'',
          equipmentImgUrl:'',
          equipmentStatus:'',
          domains: [{
            productId: null,
            yield: null,
            unit: null
          }]
        },
        rules: {
          equipmentName: [
            {required: true, message: '请填写设备名称', trigger: 'blur'}
          ],
          equipmentSeq: [
            {type: 'string', required: true, message: '请填写设备号', trigger: 'blur'}
          ]
        },
        loading: false,
        productList:[]
      }
    },
    async mounted () {
      this.loading = true
      let res=await reqAllProduct(this.FactoryId)
      this.productList=res.data

      let res1 = await reqGetEquipmentById(this.id)
      let equipment=res1.data.equipment
      this.form.id=Number(this.id)
      this.form.factoryId=this.FactoryId
      this.form.equipmentName=equipment.equipmentName
      this.form.equipmentSeq=equipment.equipmentSeq
      this.form.equipmentImgUrl=equipment.equipmentImgUrl
      this.form.equipmentStatus=equipment.equipmentStatus

      let list = await reqListByEid(this.id)
      this.form.domains = list
      this.form.domains.forEach((item) => {
        item.flag = 0
      })
      this.loading = false
    },
    methods: {
      handleAvatarSuccess (res, file) {
        this.form.equipmentImgUrl = res
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },

      addDomain () {
        this.form.domains.push({
          id: null,
          equipmentId: Number(this.id),
          productId: null,
          factoryId: this.FactoryId,
          yield: null,
          unit:10,
          flag: 1
        })
      },
      removeDomain (index) {
        if (this.form.domains[index].flag === 0) {
          reqDelEP(this.form.domains[index].id).then().catch()
        }
        this.form.domains.splice(index, 1)
      },

      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.form.updateUserid = this.User.id
            this.loading = true
            console.log(this.form)
            reqEquipmentUpdate(this.form)
              .then((res) => {
                this.loading = false
                if (res.code === '10000') {
                  this.$message.success('修改成功')
                  this.modalClose(1)
                }
                else {
                  this.$message.error(res.msg)
                  this.modalClose()
                }
              })
              .catch((error) => {
                this.loading = false
                this.$message.error('网络崩溃了，请稍后再试哦')
                this.modalClose()
              })
          }
          else {
            return false
          }
        })
      },

      modalClose (msg) {
        if (msg === 1) {
          PubSub.publish('equipment-dialog-close', 2) //添加成功
        } else {
          PubSub.publish('equipment-dialog-close', 0) //添加失败
        }
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 150px;
    height: 150px;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
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
