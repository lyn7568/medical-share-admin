<template>
  <el-dialog
    class="dialogClass"
    title="科室管理"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="640px"
    @close="closeForm('formObj')"
  >
    <el-form
      :model="formObj" ref="formObj" :rules="rulesObj"
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
import { requiredTip } from '@/utils'
import { slelectDepartType } from '@/utils/dict'
import { addDepart, updateDepart, checkDepart } from '@/api/api'

export default {
  data() {
    return {
      objId: '',
      dialogFormVisible: false,
      formItem: [
        {
          span: 12,
          prop: 'name',
          tit: '科室名称',
          num: 20,
          required: true
        },
        {
          span: 12,
          prop: 'type',
          tit: '科室类别',
          select: slelectDepartType,
          required: true
        },
        {
          span: 12,
          prop: 'phone',
          tit: '科室电话',
          num: 20
        },
        {
          span: 24,
          prop: 'location',
          tit: '地址',
          num: 200
        },
        {
          span: 24,
          prop: 'descp',
          tit: '科室简介',
          textarea: true,
          num: 2000
        }
      ],
      formLoading: false,
      formObj: {
        name: '',
        type: '',
        phone: '',
        location: '',
        descp: ''
      },
      rulesObj: {}
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
          if (formItem[i].prop === 'name') {
            ru.push({
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入科室名称'))
                } else {
                  var obj = {}
                  if (this.objId) {
                    obj = {
                      active: 1,
                      name: value,
                      id: this.objId
                    }
                  } else {
                    obj = {
                      active: 1,
                      name: value
                    }
                  }
                  this.$http.get(checkDepart, obj, function(res) {
                    if (res.success) {
                      if (res.data) {
                        callback(new Error('该科室名称已存在，请重新输入'))
                      } else {
                        callback()
                      }
                    }
                  })
                }
              },
              trigger: 'blur'
            })
          } else {
            ru.push({
              required: true,
              message: requiredTip(formItem[i].tit),
              trigger: 'blur'
            })
          }
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
          type: '',
          phone: '',
          location: '',
          descp: ''
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
            type: form.type,
            phone: form.phone,
            descp: form.descp,
            location: form.location
          }
          if (that.objId) {
            const paramsId = { id: that.objId }
            const obj = Object.assign(paramsId, paramsData)
            that.$http.post(updateDepart, obj, function(res) {
              if (res.success) {
                that.$message({
                  message: '信息修改成功',
                  type: 'success'
                })
                that.closeForm(formName)
                that.$store.dispatch('getDictDepart')
              }
            })
          } else {
            that.$http.post(addDepart, paramsData, function(res) {
              if (res.success) {
                that.$message({
                  message: '信息添加成功',
                  type: 'success'
                })
                that.closeForm(formName)
                that.$store.dispatch('getDictDepart')
              }
            })
          }
        } else {
          window.scroll(0, 0)
          return false
        }
      })
    }
  }
}
</script>
