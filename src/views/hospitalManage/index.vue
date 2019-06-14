<template>
  <div class="app-container">
    <div class="box-container">
      <div class="contain-search">
        <el-input placeholder="搜索医院名称" clearable v-model="searchText" class="input-with-select"></el-input>
        <el-select v-model="selOpt1" clearable placeholder="请选择医院级别">
          <el-option
            v-for="sel in useLists"
            :key="sel.value"
            :label="sel.label"
            :value="sel.value"
            @current-change="sel.value"
          ></el-option>
        </el-select>
        <el-select v-model="selOpt2" clearable placeholder="请选择子级别">
          <el-option
            v-for="sel in useSta"
            :key="sel.value"
            :label="sel.label"
            :value="sel.value"
            @current-change="sel.value"
          ></el-option>
        </el-select>
        <el-select v-model="selOpt2" clearable placeholder="请选择医院类型">
          <el-option
            v-for="sel in useSta2"
            :key="sel.value"
            :label="sel.label"
            :value="sel.value"
            @current-change="sel.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click.stop="search">查找</el-button>
        <el-button type="primary" @click.stop="addOpenDialogFun">创建医院</el-button>
      </div>
    </div>
    <div class="content-container">
      <complex-table
        v-loading="tableLoading"
        :tableObject="tableObject"
        @pageCurFun="currentPageChange"
        @deleteFun="deleteFun"
        @editOpenDialogFun="editOpenDialogFun"
        @resetUserPw="resetUserPw"></complex-table>
    </div>
    <edit-hospital ref="openHospitalDialog"></edit-hospital>
  </div>
</template>

<script>
  import complexTable from '@/components/complexTable'
  import { pageQueryUser, deleteUser, resetPw } from '@/api/api'
  import editHospital from './editHospital'
  import { selectHospitalLevel, selectHospitalSubLevel, selectHospitalType } from '@/utils/dict'
  export default {
    data() {
      return {
        searchText: '',
        selOpt1: '',
        selOpt2: '',
        selOpt3: '',
        tableLoading: false,
        useLists: selectHospitalLevel,
        useSta: selectHospitalSubLevel,
        useSta2: selectHospitalType,
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
              prop: 'account',
              tit: '账号'
            },
            {
              prop: 'name',
              tit: '医院名称'
            },
            {
              prop: 'level',
              tit: '医院级别',
              hLevel: true
            },
            {
              prop: 'subLevel',
              tit: '医院子级别',
              hSubLevel: true
            },
            {
              prop: 'type',
              tit: '医院类型',
              hType: true
            },
            {
              tit: '操作',
              operate: 'edit',
              width: '260'
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
            },
            {
              text: '重置密码',
              event: 'resetUserPw',
              type: 'success'
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
      editHospital
    },
    methods: {
      queryInfoList() {
        var that = this
        this.tableLoading = true
        this.$http.get(pageQueryUser, {
          active: 1,
          name: this.searchText,
          level: this.selOpt1,
          subLevel: this.selOpt2,
          type: this.selOpt3,
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
            response.data.data.find((item, index) => {
              if (item.id === '2319F311BE294CB9A8FBF05F267ED77A') {
                response.data.data.splice(index, 1)
                response.data.total -= 1
              }
            })
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
        this.$confirm('确定删除该医院？', '提示', {
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              this.$http.get(deleteUser, { id: row.id }, function(response) {
                if (response.success) {
                  that.queryInfoList()
                }
              })
            }
          }
        })
      },
      resetUserPw(row) {
        var that = this
        this.$confirm('确定重置密码？', '提示', {
          type: 'success',
          callback: action => {
            if (action === 'confirm') {
              that.$http.post(resetPw, { id: row.id }, function(response) {
                that.$message({
                  message: '密码重置成功',
                  type: 'success'
                })
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
        this.$refs.openHospitalDialog.openDiag(val)
      },
      addOpenDialogFun() {
        this.$refs.openHospitalDialog.openDiag()
      }
    }
  }
</script>