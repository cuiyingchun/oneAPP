<template>
  <div class="tm">
    <header class="hd"><span @click="toCommunication"><i class="icon-back"></i>返回</span><h1>模板消息</h1></header>
    <!--<div class="contact-group">
      <div class="contact-list" @click="checkUserF()">
        <p>
          <i v-bind:class="{'bos-icon-caret-right':!caretFlatF,'bos-icon-caret-bottom':caretFlatF}"></i>
          <span>侦察类</span>
        </p>
      </div>
      <i class="bos-icon-more" @click="showChoice3"></i>
      <ul class="contact-ull" v-show="isShowF">
       &lt;!&ndash; <li @click="goInTemplate1('侦察目标')">侦察目标</li>
        <li @click="goInTemplate1('天气状况')">天气状况</li>&ndash;&gt;
        <li v-for="item in investigation">{{item}}</li>
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
        <li @click="goInTemplate1('测试模板')">测试模板3</li>
      </ul>
    </div>-->
    <div class="contact-group" v-if="investigation.length">
      <div class="contact-list" @click="checkUserF()">
        <p>
          <i v-bind:class="{'bos-icon-caret-right':!caretFlatF,'bos-icon-caret-bottom':caretFlatF}"></i>
          <span>侦察类</span>
        </p>
      </div>
      <ul class="contact-ull" v-show="isShowF">
        <li v-for="item in investigation" @click="goInTemplate1(item.name,item.filePath)">{{item.name}}</li>
        <!--<li>天气状况</li>-->
      </ul>
    </div>
  </div>
</template>

<script>
  import * as actionTypes from "@/store/actions-types";
  import {otherFn} from '@/assets/js/utils';
  export default {
    data () {
      return {
        caretFlatF: false,
        isShowF: false,
        investigation:[],
        user:this.$route.params.user,
        group:this.$route.params.group,
        ul:this.$route.params.ul,
      }
    },
    mounted(){
      otherFn.importTemplate(this.investigation);
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    methods: {
      toCommunication(){
        let _this = this;
        if(this.user){
          this.$router.push({name: 'Chat', params: {user:_this.user}});
        }else if(this.group){
          this.$router.push({name: 'ChatGroup', params: {group:_this.group}});
        }
      },
      checkUserF(){
        if(!this.caretFlatF){
          this.caretFlatF=true;
          this.isShowF=true;
        }else{
          this.caretFlatF=false;
          this.isShowF=false;
        }
      },
      goInTemplate1(name,filePath){
        this.$router.push({name: 'TemplatePage',  params: {name:name,filePath:filePath,user: this.user,ul: this.ul}});
      }
    }
  }
</script>
<style>
  .tm{
    padding: 0;
    margin:3rem 0 0;
    font-size: 1.2rem;
    background: #fff;
  }
  .tm .hd{
    text-align: center;
    position: fixed;
    top: 0;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    background: url("../../../../static/images/im_header_bg.png") no-repeat;
    background-size: 100% 3rem;
    color: #fff;
  }
  .tm .hd h1{
    font-weight: normal;
    margin: 0 4rem 0 0;
    font-size: 1.2rem;
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
  .tm .leadin{
    background-color: #ebebeb;
    padding: 2% 0;
  }
  .tm .leadin-btn{
    width: 96%;
    margin: 0 2%;
    background-color: #e9625f;
    color: #fff;
    text-align: center;
    height: 3.5rem;
    line-height: 3.5rem;
    border-radius: 5px;
  }
</style>
