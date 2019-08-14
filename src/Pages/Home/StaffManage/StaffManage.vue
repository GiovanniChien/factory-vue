<template>
  <div>
    <el-row style="margin-top:50px">
      <el-col :offset="3" :span="6">
        <el-input
          placeholder="用户名/姓名"
          prefix-icon="el-icon-search"
          v-model="user_name_search"
          @keyup.enter.native="searchWithName">
        </el-input>
      </el-col>
      <el-col :offset="1" :span="3">
        <el-button plain @click="searchWithName">搜索</el-button>
      </el-col>
      <el-col :offset="7" :span="2">
        <el-button type="primary" plain @click="addUser">添加</el-button>
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
            prop="userName"
            label="用户名"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="userJobNum"
            label="工号"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="userRealName"
            label="姓名"
            width="180"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="roleId"
            label="用户权限"
            width="120"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag :type="scope.row.roleId===0?'success':'info'">
                {{scope.row.roleId===0?'超级管理员':'普通管理员'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="300">
            <template slot-scope="scope">
              <el-button
                @click="viewStaff(scope.$index,scope.row)" type="info"
                icon="el-icon-view" size="mini">
                详细
              </el-button>
              <el-button @click="handleUpdateClick(scope.$index,scope.row)"
                         type="primary" icon="el-icon-edit"
                         size="mini">
                修改
              </el-button>
              <el-button @click="handleDeleteClick(scope.$index,scope.row)"
                         type="danger" icon="el-icon-delete"
                         :disabled="scope.row.id===User.id"
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
    <AddStaff v-if="addVisible" :visible.sync="addVisible"/>
    <UpdateStaff v-if="updateVisible" :visible.sync="updateVisible" :id="id"/>
    <ViewStaff v-if="showVisible" :visible.sync="showVisible" :id="id"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import PubSub from 'pubsub-js'
  import {reqUserList, reqDelUser, reqUserListByName} from '../../../api/user'
  import AddStaff from '../../../components/StaffManage/AddStaff'
  import UpdateStaff from '../../../components/StaffManage/UpdateStaff'
  import ViewStaff from '../../../components/StaffManage/ViewStaff'

  export default {
    components: {
      UpdateStaff,
      AddStaff,
      ViewStaff
    },
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
        user_name_search: '',
        id: '',
      }
    },
    mounted () {
      this.getTableData()
      PubSub.subscribe('staff-dialog-close', (msg, data) => {
        this.addVisible = false
        this.updateVisible = false
        this.showVisible = false
        if (data === 1) {
          //插入成功
          let {page, totalPage, pageSize, total} = this.pageInfo
          //console.log(this.pageInfo)
          //当前已经到了最后一页的最后一条记录，即新记录应该插在下一页
          if (page === totalPage && pageSize * totalPage === total) {
            this.pageInfo.page = this.pageInfo.page + 1
            this.pageInfo.total = this.pageInfo.total + 1
            this.pageInfo.totalPage = this.pageInfo.totalPage + 1
          } else {
            this.pageInfo.page = this.pageInfo.totalPage
          }
          //console.log(this.pageInfo)
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
        let res = await reqUserList({
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize,
          factoryId: this.FactoryId
        })
        let data = res.data
        this.pageInfo.page = data.page
        this.pageInfo.pageSize = data.pageSize
        this.pageInfo.total = data.total
        this.pageInfo.totalPage = data.totalPage
        this.tableData = []
        //从createUserRealName: ""，factoryName: ""，updateUserRealName: ""，user:{}中获取tableData
        let userInfo = data.userInfo
        userInfo.forEach((item) => {
          let tmp = item.user
          tmp.createUserRealName = item.createUserRealName
          tmp.factoryName = item.factoryName
          tmp.updateUserRealName = item.updateUserRealName
          this.tableData.push(tmp)
        })
        this.loading = false
      },
      handlePageChange (page) {
        this.pageInfo.page = page
        if (this.user_name_search.trim().length !== 0) {
          this.getTableDataByEs()
        } else {
          this.getTableData()
        }
      },
      handleDeleteClick (index, u) {
        this.$confirm('确认删除此员工？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          reqDelUser({id: u.id, updateUserid: this.User.id})
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
      searchWithName () {
        //如果搜索框内无内容，则通过mysql分页获取第一页内容
        if (this.user_name_search.trim().length === 0) {
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
        let q = encodeURIComponent(this.user_name_search)
        let res = await reqUserListByName({
          page: this.pageInfo.page,
          q: q, pageSize: this.pageInfo.pageSize,
          factoryId: this.FactoryId
        })
        let data = res.data
        this.tableData = data.content
        this.pageInfo.page = data.number + 1
        this.pageInfo.pageSize = data.size
        this.pageInfo.total = data.totalElements
        this.pageInfo.totalPage = data.totalPages
        this.loading = false
      },
      addUser () {
        this.addVisible = true
      },
      handleUpdateClick (index, u) {
        this.id = u.id.toString()
        this.updateVisible = true
      },
      viewStaff (index, u) {
        this.id = u.id.toString()
        this.showVisible = true
      }
    },
    watch: {
      FactoryId (newVal) {
        this.pageInfo.page = 1
        this.user_name_search = ""
        this.getTableData()
      }
    }
  }
</script>

<style scoped>

</style>
