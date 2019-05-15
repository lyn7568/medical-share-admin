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
  // import { pageInquireUrl, deleteUrl, inquireContentUrl } from '@/api/content'
  // import { parseTime, contentType } from '@/utils/index'
  // import comTable from '@/utils/comTable'
  // import cacheModule from '@/utils/queryName'
  import editDepart from './editDepart'
  export default {
    data() {
      return {
        searchText: '',
        tableLoading: false,
        tableObject: {
          data: [
            {
              account: '1234',
              name: 'dkjfjds',
              catalog: '2'
            }
          ],
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
      this.publishList()
    },
    components: {
      complexTable,
      editDepart
    },
    methods: {
      publishList() {
        // var that = this
        // this.$http.get(pageInquireUrl, this.info, (response) => {
        //   if (response.success && response.data) {
        //     const res = response.data
        //     const epData = res.data
        //     let j = 0
        //     for (let i = 0; i < epData.length; i++) {
        //       epData[i].modifyTime = parseTime(epData[i].modifyTime).substr(0, 16)
        //       epData[i].catalog = contentType[epData[i].catalog]
        //       j++
        //       cacheModule.Judge(epData[i].creator, info => {
        //         j--
        //         epData[i].creator = info.name
        //         if (j === 0) {
        //           this.total = res.total
        //           if (epData.length === that.info.pageSize) {
        //             this.tableData = epData
        //           } else {
        //             const array = epData
        //             comTable.gapFilling(array)
        //             this.tableData = array
        //           }
        //         }
        //       })
        //     }
        //     if (epData.length === 0) {
        //       this.total = 0
        //       this.tableData = []
        //     }
        //   } else {
        //     this.total = 0
        //     this.tableData = []
        //   }
        // })
      },
      deleteFun(obj) {
        this.$confirm('确定删除该条内容？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // this.$http.get(deleteUrl, { id: obj.id }, response => {
          //   if (response.success) {
          //     if (response.data) {
          //       this.publishList()
          //       this.$message({
          //         message: '删除成功',
          //         type: 'success'
          //       })
          //     } else {
          //       this.$http.get(inquireContentUrl, { id: this.id }, (response) => {
          //         if (response.success && response.data) {
          //           const info = response.data
          //           if (!info.actived) {
          //             this.$message({
          //               message: '该内容已被删除',
          //               type: 'warning'
          //             })
          //           }
          //         }
          //       })
          //     }
          //   }
          // })
        }).catch(() => {

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
      addOpenDialogFun(val) {
        this.$refs.openDepartDialog.openDiag(val)
      }
    }
  }
</script>