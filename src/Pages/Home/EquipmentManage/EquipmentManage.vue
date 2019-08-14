<template>
  <div>
    <el-row style="margin-top:50px">
      <el-col :offset="3" :span="6">
        <el-input
          placeholder="设备名称"
          prefix-icon="el-icon-search"
          v-model="equipment_name_search"
          @keyup.enter.native="searchWithName">
        </el-input>
      </el-col>
      <el-col :offset="1" :span="3">
        <el-button plain @click="searchWithName">搜索</el-button>
      </el-col>
      <el-col :offset="7" :span="2">
        <el-button type="primary" plain @click="handleAdd">添加</el-button>
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
            prop="equipmentSeq"
            label="设备序号"
            width="180"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="equipmentName"
            label="设备名称"
            width="180"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="最近修改时间"
            prop="updateTime"
            width="220"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.updateTime|formatDateFull}}
            </template>
          </el-table-column>
          <el-table-column
            prop="equipmentStatus"
            label="设备状态 "
            width="80"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag :type="scope.row.equipmentStatus===10?'success':(scope.row.equipmentStatus===20?'info':'danger')">
                {{scope.row.equipmentStatus===10?'启用':(scope.row.equipmentStatus===20?'停用':'故障')}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="280"
            fixed="right">
            <template slot-scope="scope">
              <el-button @click="viewEquipment(scope.$index,scope.row)" type="info" icon="el-icon-view" size="mini">
                详情
              </el-button>
              <el-button @click="handleUpdate(scope.$index,scope.row)" type="primary" icon="el-icon-edit" size="mini">
                修改
              </el-button>
              <el-button @click="handleDel(scope.$index,scope.row)" type="danger" icon="el-icon-delete"
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
          @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>
    </el-row>
    <EquipmentAdd v-if="addEquipmentVisible" :visible.sync="addEquipmentVisible"/>
    <ViewEquipment v-if="viewEquipmentVisible" :visible.sync="viewEquipmentVisible" :id="id"></ViewEquipment>
    <EquipmentUpdate v-if="updateEquipmentVisible" :visible.sync="updateEquipmentVisible" :id="id"/>
  </div>
</template>

<script>
  import PubSub from 'pubsub-js'
  import {mapState} from 'vuex'
  import {reqEquipmentList,reqDelEquipmentById,reqEquipmentSearch} from '../../../api/equipment'
  import EquipmentAdd from '../../../components/EquipmentManage/EquipmentAdd'
  import EquipmentUpdate from '../../../components/EquipmentManage/EquipmentUpdate'
  import ViewEquipment from '../../../components/EquipmentManage/ViewEquipment'

  export default {
    components: {EquipmentAdd, EquipmentUpdate,ViewEquipment},
    computed:{
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
        addEquipmentVisible: false,
        updateEquipmentVisible: false,
        viewEquipmentVisible:false,
        equipment_name_search: '',
        id:''
      }
    },
    mounted: function () {
      this.getData()
      PubSub.subscribe('equipment-dialog-close', (msg, data) => {
        this.viewEquipmentVisible=false
        this.addEquipmentVisible = false
        this.updateEquipmentVisible = false
        if (data === 1) {
          //插入成功
          let {pageNum, pages, pageSize, total} = this.pageInfo
          //当前已经到了最后一页的最后一条记录，即新记录应该插在下一页
          if (pageNum === pages && pageSize * pages === total) {
            this.pageInfo.pageNum = this.pageInfo.pageNum + 1
            this.pageInfo.total = this.pageInfo.total + 1
            this.pageInfo.pages = this.pageInfo.pages + 1
          }
          this.getData()
        } else if (data === 2) {
          //更新成功，更新当前页
          this.getData()
        }
      })
    },
    methods: {
      async getData () {
        this.loading=true;
        let result = await reqEquipmentList(this.pageInfo.pageNum, this.pageInfo.pageSize, this.FactoryId)
        this.pageInfo = result.data
        this.tableData = this.pageInfo.list
        this.loading=false;
      },
      async getTableDataByEs(){
        let name=encodeURIComponent(this.equipment_name_search)
        let res=await reqEquipmentSearch(this.pageInfo.pageNum,this.pageInfo.pageSize,name, this.FactoryId)
        let data=res.data
        this.tableData=data.content
        this.pageInfo.pageNum=data.number+1
        this.pageInfo.total = data.totalElements
        this.pageInfo.pages = data.totalPages
        this.loading = false
      },
      viewEquipment (index, row) {
        this.id = row.id.toString()
        this.viewEquipmentVisible = true
      },
      handleCurrentChange (val) {
        this.pageInfo.pageNum = val
        if(this.equipment_name_search.trim().length!==0){
          this.getTableDataByEs()
        }else {
          this.getData()
        }
      },
      handleDel (index, row) {
        this.$confirm('确认删除此产品？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.loading = true
          reqDelEquipmentById({id: row.id, updateUserid: this.User.id})
            .then((res) => {
              this.loading = false
              if (res.code === '10000') {
                this.$message.success('删除成功')
                let {pageNum, pages, pageSize, total} = this.pageInfo
                if (pageNum === pages && pageSize * (pages - 1) === total - 1) {
                  this.pageInfo.pageNum = this.pageInfo.pageNum === 1 ? 1 : this.pageInfo.pageNum - 1
                }
                //如果不是这一页的最后一条记录，更新当前页
                this.getData()
              } else {
                this.$message.error('删除失败，请稍后再试')
              }
            })
            .catch((error) => {
              this.$message.error('网络崩溃了，请稍后再试')
              this.loading = false
            })
        }).catch(()=>{

        })
      },
      handleUpdate (index, row) {
        this.id = row.id.toString()
        this.updateEquipmentVisible = true
      },
      handleAdd () {
        this.addEquipmentVisible = true
      },
      searchWithName () {
        this.pageInfo.pageNum=1
        if (this.equipment_name_search.trim().length === 0) {
          this.getData()
          return
        }
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
