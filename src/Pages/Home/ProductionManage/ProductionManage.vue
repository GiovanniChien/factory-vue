<template>
  <div>
    <el-row style="margin-top:50px">
      <el-col :offset="3" :span="6">
        <el-input
          placeholder="产品名"
          prefix-icon="el-icon-search"
          v-model="product_name_search"
          @keyup.enter.native="searchWithName">
        </el-input>
      </el-col>
      <el-col :offset="1" :span="3">
        <el-button plain @click="searchWithName">搜索</el-button>
      </el-col>
      <el-col :offset="7" :span="2">
        <el-button type="primary" plain @click="addProduct">添加</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :offset="3" :span="19">
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          v-loading="loading">
          <el-table-column
            type="index"
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            label="产品编号"
            prop="productNum"
            width="200"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="产品名称"
            prop="productName"
            width="200"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="最近修改时间"
            prop="updateTime"
            width="250"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.updateTime|formatDateFull}}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="280">
            <template slot-scope="scope">
              <el-button @click="viewProduct(scope.$index,scope.row)" type="info" icon="el-icon-view" size="mini">详情
              </el-button>
              <el-button @click="handleClick(scope.$index,scope.row)" type="primary" icon="el-icon-edit" size="mini">修改
              </el-button>
              <el-button @click="handleDeleteClick(scope.$index,scope.row)" type="danger" icon="el-icon-delete" size="mini">删除
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
          :current-page="pageInfo.pageNum"
          :page-count="pageInfo.pages"
          @current-change="handlePageChange">
        </el-pagination>
      </el-col>
    </el-row>
    <ViewProduct v-if="viewProductVisible" :visible.sync="viewProductVisible" :id="id"></ViewProduct>
    <NewProduct v-if="addProductVisible" :visible.sync="addProductVisible"></NewProduct>
    <UpdateProduct v-if="updateProductVisible" :visible.sync="updateProductVisible" :id="id"></UpdateProduct>
  </div>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {mapState} from 'vuex'
  import {reqProductList,reqDelProduct,reqProductSearch} from '../../../api/product'
  import ViewProduct from '../../../components/ProductionManage/ViewProduct'
  import UpdateProduct from '../../../components/ProductionManage/UpdateProduct'
  import NewProduct from '../../../components/ProductionManage/NewProduct'

  export default {
    components: {
      ViewProduct,UpdateProduct,NewProduct
    },
    computed: {
      ...mapState(['User', 'FactoryId'])
    },
    data () {
      return {
        tableData: [],
        pageInfo: {
          total: 0,
          pageNum: 1,
          pages: 0,
          pageSize: 5
        },
        loading: false,
        viewProductVisible: false,
        addProductVisible: false,
        updateProductVisible: false,
        product_name_search: '',
        id:''
      }
    },
    mounted () {
      this.getTableData()

      PubSub.subscribe('product-dialog-close', (msg, data) => {
        this.viewProductVisible = false
        this.updateProductVisible = false
        this.addProductVisible = false
        if (data === 1) {
          //插入成功
          let {pageNum, pages, pageSize, total} = this.pageInfo
          //当前已经到了最后一页的最后一条记录，即新记录应该插在下一页
          if (pageNum === pages && pageSize * pages === total) {
            this.pageInfo.pageNum = this.pageInfo.pageNum + 1
            this.pageInfo.total = this.pageInfo.total + 1
            this.pageInfo.pages = this.pageInfo.pages + 1
          }
          this.getTableData()
        } else if (data === 2) {
          //更新成功，更新当前页
          this.getTableData()
        }
      })
    },
    methods: {
      async getTableData () {
        this.loading = true
        let res = await reqProductList(this.pageInfo.pageNum, this.pageInfo.pageSize, this.FactoryId)
        this.pageInfo = res.data
        this.tableData = this.pageInfo.list
        this.loading = false
      },
      async getTableDataByEs () {
        //先将搜索框内内容用UTF8编码
        let name = encodeURIComponent(this.product_name_search)
        let res = await reqProductSearch(this.pageInfo.pageNum,this.pageInfo.pageSize,this.FactoryId,name)
        let data = res.data
        this.tableData = data.content
        this.pageInfo.pageNum = data.number + 1
        this.pageInfo.pageSize = data.size
        this.pageInfo.total = data.totalElements
        this.pageInfo.pages = data.totalPages
        this.loading = false
      },
      handlePageChange (page) {
        this.pageInfo.pageNum = page
        if (this.product_name_search.trim().length !== 0) {
          this.getTableDataByEs()
        } else {
          this.getTableData()
        }
      },
      viewProduct (index, row) {
        this.id = row.id.toString()
        this.viewProductVisible = true
      },
      handleClick (index, row) {
        this.id = row.id.toString()
        this.updateProductVisible = true
      },
      handleDeleteClick (index, row) {
        this.$confirm('确认删除此产品？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.loading = true
          reqDelProduct({id: row.id, updateUserid: this.User.id})
            .then((res) => {
              if (res.code === '10000') {
                this.$message.success('删除成功')
                let {pageNum, pages, pageSize, total} = this.pageInfo
                if (pageNum === pages && pageSize * (pages - 1) === total - 1) {
                  this.pageInfo.pageNum = this.pageInfo.pageNum === 1 ? 1 : this.pageInfo.pageNum - 1
                }
                //如果不是这一页的最后一条记录，更新当前页
                this.getTableData()
              } else {
                this.$message.error('删除失败，请稍后再试')
                this.loading = false
              }
            })
            .catch((error) => {
              this.$message.error('网络崩溃了，请稍后再试')
              this.loading = false
            })
        }).catch(()=>{

        })
      },
      addProduct () {
        this.addProductVisible = true
      },
      searchWithName () {
        //如果搜索框内无内容，则通过mysql分页获取第一页内容
        if (this.product_name_search.trim().length === 0) {
          this.pageInfo.pageNum = 1
          this.getTableData()
          return
        }
        //如果有内容则去es获取第一页内容
        this.loading = true
        this.pageInfo.pageNum = 1
        this.getTableDataByEs()
      }
    }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
