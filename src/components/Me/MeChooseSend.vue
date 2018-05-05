<template>
  <div class="emergency-send">
    <div class="top">
      <span @click="toMePro"><i class="icon-back"></i>返回</span>
      紧急救援求助对象
      <a style="position: absolute;right: 0.8rem;" @click="sosDefault">OK</a>
    </div>
    <chooseMembers type="sos"></chooseMembers>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {DB} from '@/assets/js/db';
  import chooseMembers from './chooseMembers.vue'
  export default{
    data(){
      return{
      }
    },
    components:{
      chooseMembers
    },
    methods:{
      toMePro(){
        this.$router.replace("/MePro");
      },
      sosDefault(){
        /*let dbGroup = new DB('group');
        dbGroup.remove({type :"sosDefault"}, function(err){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('sosDefault has be removed');
          }
        });*/
        this.$router.replace("/handle");
      },
    }
  }
</script>

<style>
  .emergency-send .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .emergency-send .top span{
    position: absolute;
    left: 0;
  }
</style>
