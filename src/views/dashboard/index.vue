<template>
  <div class="dashboard-container"></div>
</template>

<script>
export default {
  name: 'dashboard',
  created() {
    this.$router.push({ name: 'doctorManage' })
  }
}
</script>
