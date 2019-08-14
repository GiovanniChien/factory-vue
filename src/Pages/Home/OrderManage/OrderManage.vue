<template>
  <div>
    <el-row style="margin-top:50px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-col :span="3" :offset="3">
          <el-form-item>
            <el-input v-model="searchForm.orderSeq" placeholder="订单编号"></el-input>
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
        <el-col :span="3" :offset="1">
          <el-form-item>
            <el-select v-model="searchForm.orderStatus" placeholder="订单状态状态">
              <el-option label="全部状态" value="0"></el-option>
              <el-option label="未接单" value="10"></el-option>
              <el-option label="已接单" value="20"></el-option>
              <el-option label="已拒绝" value="30"></el-option>
              <el-option label="生产中" value="40"></el-option>
              <el-option label="订单完成" value="50"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-form-item style="margin-left: 150px">
          <el-button type="primary" @click="searchOrder">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrder">添加</el-button>
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
            prop="order.orderSeq"
            label="订单编号"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="order.orderSource"
            label="订单来源"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品名称"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="order.productCount"
            label="产品数量"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="finishCount"
            label="完成数量"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="order.endDate"
            label="订单截止日期"
            width="120"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.order.endDate|formatDate}}
            </template>
          </el-table-column>
          <el-table-column
            prop="order.orderStatus"
            label="订单状态"
            width="100"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.order.orderStatus|OrderStatus}}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            style="text-align: center">
            <template slot-scope="scope">
              <el-button
                @click="viewOrder(scope.$index,scope.row)" type="info"
                icon="el-icon-view" size="mini">
                详细
              </el-button>
              <el-button @click="handleDeleteClick(scope.$index,scope.row)"
                         type="danger" icon="el-icon-delete"
                         v-if="scope.row.order.orderStatus===10||scope.row.order.orderStatus===30"
                         size="mini">删除
              </el-button>
              <el-row v-if="scope.row.order.orderStatus===10" style="margin-top: 5px">
                <el-button @click="changeOrderStatus(scope.$index,scope.row,true)"
                           type="success" icon="el-icon-circle-check"
                           size="mini">
                  接单
                </el-button>
                <el-button @click="changeOrderStatus(scope.$index,scope.row,false)"
                           type="danger" icon="el-icon-circle-close"
                           size="mini">
                  拒单
                </el-button>
              </el-row>
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
    <AddOrder v-if="addVisible" :visible.sync="addVisible"/>
    <ViewOrder v-if="showVisible" :visible.sync="showVisible" :id="id"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import PubSub from 'pubsub-js'
  import {reqAllProduct} from '../../../api/product'
  import {reqOrderList, reqUpdateStatus, reqDel} from '../../../api/order'
  import AddOrder from '../../../components/OrderManage/AddOrder'
  import ViewOrder from '../../../components/OrderManage/ViewOrder'

  export default {
    components: {ViewOrder, AddOrder},
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
          orderSeq: '',
          productId: 0,
          orderStatus: '0'
        },
        products: [],
      }
    },
    mounted () {
      this.getTableData()
      this.getAllProductByFactoryId(this.FactoryId)
      PubSub.subscribe('order-dialog-close', (msg, data) => {
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
        this.searchForm.factoryId = this.FactoryId
        this.searchForm.productId = Number(this.searchForm.productId)
        let res = await reqOrderList({
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize,
          order: this.searchForm
        })
        let data = res.data
        console.log(data)
        this.pageInfo.page = data.pageNum
        this.pageInfo.pageSize = data.pageSize
        this.pageInfo.total = data.total
        this.pageInfo.totalPage = data.pages
        this.tableData = data.orders
        this.loading = false
      },
      handlePageChange (page) {
        this.pageInfo.page = page
        this.getTableData()
      },
      handleDeleteClick (index, o) {
        this.$confirm('确认删除此订单？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          reqDel({id: o.order.id, updateUserid: this.User.id})
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
        //console.log(this.products)
      },
      searchOrder () {
        this.loading = true
        this.pageInfo.page = 1
        this.getTableData()
      },
      addOrder () {
        this.addVisible = true
      },
      viewOrder (index, o) {
        this.id = o.order.id.toString()
        this.showVisible = true
      },
      changeOrderStatus (index, o, isAcc) {
        //接单或拒单，isAcc=true接单，否则拒单
        let msg = ''
        let orderStatus
        if (isAcc) {
          msg = '确认接受此订单?'
          orderStatus = 20
        } else {
          msg = '确认拒绝此订单?'
          orderStatus = 30
        }
        this.$confirm(msg, '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reqUpdateStatus({id: o.order.id, updateUserid: this.User.id, orderStatus: orderStatus})
            .then((res) => {
              this.tableData[index].order.orderStatus = res.data.orderStatus
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
          orderSeq: '',
          productId: 0,
          orderStatus: '0'
        }
        this.getTableData()
      }
    },
    filters: {
      OrderStatus (val) {
        /*10：未接单  20：已接单  30：已拒绝
         40：生产中  50：订单完成*/
        let res = ''
        switch (val) {
          case 10:
            res = '未接单'
            break
          case 20:
            res = '已接单'
            break
          case 30:
            res = '已拒绝'
            break
          case 40:
            res = '生产中'
            break
          case 50:
            res = '订单完成'
            break
        }
        return res
      }
    }
  }
</script>

<style scoped>

</style>
