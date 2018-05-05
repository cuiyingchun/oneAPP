<template>
  <div id="me">
    <div class="top">
      <span @click="toHandle"><i class="icon-back"></i>返回</span>
      我的设置
    </div>
    <div class="mePro_content">
      <ul>
        <li @click="toInfo">基本信息<i></i></li>
        <li @click="tohelp">紧急救援求助<i></i></li>
        <li @click="toTrend">TS共享<i></i></li>
        <li @click="toMap">离线地图<i></i></li>
        <li>高分配管理<i></i></li>
        <li @click="toMessage">信息提醒<i></i></li>
        <li>静音模式<bos-switch v-model="mute" @change="toggleMute"></bos-switch></li>
        <li>关于<i></i></li>
        <li @click="logout">退出<i></i></li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {DB} from '@/assets/js/db';
  import appService from '@/assets/js/service';
  export default{
    data(){
      return{
        mute:this.$store.state.mute,
      }
    },
    methods:{
      toInfo(){
        this.$router.replace("/mePro/information");
      },
      tohelp(){
        this.$router.replace("/mePro/emergency");
      },
      toHandle(){
        this.$router.replace("/handle");
      },
      toTrend() {
        this.$router.replace("/mePro/shareTrend")
      },
      toMap(){
        this.$router.replace("/mePro/offlineMap")
      },
      toMessage() {
        this.$router.replace("/mePro/messageReminder")
      },
      toggleMute(){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{ $set: { mute: _this.mute } }, { multi: true },function(err){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('success');
          }
        });
        this.$store.state.mute = this.mute;
      },
      logout(){
        let _this = this;
        this.$confirm('确定退出应用?', '退出确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          GeoBOS.appman.close();
        })
      }
    }
  }

</script>

<style>
   .mePro_content>ul>li>i{
     display: inline-block;
     width: 1.7rem;
     height: 1.7rem;
     background: url("../../../static/plotimg/icon_list_indicator.png") no-repeat;
     background-size: 70%;
     position: absolute;
     top: 0.8rem;
     right: 0;
  }
  .mePro_content{
    margin-top:3rem;
  }
  .mePro_content>ul{
    padding:.1rem 1rem;
  }
  .mePro_content>ul>li{
    line-height: 3rem;
    position: relative;
    border-bottom:solid 1px #eee;
  }
  .bos-switch{
    display: inline-block;
    float: right;
    height: 2.2rem;
    top:.5rem;
  }
  .mePro_content .bos-switch__core{
    border-color: #d1d1d1;
    background-color: #d1d1d1;
  }
  .mePro_content .bos-switch__input:checked+.bos-switch__core{
    border-color: #9ee75a;
    background-color: #9ee75a;
  }
</style>
