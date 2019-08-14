<template>
  <el-dialog title="修改产品" top="80px"
             :visible.sync="visible" width="20%" :before-close="modalClose">
    <el-form ref="form" :rules="rules" size="mini"
             :model="form" label-width="80px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-form-item label="产品编号" prop="productNum">
          <el-input v-model="form.productNum"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model.number="form.productName"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-form-item label="产品图">
          <el-upload
            class="avatar-uploader"
            action="/api/resource-server/upload/product"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            v-model="form.productImgUrl">
            <img v-if="form.productImgUrl" :src="`/api/resource-server/product/${form.productImgUrl}`" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row style="text-align: center">
        <el-button type="primary" @click="onSubmit" size="mini">修改</el-button>
        <el-button @click="modalClose" size="mini">取消</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {mapState} from 'vuex'
  import {reqProductById,reqUpdateProduct} from '../../api/product'

  export default {
    name: 'update-product',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      id: {type: String}
    },
    computed: {
      ...mapState(['User'])
    },
    data(){
      return{
        form:{},
        rules:{
          productNum:[
            {required:true,message:'请填写产品编号',trigger:'blur'}
          ],
          productName:[
            {required:true,message:'请填写产品名称',trigger:'blur'}
          ]
        },
        loading:false
      }
    },
    async mounted () {
      this.loading=true
      let product = await reqProductById(this.id)
      this.form = product.data
      this.loading=false
    },
    methods:{
      handleAvatarSuccess(res,file){
        this.form.productImgUrl=res
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

      onSubmit () {
          this.$refs['form'].validate((valid)=>{
          if(valid){
            this.form.updateUserid = this.User.id

            this.loading=true;
            reqUpdateProduct(this.form)
              .then((res)=>{
                this.loading=false;
                if(res.code==='10000'){
                  this.$message.success('修改成功')
                  this.modalClose(1)
                }
                else{
                  this.$message.error(res.msg)
                  this.modalClose()
                }
              })
              .catch((error)=>{
                this.loading=false;
                this.$message.error('网络崩溃了,请稍后再试')
                this.modalClose()
              })
          }
          else{
            return false;
          }
        })
      },

      modalClose (msg) {
        if (msg === 1) {
          PubSub.publish('product-dialog-close', 2)
        } else {
          PubSub.publish('product-dialog-close', 0)
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
