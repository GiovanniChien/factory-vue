<template>
  <div>
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
            width="60">
          </el-table-column>
          <el-table-column
            prop="factoryName"
            label="工厂名"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="factoryAddr"
            label="工厂地址"
            width="170"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="factoryWorker"
            label="工人数"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="factoryStatus"
            label="工厂状态"
            width="80"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag :type="scope.row.factoryStatus===0?'success':'info'">
                {{scope.row.factoryStatus===0?'正常':'关闭'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="flag"
            label="是否有效"
            width="80"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag :type="scope.row.flag===0?'success':'danger'">
                {{scope.row.flag===0?'有效':'无效'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="300">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.factoryStatus===0"
                @click="changeStatus(scope.$index,scope.row,'0')" type="danger"
                icon="el-icon-circle-close" size="mini">
                停止
              </el-button>
              <el-button
                v-else
                @click="changeStatus(scope.$index,scope.row,'1')" type="success"
                icon="el-icon-circle-check" size="mini">
                开启
              </el-button>
              <el-button @click="handleClick(scope.$index,scope.row)" type="primary" icon="el-icon-edit" size="mini">
                修改
              </el-button>
              <el-button @click="handleDeleteClick(scope.$index,scope.row)" type="danger" icon="el-icon-delete"
                         size="mini">删除
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
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {reqFactoryList, reqUpdateStatus} from '../../../api/factory'

  export default {
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
      }
    },
    mounted () {
      this.getTableData()
    },
    computed: {
      ...mapState(['User'])
    },
    methods: {
      async getTableData () {
        this.loading = true
        let res = await reqFactoryList(this.pageInfo.page, this.pageInfo.pageSize)
        let data = res.data
        this.pageInfo.page = data.pageNum
        this.pageInfo.pageSize = data.pageSize
        this.pageInfo.total = data.total
        this.pageInfo.totalPage = data.pages
        this.tableData = data.list
        this.loading = false
        console.log(this.tableData, this.loading)
      },
      handlePageChange (page) {
        this.pageInfo.page = page
        this.getTableData()
      },
      changeStatus (index, f, isClose) {
        let msg = ''
        let factoryStatus
        if (isClose === '0') {
          msg = '确认关闭此工厂?'
          factoryStatus = '1'
        } else {
          msg = '确认开启此工厂?'
          factoryStatus = '0'
        }
        this.$confirm(msg, '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reqUpdateStatus({id: f.id, updateUserid: this.User.id, factoryStatus: factoryStatus})
            .then((res) => {
              this.tableData[index].factoryStatus = res.data.factoryStatus
              this.$message({message: '操作成功', type: 'success'})
            })
            .catch((error) => {
              this.$message({message: '网络崩溃，请稍后重试', type: 'error'})
            })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style scoped>

</style>
