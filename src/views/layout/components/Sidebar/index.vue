<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      background-color="#00837e"
      text-color="#bfcbd9"
      active-text-color="#fff"
      :collapse="isCollapse"
    >
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    routes() {
      // return this.$router.options.routes
      return this.$store.getters.permission_routers
    },
    isCollapse() {
      return !this.$store.state.app.sidebar.opened
    }
  }
}
</script>
