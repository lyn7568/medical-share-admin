<template>
  <div class="app-container">
    <div class="box-container">
      <div class="contain-search">
        <el-input placeholder="搜索医院名称" clearable v-model="searchText" class="input-with-select"></el-input>
        <el-select v-model="useState" clearable placeholder="请选择医院级别">
          <el-option
            v-for="sel in useLists"
            :key="sel.value"
            :label="sel.label"
            :value="sel.value"
            @current-change="sel.value"
          ></el-option>
        </el-select>
        <el-select v-model="useSta1" clearable placeholder="请选择子级别">
          <el-option
            v-for="sel in useSta"
            :key="sel.value"
            :label="sel.label"
            :value="sel.value"
            @current-change="sel.value"
          ></el-option>
        </el-select>
        <el-select v-model="useSta3" clearable placeholder="请选择医院类型">
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
  // import { pageInquireUrl, deleteUrl, inquireContentUrl } from '@/api/content'
  // import { parseTime, contentType } from '@/utils/index'
  // import comTable from '@/utils/comTable'
  // import cacheModule from '@/utils/queryName'
  import editDoctor from './editDoctor'
  export default {
    data() {
      return {
        searchText: '',
        tableLoading: false,
        useLists: [
          { label: '一级', value: '1' },
          { label: '二级', value: '2' },
          { label: '三级', value: '3' }
        ],
        useSta: [
          { label: '特等', value: '1' },
          { label: '甲等', value: '2' },
          { label: '乙等', value: '3' },
          { label: '丙等', value: '4' },
        ],
        useSta2: [
          { label: '综合医院', value: '1' },
          { label: '心血管医院', value: '2' },
          { label: '妇产医院', value: '3' },
          { label: '儿童医院', value: '4' },
          { label: '口腔医院', value: '5' },
          { label: '肿瘤医院', value: '6' },
          { label: '传染病医院', value: '7' },
          { label: '精神病医院', value: '8' },
          { label: '其他专科医院', value: '9' },
        ],
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
              prop: 'catalog',
              tit: '医院级别'
            },
            {
              prop: 'title',
              tit: '医院子级别'
            },
            {
              prop: 'title',
              tit: '医院类型'
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
            },
            {
              text: '重置密码',
              event: 'deleteFun',
              type: 'success'
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
      editDoctor
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
        this.$refs.openDoctorDialog.openDiag(val)
      },
      addOpenDialogFun(val) {
        this.$refs.openDoctorDialog.dialogFormVisible = true;
      }
    }
  }
</script>