<template>
  <div class="trend-send">
    <div class="top">
      <span @click="toShareT"><i class="icon-back"></i>返回</span>
      共享对象
      <a style="position: absolute;right: 0.8rem;" @click="tsDefault">OK</a>
    </div>
    <chooseMembers type="ts"></chooseMembers>
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
      toShareT(){
        this.$router.replace("/mePro/shareTrend");
      },
      tsDefault(){
        /*let dbGroup = new DB('group');
        dbGroup.remove({type :"tsDefault"}, function(err){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('tsDefault has be removed');
          }
        });*/
        this.$router.replace("/handle");
      },
    }
  }
</script>

<style>
  .trend-send .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .trend-send .top span{
    position: absolute;
    left: 0;
  }
</style>
