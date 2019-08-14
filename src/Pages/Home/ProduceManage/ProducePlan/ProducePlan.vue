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
            <el-select v-model="searchForm.planStatus" placeholder="计划状态">
              <el-option label="全部状态" value="0"></el-option>
              <el-option label="未启动" value="10"></el-option>
              <el-option label="已启动" value="20"></el-option>
              <el-option label="已完成" value="30"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-form-item style="margin-left: 20px">
          <el-button type="primary" @click="searchPlan">查询</el-button>
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
            prop="plan.planSeq"
            label="计划编号"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="plan.productOrder.orderSeq"
            label="订单编号"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="plan.planCount"
            label="数量"
            width="60"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="plan.deliveryDate"
            label="交货日期"
            width="100"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.plan.deliveryDate|formatDate}}
            </template>
          </el-table-column>
          <el-table-column
            prop="plan.planStartDate"
            label="计划开始日期"
            width="120"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.plan.planStartDate|formatDate}}
            </template>
          </el-table-column>
          <el-table-column
            prop="plan.planEndDate"
            label="计划结束时间"
            width="120"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.plan.planEndDate|formatDate}}
            </template>
          </el-table-column>
          <el-table-column
            prop="roleId"
            label="计划状态"
            width="100"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag :type="scope.row.plan.planStatus===30?'success':scope.row.plan.planStatus===10?'info':''">
                {{scope.row.plan.planStatus|PlanStatus}}
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
                @click="viewFactory(scope.$index,scope.row)" type="info"
                icon="el-icon-view" size="mini">
                详细
              </el-button>
              <el-button @click="handleUpdateClick(scope.$index,scope.row)"
                         type="primary" icon="el-icon-edit"
                         v-if="scope.row.plan.planStatus===10"
                         size="mini">
                修改
              </el-button>
              <el-button @click="handleDeleteClick(scope.$index,scope.row)"
                         type="danger" icon="el-icon-delete"
                         v-if="scope.row.plan.planStatus===10"
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
    <AddPlan v-if="addVisible" :visible.sync="addVisible"/>
    <UpdatePlan v-if="updateVisible" :visible.sync="updateVisible" :id="id"/>
    <ViewPlan v-if="showVisible" :visible.sync="showVisible" :id="id"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import PubSub from 'pubsub-js'
  import {reqPlanList, reqDel} from '../../../../api/plan'
  import {reqAllProduct} from '../../../../api/product'
  import AddPlan from '../../../../components/ProduceManage/ProducePlan/AddPlan'
  import UpdatePlan from '../../../../components/ProduceManage/ProducePlan/UpdatePlan'
  import ViewPlan from '../../../../components/ProduceManage/ProducePlan/ViewPlan'

  export default {
    components: {AddPlan, UpdatePlan, ViewPlan},
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
        id: '',
        searchForm: {
          planSeq: '',
          orderSeq: '',
          productId: 0,
          planStatus: '0'
        },
        products: [],
      }
    },
    mounted () {
      this.getTableData()
      this.getAllProductByFactoryId(this.FactoryId)
      PubSub.subscribe('plan-dialog-close', (msg, data) => {
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
        this.searchForm.factoryId = this.FactoryId
        this.searchForm.productId = Number(this.searchForm.productId)
        let res = await reqPlanList({
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize,
          plan: this.searchForm
        })
        let data = res.data
        //console.log(data)
        this.pageInfo.page = data.pageNum
        this.pageInfo.pageSize = data.pageSize
        this.pageInfo.total = data.total
        this.pageInfo.totalPage = data.pages
        this.tableData = data.plans
        this.loading = false
      },
      handlePageChange (page) {
        this.pageInfo.page = page
        this.getTableData()
      },
      handleDeleteClick (index, r) {
        this.$confirm('确认删除此计划？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          reqDel({id: r.plan.id, updateUserid: this.User.id, orderId: r.plan.orderId})
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
      searchPlan () {
        this.loading = true
        this.pageInfo.page = 1
        this.getTableData()
      },
      addPlan () {
        this.addVisible = true
      },
      handleUpdateClick (index, p) {
        this.id = p.plan.id.toString()
        this.updateVisible = true
      },
      viewFactory (index, p) {
        this.id = p.plan.id.toString()
        this.showVisible = true
      }
    },
    watch: {
      FactoryId (newVal) {
        this.pageInfo.page = 1
        this.searchForm = {
          planSeq: '',
          orderSeq: '',
          productId: 0,
          planStatus: '0'
        }
        this.getTableData()
      }
    },
    filters: {
      PlanStatus (val) {
        let res = ''
        switch (val) {
          case 10:
            res = '未启动'
            break
          case 20:
            res = '已启动'
            break
          case 30:
            res = '已完成'
            break
        }
        return res
      }
    }
  }
</script>

<style scoped>

</style>
