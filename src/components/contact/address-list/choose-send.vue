<template>
  <div class="choose-partner">
    <header class="choose-head">
      <span @click="toAddressList"><i class="icon-back"></i>返回</span>
      <h1>选择发送成员</h1>
    </header>
    <chooseMembers type="chatMany"></chooseMembers>

  </div>
</template>

<script>
  import Vue from 'vue';
  import {DB} from '@/assets/js/db';
  import * as actionTypes from "@/store/actions-types";
  import chooseMembers from '../../Me/chooseMembers.vue'
  export default{
    data(){
      return{
          chatUsers:[]
      }
    },
    components:{
      chooseMembers
    },
    methods:{
      toAddressList(){
        this.$router.replace("/address-list");
      }
    }
  }
</script>

<style>
  .choose-head{
    text-align: center;
    position: fixed;
    top: 0;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    background: url("../../../../static/images/im_header_bg.png") no-repeat;
    background-size: 100% 3rem;
    font-size: 1rem;
    color: #fff;
    z-index: 1111;
  }
  .choose-head h1{
    font-weight: normal;
    margin: 0;
    font-size: 1.2rem;
    margin-right: 4rem;
  }
  .choose-head span{
    float: left;
    font-size: 1rem;
  }
  .choose-head .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .choosegroup-group{
    position: relative;
  }
  .choosegroup-box{
    margin-top: 3rem;
    margin-bottom: 3.5rem;
  }
  .choosegroup-list{
    padding-left: 4%;
    line-height: 3.2rem;
    border-bottom: 1px solid #e9e9e9;
  }
  .choosegroup-list span{
    margin-left: 0.9rem;
  }
  .choosegroup-list label{
    position: relative;
    right: 1rem;
    text-align: center;
    float: right;
    color: #999;
  }
  .choose-partner .icon-nochoose{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_radiobutton_multi_nochoose.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: absolute;
    top: .85rem;
    left: .6rem;
  }
  .choose-partner .icon-choose{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_radiobutton_multi_choose.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: absolute;
    top: .85rem;
    left: .6rem;
  }
  .icon-righttri{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url("../../../../static/images/im_group_indicator_unexpanded01.png") no-repeat;
    background-size: 100%;
    position: relative;
    top: 1.1rem;
    margin-right: 1rem;
    float: right;
  }
  .icon-downtri{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url("../../../../static/images/im_group_indicator_expanded01.png") no-repeat;
    background-size: 100%;
    position: relative;
    top: 1.1rem;
    margin-right: 1rem;
    float: right;
  }
  .choose-partner .icon-nochoose-children{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_radiobutton_multi_nochoose.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: relative;
    top: 1.15rem;
  }
  .choose-partner .icon-choose-children{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_radiobutton_multi_choose.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: relative;
    top: 1.15rem;
  }
  .choosegroup-ull{
    background:#fff;
  }
  .choosegroup-ull li{
    border-top:solid 1px #eee;
    height:3.7rem;
    line-height: 1.5rem;
    padding:0 1.2rem;
  }
  .choosegroup-ull li a{ width:90%;display:inline-block;}
  .choosegroup-ull li a>img{width:8%;height:8%;float:left;margin-top: 0.15rem}
  .choosegroup-ull li a>span { float:left;padding-left:1rem;font-weight: bold}
  .choosegroup-ull li a>label { float:left;padding-left:1rem;color: blue;font-size: 0.9rem}

  .sendfooter{
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #ebebeb;
    padding: 2% 0;
  }
  .send-btn{
    width: 96%;
    margin: 0 2%;
    background-color: #e9625f;
    color: #ffffff;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    border-radius: 5px;
  }
</style>
