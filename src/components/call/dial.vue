<template>
  <div>
    <div class="dial-top">
      <!--头像-->
      <p><img :src="'http://localhost:3000/sdcard/data/config/images/'+$store.state.call.dialUser.image"/></p>
      <!--昵称-->
      <p>{{$store.state.call.dialUser.position}}{{$store.state.call.dialUser.nickName}}</p>
      <p v-if="isCalling">正在进行音频呼叫...</p>
      <p v-if="isOnline">对方离线，通话结束...</p>
      <p v-if="isTimeout">网络超时，通话结束...</p>
      <p v-if="isBusy">对方繁忙中...</p>
    </div>
    <div class="dial-middle" v-if="isAccept">
      <p>{{hour<10?'0'+hour:hour}}:{{minute<10?'0'+minute:minute}}:{{second<10?'0'+second:second}}</p>
    </div>
    <div class="dial-footer">
      <bos-button type="success" size="large" :class="[isDial?'after-answer':'before-answer']" @click="answer">接听</bos-button>
      <bos-button type="danger" size="large" :class="[isDial?'after-hangup':'before-hangup']" @click="hangup">挂断</bos-button>
    </div>
  </div>
</template>

<script>
  import {DB} from '@/assets/js/db';
  import {io,calls} from '@/assets/js/utils';
  export default {
    name: 'Dial',
    data() {
      return {
        hour:0,
        minute:0,
        second:0,
        int:undefined,
        isDial:this.$store.state.call.isDial,//全局变量，用于判断是否为拨打方，拨打方显示挂断按钮，接收方显示接听、挂断按钮
        isCalling:undefined,//用于显示拨打状态，显示“正在进行音频呼叫”
        isOnline:undefined,//用于显示拨打状态，显示“对方离线，通话结束”
        isTimeout:undefined,//用于显示拨打状态，显示“网络超时，通话结束”
        isBusy:undefined,//用于显示拨打状态，显示“对方繁忙中”
        isAccept:undefined,//判断是否接听（双方）
      }
    },
    mounted(){
      let _this = this;
      if (window.atelier && this.$store.state.currentUser.communicationMode == "ADHOC") {
        GeoBOS.call.addCallAcceptListener(() => {
          console.log("----------call accept-------------");
          _this.isAccept = true;
          _this.isCalling = false;
          _this.timekeeper();
          _this.callAccept();
        });
        GeoBOS.call.addCallCallingListener(() => {
          console.log("----------call calling-------------");
          _this.callCalling()
          setTimeout(function(){
            if(!_this.isAccept){
              _this.isCalling = false;
              _this.isTimeout = true;
              _this.isAccept = false;
              calls.hangUpCall();
            }
          },40000)
        });
        GeoBOS.call.addCallBusyListener(() => {
          console.log("----------call busy-------------");
          //_this.$message.error('对方繁忙');
          _this.isCalling = false;
          _this.isBusy = true;
          setTimeout(function(){
            _this.$store.state.call.showDial = false;
            _this.$store.state.call.isDial = undefined;
          },3000)
          _this.callEnd();
        });
        GeoBOS.call.addCallTimeoutListener(() => {
          console.log("----------call timeout-------------");
          _this.isCalling = false;
          _this.isOnline = true;
          setTimeout(function(){
            _this.$store.state.call.showDial = false;
            _this.$store.state.call.isDial = undefined;
          },3000)
        });
        GeoBOS.call.addCallCancelListener(() => {
          console.log("----------call cancel-------------");
          if(_this.isAccept == undefined){
            _this.$store.state.call.showDial = false;
            _this.$store.state.call.isDial = undefined;
          }else if(_this.isAccept == false){
            setTimeout(function(){
              _this.$store.state.call.showDial = false;
              _this.$store.state.call.isDial = undefined;
            },3000)
          }
          _this.callEnd();
        });
        GeoBOS.call.addCallEndListener(() => {
          console.log("----------call end-------------");
          _this.isAccept = false;
          _this.$store.state.call.showDial = false;
          _this.$store.state.call.isDial = undefined;
        });
        GeoBOS.call.addCallRejectListener(() => {
          console.log("----------call reject-------------");
          _this.$store.state.call.showDial = false;
          _this.$store.state.call.isDial = undefined;
          _this.callEnd();
        });
      }
      if(this.$store.state.currentUser.communicationMode == "SATCOM"){
        GeoBOS.satcom.onATMessage.addListener('bos.iecas.app', (msg) => {
          console.log("recv_Cmd:msg " + msg);
          console.log("recv_Cmd:body " + JSON.parse(msg).body);
          var msgObj = JSON.parse(msg);
          var dsub = msgObj.dsub;
          console.log("recv_Cmd:dsub " + dsub);
          if (dsub == 0x7e) {
            var body = JSON.parse(msgObj.body);
            var simId = body.sim_id;
            var num = body.number;
            var phoneState = body.state;
            if (phoneState == 4) {
              //已接通
              _this.isAccept = true;
              _this.isCalling = false;
              _this.timekeeper();
              _this.callAccept();
            }else if (phoneState == 0) {
              //空闲
            }
          }
        });
      }
      if(this.isDial){
        this.isCalling = true;
        this.isOnline = false;
        this.isTimeout = false;
        this.isBusy = false;
      }else {
        this.isCalling = false;
        this.isOnline = false;
        this.isTimeout = false;
        this.isBusy = false;
      }
    },
    methods:{
      timekeeper(){
        let _this = this;
        this.int=setInterval(_this.timer,1000);
      },
      answer(){
        calls.answerCall();
        this.isDial = !this.isDial;
      },
      timer(){
        this.second += 1;
        if(this.second>=60)
        {
          this.second=0;
          this.minute += 1;
        }
        if(this.minute>=60)
        {
          this.minute=0;
          this.hour += 1;
        }
      },
      hangup(){
        let _this = this;
        window.clearInterval(_this.int);
        calls.hangUpCall();
        this.$store.state.call.showDial = false;
      },
      callCalling(){
        calls.storeCallMessage(this.$store.state.account, this.$store.state.call.dialUser, 'radio', 'Y');
      },
      callAccept(){
        let db = new DB("Message");
        db.update({ isAccept: '' }, {$set:{ isAccept: 'Y'}}, {multi: true}, function (err, num) {
          if(err){
            console.log(err);
          }else{
            console.log(num);
          }
        });
      },
      //通话拒绝、取消、繁忙
      callEnd(){
        let db = new DB("Message");
        db.update({ isAccept: '' }, {$set:{ isAccept: 'N'}}, {multi: true}, function (err, num) {
          if(err){
            console.log(err);
          }else{
            console.log(num);
          }
        });
      },
    }
  }
</script>

<style>
  .dial-top>p{
    text-align: center;
  }
  .dial-top>p:nth-of-type(2),.dial-top>p:nth-of-type(3){
    margin: .5rem;
    font-size: 1.1rem;
  }
  .dial-top>p>img{
    width: 13%;
    height: 13%;
    border-radius: 50%;
    margin-top: 1rem;
  }
  .dial-middle>p{
    font-size: 1.3rem;
    text-align: center;
  }
  .dial-footer .before-answer{
    position: fixed;
    left: 3rem;
    bottom: 2rem;
  }
  .dial-footer .after-answer{
    display: none;
  }
  .dial-footer .before-hangup{
    position: fixed;
    right: 3rem;
    bottom: 2rem;
  }
  .dial-footer .after-hangup{
    position: fixed;
    right: 16.6rem;
    bottom: 2rem;
  }
</style>
