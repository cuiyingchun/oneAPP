<template>
  <div style="background-color: #ededed;">
    <div class="top" style="position: relative">
      <span @click="toChat"><i class="icon-back"></i>返回</span>
      聊天设置
    </div>
    <div class="partner">
      <img :src="'http://localhost:3000/sdcard/data/config/images/'+user.image">
      <span>{{user.nickName}}</span>
    </div>
    <div class="chathistory" @click="toChatHistory">
      <i class="icon-record"></i>
      <p>聊天记录</p>
    </div>
    <div class="chatbackground" @click="toChatBackground">
      <i class="icon-chatbg"></i>
      <p>聊天背景设置</p>
    </div>
    <div style="padding-bottom: 0.1rem">
      <div class="deletefriend">删除好友</div>
    </div>
  </div>
</template>
<script>
  import * as actionTypes from "@/store/actions-types";
  export default {
    name: 'ChatSetting',
    data () {
      return {
        user:this.$route.params.user,
      }
    },
    mounted(){
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    methods: {
      toChat(){
        let _this = this;
        this.$router.push({name: 'Chat', params: {user:_this.user}});
      },
      toChatHistory(){
        let _this = this;
        this.$router.push({name: 'ChatHistory', params: {user:_this.user}});
      },
      toChatBackground(){
        let _this = this;
        this.$router.push({name: 'ChatBackground', params: {user:_this.user}});
      }
    }
  }
</script>
<style>
  .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .partner{
    border-top: 5px solid #ededed;
    border-bottom: 8px solid #cfd3d6;
    background-color: #ffffff;
    position: absolute;
    top: 3rem;
    width: 100%;
    height:4.5rem;
  }
  .partner img{
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    margin: .25rem 1rem 0 .6rem;
  }
  .partner span{
    position:relative;
    bottom: 1.6rem;
  }
  .chathistory{
    margin-top: 5.3rem;
    line-height: 2.5rem;
    border-bottom: 8px solid #cfd3d6;
    background-color: #fff;
  }
  .icon-record{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: url("../../../../static/images/im_chat_record_icon.png") no-repeat;
    background-size: 100%;
    float: left;
    position: relative;
    top: 0.25rem;
    margin-left: 0.7rem;
    margin-right: 0.6rem;
  }
  .chatbackground{
    line-height: 2.5rem;
    border-bottom: 8px solid #cfd3d6;
    background-color: #fff;
  }
  .icon-chatbg{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: url("../../../../static/images/im_chat_bg_setting_icon.png") no-repeat;
    background-size: 100%;
    float: left;
    position: relative;
    top: 0.25rem;
    margin-left: 0.7rem;
    margin-right: 0.6rem;
  }
  .deletefriend{
    width: 96%;
    margin: auto 2%;
    line-height: 3rem;
    text-align: center;
    border-radius: 3px;
    background-color: #e9625f;
    margin-top: 3.3rem;
    margin-bottom: 0.5rem;
    color: #fff;
  }
</style>

