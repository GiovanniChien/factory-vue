<template>
  <div>
    <el-row style="margin-top:50px">
      <el-col :offset="3" :span="6">
        <el-input
          placeholder="工厂名"
          prefix-icon="el-icon-search"
          v-model="factory_name_search"
          @keyup.enter.native="searchWithName">
        </el-input>
      </el-col>
      <el-col :offset="1" :span="3">
        <el-button plain @click="searchWithName">搜索</el-button>
      </el-col>
      <el-col :offset="7" :span="2">
        <el-button type="primary" plain @click="addFactory">添加</el-button>
      </el-col>
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
            fixed="right"
            label="操作"
            width="380">
            <template slot-scope="scope">
              <el-button
                @click="viewFactory(scope.$index,scope.row)" type="info"
                icon="el-icon-view" size="mini">
                详细
              </el-button>
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
              <el-button @click="handleUpdateClick(scope.$index,scope.row)" type="primary" icon="el-icon-edit"
                         size="mini">
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
    <AddFactory v-if="addVisible" :visible.sync="addVisible"/>
    <UpdateFactory v-if="updateVisible" :visible.sync="updateVisible"
                   :id="id"/>
    <ViewFactory v-if="showVisible" :visible.sync="showVisible" :id="id"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import PubSub from 'pubsub-js'
  import {reqFactoryList, reqUpdateStatus, reqDelFac, reqFactoryListByName} from '../../../api/factory'
  import AddFactory from '../../../components/FactoryManage/AddFactory'
  import UpdateFactory from '../../../components/FactoryManage/UpdateFactory'
  import ViewFactory from '../../../components/FactoryManage/ViewFactory'

  export default {
    components: {AddFactory, UpdateFactory, ViewFactory},
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
        updateVisible: false,
        showVisible: false,
        factory_name_search: '',
        id: '',
      }
    },
    mounted () {
      this.getTableData()
      PubSub.subscribe('factory-dialog-close', (msg, data) => {
        this.addVisible = false
        this.updateVisible = false
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
        } else if (data === 2) {
          //更新成功，更新当前页
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
        let res = await reqFactoryList(this.pageInfo.page, this.pageInfo.pageSize)
        let data = res.data
        this.pageInfo.page = data.pageNum
        this.pageInfo.pageSize = data.pageSize
        this.pageInfo.total = data.total
        this.pageInfo.totalPage = data.pages
        this.tableData = data.list
        this.loading = false
      },
      handlePageChange (page) {
        this.pageInfo.page = page
        if (this.factory_name_search.trim().length !== 0) {
          this.getTableDataByEs()
        } else {
          this.getTableData()
        }
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
      },
      handleDeleteClick (index, f) {
        this.$confirm('确认删除此工厂？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          reqDelFac({id: f.id, updateUserid: this.User.id})
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
                //将vuex中保存的工厂删除
                this.$store.dispatch('delFactory', f.id)
                if (this.FactoryId === f.id) {
                  this.$store.dispatch('setFactoryId', 0)
                  PubSub.publish('switch-factory')
                }
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
      searchWithName () {
        //如果搜索框内无内容，则通过mysql分页获取第一页内容
        if (this.factory_name_search.trim().length === 0) {
          this.pageInfo.page = 1
          this.getTableData()
          return
        }
        //如果有内容则去es获取第一页内容
        this.loading = true
        this.pageInfo.page = 1
        this.getTableDataByEs()
      },
      async getTableDataByEs () {
        //先将搜索框内内容用UTF8编码
        let q = encodeURIComponent(this.factory_name_search)
        let res = await reqFactoryListByName({page: this.pageInfo.page, q: q, pageSize: this.pageInfo.pageSize})
        let data = res.data
        this.tableData = data.content
        this.pageInfo.page = data.number + 1
        this.pageInfo.pageSize = data.size
        this.pageInfo.total = data.totalElements
        this.pageInfo.totalPage = data.totalPages
        this.loading = false
      },
      addFactory () {
        this.addVisible = true
      },
      handleUpdateClick (index, f) {
        this.id = f.id.toString()
        this.updateVisible = true
      },
      viewFactory (index, f) {
        this.id = f.id.toString()
        this.showVisible = true
      }
    }
  }
</script>

<style scoped>

</style>
