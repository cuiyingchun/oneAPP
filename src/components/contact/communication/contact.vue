<template>
  <div id="body">
    <div class="tab_content">
      <div class="top">
        <span @click="toHandle"><i class="icon-back"></i>返回</span>
        通讯应用
      </div>
      <div class="contact-content">
        <div class="content_talk" style="margin-top: -6px">
          <bos-tabs v-model="activeName" @tab-click="handleClick">
            <bos-tab-pane label="信息" name="first">
              <div class="message-box">
                <div class="message-group-record">
                  <div class="message-list message-list1" v-for="(message,index) in msgLists">
                    <a @click="toChat(message)">
                      <img v-if="message.chatImage" :src="'http://localhost:3000/sdcard/data/config/images/'+ message.chatImage" style="border-radius: 50%" />
                      <!--<img src="../../../../static/images/im_portrait_multi.png">-->
                      <img v-else-if="message.groupName" :src="'./static/images/im_groupbtn.png'"/>
                      <img v-else :src="'./static/images/im_portrait_multi.png'"/>
                      <span :class="'count'+ message.uuid " style="display: none;">{{message.noReadCount}}</span>
                      <span>
                        <span style="float:left;" v-if="message.chatName">{{ message.chatName}}：</span>
                        <span style="float:left;" v-else-if="message.groupName">{{message.groupName}}：</span>
                        <span style="float:left;" v-else>多人发送：</span>
                        <span style="float:left;" v-html="message.msg" class="abc"></span>
                      </span>
                    </a>
                    <p>
                      <span style="color: #999;">{{message.sendDate}}</span>
                      <i class="icon-deletemessage" @click="deleteMessage(index,message)"></i>
                    </p>
                  </div>
                </div>
              </div>
            </bos-tab-pane>
            <bos-tab-pane label="电话" name="second">
              <div class="phone-box" style="margin-bottom: 5.5rem">
                <div class="phone-group" v-for="(call,index) in callList">
                  <div class="phone-list">
                    <img :src="'http://localhost:3000/sdcard/data/config/images/'+[call.isCalling == 'Y'?call.receiverImage:call.senderImage]">
                    <p>
                      <span>{{call.isCalling == 'Y'?call.senderNickName:call.senderNickName}}</span>：
                      <span style="color: #999">{{call.callDate}}</span>
                    </p>
                    <p>
                      <i v-if="call.callType == 'radio'" :class="[call.isCalling == 'Y'?'icon-radio-ou':'icon-radio-in']" @click="radioCallBack(call)"></i>
                      <i v-if="call.callType == 'video'" :class="[call.isCalling == 'Y'?'icon-dianbo-ou':'icon-dianbo-in']" @click=""></i>
                      <i class="icon-more" @click="toCallDetail(call)"></i>
                    </p>
                  </div>
                </div>
              </div>
              <p @click="showTel">拨号键盘</p>
            </bos-tab-pane>
          </bos-tabs>
        </div>
      </div>
      <div class="window-Black" :class="{trans:telShow}">
        <div class="tel">
          <div class="display-num">
            <i @click="closeTel" class="icon-icb"></i>
            <input :value="phone.join('')" style="text-align: center"/>
            <i @click="deleteNum" class="icon-idd"></i><br/>
          </div>
          <div class="dial-btn">
            <i data-num="1" @click="getPhone($event)" class="icon-one"></i>
            <i data-num="2" @click="getPhone($event)" class="icon-two"></i>
            <i data-num="3" @click="getPhone($event)" class="icon-three"></i><br/>
            <i data-num="4" @click="getPhone($event)" class="icon-four"></i>
            <i data-num="5" @click="getPhone($event)" class="icon-five"></i>
            <i data-num="6" @click="getPhone($event)" class="icon-six"></i><br/>
            <i data-num="7" @click="getPhone($event)" class="icon-seven"></i>
            <i data-num="8" @click="getPhone($event)" class="icon-eight"></i>
            <i data-num="9" @click="getPhone($event)" class="icon-nine"></i><br/>
            <i data-num="*" @click="getPhone($event)" class="icon-xing"></i>
            <i data-num="0" @click="getPhone($event)" class="icon-zero"></i>
            <i data-num="#" @click="getPhone($event)" class="icon-sharp"></i>
          </div>
          <div class="other-btn">
            <bos-button class="btn" type="primary" size="large" style="left: -1.5rem" @click="makeCall">音频电话</bos-button>
            <bos-button class="btn" type="primary" size="large" style="background-color: #e6795a;border-color: #e6795a;right: -1.5rem">视频通话</bos-button>
          </div>
        </div>
      </div>
    </div>
    <div class="tab_menu">
      <div class="footer" id="footer">
        <ul>
          <li class="selected"><i class="bottom_one"></i>会话</li>
          <li @click="toAddressList"><i class="bottom_two"></i>通讯录</li>
          <li @click="toMe"><i class="bottom_three"></i>我</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {DB} from "@/assets/js/db"
  import {generateUUID,getGroupName,calls,io} from '@/assets/js/utils';
  import * as actionTypes from "@/store/actions-types";
  export default {
    data() {
      return {
        telShow: false,
        phone:[],
        messageList:[],
        callList:[],
        activeName: this.$store.state.contactName,
        msgLists : [],
        msgGroupLists : undefined,
        identity:this.$route.params.identity,
      }
    },
    created() {
      this.GetRecord();
    },
    mounted(){
      this.getCall();
      this.$store.state.currentUser.contact = true;
    },
    beforeDestroy(){
      this.$store.state.contactName = 'first';
    },
    methods: {
      GetRecord(){
        let _this = this;
        let msgDB = new DB("Message");//信息的表
        /*点对点消息查询*/
        msgDB.queryConfig({name:'message',moduleUser : _this.myself.uniqueId},function(err, result){
          if(err){
            console.log(err.message);
          }else{
            console.log("查询消息数据库");
            console.log(result);
            var map = {},
              dest = [];
            for(var i = 0; i < result.length; i++){
              var ai = result[i];
              /*合并相同的对象*/
              if(ai.identity){
                if(!map[ai.identity]){
                  dest.push({
                    identity: ai.identity,
                    name: ai.name,
                    data: [ai]
                  });
                  map[ai.identity] = ai;
                }else{
                  for(let j = 0; j < dest.length; j++){
                    let dj = dest[j];
                    if(dj.identity == ai.identity){
                      dj.data.push(ai);
                      break;
                    }
                  }
                }
              }
            }
            _this.msgLists = [];
            for(let i =0;i<dest.length;i++){
//             找到对方
              let timers = [];
              let value = undefined;
              let id = (dest[i].identity.split("_"))[1];
              for(let j=0;j<_this.$store.state.currentUserAll.length;j++){
                if(_this.$store.state.currentUserAll[j].uniqueId == id){
                  value = _this.$store.state.currentUserAll[j];
                }
              }
              for(let j=0;j<dest[i].data.length;j++){
                dest[i].data[j].ids = value;
              }
              for(let j=0;j<dest[i].data.length;j++){
                timers.push(new Date(dest[i].data[j].sendDate).getTime());
              }
              var max=timers[0];
              if(timers.length>1){
                for(var k in timers) {
                  if (timers[k] > max) {
                    max = timers[k];
                  }
                }
              }
              for(let j=0;j<dest[i].data.length;j++){
                if(new Date(dest[i].data[j].sendDate).getTime() == max){
                  _this.msgLists.push(dest[i].data[j]);
                }
              }
              console.log("合并对象");
              console.log(_this.msgLists);
              //未读
              let query = {
                identity:dest[i].identity,
                isRead:'N'
              };
              msgDB.queryConfig(query,function(err, result){
                if(err){
                  console.log(err.message);
                }else{
                  _this.msgLists[i].noReadCount = result.length;
                  if(result.length){
                    $('.count'+_this.msgLists[i].uuid).css("display","block");
                    $(".bottom_one").css("backgroundPosition","0 -6.6rem");
                  }
                }
              });
            }
            for(let j=0;j<_this.msgLists.length;j++){
              _this.changeText(_this.msgLists[j]);
            }
          }
        });
      },
      changeText(value){
        if(value.msgType === "file"){
          value.msg = "[文件]";
        }
        if(value.msgType === "picture"){
          value.msg = "[图片]";
        }
        if(value.msgType === "audio"){
          value.msg = "[语音]";
        }
        if(value.msgType === "video"){
          value.msg = "[视频]";
        }
      },
      getCall(){
        let _this = this;
        let callLists = [];
        let db = new DB("Message");
        db.queryConfig({name: 'call'},function(err,res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log("查询通话记录");
            console.log(res);
            let sendDate = [];
            for(let i=0;i<res.length;i++){
              if(res[i].callType){
                sendDate.push(new Date(res[i].callDate).getTime());
              }
            }
            let sendDateSort = sendDate.sort(io.sortNumberSub);
            let sendDateResort = [];
            for(let i=0;i<sendDateSort.length;i++){
              sendDateResort.push(io.formatDateTime(new Date(sendDateSort[i])));
            }
            for(let i=0;i<sendDateResort.length;i++){
              for(let j=0;j<res.length;j++){
                if(sendDateResort[i]==res[j].callDate){
                  callLists.push(res[j]);
                }
              }
            }
            var hash = {};
            callLists = callLists.reduce(function(item, next) {
              hash[next.identity] ? '' : hash[next.identity] = true && item.push(next);
              return item;
            }, []);
            _this.callList = callLists;
          }
        })
      },
      handleClick(tab, event) {
      },
      showTel(){
        this.telShow = true;
      },
      closeTel(){
        this.telShow = false;
      },
      getPhone: function (e) {
        this.phone.push(e.target.getAttribute('data-num'));
        if (this.phone.length > 11) {
          this.phone.length = 11;
        }
      },
      deleteNum: function () {
        this.phone.splice(-1, 1).join('');
      },
      toCallDetail(call){
        let _this =this;
        this.$store.state.currentUser.contact = false;
        let dbGroupMember = new DB('GroupMember');
        if(call.sender == this.$store.state.account.uniqueId){
          dbGroupMember.queryConfig({uniqueId: call.receiver},function(err,res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              console.log(res)
              _this.$router.push({name:'CallDetail',params:{user:res[0]}});
            }
          })
        }else if(call.receiver == this.$store.state.account.uniqueId){
          dbGroupMember.queryConfig({uniqueId: call.sender},function(err,res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              _this.$router.push({name:'CallDetail',params:{user:res[0]}});
            }
          })
        }
      },
      toAddressList(){
        this.$store.state.currentUser.contact = false;
        this.$router.replace("/address-list");
      },
      toMe(){
        this.$store.state.currentUser.contact = false;
        this.$router.replace("/me");
      },
      deleteMessage(index,message) {
        let _this = this;
        this.$confirm('确定删除该消息?', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(function (value) {
          _this.msgLists.splice(index, 1);
          let query = {
            identity:message.identity
          };
          let msgDB = new DB("Message");
          msgDB.remove(query,{ multi: true },function(err){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              console.log('removed msgDB');
            }
          });
        }).then(function(){
          if(!_this.msgLists.length){
            $(".bottom_one").css("backgroundPosition","0 0");
          }
        });

      },
      toChat(user){
        let _this = this;
        this.$store.state.currentUser.contact = false;
        if(user.ids){
          this.$router.push({name:"Chat",params:{user:user.ids,where:"contact"}});
        }else if(user.groupUri){
          let db = new DB("Group");
          db.queryConfig({uniqueId:user.groupUri},function(err,res){
              if(err){
                _this.$message.error('网络错误,请重试');
              }else{
                _this.$router.push({name:"ChatGroup",params:{group:res[0],where:"contact"}});
              }
          })
        }else{
          this.$router.push({name:"ChatMany",params:{chatUsers:user.chatMany,chatIps:user.chatIps,chatIds:user.chatIds,where:"contact"}});
        }
      },
      toHandle(){
        this.$store.state.currentUser.contact = false;
        this.$router.replace("/handle");
      },
      makeCall(){
        let _this = this;
        let callNumber = this.phone.join('');
        let dbGroupMember = new DB('GroupMember');
        /*根据号码获取对应的IP*/
        dbGroupMember.queryConfig({phoneNum:callNumber},function(err,res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            _this.$store.state.call.dialImageUser = res[0];
            if(this.$store.state.currentUser.communicationMode == "ADHOC"){
              calls.initCall(_this.$store.state.account.sipid);/*此处为本机ip*/
              calls.makeCall(res[0].sipid);
            }else if(this.$store.state.currentUser.communicationMode == "SATCOM"){
              calls.sendCallRequest(sim, callNumber);//sim暂时不清楚传什么参数
              calls.storeCallMessage(this.$store.state.account, this.$store.state.call.dialUser, 'radio', 'Y');
            }
            _this.$store.state.call.isDial = true;
            _this.$store.state.call.showDial = true;
          }
        })
      },
      radioCallBack(call){
        let sipid,phoneNum;
        if(call.isCalling == 'Y'){
          for(let i = 0; i < this.$store.state.currentUserAll.length; i++){
            if(this.$store.state.currentUserAll[i].uniqueId == call.receiver){
              this.$store.state.call.dialUser = this.$store.state.currentUserAll[i];
              if(this.$store.state.currentUser.communicationMode == "ADHOC"){
                sipid = this.$store.state.currentUserAll[i].sipid;
                calls.initCall(this.$store.state.account.sipid);/*此处为本机ip*/
                calls.makeCall(sipid);/*此处为接收方ip*/
              }else if(this.$store.state.currentUser.communicationMode == "SATCOM"){
                phoneNum = this.$store.state.currentUserAll[i].phoneNum;
                calls.sendCallRequest(sim, phoneNum);//sim暂时不清楚传什么参数
                calls.storeCallMessage(this.$store.state.account, this.$store.state.call.dialUser, 'radio', 'Y');
              }
            }
          }
        }else if(call.isCalling == 'N'){
          for(let i = 0; i < this.$store.state.currentUserAll.length; i++){
            if(this.$store.state.currentUserAll[i].uniqueId == call.sender){
              this.$store.state.call.dialUser = this.$store.state.currentUserAll[i];
              if(this.$store.state.currentUser.communicationMode == "ADHOC"){
                sipid = this.$store.state.currentUserAll[i].sipid;
                calls.initCall(this.$store.state.account.sipid);/*此处为本机ip*/
                calls.makeCall(sipid);/*此处为接收方ip*/
              }else if(this.$store.state.currentUser.communicationMode == "SATCOM"){
                phoneNum = this.$store.state.currentUserAll[i].phoneNum;
                calls.sendCallRequest(sim, phoneNum);//sim暂时不清楚传什么参数
                calls.storeCallMessage(this.$store.state.account, this.$store.state.call.dialUser, 'radio', 'Y');
              }
            }
          }
        }
        this.$store.state.call.isDial = true;
        this.$store.state.call.showDial = true;
      }
    }
  };
</script>
<style>
  .message-group-record a>span:nth-of-type(1){
    background: red;
    color: white;
    min-width: 1em;
    line-height: 1.1em;
    text-align: center;
    display: inline-block;
    border-radius: 1em;
    font-size: .6em;
    padding: .3em;
    height: 1.1em;
    position: absolute;
    left: 4em;
    margin-top: .1em;
  }
  /*会话页面的样式编写*/
  .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .top span{
    position: absolute;
    left: 0;
  }
  .tab_box{width:100%;min-height:100%;padding-bottom:3.2rem;}
  .tab_menu .selected{color:#6ea003;}
  .tab_menu .selected i{background-position:0 -2.06rem;}
  .tab_menu .selected .bottom_two {top:.4rem}
  .contact-content{
    background:#fff;
    padding-top:3rem;
  }
  .contact-content>.content_talk{
    text-align: center;
  }
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
  .tab_box > .hide{display:none;}
  .bos-tabs__nav{
    width:100%;
  }
  #body .bos-tabs__item{
    width:50%;
  }
  #body .bos-tab-pane>p{
    width:100%;
    line-height:2.4rem;
    font-size:1rem;
    border-top:solid 1px #eee;
    position:fixed;
    bottom:3.2rem;
    background: #fff;
  }
  .window-Black{
    width:100%;
    height:100%;
    background:#fff;
    position:fixed;
    top: 100%;
    left:0;
    z-index:1002;
    -moz-transition: top ease 200ms;
    -o-transition: top ease 200ms;
    -webkit-transition: top ease 200ms;
    transition: top ease 200ms;
  }
  .trans{
    top: 0;
  }
  .tel{
    width:250px;
    display: inline-block;
    position: absolute;
    left: 50%;
    margin-top: 2rem;
    margin-left:-125px;
  }
  .tel .display-num input{
    position: absolute;
    left: 0.3rem;
    top: -0.3rem;
    font-size: 1.2rem;
    border: none;
  }
  .tel .icon-icb{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: url("../../../../static/images/im_close_blue.png") no-repeat;
    background-size: 2rem;
    position: absolute;
    left: -5rem;
    top: -0.5rem;
  }
  .tel .icon-idd{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: url("../../../../static/images/im_dial_delete.png") no-repeat;
    background-size: 2rem;
    position: absolute;
    right: -5rem;
    top: -0.5rem;
  }
  .dial-btn{
    padding: 0.9rem 0;
  }
  .dial-btn i{
    margin: 0 1rem;
  }
  .tel .dial-btn>i{
    display: inline-block;
    width: 3rem;
    height: 3rem;
    background: url("../../../../static/images/im_zero.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-one{
    background: url("../../../../static/images/im_one.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-two{
    background: url("../../../../static/images/im_two.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-three{
    background: url("../../../../static/images/im_three.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-four{
    background: url("../../../../static/images/im_four.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-five{
    background: url("../../../../static/images/im_five.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-six{
    background: url("../../../../static/images/im_six.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-seven{
    background: url("../../../../static/images/im_seven.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-eight{
    background: url("../../../../static/images/im_eight.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-nine{
    background: url("../../../../static/images/im_nine.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-xing{
    background: url("../../../../static/images/im_xing.png") no-repeat;
    background-size: 3rem;
  }
  .tel .dial-btn>i.icon-sharp{
    background: url("../../../../static/images/im_sharp.png") no-repeat;
    background-size: 3rem;
  }
  .tel .other-btn{
    padding: 0 0.9rem;
  }
  .tel .other-btn .btn{
    width: 55%;
    position: absolute;
  }
  .icon-radio-ou, .icon-radio-in, .icon-dianbo-ou, .icon-dianbo-in{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    position: relative;
    top: 0.7rem;
    left: 0.4rem;
  }
  .icon-radio-ou{
    background: url("../../../../static/images/im_radio_ou.png") no-repeat;
    background-size: 100%;
  }
  .icon-radio-in{
    background: url("../../../../static/images/im_radio_in.png") no-repeat;
    background-size: 100%;
  }
  .icon-dianbo-ou{
    background: url("../../../../static/images/im_radio_ou.png") no-repeat;
    background-size: 100%;
  }
  .icon-dianbo-in{
    background: url("../../../../static/images/im_radio_in.png") no-repeat;
    background-size: 100%;
  }
  .icon-more{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_massage_more.png") no-repeat;
    background-size: 100%;
    position: relative;
    top: 0.5rem;
    left: 1.9rem;
  }
  .phone-list,.message-list { overflow:hidden;height:2.4rem;line-height:2.4rem;border-bottom: 1px solid #eee}
  .phone-list p:nth-of-type(1){float:left;}
  .phone-list p:nth-of-type(1) span:nth-of-type(1){margin-left:.8rem;font-size: 0.9rem}
  .phone-list img{width: 2rem;height:2rem;float: left;margin-left: 1rem;margin-top:3px; border-radius: 50%}
  .phone-list p:nth-of-type(1) span:nth-of-type(2){margin-left: 0;font-size: 0.9rem}
  .phone-list p:nth-of-type(2){float:right;margin-right:3.2rem;font-size:1rem;}

  .icon-deletemessage{
    display: inline-block;
    width: 10%;
    height: 1.2rem;
    background: url("../../../../static/images/im_delete_group.png") no-repeat;
    background-size: 100%;
    margin-top:.6rem;
    margin-left:.3rem;
    float:left;
  }
  .message-group-record .message-list1{width:100%;border-bottom: 1px solid #eee !important;padding:0 !important;}
  .message-group-record .message-list1>a{height:2.4rem;float:left;width: 70%;text-align: left;}
  .message-group-record .message-list1>p{width:25%;float:left;margin-right:10px;}
  .message-group-record .message-list p>span{
    background:#fff;
    line-height:2.5rem;
    float:left;
    width:85%;
    font-size:.7rem;
  }
  .message-group-record a>span:nth-of-type(2){
    height:2.3rem !important;
    line-height: 2.3rem !important;
    background: #fff;
    color:#000;
    display: inline-block;
    text-align: center;
    width:80%;
    margin-top: 0.25rem;
  }
  .message-group-record a>span>span:nth-of-type(1){
    width:27%;
    background: #fff;
  }
  .message-group-record a>span>span:nth-of-type(2){
    width:65%;
    background: #fff;
    text-align: left;
  }
  .message-group-record a>span>span:nth-of-type(2) img{width:1.2rem;height:1.2rem;}
  .message-group-record a>p span{
    width:100%;
  }
  .message-box{
    overflow-y:auto;padding-bottom:3rem;
  }
  .message-group-record .message-list>a>p span:nth-of-type(1){margin-left:.8rem;width:100%;}
  .message-group-record .message-list>a>img{width: 2rem;height:2rem;float:left;margin-left: 1rem;margin-top:3px;}
</style>

