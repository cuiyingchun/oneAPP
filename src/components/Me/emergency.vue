<template>
  <div class="emergency">
    <div class="top">
      <span @click="goback()"><i class="icon-back"></i>返回</span>
      紧急救援求助
    </div>
    <div class="content">
      <div class="info">
        <span>求救对象:</span>
        <input type="button" value="选择通讯录好友" id="friends" @click="choiceFri">
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {}
    },
    methods: {
      goback(){
        this.$router.replace("/mePro")
      },
      choiceFri(){
        this.$router.replace("/mePro/choicefri")
      }
    }
  }
</script>

<style>
  .emergency .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .emergency .top span{
    position: absolute;
    left: 0;
  }
  .info {
    width: 94%;
    margin: 4rem auto;
    height: 3rem;
    line-height: 3rem;
  }
  #friends{
    border: 1px solid #e4e4e4;
    background-color: #fff;
    width:85%;
    line-height: 3rem;
    height: 3rem;
    margin-left: 10px;
  }
 #friends:active{
   background-color: #cfd3d6;
 }
</style>
