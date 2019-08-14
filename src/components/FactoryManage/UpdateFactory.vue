<template>
  <el-dialog title="修改" top="20px" :visible.sync="visible"
             :id="id" width="60%" :before-close="modalClose">
    <el-form ref="form" :rules="rules" size="mini"
             :model="form" label-width="80px" style="margin-top: 10px"
             v-loading="loading">
      <el-row style="margin-bottom: 10px">
        <el-col :offset="3" :span="15">
          <el-form-item label="工厂名称" prop="factoryName">
            <el-input v-model="form.factoryName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :offset="3" :span="15">
          <el-form-item label="工厂地址">
            <el-input v-model="form.factoryAddr"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="15" :offset="3">
          <el-form-item label="工厂网址" prop="factoryUrl">
            <el-input v-model="form.factoryUrl"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="15" :offset="3">
          <el-form-item label="工厂人数" prop="factoryWorker">
            <el-input v-model.number="form.factoryWorker"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="7" :offset="3">
          <el-form-item label="工厂状态">
            <el-radio v-model="form.factoryStatus" :label="0">正常</el-radio>
            <el-radio v-model="form.factoryStatus" :label="1">关闭</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="7" :offset="3">
          <el-form-item label="工厂图">
            <el-upload
              class="avatar-uploader"
              action="/api/resource-server/upload/factory"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              v-model="form.factoryImgUrl">
              <img v-if="form.factoryImgUrl" :src="`/api/resource-server/factory/${form.factoryImgUrl}`" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="14" :offset="3">
          <el-form-item label="备注" prop="bak">
            <el-input type="textarea" v-model="form.bak"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
  import {reqUpdate, reqFactoryById} from '../../api/factory'

  export default {
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
    data () {
      return {
        form: {},
        rules: {
          factoryName: [
            {type: 'string', required: true, message: '请填写工厂名称', trigger: 'blur'}
          ],
          factoryWorker: [
            {required: true, message: '请填写工厂人数'},
            {type: 'number', message: '非法输入'}
          ]
        },
        loading: false
      }
    },
    async mounted () {
      let res = await reqFactoryById(this.id)
      this.form = res.data
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
            if (valid) {
              this.loading = true
              let f = this.form
              f.updateUserid = this.User.id
              reqUpdate(f)
                .then((res) => {
                  this.loading = false
                  if (res.code === '10000') {
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    })
                    this.$store.dispatch('setFactoryList')
                    this.modalClose(1)
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
      handleAvatarSuccess (res, file) {
        this.form.factoryImgUrl = res
      }
      ,
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      modalClose (msg) {
        if (msg === 1) {
          PubSub.publish('factory-dialog-close', 2) //修改工厂成功
        } else {
          PubSub.publish('factory-dialog-close', 0) //修改工厂失败或取消
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
