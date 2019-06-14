<template>
  <div class="app-container">
    <div class="content-container">
      <div class="main-info">
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
      </div>
    </div>
  </div>
</template>

<script>
import { queryRegister, updateRegister, hospitalLogo } from '@/api/api'
import { requiredTip } from '@/utils'

import cityPicker from '@/components/CityPicker'
import uploadFile from '@/components/uploadFile'
import { selectHospitalLevel, selectHospitalSubLevel, selectHospitalType } from '@/utils/dict'

export default {
  data() {
    return {
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
  computed: {
    objId() {
      return this.$store.getters.userid
    }
  },
  created() {
    this.pushRulesFn()
    this.getCurrentInfo()
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
    getCurrentInfo() {
      var that = this
      that.$http.get(queryRegister, {
        id: that.objId
      }, function(res) {
        that.formLoading = false
        if (res.success) {
          const obj = res.data
          that.formObj = obj
        }
      })
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
            image: form.image,
            id: that.objId
          }
          that.$http.post(updateRegister, paramsData, function(res) {
            if (res.success) {
              that.$message({
                message: '信息修改成功',
                type: 'success'
              })
            }
          })
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
