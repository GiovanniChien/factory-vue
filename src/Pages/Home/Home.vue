<template>
  <div>
    主页
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data () {
      return {}
    },
    computed: {
      ...mapState(['User'])
    },
    mounted () {
      console.log(this.User)
    }
  }
</script>

<style scoped>

</style>
