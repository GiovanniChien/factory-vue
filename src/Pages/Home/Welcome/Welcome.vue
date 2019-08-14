<template>
  <div>
    <div style="margin-left: 80px;margin-right: 80px;margin-top: 30px">
      <div>
        <span style="font-size:20px;width: 40%;display: inline-block">设备运行情况</span>
      </div>
      <el-divider></el-divider>
      <el-row style="text-align: center;">
        <el-col :span="8">
          <div style="margin-bottom: 10px;color:#13ce66;">开机率</div>
          <el-progress type="circle" color="#13ce66"
                       :percentage="(eData.bootRate*100).toFixed(2)"></el-progress>
        </el-col>
        <el-col :span="8">
          <div style="margin-bottom: 10px;color: #ff4949;">故障率</div>
          <el-progress type="circle" color="#ff4949"
                       :percentage="(eData.faultRate*100).toFixed(2)"></el-progress>
        </el-col>
        <el-col :span="8">
          <div style="margin-bottom: 10px;color:#e6a23c;">停用率</div>
          <el-progress type="circle" color="#e6a23c"
                       :percentage="(eData.downRate*100).toFixed(2)"></el-progress>
        </el-col>
      </el-row>
      <div style="margin-top: 50px">
        <span style="font-size:20px;width: 40%;display: inline-block">订单统计</span>
      </div>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="12">
          <div ref="pieChart" style="width: 400px;height:300px;"></div>
        </el-col>
        <el-col :span="12">
          <div ref="barChart" style="width: 400px;height:300px;"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {reqStatistic} from '../../../api/equipment'
  import {reqStatisticOrderStatus, reqStatisticOrderByMonth} from '../../../api/order'
  import {mapState} from 'vuex'
  import echarts from 'echarts'
  import 'echarts/theme/macarons.js'

  export default {
    computed: {
      ...mapState(['FactoryId'])
    },
    data () {
      return {
        eData: {},
        pieData: [],//饼图数据
        barData: {},//柱状图数据
      }
    },
    async mounted () {
      this.reloadResource()
    },
    methods: {
      async reloadResource () {
        let res = await reqStatistic(this.FactoryId)
        this.eData = res.data
        this.drawPie()
        this.drawBar()
      },
      drawPie () {
        let pieChart = echarts.init(this.$refs.pieChart, 'macarons')
        pieChart.showLoading()
        reqStatisticOrderStatus(this.FactoryId)
          .then((res) => {
            let data = res.data
            this.pieName = data.name
            console.log(this.pieName)
            for (let i = 0; i < 5; i++) {
              let obj = {}
              obj.name = data.name[i]
              obj.value = data.value[i]
              this.pieData[i] = obj
            }
            pieChart.setOption({        //加载数据图表
              title: {
                text: '订单情况',
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: '{b} <br/>{c} : {d} %'      //a 系列名称，b 数据项名称，c 数值，d 百分比
              },
              legend: {
                orient: 'vertical',
                x: 'left',
                data: this.pieData.name
              },
              toolbox: {
                show: true,
                feature: {
                  mark: {show: true},
                  dataView: {show: true, readOnly: false},
                  magicType: {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                      funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                      }
                    }
                  },
                  restore: {show: true},
                  saveAsImage: {show: true}
                }
              },
              calculable: true,
              series: [
                {
                  name: '订单数量',
                  type: 'pie',
                  radius: '55%',//饼图的半径大小
                  center: ['50%', '60%'],//饼图的位置
                  data: this.pieData
                }
              ]
            })
            pieChart.hideLoading()
          })
          .catch((error) => {
            this.$message({
              message: '请求失败，请稍后再试',
              type: 'error'
            })
            pieChart.hideLoading()
          })
      },
      drawBar () {
        let barChart = echarts.init(this.$refs.barChart, 'macarons')
        barChart.showLoading()
        reqStatisticOrderByMonth(this.FactoryId)
          .then((res) => {
            this.barData = res.data
            barChart.setOption({
              title: {
                text: '年度订单情况',
                subtext: '柱状图',
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: '{b} <br/>{c}'      //a 系列名称，b 数据项名称，c 数值，d 百分比
              },
              legend: {
                orient: 'vertical',
                x: 'left',
                data: ['月份']
              },
              xAxis: {
                data: this.barData.month
              },
              yAxis: {},
              toolbox: {
                show: true,
                feature: {
                  mark: {show: true},
                  dataView: {show: true, readOnly: false},
                  magicType: {
                    show: true,
                    type: ['bar', 'funnel'],
                    option: {
                      funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                      }
                    }
                  },
                  restore: {show: true},
                  saveAsImage: {show: true}
                }
              },
              calculable: true,
              series: [
                {
                  name: '订单数',
                  type: 'bar',
                  center: ['50%', '60%'],//饼图的位置
                  data: this.barData.num
                }
              ]
            })
            barChart.hideLoading()
          })
      }
    },
    watch: {
      FactoryId (newVal) {
        this.reloadResource()
      }
    }
  }
</script>

<style scoped>

</style>
