<template>
  <div class="app-container">
    <div class="box-container">
      <div class="contain-search">
        <el-input placeholder="搜索科室名称" clearable v-model="searchText" class="input-with-select"></el-input>
        <el-button type="primary" @click.stop="search">查找</el-button>
        <el-button type="primary" @click.stop="addOpenDialogFun">添加科室</el-button>
      </div>
    </div>
    <div class="content-container">
      <complex-table :tableObject="tableObject"
        @pageCurFun="currentPageChange"
        @deleteFun="deleteFun"
        @editOpenDialogFun="editOpenDialogFun"></complex-table>
    </div>
    <edit-depart ref="openDepartDialog"></edit-depart>
  </div>
</template>

<script>
  import complexTable from '@/components/complexTable'
  import { pageQueryDepart, deleteDepart } from '@/api/api'
  import editDepart from './editDepart'
  export default {
    data() {
      return {
        searchText: '',
        tableLoading: false,
        tableObject: {
          data: [],
          pageNo: 1,
          total: 0,
          pageSize: 10,
          arr: [
            {
              prop: 'name',
              tit: '科室名称'
            },
            {
              prop: 'phone',
              tit: '科室电话'
            },
            {
              prop: 'descp',
              tit: '科室简介'
            },
            {
              tit: '操作',
              operate: 'edit',
              width: '200'
            }
          ],
          oFun: [
            {
              text: '编辑',
              event: 'editOpenDialogFun',
              type: 'primary'
            },
            {
              text: '删除',
              event: 'deleteFun',
              type: 'danger'
            }
          ]
        }
      }
    },
    created() {
      this.queryInfoList()
    },
    components: {
      complexTable,
      editDepart
    },
    methods: {
      queryInfoList() {
        var that = this
        this.tableLoading = true
        this.$http.get(pageQueryDepart, {
          active: 1,
          name: this.searchText,
          pageSize: this.tableObject.pageSize,
          pageNo: this.tableObject.pageNo
        }, function(response) {
          if (response.success) {
            if (response.data === null) {
              that.tableObject.data = []
              that.tableObject.total = 0
              setTimeout(() => {
                that.tableLoading = false
              }, 1.5 * 1000)
              return
            }
            that.tableObject.data = response.data.data
            that.tableObject.total = response.data.total
            setTimeout(() => {
              that.tableLoading = false
            }, 1.5 * 1000)
          }
        })
      },
      deleteFun(row) {
        var that = this
        this.$confirm('确定删除该科室？', '提示', {
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              this.$http.get(deleteDepart, { id: row.id }, function(response) {
                if (response.success) {
                  that.queryInfoList()
                }
              })
            }
          }
        })
      },
      search() {
        this.resetInfo()
      },
      resetInfo() {
        this.tableObject.data = []
        this.tableObject.pageNo = 1
        this.tableObject.total = 0
        this.tableObject.pageSize = 10
        this.queryInfoList()
      },
      currentPageChange(val) {
        this.tableObject.pageNo = val
        this.queryInfoList()
      },
      editOpenDialogFun(val) {
        this.$refs.openDepartDialog.openDiag(val)
      },
      addOpenDialogFun() {
        this.$refs.openDepartDialog.openDiag()
      }
    }
  }
</script>