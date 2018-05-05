<template>
  <div>
    <div
      :bos-loading-text="loadingText" v-loading.fullscreen.lock="loadingFullScreen">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    data() {
      return {
        loadingFullScreen: true,
        loadingText: '正在加载中...',
      }
    },
    mounted() {
      GeoBOS.onError = function (err) {
        console.log(err.message);
      };
      GeoBOS.onReady = () => {
        console.log('ready');
        let dbGroup = GeoBOS.db.create('group');
        this.loadingFullScreen = false;
        this.$router.replace("/main");
      };
      let options = {
        appId: "bos.iecas.app", //指定应用唯一ID,确保该字段唯一性
      };
      GeoBOS.init(options);

      /*this.loadingFullScreen = false;
      this.$router.replace("/main");*/
    }
  }
</script>

<style>

</style>
