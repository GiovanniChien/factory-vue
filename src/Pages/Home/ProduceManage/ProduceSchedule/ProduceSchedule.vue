<template>
  <div>
    <el-row style="margin-top:50px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-col :offset="3" :span="3">
          <el-form-item>
            <el-input v-model="searchForm.planSeq" placeholder="计划编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-form-item>
            <el-input v-model="searchForm.scheduleSeq" placeholder="工单编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-form-item>
            <el-select v-model="searchForm.productId" placeholder="产品">
              <el-option label="全部产品" :value="0"></el-option>
              <el-option v-for="(p,index) in products" :key="index"
                         :label="p.productName" :value="p.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-form-item style="margin-left: 20px">
          <el-button type="primary" @click="searchSchedule">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPlan">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :offset="3" :span="19">
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          v-loading="loading">
          <el-table-column
            type="index"
            label="编号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="schedule.productPlan.planSeq"
            label="计划编号"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="schedule.productPlan.planCount"
            label="计划数量"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="schedule.scheduleCount"
            label="产品数量"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="schedule.scheduleSeq"
            label="工单号"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="equipmentSeq"
            label="设备序列号"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="schedule.startDate"
            label="开始时间"
            width="100"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.schedule.startDate|formatDate|LocalDateFormat}}
            </template>
          </el-table-column>
          <el-table-column
            prop="schedule.endDate"
            label="结束时间"
            width="100"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.schedule.endDate|formatDate|LocalDateFormat}}
            </template>
          </el-table-column>
          <el-table-column
            prop="schedule.scheduleStatus"
            label="工单状态"
            width="100"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.schedule.scheduleStatus===30?'success':scope.row.schedule.scheduleStatus===10?'info':''">
                {{scope.row.schedule.scheduleStatus|ScheduleStatus}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="300"
            style="text-align: center">
            <template slot-scope="scope">
              <el-button
                @click="viewSchedule(scope.$index,scope.row)" type="info"
                icon="el-icon-view" size="mini">
                详细
              </el-button>
              <el-button @click="handleDeleteClick(scope.$index,scope.row)"
                         type="danger" icon="el-icon-delete"
                         v-if="scope.row.schedule.scheduleStatus===10"
                         size="mini">删除
              </el-button>
              <el-button @click="changeScheduleStatus(scope.$index,scope.row,true)"
                         type="success" icon="el-icon-video-play"
                         v-if="scope.row.schedule.scheduleStatus===10"
                         size="mini">开始
              </el-button>
              <el-button @click="changeScheduleStatus(scope.$index,scope.row,false)"
                         type="success" icon="el-icon-circle-check"
                         v-if="scope.row.schedule.scheduleStatus===20"
                         size="mini">完成
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;text-align: center">
      <el-col :offset="3" :span="19">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          :current-page="pageInfo.page"
          :page-count="pageInfo.totalPage"
          @current-change="handlePageChange">
        </el-pagination>
      </el-col>
    </el-row>
    <AddSchedule v-if="addVisible" :visible.sync="addVisible"/>
    <ViewSchedule v-if="showVisible" :visible.sync="showVisible" :id="id"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import PubSub from 'pubsub-js'
  import {reqAllProduct} from '../../../../api/product'
  import {reqScheduleList, reqDel, reqUpdateStatus} from '../../../../api/schedule'
  import AddSchedule from '../../../../components/ProduceManage/ProductSchedule/AddSchedule'
  import ViewSchedule from '../../../../components/ProduceManage/ProductSchedule/ViewSchedule'

  export default {
    components: {AddSchedule, ViewSchedule},
    data () {
      return {
        tableData: [],
        pageInfo: {
          total: 0,
          page: 1,
          totalPage: 0,
          pageSize: 3
        },
        loading: false,
        addVisible: false,
        showVisible: false,
        id: '',
        searchForm: {
          planSeq: '',
          scheduleSeq: '',
          productId: 0
        },
        products: [],
      }
    },
    mounted () {
      this.getTableData()
      this.getAllProductByFactoryId(this.FactoryId)
      PubSub.subscribe('schedule-dialog-close', (msg, data) => {
        this.addVisible = false
        this.showVisible = false
        if (data === 1) {
          //插入成功
          let {page, totalPage, pageSize, total} = this.pageInfo
          //当前已经到了最后一页的最后一条记录，即新记录应该插在下一页
          if (page === totalPage && pageSize * totalPage === total) {
            this.pageInfo.page = this.pageInfo.page + 1
            this.pageInfo.total = this.pageInfo.total + 1
            this.pageInfo.totalPage = this.pageInfo.totalPage + 1
          } else {
            this.pageInfo.page = this.pageInfo.totalPage
          }
          this.getTableData()
        }
      })
    },
    computed: {
      ...mapState(['User', 'FactoryId'])
    },
    methods: {
      async getTableData () {
        this.loading = true
        this.searchForm.factoryId = this.FactoryId
        this.searchForm.productId = Number(this.searchForm.productId)
        let res = await reqScheduleList({
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize,
          schedule: this.searchForm
        })
        let data = res.data
        // console.log(data)
        this.pageInfo.page = data.pageNum
        this.pageInfo.pageSize = data.pageSize
        this.pageInfo.total = data.total
        this.pageInfo.totalPage = data.pages
        this.tableData = data.schedules
        //console.log(this.tableData)
        this.loading = false
      },
      handlePageChange (page) {
        this.pageInfo.page = page
        this.getTableData()
      },
      handleDeleteClick (index, s) {
        this.$confirm('确认删除此工单？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          reqDel({id: s.schedule.id, updateUserid: this.User.id, planId: s.schedule.planId})
            .then((res) => {
              if (res.code === '10000') {
                this.$message({message: '删除成功', type: 'success'})
                //这一页的最后一条记录,把当前页更新为前一页
                let {page, totalPage, pageSize, total} = this.pageInfo
                if (page === totalPage && pageSize * (totalPage - 1) === total - 1) {
                  this.pageInfo.page = this.pageInfo.page === 1 ? 1 : this.pageInfo.page - 1
                }
                //如果不是这一页的最后一条记录，更新当前页
                this.getTableData()
              } else {
                this.$message({message: res.msg, type: 'error'})
                this.loading = false
              }
            })
            .catch((error) => {
              this.$message({message: '网络崩溃了，请稍后再试', type: 'error'})
              this.loading = false
            })
        }).catch(() => {

        })
      },
      async getAllProductByFactoryId (factoryId) {
        let res = await reqAllProduct(factoryId)
        this.products = res.data
      },
      searchSchedule () {
        this.loading = true
        this.pageInfo.page = 1
        this.getTableData()
      },
      addPlan () {
        this.addVisible = true
      },
      viewSchedule (index, s) {
        this.id = s.schedule.id.toString()
        this.showVisible = true
      },
      changeScheduleStatus (index, s, isStart) {
        //开始或完成调度，isStart=true开始，否则完成
        let msg = ''
        let scheduleStatus
        if (isStart) {
          msg = '确认开始此调度?'
          scheduleStatus = 20
        } else {
          msg = '确认完成此调度?'
          scheduleStatus = 30
        }
        this.$confirm(msg, '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reqUpdateStatus({
            id: s.schedule.id,
            updateUserid: this.User.id,
            scheduleStatus: scheduleStatus,
            planId: s.schedule.planId
          })
            .then((res) => {
              this.tableData[index].schedule.scheduleStatus = res.data.scheduleStatus
              this.$message({message: '操作成功', type: 'success'})
            })
            .catch((error) => {
              this.$message({message: '网络崩溃，请稍后重试', type: 'error'})
            })
        }).catch(() => {
        })
      }
    },
    watch: {
      FactoryId (newVal) {
        this.pageInfo.page = 1
        this.searchForm = {
          planSeq: '',
          scheduleSeq: '',
          productId: 0
        }
        this.getTableData()
      }
    },
    filters: {
      ScheduleStatus (val) {
        let res = ''
        switch (val) {
          case 10:
            res = '未开始'
            break
          case 20:
            res = '生产中'
            break
          case 30:
            res = '已完成'
            break
        }
        return res
      },
      LocalDateFormat (val) {
        if (val.toString().substring(0, 4) === '1970') return '——'
      }
    }
  }
</script>

<style scoped>

</style>
