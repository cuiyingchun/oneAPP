<template>
<div>
</div>
</template>

<script>
  import router from '../router';
  export default {
    name: 'main',
    data () {
      return {
      }
    },
    mounted() {
      this.$router.replace("/choice");
    },
    router: router
  }
</script>
<style scoped>

</style>
