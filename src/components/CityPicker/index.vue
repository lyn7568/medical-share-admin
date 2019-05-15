<template>
  <div class="linkage">
    <el-row>
      <el-col :span="12">
        <el-select
          v-model="sheng"
          @change="choseProvince"
          placeholder="省/直辖市">
          <el-option
            v-for="item in citydata"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-select
          v-model="shi"
          @change="choseCity"
          placeholder="所在城市">
          <el-option
            v-for="item in cityArr"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: ['addrCode'],
  data() {
    return {
      // provinceArr: [],
      cityArr: [],
      sheng: '',
      shi: ''
    }
  },
  computed: {
    ...mapGetters([
      'citydata'
    ])
  },
  watch: {
    citydata(val) {
      this.citydata = val
    },
    addrCode(val) {
      var that = this
      setTimeout(() => {
        that.initpsq()
      }, 100)
    }
  },
  created() {
    // var that = this
    // setTimeout(() => {
    //   that.initpsq()
    // }, 100)
  },
  methods: {
    // getCityData: function() {
    //   var that = this
    //   queryDict.applyDict('XZQH', function(dictData) {
    //     if (dictData && dictData.length > 0) {
    //       var data = dictData.sort((obj1, obj2) => {
    //         return obj1.code - obj2.code
    //       })
    //       console.log(dictData)
    //       that.provinceArr = {}
    //       data.map(item => {
    //         if (item.code.match(/0000$/)) {
    //           that.provinceArr[item.code] = { id: item.code, value: item.caption, children: {}}
    //         } else if (item.code.match(/00$/)) {
    //           var p = that.provinceArr[item.code.slice(0, 2) + '0000']
    //           p.children[item.code] = { id: item.code, value: item.caption, children: {}}
    //           if (!p.defaultChild) {
    //             p.defaultChild = p.children[item.code]
    //           }
    //         }
    //         //  else {
    //         //   var pp = that.provinceArr[item.code.slice(0, 2) + '0000'].children[item.code.slice(0, 4) + '00']
    //         //   pp.children[item.code] = { id: item.code, value: item.caption }
    //         //   if (!pp.defaultChild) {
    //         //     pp.defaultChild = pp.children[item.code]
    //         //   }
    //         // }
    //       })
    //     } else {
    //       console.log(dictData.status)
    //     }
    //   })
    // },
    choseProvince: function(e) {
      var p = this.citydata[e]
      this.cityArr = p.children
      this.sheng = p.value
      this.shi = p.defaultChild.value
      this.E = p.defaultChild.id
      this.$emit('paren', this.E)
      this.$emit('parenStr', this.shi)
    },
    choseCity: function(e) {
      var p = this.citydata[e.slice(0, 2) + '0000'].children[e]
      this.E = p.id
      this.shi = p.value
      this.$emit('paren', this.E)
      this.$emit('parenStr', this.shi)
    },
    initpsq: function() {
      if (!this.addrCode) {
        this.sheng = ''
        this.shi = ''
        return
      }
      const s = this.addrCode.substring(0, 2) + '0000'
      const si = this.addrCode.substring(0, 4) + '00'
      if (this.citydata) {
        var p = this.citydata[s]
        this.cityArr = p.children
        this.sheng = p.value
        this.shi = p.children[si].value
      }
    }
  }
}
</script>
