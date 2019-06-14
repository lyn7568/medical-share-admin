<template>
  <div class="app-container">
    <div class="box-container">
      <div class="contain-search">
        <el-input placeholder="搜索器械名称" clearable v-model="searchText" class="input-with-select"></el-input>
        <el-select v-model="useState" clearable placeholder="请选择使用状态">
          <el-option
            v-for="sel in useLists"
            :key="sel.value"
            :label="sel.label"
            :value="sel.value"
            @current-change="sel.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click.stop="search">查找</el-button>
        <el-button type="primary" @click.stop="addOpenDialogFun">添加器械</el-button>
      </div>
    </div>
    <div class="content-container">
      <complex-table :tableObject="tableObject"
        @pageCurFun="currentPageChange"
        @deleteFun="deleteFun"
        @editOpenDialogFun="editOpenDialogFun"></complex-table>
    </div>
    <edit-apply ref="openApplyDialog"></edit-apply>
  </div>
</template>

<script>
  import { pageQueryApply, deleteApply } from '@/api/api'
  import complexTable from '@/components/complexTable'
  import editApply from './editApply'
  import { slelectUseStatus } from '@/utils/dict'
  export default {
    data() {
      return {
        searchText: '',
        useState: '',
        useLists: slelectUseStatus,
        tableLoading: false,
        tableObject: {
          data: [],
          pageNo: 1,
          total: 0,
          pageSize: 10,
          arr: [
            {
              prop: 'name',
              tit: '器械姓名'
            },
            {
              prop: 'department',
              tit: '所属科室',
              dCur: true
            },
            {
              prop: 'status',
              tit: '使用状态',
              aStatus: true
            },
            {
              prop: 'spec',
              tit: '厂商型号'
            },
            {
              prop: 'application',
              tit: '用途功能',
              width: '260'
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
      editApply
    },
    methods: {
      queryInfoList() {
        var that = this
        this.tableLoading = true
        this.$http.get(pageQueryApply, {
          active: 1,
          name: this.searchText,
          status: this.useState,
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
        this.$confirm('确定删除该器械？', '提示', {
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              this.$http.get(deleteApply, { id: row.id }, function(response) {
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
        this.$refs.openApplyDialog.openDiag(val)
      },
      addOpenDialogFun() {
        this.$refs.openApplyDialog.openDiag()
      }
    }
  }
</script>