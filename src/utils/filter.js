import Vue from 'vue'
import { strToArr, arrToStr } from '@/utils'
import store from '@/store'
import { selectHospitalLevel, selectHospitalSubLevel, selectHospitalType, slelectUseStatus, slelectTeachTitle, slelectClinicalTitle } from './dict.js'

Vue.filter('hLevel', function(val) {
  const w = selectHospitalLevel.find(item => {
    return item.value === val
  })
  return w.label
})
Vue.filter('hSubLevel', function(val) {
  const w = selectHospitalSubLevel.find(item => {
    return item.value === val
  })
  return w.label
})
Vue.filter('hType', function(val) {
  const w = selectHospitalType.find(item => {
    return item.value === val
  })
  return w.label
})
Vue.filter('aStatus', function(val) {
  const w = slelectUseStatus.find(item => {
    return item.value === val
  })
  return w.label
})
Vue.filter('tTitle', function(val) {
  const w = slelectTeachTitle.find(item => {
    return item.value === val
  })
  return w.label
})
Vue.filter('cTitle', function(val) {
  var labV = []
  if (val) {
    const arr = strToArr(val)
    slelectClinicalTitle.find(item => {
      if (item.value === arr[0]) {
        labV.push(item.label)
        item.children.find(tt => {
          if (tt.value === arr[1]) {
            labV.push(tt.label)
          }
        })
      }
    })
  }
  return arrToStr(labV, '/')
})
Vue.filter('dCur', function(val) {
  const w = store.getters.departArrs.find(item => {
    return item.id === val
  })
  return w.name
})
