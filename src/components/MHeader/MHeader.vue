<template>
  <div class="header">
    <div class="title">智慧工厂</div>
    <div class="info">
      <span style="font-size: 10px;color:#785e46;cursor: pointer;" @click="logout">退出登录</span>
      <span>{{User.userRealName}}</span>
      <span @click="switchFactory" style="cursor: pointer">{{factoryName}}</span>
    </div>
    <el-dialog
      title="切换工厂"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleDialogClose">
      <div>
        <el-select v-model="tf" placeholder="请选择">
          <el-option v-for="(f,index) in FactoryList" :key="index" :label="f.factoryName" :value="f.id"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSwitch">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {reqFactoryById} from '../../api/factory'

  export default {
    computed: {
      ...mapState(['User', 'FactoryId', 'FactoryList'])
    },
    data () {
      return {
        factoryName: '未定义',
        dialogVisible: false,
        tf: ''
      }
    },
    mounted () {
      if (this.FactoryId === 0) {
        this.switchFactory()
      } else {
        this.updateFactory()
      }
    },
    methods: {
      logout () {
        this.$confirm('确认退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('logout')
          this.$router.replace({path: '/login'})
        })
      },
      switchFactory () {
        if (this.User.roleId === 0) {
          this.dialogVisible = true
        }
      },
      handleDialogClose (done) {
        if (this.FactoryId !== 0) {
          done()
        }
      },
      async updateFactory () {
        let res = await reqFactoryById(this.FactoryId)
        if (res.code === '10000') {
          this.factoryName = res.data.factoryName
        }
      },
      confirmSwitch () {
        if (this.tf !== '') {
          this.dialogVisible = false
          this.$store.dispatch('setFactoryId', this.tf)
          this.updateFactory()
        }
      }
    }
  }
</script>

<style scoped>
  .header {

  }

  .title {
    text-align: left;
    width: 60%;
    font-size: 24px;
    float: left;
    font-weight: bold;
    line-height: 60px;
    padding-left: 80px;
  }

  .info {
    float: right;
    font-size: 14px;
    line-height: 60px;
  }

  .info span {
    display: inline-block;
    margin-right: 20px
  }
</style>
