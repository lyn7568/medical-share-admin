<template>
  <div class="app-container">
    <div class="content-container">
      <div class="main-info">
        <el-form
          :model="formObj"
          ref="formObj"
          :rules="rulesObj"
          label-width="80px"
          class="update-wrapper demo-ruleForm"
          v-loading="formLoading"
        >
          <el-row :gutter="25">
            <el-col :span="14">
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
                    <cityPicker v-else-if="item.city" @paren="toshow" :addrCode="formObj[item.prop]"></cityPicker>
                    <el-select v-else-if="item.select" v-model="formObj[item.prop]" placeholder="请选择">
                      <el-option
                        v-for="item in item.select"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        @current-change="item.value">
                      </el-option>
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
                <el-col :span="24">
                  <el-form-item align="center">
                    <el-button type="primary" @click="submitForm('formObj')">保存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="10">
              <uploadFile :upImgsStr="formObj.logo" :uploadImg="uploadImg" @uploadfun="uploadfun"></uploadFile>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
//   import {
//     addCompany,
//     updateCompany,
//     queryCompanyOne,
//     queryCompKeyword,
//     uploadCompanyLogo
//   } from '@/api/companyCen'

//   import queryDict from '@/utils/queryDict'
import { requiredTip } from '@/utils'

import cityPicker from '@/components/CityPicker'
import uploadFile from '@/components/uploadFile'

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
          prop: 'size',
          tit: '医院级别',
          select: [
            { label: '一级', value: '1' },
            { label: '二级', value: '2' },
            { label: '三级', value: '3' }
          ],
          required: true
        },
        {
          span: 12,
          prop: 'size',
          tit: '子级别',
          select: [
            { label: '特等', value: '1' },
            { label: '甲等', value: '2' },
            { label: '乙等', value: '3' },
            { label: '丙等', value: '4' }
          ],
          required: true
        },
        {
          span: 12,
          prop: 'size',
          tit: '医院类型',
          select: [
            { label: '特等', value: '1' },
            { label: '甲等', value: '2' },
            { label: '乙等', value: '3' },
            { label: '丙等', value: '4' }
          ],
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
          tit: '所在城市',
          required: true
        },
        {
          span: 24,
          prop: 'location',
          tit: '详细地址',
          num: 50
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
    // if (urlParse('id')) {
    //   this.companyId = urlParse('id')
    //   this.formLoading = true
    //   this.getCompanyInfo()
    // }
    // this.getDictoryData()
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
    //   getDictoryData() {
    //     const that = this
    //     queryDict.applyDict('QYGM', function(dictData) {
    //       dictData.map(item => {
    //         that.numRanger.push({ value: item.code, label: item.caption })
    //       })
    //     }) // 企业规模
    //     queryDict.applyDict('QYLX', function(dictData) {
    //       dictData.map(item => {
    //         that.compType.push({ value: item.code, label: item.caption })
    //       })
    //     }) // 企业类型
    //   },
    //   getCompanyInfo() {
    //     var that = this
    //     that.$http.get(queryCompanyOne, {
    //       id: that.companyId
    //     }, function(res) {
    //       that.formLoading = false
    //       if (res.success) {
    //         const obj = res.data
    //         that.formObj = obj
    //         that.addrCur = obj.addr
    //       }
    //     })
    //   },
    //   submitForm(formName) {
    //     var that = this
    //     that.$refs[formName].validate((valid) => {
    //       if (valid) {
    //         const form = that.formObj
    //         const paramsData = {
    //           name: form.name,
    //           logo: form.logo,
    //           type: form.type,
    //           size: form.size,
    //           foundYear: form.foundYear,
    //           descp: form.descp,
    //           url: form.url,
    //           addr: form.addr,
    //           location: form.location,
    //           zipCode: form.zipCode,
    //           servicePhone: form.servicePhone,
    //           serviceEmail: form.serviceEmail,
    //           operateTime: form.operateTime,
    //           linkman: form.linkman,
    //           linkphone: form.linkphone,
    //           linkemail: form.linkemail,
    //           industry: JSON.stringify(form.industry),
    //           subject: JSON.stringify(form.subject),
    //           qualification: JSON.stringify(form.qualification),
    //           fieldOfSupplier: JSON.stringify(form.fieldOfSupplier),
    //           fieldOfCustomer: JSON.stringify(form.fieldOfCustomer)
    //         }
    //         if (that.companyId) {
    //           const paramsId = { id: that.companyId }
    //           const obj = Object.assign(paramsId, paramsData)
    //           that.$http.put(updateCompany, obj, function(res) {
    //             if (res.success) {
    //               that.$message({
    //                 message: '企业信息修改成功',
    //                 type: 'success'
    //               })
    //               that.$router.push({ name: 'noactiveList' })
    //             }
    //           })
    //         } else {
    //           that.$http.post(addCompany, paramsData, function(res) {
    //             if (res.success) {
    //               that.$message({
    //                 message: '企业信息添加成功',
    //                 type: 'success'
    //               })
    //               that.$router.push({ name: 'noactiveList' })
    //             }
    //           })
    //         }
    //       } else {
    //         window.scroll(0, 0)
    //         return false
    //       }
    //     })
    //   },
    uploadfun(value) {
      this.formObj.logo = value
    },
    toshow(value) {
      this.formObj.addr = value
    }
  }
}
</script>
