<template>
  <el-dialog
    class="dialogClass"
    title="器械管理"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="760px"
  >
    <el-form
      :model="formObj"
      ref="formObj"
      :rules="rulesObj"
      label-width="80px"
      class="update-wrapper demo-ruleForm"
      v-loading="formLoading"
    >
      <el-row :gutter="25">
        <el-col :span="24">
          <el-row :gutter="20" class="update-main">
            <el-col :span="item.span||''" v-for="item in formItem" :key="item.index">
              <el-form-item v-if="item.prop" :label="item.tit" :prop="item.prop">
                <el-input
                  v-if="item.textarea"
                  type="textarea"
                  :rows="8"
                  v-model="formObj[item.prop]"
                  :placeholder="`请填写${item.tit}`"
                  :maxlength="item.num||''"
                ></el-input>
                <el-select v-else-if="item.select" v-model="formObj[item.prop]" placeholder="请选择">
                  <el-option
                    v-for="sel in item.select"
                    :key="sel.value"
                    :label="sel.label"
                    :value="sel.value"
                    @current-change="sel.value"
                  ></el-option>
                </el-select>
                <uploadFile
                  v-else-if="item.upload"
                  :upImgsStr="formObj[item.prop]"
                  :uploadImg="uploadImg"
                  @uploadfun="uploadfun">
                </uploadFile>
                <el-cascader
                  v-else-if="item.cascader"
                  :options="item.cascader"
                  :props="{
                    value: 'value',
                    label: 'label',
                    children: 'children'
                  }"
                  v-model="formObj[item.prop]"
                  :placeholder="'请选择'+item.tit">
                </el-cascader>
                <el-input
                  v-else
                  v-model="formObj[item.prop]"
                  :placeholder="`请填写${item.tit}`"
                  :maxlength="item.num||''"
                ></el-input>
              </el-form-item>
              <el-form-item v-else class="space-form-item"></el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveSubmitInfo">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { requiredTip } from '@/utils'
import uploadFile from '@/components/uploadFile'
import dynamicTags from '@/components/DynamicTags'
export default {
  data() {
    return {
      dialogFormVisible: false,
      formItem: [
        {
          span: 24,
          prop: 'img',
          upload: true
        },
        {
          span: 12,
          prop: 'name',
          tit: '器械姓名',
          num: 20,
          required: true
        },
        {
          span: 12,
          prop: 'titi',
          tit: '使用状态',
          select: this.$parent.useLists
        },
        {
          span: 12,
          prop: 'tit',
          tit: '所属科室',
          num: 20
        },
        {
          span: 12,
          prop: 'tit',
          tit: '厂商型号',
          num: 20
        },
        {
          span: 24,
          prop: 'descp',
          tit: '功能用途',
          textarea: true,
          num: 2000
        },
        {
          span: 24,
          prop: 'descp',
          tit: '器械简介',
          textarea: true,
          num: 2000
        }
      ],
      formLoading: false,
      formObj: {
        name: '',
        logo: '',
        url: '',
        manageOrg: '',
        addr: '',
        location: '',
        zipCode: '',
        servicePhone: '',
        serviceEmail: '',
        operateTime: '',
        linkman: '',
        job: '',
        department: '',
        comp: '',
        linkphone: '',
        linkemail: '',
        descp: ''
      },
      rulesObj: {},
      uploadImg: {
        // url: uploadLogo,
        tip: '上传器械图片',
        width: '180px',
        height: '180px',
        limit: 3
      }
    }
  },
  components: {
    uploadFile,
    dynamicTags
  },
  computed: {
    UID() {
      return this.$store.getters.userid
    }
  },
  created() {
    this.pushRulesFn()
  },
  methods: {
    pushRulesFn() {
      const formItem = this.formItem
      const rulesObj = this.rulesObj
      for (let i = 0; i < formItem.length; ++i) {
        const ru = []
        if (formItem[i].required) {
          ru.push({
            required: true,
            message: requiredTip(formItem[i].tit),
            trigger: 'blur'
          })
        }
        rulesObj[formItem[i].prop] = ru
      }
    },
    openDiag(val) {
      var that = this
      if (val) {
        this.objId = val.id
        this.formObj = val
      } else {
        this.formObj = {
          test: ''
        }
      }
      setTimeout(() => {
        that.dialogFormVisible = true
      }, 1)
    },
    saveSubmitInfo() {
      var that = this
      this.$refs['formObj'].validate(valid => {
        if (valid) {
          const paramsData = {

          }
          // that.$http.post('/esn/add', paramsData, function(res) {
          //   if (res.success) {
          //     that.$message({
          //       message: '信息保存成功',
          //       type: 'success'
          //     })
          //     that.closeDialog()
          //     that.$parent.resetInfo()
          //   }
          // })
        }
      })
    },
    closeDialog() {
      this.$refs['formObj'].resetFields()
      this.dialogFormVisible = false
    },
    uploadfun(value) {
      this.formObj.logo = value
    }
  }
}
</script>
