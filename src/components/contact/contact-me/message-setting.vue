<template>
  <div class="ms">
    <header class="hd"><span @click="toCommunication"><i class="icon-back"></i>返回</span><h1>新消息设置</h1></header>
    <div class="list">
      <ul>
        <li>新消息通知<bos-switch class="fr-m" v-model="notice" @change="noticeSetting"></bos-switch></li>
        <li>声音<bos-switch class="fr-m" v-model="sound" @change="soundSetting"></bos-switch></li>
        <li>震动<bos-switch class="fr-m" v-model="vibrate" @change="vibrateSetting"></bos-switch></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import {DB,GroupDB} from '@/assets/js/db';
  import * as actionTypes from "@/store/actions-types";
  export default {
    data () {
      return {
        notice: this.$store.state.messageSetting.notice,
        sound: this.$store.state.messageSetting.sound,
        vibrate: this.$store.state.messageSetting.vibrate,
      }
    },
    mounted(){
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    methods: {
      toCommunication(){
        this.$router.replace("/me");
      },
      noticeSetting(){
        let _this = this;
        if(this.notice == true){
          this.sound = true;
          this.vibrate = true;
        }else if(this.notice == false){
          this.sound = false;
          this.vibrate = false;
        }
        let dbInit = new DB("initMessage");
        dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{ $set: { "messageSetting.notice":_this.notice,"messageSetting.sound":_this.sound,"messageSetting.vibrate":_this.vibrate } }, { multi: true },function(err){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('success');
          }
        })
      },
      soundSetting(){
        let _this = this;
        if(this.sound == true){
          this.notice = true;
        }else if(this.sound == false && this.vibrate == false){
          this.notice = false;
        }
        let dbInit = new DB("initMessage");
        dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{ $set: { "messageSetting.notice":_this.notice,"messageSetting.sound":_this.sound,"messageSetting.vibrate":_this.vibrate } }, { multi: true },function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('success');
          }
        })
      },
      vibrateSetting(){
        let _this = this;
        if(this.vibrate == true){
          this.notice = true;
        }else if(this.vibrate == false && this.sound == false){
          this.notice = false;
        }
        let dbInit = new DB("initMessage");
        dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{ $set: { "messageSetting.notice":_this.notice,"messageSetting.sound":_this.sound,"messageSetting.vibrate":_this.vibrate } }, { multi: true },function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('success');
          }
        })
      },
    },
  }
</script>
<style>
  .ms{
    padding: 0;
    margin: 0;
    font-size: 1rem;
    background: #fff;
  }
  .ms ul{
    list-style: none;
    padding: 0 0.9rem;
  }
  .ms ul li{
    height: 3rem;
    line-height: 3rem;
    border-bottom: 1px solid #e9e9e9;
  }
  .ms .hd{
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
  .ms .hd h1{
    font-weight: normal;
    margin: 0 4rem 0 0;
    font-size: 1.2rem;
  }
  .ms .hd span{
    float: left;
  }
  .ms .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: .77rem;
    left: .5rem;
  }
  .ms .fr-m{
    float: right;
    margin-right: 1rem;
  }
  .fr-m .bos-switch__core{
    border-color: #d1d1d1;
    background-color: #d1d1d1;
  }
  .fr-m .bos-switch__input:checked+.bos-switch__core{
    border-color: #9ee75a;
    background-color: #9ee75a;
  }
</style>
