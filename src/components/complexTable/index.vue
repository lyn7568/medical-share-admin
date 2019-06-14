<template>
  <div class="tableClass">
    <el-table
      ref="tableBody"
      border
      :data="tableObject.data"
      :height="tableHeight"
    >
      <el-table-column
        v-for="item in tableObject.arr"
        :key="item.index"
        :prop="item.prop ? item.prop : ''"
        :label="item.tit ? item.tit : ''"
        :width="item.width ? item.width : ''"
        align="center"
        :className="item.active"
      >
        <template slot-scope="scope">
          <template v-if="scope.row[item.prop]">
            <div v-if="item.hLevel">{{scope.row[item.prop] | hLevel }}</div>
            <div v-else-if="item.hSubLevel">{{scope.row[item.prop] | hSubLevel }}</div>
            <div v-else-if="item.hType">{{scope.row[item.prop] | hType }}</div>
            <div v-else-if="item.aStatus">{{scope.row[item.prop] | aStatus }}</div>
            <div v-else-if="item.tTitle">{{scope.row[item.prop] | tTitle }}</div>
            <div v-else-if="item.cTitle">{{scope.row[item.prop] | cTitle }}</div>
            <div v-else-if="item.dCur">{{scope.row[item.prop] | dCur }}</div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
          <div v-else-if="item.operate && typeof scope.row === 'object'">
            <el-button
              size="mini"
              v-for="operate in tableObject.oFun"
              :type="operate.type"
              :key="operate.index"
              @click="$emit(operate.event, scope.row)"
            >
             {{operate.text}}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="tableObject.pageNo"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="tableObject.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="tableObject.total"
      ></el-pagination>
    </div>
  </div>
</template>


<script>
export default {
  name: 'complexTable',
  props: {
    tableObject: {
      type: Object
    }
  },
  data() {
    return {
      tableHeight: 200
    }
  },
  mounted() {
    var that = this
    setTimeout(() => {
      that._reHeight()
    }, 100)
    window.addEventListener('resize', that._reHeight)
  },
  methods: {
    _reHeight() {
      this.tableHeight = window.innerHeight - this.$refs.tableBody.$el.offsetTop - 210
    },
    handleCurrentChange(val) {
      this.$emit('pageCurFun', val)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._reHeight)
  }
}
</script>
