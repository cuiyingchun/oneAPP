<template>
  <div class="tm" style="margin-top: 1rem">
    <header class="hd"><span @click="toCommunication"><i class="icon-back"></i>返回</span><h1>关于</h1></header>
    <div class="content">
      <img src="../../../../static/images/im_ic_launcher.png">
      <span>通讯应用软件V1.0.0</span><br/><br/><br/>
      <label>中国电子科技集团公司第五十四研究所版权所有</label><br/>
      <a>版本更新检测</a>
    </div>
  </div>
</template>

<script>
  import * as actionTypes from "@/store/actions-types";
  export default {
    data () {
      return {
      }
    },
    mounted(){
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    methods: {
      toCommunication(){
        this.$router.replace("/me");
      }
    }
  }
</script>
<style>
  .tm{
    padding: 0;
    font-size: 1.2rem;
    background: #ffffff;
  }
  .tm .hd{
    text-align: center;
    /*position: absolute;*/
    /*top: 0;*/
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    background: url("../../../../static/images/im_header_bg.png") no-repeat;
    background-size: 100% 3rem;
    color: #fff;
  }
  .tm .hd h1{
    font-weight: normal;
    margin: 0;
    font-size: 1.2rem;
    margin-right: 4rem;
  }
  .tm .hd span{
    float: left;
    font-size: 1rem;
  }
  .tm .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .tm .content{
    text-align: center;
    height:20rem;
    padding: 0;
  }
  .tm .content img{
    width: 5rem;
    height: 5rem;
    margin: 10% 43.6% 0 44%;
  }
  .tm .content label{
    font-size: 0.95rem;
    display: inline-block;
    margin-top: 3rem;
    font-weight: bold;
  }
  .tm .content a{
    font-size: 0.95rem;
    display: inline-block;
    margin-top: 1rem;
    color: #227fcc;
    font-weight: bold;
  }
</style>
