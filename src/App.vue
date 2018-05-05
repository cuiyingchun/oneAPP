<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <dial style="width: 100%;position: fixed;top: 0;bottom: 0;z-index: 20001;background: #fff;" v-if="$store.state.call.showDial"></dial>
  </div>
</template>

<script>
  import Dial from '@/components/call/dial';
export default {
  name: 'app',
  components:{
    Dial
  }
}
</script>

<style>
 /*#app{*/
   /*position: absolute;*/
   /*width: 100%;*/
   /*height: 100%;*/
 /*}*/
</style>
