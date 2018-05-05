<template>
  <div>
    <bos-button type="primary" class="quit-common" @click="flotQuit">退出</bos-button>
  </div>
</template>
<script>
  //import {Hub} from "../../../assets/js/hub";
  export default{
      methods:{
        flotQuit(){
          $("#plotview").hide();
          $("#handle").show();
          $(".plot-box").show();
          $(".plot-box111").hide();
          this.$store.state.showTemp = false;
          //Hub.$emit('tip', ['common', 'message'])
        }
      }
  }
</script>
