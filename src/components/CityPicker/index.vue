<template>
  <div class="linkage">
    <el-row>
      <el-col :span="8">
        <el-select
          v-model="sheng"
          @change="choseProvince"
          placeholder="省">
          <el-option
            v-for="item in citydata"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select
          v-model="shi"
          @change="choseCity"
          placeholder="市">
          <el-option
            v-for="item in cityArr"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select
          v-model="qu"
          @change="choseBlock"
          placeholder="区(县)">
          <el-option
            v-for="item in blockArr"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
  <!-- <el-cascader :options="citydata" 
    :props="{
      value: 'id',
      label: 'value',
      children: 'children'
    }">
    <template slot-scope="{ node, data }">
      <span>{{ data.caption }}</span>
      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
    </template>
  </el-cascader> -->
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: ['addrCode'],
  data() {
    return {
      cityArr: [],
      blockArr: [],
      sheng: '',
      shi: '',
      qu: ''
    }
  },
  computed: {
    ...mapGetters([
      'citydata'
    ])
  },
  created() {
    this.initpsq()
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
  methods: {
    choseProvince: function(e) {
      var p = this.citydata[e]
      this.cityArr = p.children
      this.sheng = p.value
      this.shi = ''
      this.qu = ''
      this.shi = p.defaultChild.value
      this.qu = p.defaultChild.defaultChild.value
      this.E = p.defaultChild.defaultChild.id
      this.$emit('paren', this.E)
      // this.$emit('parenStr', this.shi)
    },
    choseCity: function(e) {
      var p = this.citydata[e.slice(0, 2) + '0000'].children[e]
      this.blockArr = p.children
      this.shi = p.value
      this.qu = p.defaultChild.value
      this.E = p.defaultChild.id
      this.$emit('paren', this.E)
      // this.$emit('parenStr', this.shi)
    },
    choseBlock: function(e) {
      this.qu = this.citydata[e.slice(0, 2) + '0000'].children[e.slice(0, 4) + '00'].children[e].value
      this.E = e
      this.$emit('paren', this.E)
    },
    initpsq: function() {
      if (!this.addrCode) {
        this.sheng = ''
        this.shi = ''
        this.qu = ''
        return
      }
      const s = this.addrCode.substring(0, 2) + '0000'
      const si = this.addrCode.substring(0, 4) + '00'
      const x = this.addrCode
      if (this.citydata) {
        var p = this.citydata[s]
        this.sheng = p.value
        if (p.children) {
          this.cityArr = p.children
          if (p.children[si]) {
            this.shi = p.children[si].value
            if (p.children[si].children) {
              this.blockArr = p.children[si].children
              if (p.children[si].children[x]) {
                this.qu = p.children[si].children[x].value
              }
            }
          }
        }
      }
    }
  }
}
</script>
