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
                <el-select
                  v-else-if="item.selectSearch"
                  v-model="formObj[item.prop]"
                  :placeholder="'请选择'+item.tit">
                  <el-option
                    v-for="sel in departList"
                    :key="sel.id"
                    :label="sel.name"
                    :value="sel.id">
                  </el-option>
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
      <el-button type="primary" @click="submitForm('formObj')">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addApply, updateApply, applyLogo } from '@/api/api'
import { requiredTip } from '@/utils'
import uploadFile from '@/components/uploadFile'
export default {
  data() {
    return {
      dialogFormVisible: false,
      formItem: [
        {
          span: 24,
          prop: 'image',
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
          prop: 'status',
          tit: '使用状态',
          select: this.$parent.useLists
        },
        {
          span: 12,
          prop: 'department',
          tit: '所属科室',
          num: 20,
          selectSearch: true,
          required: true
        },
        {
          span: 12,
          prop: 'spec',
          tit: '厂商型号',
          num: 20
        },
        {
          span: 24,
          prop: 'application',
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
        status: '',
        department: '',
        spec: '',
        application: '',
        descp: '',
        image: ''
      },
      rulesObj: {},
      uploadImg: {
        url: applyLogo,
        tip: '上传器械图片',
        width: '180px',
        height: '180px',
        limit: 3
      }
    }
  },
  components: {
    uploadFile
  },
  computed: {
    departList() {
      return this.$store.getters.departArrs
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
        this.objId = ''
        this.formObj = {
          name: '',
          status: '',
          department: '',
          spec: '',
          application: '',
          descp: '',
          image: ''
        }
      }
      setTimeout(() => {
        that.dialogFormVisible = true
      }, 1)
    },
    closeForm(formName) {
      this.$refs[formName].resetFields()
      this.formObj.image = ''
      this.$parent.resetInfo()
      this.dialogFormVisible = false
    },
    submitForm(formName) {
      var that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          const form = that.formObj
          const paramsData = {
            name: form.name,
            status: form.status,
            spec: form.spec,
            application: form.application,
            department: form.department,
            descp: form.descp,
            image: form.image
          }
          if (that.objId) {
            const paramsId = { id: that.objId }
            const obj = Object.assign(paramsId, paramsData)
            that.$http.post(updateApply, obj, function(res) {
              if (res.success) {
                that.$message({
                  message: '信息修改成功',
                  type: 'success'
                })
                that.closeForm(formName)
              }
            })
          } else {
            that.$http.post(addApply, paramsData, function(res) {
              if (res.success) {
                that.$message({
                  message: '信息添加成功',
                  type: 'success'
                })
                that.closeForm(formName)
              }
            })
          }
        } else {
          window.scroll(0, 0)
          return false
        }
      })
    },
    uploadfun(value) {
      this.formObj.image = value
    }
  }
}
</script>
