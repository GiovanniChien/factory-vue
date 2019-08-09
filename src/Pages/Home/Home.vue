<template>
  <div>
    <el-container>
      <el-header>
        <MHeader/>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <NavSide/>
        </el-aside>
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import MHeader from '../../components/MHeader/MHeader'
  import NavSide from '../../components/NavSide/NavSide'

  export default {
    components: {
      MHeader,
      NavSide
    },
    data () {
      return {}
    },
    computed: {
      ...mapState(['User', 'FactoryId'])
    },
    mounted () {
      if (this.FactoryId === 0) {
        this.$store.dispatch('setFactoryList')
      }
    }
  }
</script>

<style scoped>
  .el-header {
    width: 100%;
    background-color: #090723;
    color: #ffffff;
  }
</style>
