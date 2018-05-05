<template>
 <!-- <div>
    <div class="format_box">
      <div class="format_content">
        <div class="top" style="position: relative">
          <span @click="toChat"><i class="icon-back"></i>返回</span>
          模板消息
        </div>

      </div>
    </div>
  </div>-->
  <div class="tm">
    <header class="hd"><span @click="toChat"><i class="icon-back"></i>返回</span><h1>模板消息</h1></header>
    <div class="contact-group">
      <div class="contact-list" @click="checkUserF()">
        <p>
          <i v-bind:class="{'bos-icon-caret-right':!caretFlatF,'bos-icon-caret-bottom':caretFlatF}"></i>
          <span>侦察类</span>
        </p>
      </div>
      <i class="bos-icon-more" @click=" "></i>
      <ul class="contact-ull" v-show="isShowF">
        <li @click="goInTemplate('侦察目标')">侦察目标</li>
        <li @click="goInTemplate('天气状况')">天气状况</li>
      </ul>
    </div>
    <div class="contact-group">
      <div class="contact-list" @click="checkUserX()">
        <p>
          <i v-bind:class="{'bos-icon-caret-right':!caretFlatX,'bos-icon-caret-bottom':caretFlatX}"></i>
          <span>协同类</span>
        </p>
      </div>
      <i class="bos-icon-more" @click="showChoice3"></i>
      <ul class="contact-ull" v-show="isShowX">
        <li @click="goInTemplate('测试模板')">测试模板3</li>
      </ul>
    </div>
    <div class="leadin">
      <div class="leadin-btn">
        导入格式短语
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import * as actionTypes from "@/store/actions-types";
  export default {
    name: 'FormatPhrase',
    data() {
      return {
        user:this.$route.params.user,
        careFlateF: false,
        careFlateX: false,
        isShowF: false,
        isShowX: false,
        templateName: '',
      }
    },
    mounted(){
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    methods: {
      toChat(){
        let _this = this;
        if(this.user){
          this.$router.push({name: 'Chat', params: {user:_this.user}});
        }else if(this.group){
          this.$router.push({name: 'ChatGroup', params: {group:_this.group}});
        }
      },
      checkUserF(){
          console.log("zhenchalei")
        if(this.caretFlatF==false){
          this.caretFlatF=true;
          this.isShowF=true;
        }else{
          this.caretFlatF=false;
          this.isShowF=false;
        }
      },
      checkUserX(){
        if(this.caretFlatX==false){
          this.caretFlatX=true;
          this.isShowX=true;
        }else{
          this.caretFlatX=false;
          this.isShowX=false;
        }
      },
    }
  };
</script>
<style>
  /*会话页面的样式编写*/
  .tm{
    padding: 0;
    margin: 0;
    font-size: 1.2rem;
    background: #ffffff;
    margin-top: 3rem;
  }
  .tm .hd{
    text-align: center;
    position: fixed;
    top: 0;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    background-image: url("../../../../static/images/im_header_bg.png");
    background-size: 100% 3rem;
    background-repeat: no-repeat;
    color: #ffffff;
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
    background-image: url("../../../../static/images/im_header_back.png");
    background-size: 40%;
    background-repeat: no-repeat;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .tm .leadin{
    background-color: #ebebeb;
    padding: 2% 0;
  }
  .tm .leadin-btn{
    width: 96%;
    margin: 0 2%;
    background-color: #e9625f;
    color: #ffffff;
    text-align: center;
    height: 3.5rem;
    line-height: 3.5rem;
    border-radius: 5px;
  }
</style>

