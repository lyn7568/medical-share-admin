<template>
  <div class="app-container">
    <div class="box-container">
      <div class="contain-search">
        <el-input placeholder="搜索医生姓名" clearable v-model="searchText" class="input-with-select"></el-input>
        <el-input placeholder="搜索所属科室" clearable v-model="selOpt1" class="input-with-select"></el-input>
        <el-button type="primary" @click.stop="search">查找</el-button>
        <el-button type="primary" @click.stop="addOpenDialogFun">添加医生</el-button>
      </div>
    </div>
    <div class="content-container">
      <complex-table :tableObject="tableObject"
        @pageCurFun="currentPageChange"
        @deleteFun="deleteFun"
        @editOpenDialogFun="editOpenDialogFun"></complex-table>
    </div>
    <edit-doctor ref="openDoctorDialog"></edit-doctor>
  </div>
</template>

<script>
  import complexTable from '@/components/complexTable'
  import { pageQueryDoctor, deleteDoctor } from '@/api/api'
  import editDoctor from './editDoctor'
  export default {
    data() {
      return {
        searchText: '',
        selOpt1: '',
        tableLoading: false,
        tableObject: {
          data: [],
          pageNo: 1,
          total: 0,
          pageSize: 10,
          arr: [
            {
              prop: 'account',
              tit: '账号'
            },
            {
              prop: 'name',
              tit: '医生姓名'
            },
            {
              prop: 'department',
              tit: '所属科室',
              dCur: true
            },
            {
              prop: 'clinicalTitle',
              tit: '临床职称',
              cTitle: true
            },
            {
              prop: 'teachTitle',
              tit: '教学职称',
              tTitle: true
            },
            {
              prop: 'position',
              tit: '行政职务'
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
      editDoctor
    },
    methods: {
      queryInfoList() {
        var that = this
        this.tableLoading = true
        this.$http.get(pageQueryDoctor, {
          active: 1,
          name: this.searchText,
          department: this.selOpt1,
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
        this.$confirm('确定删除该医生？', '提示', {
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              this.$http.get(deleteDoctor, { id: row.id }, function(response) {
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
        this.queryInfoList()
      },
      currentPageChange(val) {
        this.tableObject.pageNo = val
        this.queryInfoList()
      },
      editOpenDialogFun(val) {
        this.$refs.openDoctorDialog.openDiag(val)
      },
      addOpenDialogFun() {
        this.$refs.openDoctorDialog.openDiag()
      }
    }
  }
</script>