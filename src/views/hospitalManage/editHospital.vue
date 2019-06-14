<template>
  <el-dialog class="dialogClass" title="医院管理" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="860px"
    @close="closeForm('formObj')">
    <el-form :model="formObj" ref="formObj" :rules="rulesObj" label-width="80px" class="update-wrapper demo-ruleForm"
      v-loading="formLoading">
      <el-row :gutter="25">
        <el-col :span="14">
          <el-row :gutter="20" class="update-main">
            <el-col :span="item.span||''" v-for="item in formItem" :key="item.index">
              <el-form-item v-if="item.prop" :label="item.tit" :prop="item.prop">
                <el-input v-if="item.textarea" type="textarea" :rows="8" v-model="formObj[item.prop]" :placeholder="`请填写${item.tit}`"
                  :maxlength="item.num||''"></el-input>
                <cityPicker v-else-if="item.city" @paren="toshow" :addrCode="formObj[item.prop]"></cityPicker>
                <el-select v-else-if="item.select" v-model="formObj[item.prop]" placeholder="请选择">
                  <el-option v-for="item in item.select" :key="item.value" :label="item.label" :value="item.value"
                    @current-change="item.value">
                  </el-option>
                </el-select>
                <el-input v-else v-model="formObj[item.prop]" :placeholder="`请填写${item.tit}`" :maxlength="item.num||''"></el-input>
              </el-form-item>
              <el-form-item v-else class="space-form-item"></el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item align="center">
                <el-button type="primary" @click="submitForm('formObj')">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10">
          <uploadFile :upImgsStr="formObj.image" :uploadImg="uploadImg" @uploadfun="uploadfun"></uploadFile>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import { addRegister, updateRegister, hospitalLogo } from '@/api/api'
  import { requiredTip } from '@/utils'

  import cityPicker from '@/components/CityPicker'
  import uploadFile from '@/components/uploadFile'
  import { selectHospitalLevel, selectHospitalSubLevel, selectHospitalType } from '@/utils/dict'

  export default {
    data() {
      return {
        objId: '',
        dialogFormVisible: false,
        formItem: [
          {
            span: 24,
            prop: 'name',
            tit: '医院名称',
            num: 100,
            required: true
          },
          {
            span: 12,
            prop: 'level',
            tit: '医院级别',
            select: selectHospitalLevel,
            required: true
          },
          {
            span: 12,
            prop: 'subLevel',
            tit: '子级别',
            select: selectHospitalSubLevel,
            required: true
          },
          {
            span: 12,
            prop: 'type',
            tit: '医院类型',
            select: selectHospitalType,
            required: true
          },
          {
            span: 12,
            prop: 'phone',
            tit: '电话',
            num: 20,
            required: true
          },
          {
            span: 24,
            prop: 'addr',
            city: true,
            tit: '地址',
            required: true
          },
          {
            span: 24,
            prop: 'location',
            tit: '详细地址',
            num: 100,
            required: true
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
          name: '',
          level: '',
          subLevel: '',
          type: '',
          phone: '',
          addr: '',
          location: '',
          descp: '',
          image: ''
        },
        rulesObj: {},
        uploadImg: {
          url: hospitalLogo,
          tip: '上传图片',
          width: '280px',
          height: '200px'
        }
      }
    },
    components: {
      cityPicker,
      uploadFile
    },
    created() {
      this.pushRulesFn()
    },
    methods: {
      openDiag(val) {
        var that = this
        if (val) {
          this.objId = val.id
          this.formObj = val
        } else {
          this.objId = ''
          this.formObj = {
            name: '',
            level: '',
            subLevel: '',
            type: '',
            phone: '',
            addr: '',
            location: '',
            descp: '',
            image: ''
          }
        }
        setTimeout(() => {
          that.dialogFormVisible = true
        }, 1)
      },
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
              level: form.level,
              subLevel: form.subLevel,
              type: form.type,
              phone: form.phone,
              descp: form.descp,
              addr: form.addr,
              location: form.location,
              image: form.image
            }
            if (that.objId) {
              const paramsId = { id: that.objId }
              const obj = Object.assign(paramsId, paramsData)
              that.$http.post(updateRegister, obj, function(res) {
                if (res.success) {
                  that.$message({
                    message: '信息修改成功',
                    type: 'success'
                  })
                  that.closeForm(formName)
                }
              })
            } else {
              that.$http.post(addRegister, paramsData, function(res) {
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
      toshow(value) {
        this.formObj.addr = value
      }
    }
  }
</script>