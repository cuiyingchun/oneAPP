<template>
  <div class="as">
    <header class="hd"><span @click="toCommunication"><i class="icon-back"></i>返回</span><h1>音视频设置</h1></header>
    <div class="audiolist">
      <ul>
        <li>
          <div>
            <p>音频选择</p>
            <bos-radio class="radio audio" v-model="audio" label="AAC">AAC</bos-radio>
            <bos-radio class="radio audio" v-model="audio" label="AMRN">AMRN</bos-radio>
          </div>
        </li>
        <li>
          <div>
            <p>视频编码选择</p>
            <bos-radio class="radio code" v-model="code" label="H.264">H.264</bos-radio>
            <bos-radio class="radio code" v-model="code" label="H.263">H.263</bos-radio>
          </div>
        </li>
        <li>
          <div>
            <p>视频宽带设置</p>
            <bos-radio class="radio band" v-model="band" label="192kbps">192kbps</bos-radio>
            <bos-radio class="radio band" v-model="band" label="384kbps">384kbps</bos-radio>
          </div>
        </li>
      </ul>
    </div>
    <footer class="ft-as">
      <bos-button class="btn" type="danger" size="large" @click="toCommunication">取消</bos-button>
      <bos-button class="btn" type="danger" size="large" @click="getSetting">确定</bos-button>
    </footer>
  </div>
</template>

<script>
  import $ from 'jquery';
  import {DB,GroupDB} from '@/assets/js/db';
  import * as actionTypes from "@/store/actions-types";
  export default {
    data () {
      return {
        audio: this.$store.state.vedioSetting.audio,
        code: this.$store.state.vedioSetting.code,
        band: this.$store.state.vedioSetting.band
      }
    },
    mounted(){
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    methods: {
      toCommunication(){
        this.$router.replace("/me");
      },
      getSetting(){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{ $set: { "vedioSetting.audio": $('.audio input:checked').val(),"vedioSetting.code": $('.code input:checked').val(),"vedioSetting.band": $('.band input:checked').val() } }, { multi: true },function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('更新成功');
            _this.$router.replace("/me");
          }
        });
      }
    }
  }
</script>
<style>
  .as{
    padding: 0;
    margin: 0;
    font-size: 1.2rem;
    background: #ebebeb;
  }
  .as ul{
    list-style: none;
    padding: 0 0.9rem;
    margin: 0;
    background: #ffffff;
  }
  .as ul li{
    height: 4.5rem;
    /*line-height: 3rem;*/
    border-bottom: 1px solid #e9e9e9;
  }
  .as ul li p{
    margin: 0 0 0.5rem 0;
    padding-top: 0.6rem;
  }
  .as .hd{
    text-align: center;
    position: fixed;
    top: 0;
    z-index: 1001;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    background: url("../../../../static/images/im_header_bg.png") no-repeat;
    background-size: 100% 3rem;
    color: #fff;
  }
  .as .hd h1{
    font-weight: normal;
    margin: 0;
    font-size: 1.2rem;
    margin-right: 4rem;
  }
  .as .hd span{
    float: left;
    font-size: 1rem;
  }
  .as .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png")  no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .as .audiolist{
    margin-top: 3rem;
    overflow: auto;
  }
  .as .radio{
    margin-bottom: 0.4rem;
    margin-left: 0.55rem;
  }
  .as .ft-as{
    width: 100%;
    padding-top: .8rem;
    padding-left: 7%;
    background: #ebebeb;
    position: fixed;
    bottom: 0;
  }
  .as .ft-as .btn{
    width: 33%;
    height: 3rem;
    font-size: 1.2rem;
    margin: 0.5rem 5%;
    position: relative;
    bottom: 0.5rem;
  }
</style>
