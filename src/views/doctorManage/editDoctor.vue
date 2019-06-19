<template>
  <el-dialog
    class="dialogClass"
    title="医生管理"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="closeForm('formObj')"
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
        <el-col :span="16">
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
                <dynamicTags
                  v-else-if="item.tag"
                  :tagInfo="item.tag"
                  :dyStr="dyStrArr"
                  @turnTags="turnTags($event)"
                ></dynamicTags>
                <el-cascader
                  v-else-if="item.cascader"
                  :options="item.cascader"
                  :props="{
                    value: 'value',
                    label: 'label',
                    children: 'children'
                  }"
                  v-model="formObj[item.prop]"
                  :placeholder="'请选择'+item.tit" @change="changeCascader">
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
        <el-col :span="8">
          <uploadFile :upImgsStr="formObj.image" :uploadImg="uploadImg" @uploadfun="uploadfun"></uploadFile>
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
import { addDoctor, updateDoctor, doctorLogo, checkDoctor } from '@/api/api'
import { requiredTip, strToArr, arrToStr } from '@/utils'
import uploadFile from '@/components/uploadFile'
import dynamicTags from '@/components/DynamicTags'
import { slelectTeachTitle, slelectClinicalTitle } from '@/utils/dict'
export default {
  data() {
    return {
      objId: '',
      dialogFormVisible: false,
      formItem: [
        {
          span: 12,
          prop: 'account',
          tit: '账号',
          num: 20,
          required: true
        },
        {
          span: 12,
          prop: 'name',
          tit: '医生姓名',
          num: 20,
          required: true
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
          prop: 'clinicalTitle',
          tit: '临床职称',
          cascader: slelectClinicalTitle
        },
        {
          span: 12,
          prop: 'teachTitle',
          tit: '教学职称',
          select: slelectTeachTitle
        },
        {
          span: 12,
          prop: 'position',
          tit: '行政职务',
          num: 20
        },
        {
          span: 24,
          prop: 'direction',
          tit: '擅长方向',
          tag: {
            lableTit: '擅长方向',
            placeholder: '请填写擅长方向 例如：冠心病、高血压、糖尿病',
            limitCount: 15,
            tagsNum: 20
          }
        },
        {
          span: 24,
          prop: 'descp',
          tit: '医院简介',
          textarea: true,
          num: 2000
        }
      ],
      formLoading: false,
      formObj: {
        account: '',
        name: '',
        department: '',
        clinicalTitle: [],
        teachTitle: '',
        position: '',
        direction: '',
        descp: '',
        image: ''
      },
      rulesObj: {},
      uploadImg: {
        url: doctorLogo,
        tip: '上传图片',
        width: '220px',
        height: '220px'
      },
      dyStrArr: []
    }
  },
  computed: {
    departList() {
      return this.$store.getters.departArrs
    }
  },
  components: {
    uploadFile,
    dynamicTags
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
          if (formItem[i].prop === 'account') {
            ru.push({
              required: true,
              validator: (rule, value, callback) => {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
                if (!value) {
                  callback(new Error('请输入账户'))
                } else {
                  if (!reg.test(value)) {
                    callback(new Error('请输入手机号码账号'))
                  } else {
                    var obj = {}
                    if (this.objId) {
                      obj = {
                        active: 1,
                        account: value,
                        id: this.objId
                      }
                    } else {
                      obj = {
                        active: 1,
                        account: value
                      }
                    }
                    this.$http.get(checkDoctor, obj, function(res) {
                      if (res.success) {
                        if (res.data) {
                          callback(new Error('账户已存在，请重新输入'))
                        } else {
                          callback()
                        }
                      }
                    })
                  }
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
        this.formObj = {
          account: val.account,
          name: val.name,
          department: val.department,
          clinicalTitle: [],
          teachTitle: val.teachTitle,
          position: val.position,
          direction: val.direction,
          descp: val.descp,
          image: val.image
        }
        if (val.clinicalTitle) {
          this.formObj.clinicalTitle = strToArr(val.clinicalTitle)
        }
        if (val.direction) {
          this.dyStrArr = strToArr(val.direction)
        }
      } else {
        this.objId = ''
        this.dyStrArr = []
        this.formObj = {
          account: '',
          name: '',
          department: '',
          clinicalTitle: [],
          teachTitle: '',
          position: '',
          direction: '',
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
            account: form.account,
            department: form.department,
            clinicalTitle: arrToStr(form.clinicalTitle),
            teachTitle: form.teachTitle,
            position: form.position,
            direction: form.direction,
            descp: form.descp,
            image: form.image
          }
          if (that.objId) {
            const paramsId = { id: that.objId }
            const obj = Object.assign(paramsId, paramsData)
            that.$http.post(updateDoctor, obj, function(res) {
              if (res.success) {
                that.$message({
                  message: '信息修改成功',
                  type: 'success'
                })
                that.closeForm(formName)
              }
            })
          } else {
            that.$http.post(addDoctor, paramsData, function(res) {
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
    },
    turnTags(value) {
      this.formObj.direction = value
    },
    changeCascader(val) {
      // this.formObj.clinicalTitle = val
    }
  }
}
</script>
