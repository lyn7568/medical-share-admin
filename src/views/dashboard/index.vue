<template>
  <div class="dashboard-container">首页</div>
</template>

<script>
export default {
  name: 'dashboard',
  created() {
    if (this.$store.getters.roles.indexOf('1') >= 0) {
      this.$router.push({ name: 'hospitalManage' })
    } else {
      this.$router.push({ name: 'doctorManage' })
    }
  }
}
</script>
