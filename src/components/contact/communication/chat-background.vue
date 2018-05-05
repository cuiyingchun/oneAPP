<template>
  <div>
    <div class="top" style="position: fixed">
      <span @click="goBack"><i class="icon-back"></i>返回</span>
      聊天背景设置
    </div>
    <div class="color-list">
      <div style="position: relative">
        <input type="radio" id="bgc1" name="chooseColor" value="#feffef"/>
        <label for="bgc1" class="color-1"></label>
      </div>
      <div style="position: relative">
        <input type="radio" id="bgc2" name="chooseColor" value="#f5deb2"/>
        <label for="bgc2" class="color-2"></label>
      </div>
      <div style="position: relative">
        <input type="radio" id="bgc3" name="chooseColor" value="#efe68b"/>
        <label for="bgc3" class="color-3"></label>
      </div>
      <div style="position: relative">
        <input type="radio" id="bgc4" name="chooseColor" value="#afe0e5" />
        <label for="bgc4" class="color-4"></label>
      </div>
      <div style="position: relative">
        <input type="radio" id="bgc5" name="chooseColor" value="#2d8b56"/>
        <label for="bgc5" class="color-5"></label>
      </div>
      <div style="position: relative">
        <input type="radio" id="bgc6" name="chooseColor" value="#d1b48a"/>
        <label for="bgc6" class="color-6"></label>
      </div>
    </div>
    <div class="chatbg-foot">
      <bos-button class="btn" type="danger" size="large" @click="goBack">取消</bos-button>
      <bos-button class="btn" type="danger" size="large" @click="getColor">确定</bos-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import $ from 'jquery';
  import {DB,GroupDB} from '@/assets/js/db';
  import * as actionTypes from "@/store/actions-types";
  export default {
    name: 'ChatBackground',
    data () {
      return {
        user:this.$route.params.user,
        group:this.$route.params.group,
        backgroundColor: undefined
      }
    },
    mounted(){
      let _this = this;
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
      $(":radio[name='chooseColor'][value='" + _this.$store.state.backgroundColor + "']").prop("checked", "checked");
    },
    methods: {
      goBack(){
        let _this = this;
        if(this.user){
          this.$router.push({name: 'ChatSetting', params: {user:_this.user}});
        }else if(this.group){
          this.$router.push({name: 'GroupInfo', params: {group:_this.group}});
        }
      },
      getColor(){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{ $set: { color: $('input:radio:checked').val() } }, { multi: true },function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('success');
          }
        });
        this.$store.state.backgroundColor = $('input:radio:checked').val();
        if(this.user){
          this.$router.push({name: 'ChatSetting', params: {user:_this.user}});
        }else if(this.group){
          this.$router.push({name: 'GroupInfo', params: {group:_this.group}});
        }
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
  .color-list{
    background-color: #f8f8f8;
    height: 15rem;
    margin-top: 3rem;
    padding: 1rem;
    position: relative;
  }
  input[type=radio]{
    position: absolute;
    top: 0.7rem;
    margin-left: 0.7rem;
    z-index: 1001;
  }
  .color-1, .color-2, .color-3, .color-4, .color-5, .color-6{
    float: left;
    width: 4.5rem;
    height: 6rem;
    margin: 0.5rem;
    position: relative;
    background-color: #feffef;
  }
  .color-1{
    background-color: #feffef;
  }
  .color-2{
    background-color: #f5deb2;
  }
  .color-3{
    background-color: #efe68b;
  }
  .color-4{
    background-color: #afe0e5;
  }
  .color-5{
    background-color: #2d8b56;
  }
  .color-6{
    background-color: #d1b48a;
  }
  .icon-nochoose{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_radiobutton_multi_nochoose.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: absolute;
    top: 0.1rem;
    right: -0.1rem;
  }
  .icon-choose{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_radiobutton_multi_choose.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: absolute;
    top: 0.1rem;
    right: -0.1rem;
  }
  .chatbg-foot{
    width: 100%;
    padding-top: 0.2rem;
    padding-left: 13%;
    background: #ebebeb;
    position: fixed;
    bottom: 0;
  }
  .chatbg-foot .btn{
    width: 27%;
    height: 3rem;
    font-size: 1.2rem;
    margin: 0.4rem 5%;
  }
</style>
