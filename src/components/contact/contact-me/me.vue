<template>
  <div>
    <div class="tab_content c">
      <header class="hd" style="position: relative">
        <span @click="toHandle"><i class="icon-back"></i>返回</span>
        通信应用
      </header>
      <div class="ifm">
        <img :src="'http://localhost:3000/sdcard/data/config/images/'+currentAccount.image" @click="toMyInfo">
        <span>{{currentAccount.nickName}}<label>({{currentAccount.phoneNum}})</label></span><span @click="changeStatus" style="margin-left:0.8rem;"><i :class="[status=='在线'?'icon-online':'icon-offline']"></i>&nbsp;&nbsp;{{status}}</span>
      </div>
      <div class="list">
        <ul class="list-inner">
          <li @click="toMessageSetting"><i class="icon-2"></i><span>消息设置</span><i class="bos-icon-arrow-right"></i></li>
          <li @click="toVedioSetting"><i class="icon-3"></i><span>音视频设置</span><i class="bos-icon-arrow-right"></i></li>
          <li @click="toTemplateMessage"><i class="icon-4"></i><span>模板消息管理</span><i class="bos-icon-arrow-right"></i></li>
          <li @click="toPtt" v-if="$store.state.currentUser.communicationMode == 'ADHOC'"><i class="icon-5"></i><span>数字对讲</span></li>
          <li @click="deleteData"><i class="icon-6"></i><span>数据清除</span></li>
          <li @click="toAbout"><i class="icon-7"></i><span>关于</span><i class="bos-icon-arrow-right"></i></li>
          <li @click="logout"><i class="icon-8"></i><span>退出</span><i class="bos-icon-arrow-right"></i></li>
        </ul>
      </div>
    </div>
    <div class="tab_menu">
      <div class="footer" id="footer">
        <ul>
          <li @click="toContact"><i class="bottom_one"></i>会话</li>
          <li @click="toAddressList"><i class="bottom_two"></i>通讯录</li>
          <li class="selected"><i class="bottom_three"></i>我</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import appService from '@/assets/js/service';
  import {DB,GroupDB} from '@/assets/js/db';
  import * as actionTypes from "@/store/actions-types";
  export default{
    data() {
      return {
        status:'在线',
        currentAccount: this.$store.state.account
      }
    },
    mounted(){
      //获取音视频设置
      this.getVedioSetting();
      //获取消息设置
      this.getMessageSetting();
    },
    methods: {
      changeStatus(){
        if(this.status == '在线'){
          this.status = '隐身';
        }else if(this.status == '隐身'){
          this.status = '在线';
        }
      },
      toMessageSetting(){
        this.$router.replace("/me/message-setting");
      },
      toVedioSetting(){
        this.$router.replace("/me/vedio-setting");
      },
      toTemplateMessage(){
        this.$router.replace("/inportFormt");
      },
      toPtt(){
        this.$router.replace("/me/adhoc-ptt");
      },
      isValidIP(ip) {
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
         return reg.test(ip);
      },
      toAbout(){
        this.$router.replace("/me/about");
      },
      logout() {
        let _this = this;
        this.$confirm('确定退出应用?', '退出确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          /*let dbInit = new DB("initMessage");
          GeoBOS.accounts.logout(function(err){
            if(err){
              console.log('failed with:' + err.message);
            }else{
              dbInit.update({autoLogin: true}, { $set: { autoLogin: false } }, { multi: true },function(err){
                if(err){
                  console.log('failed with:' + err.message)
                }else{
                  console.log('success');
                }
              });
              _this.$router.replace("/login");
            }
          });*/
          GeoBOS.appman.close();
        })
      },
      deleteData() {
          let _this = this;
        this.$confirm('确定清空数据记录?', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(()=>{
          let db = new DB("Message");
          let jsonConfig={name : "message"};
            db.remove(jsonConfig,function (err,result) {
              if(err){
                console.log('logout success');
              }else {
                console.log('success to remove msessage');
                console.log(result)
              }
            });
        })
      },
      toAddressList(){
        this.$router.replace("/address-list");
      },
      toContact(){
        this.$router.replace("/contact");
      },
      toHandle(){
        this.$router.replace("/handle");
      },
      toMyInfo(){
          this.$router.replace("/me/personal-information")
      },
      getVedioSetting(){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.queryAll(function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('打印res')
            console.log(res)
            for(let i = 0; i < res.length; i++){
              if(res[i].moduleUser = _this.$store.state.account.uniqueId){
                console.log('vedioSetting')
                console.log(res[i].vedioSetting)
                if(res[i].vedioSetting){
                  _this.$store.state.vedioSetting.audio = res[i].vedioSetting.audio;
                  _this.$store.state.vedioSetting.code = res[i].vedioSetting.code;
                  _this.$store.state.vedioSetting.band = res[i].vedioSetting.band;
                }else{
                  _this.$store.state.vedioSetting.audio = 'AAC';
                  _this.$store.state.vedioSetting.code = 'H.264';
                  _this.$store.state.vedioSetting.band = '192kbps';
                  dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{ $set: { "vedioSetting.audio": 'AAC', "vedioSetting.code": 'H.264',"vedioSetting.band": '192kbps' } }, {},function(err, res){
                    if(err){
                      console.log('failed with:' + err.message)
                    }else{
                      console.log('success');
                    }
                  })
                }
              }
            }
          }
        });
      },
      getMessageSetting(){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.queryAll(function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            for(let i = 0; i < res.length; i++){
              if(res[i].moduleUser = _this.$store.state.account.uniqueId){
                if(res[i].messageSetting){
                  console.log('res[i].messageSetting')
                  console.log(res[i].messageSetting)
                  _this.$store.state.messageSetting.notice = res[i].messageSetting.notice;
                  _this.$store.state.messageSetting.sound = res[i].messageSetting.sound;
                  _this.$store.state.messageSetting.vibrate = res[i].messageSetting.vibrate;
                }else{
                  _this.$store.state.messageSetting.notice = true;
                  _this.$store.state.messageSetting.sound = true;
                  _this.$store.state.messageSetting.vibrate = true;
                  dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{ $set: { "messageSetting.notice": true, "messageSetting.sound":true,"messageSetting.vibrate": true } }, {},function(err){
                    if(err){
                      console.log('failed with:' + err.message)
                    }else{
                      console.log('success');
                    }
                  })
                }
              }
            }
          }
        });
      }
    }
  }
</script>

<style>
  .tab_content .hd .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .tab_content .hd span{
    position: absolute;
    left: 0;
  }
  .tab_menu .selected{color:#6ea003;}
  .tab_menu .selected i{background-position:0 -2.06rem;}
  .tab_menu .selected .bottom_two {top:.4rem}
  .tab_menu > .footer{
    position: fixed;
    bottom:0;
    width:100%;
    line-height:3rem;
    border-top:solid 1px #eee;
    border-bottom:solid 1px #eee;
    background:#fff;
    z-index:1001;
  }
  .tab_menu > .footer > ul > li{
    width:33.33%;
    font-size: 1.3rem;
    text-align: center;
    border-right:1px solid #eee;
    box-sizing: border-box;
    float:left;
  }
  .tab_menu > .footer > ul > li:nth-last-child(1) {border-right:none;}
  .c ul{
    background-color: #fff;
    list-style: none;
    padding: 0 0.9rem;
    margin-top: 0;
  }
  .c ul li{
    height: 3rem;
    line-height: 3rem;
    border-bottom: 1px solid #e9e9e9;
  }
  .c ul li:nth-last-of-type(1){ border-bottom:none; }
  .c ul li i{
    position: relative;
    top: 0.55rem;
    padding-right: 0.5rem;
  }
  .c ul li span{
    font-size: 1.1rem;
  }
  .c .hd{
    text-align: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    background: url("../../../../static/images/im_header_bg.png") no-repeat;
    background-size: 100% 3rem;
    font-size: 1.2rem;
    color: #fff;
  }
  .c .ifm{
    border-top: 5px solid #ededed;
    border-bottom: 8px solid #cfd3d6;
    background-color: #fff;
    position: absolute;
    top: 3rem;
    width: 100%;
    padding:6px 0;
  }
  .c .ifm img{
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    margin-left: 1rem;
    margin-right: .6rem;
  }
  .c .ifm span{
    position:relative;
    bottom: 1.4rem;
  }
  .c .list{
    width: 100%;
    overflow: hidden;
    position: absolute;
    top: 8.45rem;
    bottom: 2.75rem;
  }
  .c .list-inner{
    height: 96%;
    width: 99%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .list-inner li i:nth-of-type(2){float:right;margin-right:10px;margin-top:8px;}
  .c .icon-online{
    display: inline-block;
    width: 1.4rem;
    height: 1.4rem;
    background: url("../../../../static/images/im_icon_online.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: relative;
    top: .4rem;
    left:.4rem;
  }
  .c .icon-offline{
    display: inline-block;
    width: 1.4rem;
    height: 1.4rem;
    background: url("../../../../static/images/im_icon_offline.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: relative;
    top: .4rem;
    left:.4rem;
  }
  .c .list-inner li i{
    width: 2rem;
    height: 2rem;
    display: inline-block;
  }
  .c .icon-2{
    background: url("../../../../static/images/im_comm_ap_msgsetting.png") no-repeat;
    background-size: 2rem;
  }
  .c .icon-3{
    background: url("../../../../static/images/im_comm_ap_audio.png") no-repeat;
    background-size: 2rem;
  }
  .c .icon-4{
    background: url("../../../../static/images/im_comm_ap_msgmodle.png") no-repeat;
    background-size: 2rem;
  }
  .c .icon-5{
    background: url("../../../../static/images/im_cellphon_icon.png") no-repeat;
    background-size: 2rem;
  }
  .c .icon-6{
    background: url("../../../../static/images/im_chat_record_icon.png") no-repeat;
    background-size: 2rem;
  }
  .c .icon-7{
    background: url("../../../../static/images/im_comm_ap_about.png") no-repeat;
    background-size:2rem;
  }
  .c .icon-8{
    background: url("../../../../static/images/im_comm_ap_msgmodle.png") no-repeat;
    background-size: 2rem;
  }
  .bottom_one,.bottom_two,.bottom_three{
    width:2rem;
    height:2rem;
    display:inline-block;
    position:relative;
    top:.5rem;
    right:.5rem;
    background: url("../../../../static/images/chat.png") no-repeat 0 0;
    background-size: 100%;
  }
  .bottom_two{
    background: url("../../../../static/images/contact.png") no-repeat 0 0;
    background-size: 100%;
  }
  .bottom_three{
    background: url("../../../../static/images/me.png") no-repeat 0 0;
    background-size: 100%;
  }
</style>
