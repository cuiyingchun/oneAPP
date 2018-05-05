<template>
  <div>
    <div class="tab_content">
      <header class="chat-head">
        <span @click="toContact"><i class="icon-back"></i>返回</span>
        <h1>{{user.nickName}}</h1>
        <i class="icon-call" @click="showCall"></i>
        <i class="icon-setting" @click="toChatSetting"></i>
      </header>
      <section class="chat-box" :style="{backgroundColor: backgroundColor}" @click="closeDis">
        <section class="chat-list">
          <ul id="PUL">
          </ul>
        </section>
      </section>
    </div>
    <div class="windowBlack" :class="{trans:callShow}" @click="closeCall">
      <div class="call-choice">
        <p @click="makeCall">
          <i></i>
          <span>语音通话</span>
        </p>
        <p>
          <i></i>
          <span>视频通话</span>
        </p>
        <p>
          <i></i>
          <span>视频回传</span>
        </p>
        <p>
          <i></i>
          <span>视频点播</span>
        </p>
      </div>
    </div>
    <div class="chat-footer">
      <div class="footer">
        <i class="icon-feature"></i>
        <div class="somechoice" style="display: inline-block">
          <span @click="showStatus">状态<i class="icon-level1" id="color"></i></span>
          <div class="status" v-show="statusShow">
            <ul>
              <li>一般<i class="icon-level1" id="yellow" @click="getFontColor('icon-level1','#e7d117',1)"></i></li>
              <li>紧急<i class="icon-level2" id="oriange" @click="getFontColor('icon-level2','#FF882B',2)"></i></li>
              <li>非常紧急<i class="icon-level3" id="red" @click="getFontColor('icon-level3','#bb120b',3)"></i></li>
            </ul>
          </div>
          <span @click="selectResponse">应答<i :class="{'icon-checkon':responseSelect,'icon-checkoff':!responseSelect}"></i></span>
          <span @click="showFont">字体<i class="icon-show"></i></span>
          <div class="font" v-show="fontShow">
            <ul>
              <li @click="getFontStyle('1','./static/images/im_blod.png')">粗体<i class="icon-bold"></i></li>
              <li @click="getFontStyle('2','./static/images/im_underline.png')">下划线<i class="icon-underline"></i></li>
              <li @click="getFontStyle('3','./static/images/im_message_font_color_black.png')" aria-checked="true">黑色<i class="icon-black"></i></li>
              <li @click="getFontStyle('4','./static/images/im_message_urgency_level_3.png')">红色<i class="icon-red"></i></li>
            </ul>
          </div>
        </div>
        <!--文字输入框-->
        <div class="Main">
          <div class="Input_Box" v-show="way">
            <div contenteditable="true" class="Input_text" @click="pasteTime"></div>
            <div class="Input_Foot">
              <a class="imgBtn" href="javascript:void(0);"><img  src="../../../../static/images/im_chatting_biaoqing_btn_normal.png" width="100%"></a>
            </div>
          </div>
          <!--表情-->
          <div class="faceDiv" style="display: none">
            <section class="emoji_container">
            </section>
            <!--<section class="emoji_tab"></section>-->
          </div>
          <!--复制-->
          <div id="copy" style="display: none">
            <ul>
              <li class="myCopy"  data-clipboard-action="copy" @click="copyDiv">复制</li>
              <li class="transmit" @click="toTransmit('text')">转发</li>
              <li class="myDel" @click="delDiv">删除</li>
            </ul>
          </div>
          <!--文件图片操作-->
          <div id="trans" style="display: none">
            <ul>
              <li class="transmit" @click="toTransmit('more')">转发</li>
              <li class="myDel" @click="delDiv">删除</li>
            </ul>
          </div>
          <!--粘贴-->
          <button id="paste" @click="pasteDiv" style="display: none">粘贴</button>
        </div>
        <!--语音输入框-->
        <div v-show="!way" class="voice-input">
          <div class="voice-btn">
            <i v-show="sayshow"></i>
            <p id="saysome">{{say}}</p>
          </div>
        </div>
        <bos-button type="primary" size="small" class="send-btn" v-show=false>发送</bos-button>
        <i id="talk_icon" :class="{'icon-voice':way,'icon-keyboard':!way}" @click="selectWay" v-show="!textContentShow"></i>
      </div>
      <!--更多功能-->
      <div class="feature-display" style="display: none">
        <ul>
          <li>
            <div @click="filePiker">
              <i class="icon-file"></i>
              <p>文件</p>
            </div>
          </li>
          <li>
            <div @click="sendPos">
              <i class="icon-location"></i>
              <p>位置共享</p>
            </div>
          </li>
          <li>
            <div @click="cameraPiker">
              <i class="icon-vedio"></i>
              <p>视频</p>
            </div>
          </li>
          <li>
            <div @click="toFormatPhrase">
              <i class="icon-templet"></i>
              <p>格式短语</p>
            </div>
          </li>
          <li>
            <div @click="toHandPaint">
              <i class="icon-scrawl"></i>
              <p>手绘</p>
            </div>
          </li>
          <li>
            <div>
              <a class="icon-takepic">
                <input type="file" accept="image/*" capture="camera">
              </a>
              <p>拍照</p>
            </div>
          </li>
          <li>
            <div @click="showCall">
              <i class="icon-phone"></i>
              <p>电话</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="divCenter" v-show="picShow">
      <img />
    </div>
    <div id="videoBox" style="display:none;">
      <video width="100%" height="100%" id="videoCenter" src=""></video>
      <i class="bos-icon-close"></i>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery';
  import Vue from 'vue';
  //import Clipboard from 'clipboard';
  import {generateUUID,calls,io} from '@/assets/js/utils';
  import {DB} from '@/assets/js/db';
  export default{
    name:"Chat",
    data() {
      return {
        user:this.$route.params.user,
        where:this.$route.params.where,
        myself:this.$store.state.account,
        responseSelect:false,
        fontShow:false,
        statusShow:false,
        callShow:false,
        sayshow : false,
        picShow : false,
        videoShow : false,
        way:true,
        imgUrl : undefined,
        textContent:'',
        bgColor: '#fff',
        selColor: '',
        textContentShow:false,
        messageList:[],
        otherIp:[],
        photoPath: '',
        timeOutEvent : 0,
        say : "按住说话",
        timers : undefined,
        backgroundColor: this.$store.state.backgroundColor,
        infoLevel: this.$store.state.chatStatus.infoLevel,
        timeOutDiv:0,
        copyText:"",
        pasteText:this.$store.state.pasteText,
        nowText: "",
        nowDate:'',
        transText:"",
        textType:""
      }
    },
    mounted(){
      this.$store.state.nowPage = "Chat";
      this.$store.state.chatStatus.fontStyle = "3";
      this.$store.state.chatStatus.statusColor = '#e7d117';
      this.$store.state.chatStatus.infoLevel = 1;
      this.$store.state.chatStatus.isReply = false;
      $(".Input_text").css("color","black");
      $(".Input_text").css("font-weight","normal");
      $(".Input_text").css("text-decoration","none");
      let _this =this;
      this.chatOne();
      this.timers = setInterval(function(){if($(".Input_text").html() == ''){
        $('.send-btn').hide();
        $("#talk_icon").show();
      }else{
        $('.send-btn').show();
        $("#talk_icon").hide();
      }
      _this.Record_init();
      },500);
      this.checkoutRecordD();
      this.sendPictrue();
      this.longTap();
    },
    methods: {
//    位置共享
      sendPos(){
        let ul = $('#PUL');
        let num = io.creatRand();
        let db = new DB("Message");
        let nowPos = {
            latitude:undefined,
            longitude:undefined
        };
        nowPos.latitude = this.$store.state.nowPoint.latitude;
        nowPos.longitude = this.$store.state.nowPoint.longitude;
        let text = "经度："+nowPos.longitude+" 纬度："+nowPos.latitude;
        let msg = {
          name : "message",
          msg : text,
          msgType : "text",
          isRead : "Y",//是否已读，默认N
          noReadCount:0,
          isConfirm : "N",//是否需要确认,默认N 不需要
          isResponse :"N",//是否受到相应,默认N 不需要
          msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
          isDelete : "N",//是否删除,默认N
          isFail:"N",//是否发送失败
          sender : this.myself.uniqueId,//发送者
          receiver : this.user.uniqueId,//接受者
          identity:this.myself.uniqueId+"_"+this.user.uniqueId,//发送+接收
          sendImage : this.myself.image,//发送者头像
          chatImage:this.user.image,
          nickName : this.myself.nickName,//发送者昵称
          chatName : this.user.nickName,
          sendDate : io.formatDateTime(new Date()),
          statusColor:this.$store.state.chatStatus.statusColor,
          fontStyle:this.$store.state.chatStatus.fontStyle,
          isReply:true,
          chatMany :"",
          uuid : generateUUID.creatUuid(),
          moduleUser:this.myself.uniqueId,
          num:io.creatRand(),//模板随机数
        };
        io.sendTemplate(ul,msg.sendDate,this.myself.image,num,msg.msg,msg.statusColor,msg.fontStyle,
          msg.isResponse,msg.isFail,msg.sender,msg.receiver,'');
        db.insert(msg,function(err,result){
          if(err){
            console.log(err.message);
          }else{
            return result;
          }
        });
      },
//      聊天历史记录
      checkoutRecordD(){
        let _this = this;
        let db = new DB('Message');
        let query = {
          identity: this.myself.uniqueId+"_"+this.user.uniqueId,
        };
        new Promise(function(resolve){
          db.queryConfig(query,function(err,res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              console.log("查询聊天历史记录");
              console.log(res);
              resolve(res);
            }
          })
        }).then(function(value){  //时间数组
          io.historyChat(value,$("#PUL"),_this.myself,'' );
        }).then(function(){
          io.scrollBottom("PUL");
          db.update(query,{ $set: { isRead: 'Y' } }, { multi: true },function(err,res){
            if(err){
              console.log(err.message);
            }else{
            }
          });
          $(".photos").click(function(){
            _this.picShow = true;
            $("#divCenter").find("img").prop("src",$(this).prop("src"));
          });
          $("#divCenter").click(function(){
            _this.picShow = false;
          });
          _this.audioPlay();
          $(".video-box>video").click(function(){
            $("#videoCenter").attr("src",$(this).attr("src"));
            $("#videoBox").show();
            let videoO = document.getElementById("videoCenter");
            videoO.play();
          });
          $(".bos-icon-close").click(function(){
            $("#videoBox").hide();
          })
        });
      },
//      表情
      chatOne(){
        let msg = {
          name : "message",
          adhoc : 'true',
          msg : "",
          msgType : "text",
          isRead : "Y",//是否已读，默认N
          noReadCount:0,
          isConfirm : "N",//是否需要确认,默认N 不需要
          isResponse :"N",//是否受到相应,默认N 不需要
          msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
          isDelete : "N",//是否删除,默认N
          isFail:"N",//是否发送失败
          sender : this.myself.uniqueId,//发送者
          receiver : this.user.uniqueId,//接受者
          identity:this.myself.uniqueId+"_"+this.user.uniqueId,//发送+接收
          sendImage : this.myself.image,//发送者头像
          chatImage:this.user.image,
          nickName : this.myself.nickName,//发送者昵称
          chatName : this.user.nickName,
          sendDate : "",
          statusColor:"",
          fontStyle:"",
          isReply:this.responseSelect,
          uuid : generateUUID.creatUuid(),
          msgStatus : "init",
          moduleUser:this.myself.uniqueId,
          num:'',//模板随机数
        };
        this.otherIp=[];
        this.otherIp.push(this.user.sipid);
        $('.Main').myEmoji(this.myself,this.user,this.otherIp,msg);
      },
//      播放语音
      audioPlay(){
        $(".icon-receivevoice").click(function(){
          $(this).addClass("actived");
          let path = $(this).next("span").html();
          var options = {
            src: ["/sdcard/" + path],
            html5: true
          };
          var sound = GeoBOS.media.AudioPlayer.getInstance(options);

          sound.on('end', function () {
            $(".icon-receivevoice").removeClass("actived");
          });
          sound.play();
        });
      },
      showCall(){
        this.callShow = true;
        $('.feature-display').css('display','none');
      },
      closeCall(){
        this.callShow = false;
      },
      showFont(){
        if(this.statusShow == true){
          this.statusShow = false;
        }
        this.fontShow = !this.fontShow;
      },
      showStatus(){
        if (this.fontShow == true){
          this.fontShow = false;
        }
        this.statusShow = !this.statusShow;
      },
      closeDis(){
        io.closeDisplay();
      },
      //应答开关
      selectResponse(){
        this.responseSelect = !this.responseSelect;
        this.$store.state.chatStatus.isReply = this.responseSelect;
      },
      selectWay(){
        this.way = !this.way;
      },
      toContact(){
        clearInterval(this.timers);
        if(this.where == "contact"){
          this.$router.go(-1);
        }else if(this.where == "handle"){
          this.$router.replace("/handle");
        }else{
          this.$router.replace("/address-list");
        }
      },
      toChatSetting(){
        let _this = this;
        clearInterval(this.timers);
        this.$router.push({name: 'ChatSetting', params: {user:_this.user}});
      },
      toFormatPhrase(){
        let _this = this;
        let ul = $('#PUL');
        clearInterval(this.timers);
        this.$router.push({name: 'TemplateMessage', params: {user:_this.user,ul:ul}});
      },
      toHandPaint(){
        let _this = this;
        let ul = $('#PUL');
        clearInterval(this.timers);
        this.$router.push({name: 'HandPaint', params: {user:_this.user,ul:ul}});
      },
      getFontColor(className,color,infolevel){
        document.getElementById("color").className = className;
        this.$store.state.chatStatus.statusColor =color;
        this.$store.state.chatStatus.infoLevel =infolevel;
        this.statusShow = false;
      },
      getFontStyle(fontStyle,url){
        this.$store.state.chatStatus.fontStyle = fontStyle;
        io.fontStyleDiv(fontStyle);
        $(".icon-show").css("background",'url('+url+') no-repeat');
        $(".icon-show").css("background-size","97%");
        this.fontShow = false;
      },
      // 发送图片
      sendPictrue() {
        let _this = this;
        $(".icon-takepic").on("change","input[type='file']",function(){
          let filePath=$(this).val();
          if(filePath.indexOf("jpg")!=-1 || filePath.indexOf("png")!=-1){
            let arr=filePath.split('\\');
            let fileName=arr[arr.length-1];
            var photoPath = "/Camera/"+fileName;
            // 前端数据显示效果
            let ul = $('#PUL');
            let db = new DB("Message");
            let msg = {
              name : "message",
              adhoc : 'true',
              msg : photoPath,
              msgType : "picture",
              isRead : "Y",//是否已读，默认N
              noReadCount:0,
              isConfirm : "N",//是否需要确认,默认N 不需要
              isResponse :"N",//是否受到相应,默认N 不需要
              msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
              isDelete : "N",//是否删除,默认N
              isFail:"N",//是否发送失败
              sender : _this.myself.uniqueId,//发送者
              receiver : _this.user.uniqueId,//接受者
              identity: _this.myself.uniqueId+"_"+_this.user.uniqueId,
              sendImage : _this.myself.image,//发送者头像
              nickName : _this.myself.nickName,//发送者昵称
              chatImage:_this.user.image,
              chatName : _this.user.nickName,
              sendDate : io.formatDateTime(new Date()),
              msgStatus : "init",//init,sender,success,fail
              moduleUser : _this.myself.uniqueId,//当前账号的使用uri
              uuid:generateUUID.creatUuid()
            };
            io.sendPhotoTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,photoPath,msg.isFail, _this.myself.uniqueId, _this.user.uniqueId,'');
            io.scrollBottom("PUL");
            io.sendFile(_this.user.sipid,photoPath,"picture",_this.myself.uniqueId,_this.user.uniqueId,_this.myself.image,
              _this.myself.nickName,undefined,_this.user.image,_this.user.nickName,msg.uuid);
            db.insert(msg,function(err,result){
              if(err){
                console.log(err.message);
              }else{
                return result;
              }
            });
          }else{
            console.log("拍照上传有误，请重新拍照");
            return false;
          }
          $('.feature-display').css('display','none');
          $(".photos").click(function(){
              _this.picShow = true;
              $("#divCenter").find("img").prop("src",$(this).prop("src"));
          });
          $("#divCenter").click(function(){
            _this.picShow = false;
          })
        })
      },
      /*选择文件*/
      filePiker(){
        let _this = this;
        GeoBOS.filePicker.pickFile( function (err, filePath) {
          if (err) {
            return console.log(err.message);
          }
          //let mfileName = filePath[0].substring(filePath[0].lastIndexOf("\/") + 1, filePath[0].length);
          /*前台显示*/
          let ul = $('#PUL');
          let num = io.creatRand();
          // 数据库
          let db = new DB("Message");
          let msg = {
            name : "message",
            adhoc : 'true',
            msg : filePath[0],
            msgType : "file",
            isRead : "Y",//是否已读，默认N
            noReadCount:0,
            isConfirm : "N",//是否需要确认,默认N 不需要
            isResponse :"N",//是否受到相应,默认N 不需要
            msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
            isDelete : "N",//是否删除,默认N
            isFail:"N",//是否发送失败
            sender : _this.myself.uniqueId,//发送者
            receiver : _this.user.uniqueId,//接受者
            identity: _this.myself.uniqueId+"_"+_this.user.uniqueId,
            sendImage : _this.myself.image,//发送者头像
            nickName : _this.myself.nickName,//发送者昵称
            chatImage:_this.user.image,
            chatName : _this.user.nickName,
            sendDate : io.formatDateTime(new Date()),
            msgStatus : "init",//init,sender,success,fail
            moduleUser : _this.myself.uniqueId,//当前账号的使用uri
            uuid:generateUUID.creatUuid()
          };
          if(filePath[0].indexOf("jpg")!= -1||filePath[0].indexOf("png")!= -1){
            msg.msgType = 'picture';
            io.sendPhotoTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,filePath[0],msg.isFail, _this.myself.uniqueId, _this.user.uniqueId,'');
          }else if(filePath[0].indexOf("aac")!= -1){
            msg.msgType = 'audio';
            io.sendAudioTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,filePath[0],msg.isFail,_this.myself.uniqueId,_this.user.uniqueId,'');
          }else if(filePath[0].indexOf("mp4")!= -1){
            msg.msgType = 'video';
            io.sendVedioTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,num,filePath[0],msg.isFail,_this.myself.uniqueId, _this.user.uniqueId,'');
          }else{
            io.sendFileTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,num,filePath[0],msg.isFail,_this.myself.uniqueId, _this.user.uniqueId,'');
          }
          io.scrollBottom("PUL");
          $('.feature-display').css('display','none');
          io.sendFile(_this.user.sipid,filePath[0],msg.msgType,_this.myself.uniqueId,_this.user.uniqueId,_this.myself.image,
            _this.myself.nickName,undefined,_this.user.image,_this.user.nickName,msg.uuid);
          db.insert(msg,function(err,result){
            if(err){
              console.log(err.message);
            }else{
              return result;
            }
          });
        });
      },
      //发送视频
      cameraPiker(){
        let _this = this;
        GeoBOS.filePicker.pickCamera( function (err, filePath) {
          if (err) {
            return console.log(err.message);
          }
          if(filePath.indexOf('mp4') != -1){
            /*前台显示*/
            let ul = $('#PUL');
            let num = io.creatRand();
            // 数据库
            let db = new DB("Message");
            let msg = {
              name : "message",
              adhoc : 'true',
              msg : filePath,
              msgType : "video",
              isRead : "Y",//是否已读，默认N
              noReadCount:0,
              isConfirm : "N",//是否需要确认,默认N 不需要
              isResponse :"N",//是否受到相应,默认N 不需要
              msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
              isDelete : "N",//是否删除,默认N
              isFail:"N",//是否发送失败
              sender : _this.myself.uniqueId,//发送者
              receiver : _this.user.uniqueId,//接受者
              identity: _this.myself.uniqueId+"_"+_this.user.uniqueId,
              sendImage : _this.myself.image,//发送者头像
              nickName : _this.myself.nickName,//发送者昵称
              chatImage:_this.user.image,
              chatName : _this.user.nickName,
              sendDate : io.formatDateTime(new Date()),
              msgStatus : "init",//init,sender,success,fail
              moduleUser : _this.myself.uniqueId,//当前账号的使用uri
              uuid:generateUUID.creatUuid()
            };
            io.sendFile(_this.user.sipid,filePath,"video",_this.myself.uniqueId,_this.user.uniqueId,_this.myself.image,
              _this.myself.nickName,undefined,_this.user.image,_this.user.nickName,msg.uuid);
            db.insert(msg,function(err,result){
              if(err){
                console.log(err.message);
              }else{
                return result;
              }
            });
            io.sendVedioTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,num,filePath,msg.isFail,_this.myself.uniqueId, _this.user.uniqueId,'');
            io.scrollBottom("PUL");
          }
          $('.feature-display').css('display','none');
        });
      },
      longTap(){
        let _this = this;
        $("#saysome").on({
          touchstart: function(e){
            _this.timeOutEvent = setTimeout(_this.longPress(),500);
            e.preventDefault();
          },
          touchmove: function(){
            clearTimeout(_this.timeOutEvent);
            _this.timeOutEvent = 0;
          },
          touchend: function(){
            clearTimeout(_this.timeOutEvent);
            _this.sayshow = false;
            _this.say = "按住说话";
            _this.recorder.stop();
            return false;
          }
        })
      },
      longPress(){
        this.timeOutEvent = 0;
        this.sayshow = true;
        this.say = "松开结束";
      //开始录音
        this.recorder.record();
      },
      Record_init(){
        //获得录音实例
        let _this = this;
        GeoBOS.media.AudioRecorder.getInstance(function (err, recorder) {
          if (err) {
            return console.log(err.message);
          }
          _this.recorder = recorder;
          //监听开始录音事件
          recorder.on('start', function () {
            console.log('start:');
          });
          //监听停止录音事件,filePath是录音文件的保存路径
          recorder.on('stop', function (filePath) {
            /*前台显示*/
            let ul = $('#PUL');
            let msg = {
              name : "message",
              adhoc : 'true',
              msg : filePath,
              msgType : "audio",
              isRead : "Y",//是否已读，默认N
              noReadCount:0,
              isConfirm : "N",//是否需要确认,默认N 不需要
              isResponse :"N",//是否受到相应,默认N 不需要
              msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
              isDelete : "N",//是否删除,默认N
              isFail:"N",//是否发送失败
              sender : _this.myself.uniqueId,//发送者
              receiver : _this.user.uniqueId,//接受者
              identity: _this.myself.uniqueId+"_"+_this.user.uniqueId,
              sendImage : _this.myself.image,//发送者头像
              nickName : _this.myself.nickName,//发送者昵称
              chatImage:_this.user.image,
              chatName : _this.user.nickName,
              sendDate : io.formatDateTime(new Date()),
              msgStatus : "init",//init,sender,success,fail
              uuid:generateUUID.creatUuid()
            };
            io.sendFile(_this.user.sipid,filePath,"audio",_this.myself.uniqueId,_this.user.uniqueId,
              _this.myself.image,_this.myself.nickName,undefined,_this.user.image,_this.user.nickName,msg.uuid);
            let db = new DB("Message");
            db.insert(msg,function(err,result){
              if(err){
                console.log(err.message);
              }else{
                console.warn("msg.isFail=======================audio");
              }
            });
            io.sendAudioTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,filePath,msg.isFail,_this.myself.uniqueId,_this.user.uniqueId,'');
            io.scrollBottom("PUL");
            _this.audioPlay();
          });
        });
      },
//      复制
      copyDiv(){
        let _this = this;
        _this.copyText=this.$store.state.copyText;
        let clipboard = new Clipboard('.myCopy',{
          text:function(){
            return  _this.copyText;
          }
        });
        console.log("clipboard--------------------");
        clipboard.on('success',function(e){
          console.log("复制内容 ：");
          console.log(e);
          _this.pasteText = e;
          _this.$store.state.pasteText = e;
        });
        clipboard.on('error',function(e){
          console.log("复制失败：；");
          console.log(e);
        });
        $('#copy').css('display','none');
      },
      pasteDiv(){
          let _this = this;
          let text = $('.Input_text');
          new Promise(function(resolve){
            text.append(_this.pasteText.text);
            resolve(_this.pasteText.text);
          }).then(function(value){
            text.value = value;
//            console.log(text);
            console.log(text.value);
            $('#paste').css('display','none');
          })
      },
      pasteTime(){
        let _this = this;
        let canClick = false;
        console.log("`2222222222`");
        $('.Input_text').on({
          touchstart: function(e){
            _this.timeOutDiv = setTimeout(function(){
              $('#copy').css('display','none');
              $('#trans').css('display','none');
              $('#paste').css('display','block');
              canClick = true;
//              console.log("cancan1----------");
//              console.log(canClick);
            },1000);
            console.log("贴start---");
            e.preventDefault();
            e.stopPropagation();
          },
//          touchmove: function(){
//            clearTimeout(_this.timeOutDiv);
//            _this.timeOutDiv = 0;
//          },
          touchend: function(){
            if(!canClick){
              clearTimeout(_this.timeOutDiv);
              console.log("贴end---");
              if(_this.timeOutDiv != 0){
                console.log("这是点击，不是长按");
                _this.set_focus();
                }
              return false;
            }
            canClick = false;
          }
        });
      },
      set_focus(){
        $('#copy').css('display','none');
        $('#paste').css('display','none');
        $('#trans').css('display','none');
        var el=document.getElementsByClassName('Input_text');
        el=el[0];  //jquery 对象转dom对象
        el.focus();
        if($.support.msie){
          let range = document.selection.createRange();
          this.last = range;
          range.moveToElementText(el);
          range.select();
          document.selection.empty(); //取消选中
        }else{
          let range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          let sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      },
      delDiv(){
          let _this = this;
          let nowImg = _this.$store.state.nowImg;
          _this.nowText = _this.$store.state.nowText;
          _this.nowDate = _this.$store.state.nowDate;
          let lis = (_this.nowText.parents())[3];
          lis.remove();
          let msgDB = new DB("Message");
          if(_this.nowText[0].className.substr(13,1) != "s"){
            msgDB.remove({sendDate:_this.nowDate,sender:_this.myself.uniqueId},{ multi: true },function(err,res){
              if(err){
                console.log(err.message);
              }else{
                console.log(res);
                return res;
              }
            });
          }else{
            msgDB.remove({sendDate:_this.nowDate,sendImage:nowImg},{ multi: true },function(err,res){
              if(err){
                console.log(err.message);
              }else{
                console.log(res);
                return res;
              }
            });
          }
          $('#copy').css('display','none');
          $('#trans').css('display','none');
      },
      //转发
      toTransmit(type){
          if(type == "text"){
            this.copyText=this.$store.state.copyText;
            this.textType=this.$store.state.textType;
            this.$router.push({name:'ChatTransmit',params:{text:this.copyText,type:this.textType,user:this.user}});
//          console.log("copytext------------------");
//          console.log(this.copyText);
          }
          if(type == "more"){
              this.transText = this.$store.state.transText;
              this.textType = this.$store.state.textType;
              this.$router.push({name:'ChatTransmit',params:{text:this.transText,type:this.textType,user:this.user}});
          }
      },
      //拨打电话
      makeCall(){
        this.$store.state.call.dialUser = this.user;
        if(this.$store.state.currentUser.communicationMode == "ADHOC"){
          //初始化电话
          calls.initCall(this.$store.state.account.sipid);/*此处为本机ip*/
          calls.makeCall(this.user.sipid);/*此处为接收方ip*/
        }
        if(this.$store.state.currentUser.communicationMode == "SATCOM"){
          calls.sendCallRequest(sim, this.user.phoneNum);//sim暂时不清楚传什么参数
          calls.storeCallMessage(this.$store.state.account, this.$store.state.call.dialUser, 'radio', 'Y');
        }
        this.$store.state.call.isDial = true;
        this.$store.state.call.showDial = true;
      },
    },
    beforeDestroy(){
      this.$store.state.nowPage = "";
    }
  }
</script>
<style>
  ::-webkit-scrollbar{
    display:none;
  }
  /*重发*/
  .remit{
    color: red;
    font-size: .8rem;
    left: -4rem;
    top: 1rem;
    position: absolute;
  }
  .chat-head{
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
  .chat-head h1{
    font-weight: normal;
    margin: 0;
    font-size: 1.2rem;
    margin-right: 4rem;
  }
  .chat-head span{
    float: left;
    font-size: 1rem;
  }
  .chat-head .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .chat-head .icon-call{
    display: inline-block;
    width: 1.1rem;
    height: 1.1rem;
    background: url("../../../../static/images/im_phone_call.png") no-repeat;
    background-size: 100%;
    position: absolute;
    top:0.955rem;
    right: 3.7rem;
  }
  .chat-head .icon-call:active{
    background: url("../../../../static/images/im_phone_call_sel.png") no-repeat;
    background-size: 100%;
  }
  .chat-head .icon-setting{
    display: inline-block;
    width: 1.33rem;
    height: 1.33rem;
    background: url("../../../../static/images/im_login_icon_settings.png") no-repeat;
    background-size: 100%;
    position: absolute;
    top:0.855rem;
    right: 1.2rem;
  }
  .chat-head .icon-setting:active{
    background: url("../../../../static/images/im_login_icon_settings_sel.png") no-repeat;
    background-size: 100%;
  }
  .chat-box{
    overflow: scroll;
    margin-top: 3rem;
  }
  .chat-list{
    position: relative;
    padding:0 .32rem;
    overflow:auto;
    margin:0 auto;
  }
  .chat-list #PUL .mysay>.whatsay>i,.chat-list #PUL .mysay>.photoshow>i{
    display: none;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_msg_state_fail_resend.png") no-repeat;
    background-size: 100%;
    position: absolute;
    top:0.8rem;
    left: -1.6rem;
  }
  .chat-list #PUL .mysay>.photoshow>i{
    position: relative;
    left: -1.6rem;
    top: -3em;
  }
  .chat-list .icon-warn{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_msg_state_fail_resend.png") no-repeat;
    background-size: 100%;
  }
  .chat-list .icon-receivevoice{
    display: inline-block;
    width: 1.2rem;
    height: 1.38rem;
    background: url("../../../../static/images/im_chat_sent_voice_playing.png") no-repeat;
    background-size: 100%;
  }
  .chat-list .hesay .icon-receivevoice{
    display: inline-block;
    width: 1.2rem;
    height: 1.38rem;
    background: url("../../../../static/images/im_chat_received_voice_playing.png") no-repeat;
    background-size: 100%;
  }
  .chat-list .mysay .icon-receivevoice {
    background: url("../../../../static/images/im_chat_sent_voice_playing.png") no-repeat;
    background-size: 100%;
  }
  .chat-list .mysay .icon-receivevoice.actived{
    background: url("../../../../static/images/receive.gif") no-repeat;
    background-size: 100%;
    border: none;
  }
  .chat-list .hesay .icon-receivevoice.actived{
    background: url("../../../../static/images/send.gif") no-repeat;
    background-size: 100%;
    border: none;
  }
  .chat-list ul{
    padding-top:.4rem;
    padding-bottom:2.2rem;
    width:100%;
    height:15.2rem;
    overflow:auto;
  }
  .chat-list ul li p{
    text-align: center;
  }
  .chat-list ul li span{
    font-size: 0.6rem;
    background-color: #eee;
    border-radius: 4px;
    padding:5px 10px;
  }
  .chat-list .other{
    width:100%;
    justify-content: flex-start;
    margin: 0.5rem 0 0.3rem 0;
    display:flex;
    position: relative;
  }
  .chat-list .other .icon-warn{
    position: absolute;
    top:0.58rem;
    right: -1.7rem;
  }
  .chat-list .other>img{
    width:2.74rem;
    height:2.74rem;
    border-radius: 50%;
    display: block;
  }
  .chat-list .whatsay {
    position: relative;
  }
  .chat-list .whatsay img{
    position: relative;
    width:1.2rem;
    height:1.2rem;
    top:0;
    display:inline-block;
  }
  .chat-list .whatsay-text{
    margin:0.3rem 0.7rem;
    max-width:20.7rem;
    background:#eee;
    padding:0.42rem 0.384rem;
    border-radius:8px;
    font-size: .94rem;
    color: #333;
    line-height:0.9533333333rem;
    word-break: break-all;
    position:relative;
  }
  .chat-list .whatsay-text a{
    width:12px;
    height:12px;
    margin-right:3px;
    margin-top:.2rem;
    float:left;
  }
  .mysay .whatsay-text :after,.hesay .whatsay-text :before{
    content: '';
    display: block;
    width:0;
    height: 0;
    border-top: 0.4rem solid transparent;
    border-bottom: 0.4rem solid transparent;
    position: absolute;
    top: 30%;
  }
  .mysay .whatsay-text :after{
    border-left: 0.4rem solid #9fe658;
    right: -0.4rem;
  }
  .mysay span{
    display: inline-block;
    width: 1.1rem;
    height: 1.1rem;
    background: url("../../../../static/images/im_msg_state_fail_resend.png") no-repeat;
    background-size: 100%;
    position: relative;
  }
  .hesay .whatsay-text :before{
    border-right: 0.4rem solid #eee;
    left:-.4rem;
  }
  #color2{
    width:10px;
    height:10px;
    display:inline-block;
    background:yellow;
    margin-right:3px;
  }
  .chat-list .mysay{
    display:flex;
    flex-direction:row-reverse;
  }
  .chat-list .mysay .icon-warn{
    position: absolute;
    top:0.58rem;
    left: -1.6rem;
  }
  .chat-list .mysay .whatsay-text{
    background:#9fe658;
    margin-right:0.64rem;
    margin-left:0;
  }
  .chat-footer{
    position: fixed;
    bottom:0;
    width:100%;
    z-index:1001;
  }
  .chat-footer .footer{
    position: relative;
    background:#fafbf6;
    padding-bottom: 0.5rem;
  }
  .chat-footer .footer .somechoice span{
    position: relative;
    bottom: 0.22rem;
    font-size: 1.05rem;
    margin-right: 0.15rem;
  }
  .voice-input{
    text-align: center;
    display: inline-block;
    position: absolute;
    right: 4rem;
    top: 0.3rem;
    width: 50%;
    margin-bottom: 0.15rem;
    background-color: #fdfdfb;
    height: 2.1rem;
    border: 0.5px solid #999;
    border-radius: 4px;
  }
  .voice-btn{position:relative;}
  .voice-btn>i{
    position:absolute;
    bottom:40px;
    left:35%;
    width:90px;
    height:90px;
    background:url("../../../../static/images/timg.gif");
    background-size:100%;
  }
  #saysome{
    position: relative;
    top: 0.3rem;
  }
  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0; /*初始状态 透明度为0*/
    }

    100% {
      opacity: 1; /*结尾状态 透明度为1*/
    }
  }
  .chat-footer .footer .status{
    padding:0 1%;
    position: absolute;
    bottom: 3rem;
    left: 0.65rem;
    background-color: #fff;
    border-radius: 2px;
    -webkit-animation-name: fadeIn; /*动画名称*/
    -webkit-animation-duration: 0.5s; /*动画持续时间*/
    -webkit-animation-iteration-count: 1; /*动画次数*/
    -webkit-animation-delay: 0s; /*延迟时间*/
  }
  .chat-footer .footer .status ul li{
    float: left;
    margin-right: 0.3rem;
  }
  .chat-footer .footer .font{
    padding:0 1%;
    position: absolute;
    bottom: 3rem;
    left: 4.45rem;
    background-color: #fff;
    border-radius: 2px;
    -webkit-animation-name: fadeIn; /*动画名称*/
    -webkit-animation-duration: 0.5s; /*动画持续时间*/
    -webkit-animation-iteration-count: 1; /*动画次数*/
    -webkit-animation-delay: 0s; /*延迟时间*/
  }
  .chat-footer .footer .font ul li{
    float: left;
    margin-right: 0.3rem;
  }
  .icon-feature{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: url("../../../../static/images/im_type_select_btn_normal.png") no-repeat;
    background-size: 100%;
    position: relative;
    top:0.355rem;
    margin-left:1%;
    margin-right: 0.2%;
  }
  .icon-feature:active{
    background: url("../../../../static/images/im_type_select_btn_pressed.png") no-repeat;
    background-size: 100%;
  }
  .icon-level1,.icon-level2,.icon-level3,.chat-footer .icon-checkon,.chat-footer .icon-checkoff,.chat-footer .icon-bold,.chat-footer .icon-italic,
  .chat-footer .icon-underline,.chat-footer .icon-red,.chat-footer .icon-black,.chat-footer .icon-show{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    position: relative;
    top:0.155rem;
    margin: 0 0.1rem;
  }
  .icon-level1{
    background: #e7d117;
    border-radius: 0.2rem;
  }
  .icon-level2{
    background: #FF882B;
    border-radius: 0.2rem;
  }
  .icon-level3{
    background: #bb120b;
    border-radius: 0.2rem;
  }
  .chat-footer .icon-checkon{
    background: url("../../../../static/images/im_login_check_on.png") no-repeat;
    background-size: 100%;
    left: 0;
  }
  .chat-footer .icon-checkoff{
    background: url("../../../../static/images/im_login_check_off.png") no-repeat;
    background-size: 100%;
    left: 0;
  }
  .chat-footer .icon-bold{
    background: url("../../../../static/images/im_blod.png") no-repeat;
    background-size: 100%;
    border-radius: 0.2rem;
  }
  .chat-footer .icon-italic{
    background: url("../../../../static/images/im_italic.png") no-repeat;
    background-size: 100%;
    border-radius: 0.2rem;
  }
  .chat-footer .icon-underline{
    background: url("../../../../static/images/im_underline.png") no-repeat;
    background-size: 100%;
    border-radius: 0.2rem;
  }
  .chat-footer .icon-red{
    background: url("../../../../static/images/im_message_urgency_level_3.png") no-repeat;
    background-size: 100%;
    border-radius: 0.2rem;
  }
  .chat-footer .icon-black{
    background: url("../../../../static/images/im_message_font_color_black.png") no-repeat;
    background-size: 100%;
    border-radius: 0.2rem;
  }
  .chat-footer .icon-show{
    background: url("../../../../static/images/im_message_font_color_black.png") no-repeat;
    background-size: 100%;
    border-radius: 0.2rem;
  }
  .icon-keyboard,.icon-voice{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    position: absolute;
    right: 0.127rem;
    top:0.355rem;
    margin-right: 1%;
  }
  .icon-keyboard{
    background: url("../../../../static/images/im_chatting_setmode_keyboard_btn_normal.png") no-repeat;
    background-size: 100%;
  }
  .icon-keyboard:active{
    background-image: url("../../../../static/images/im_chatting_setmode_keyboard_btn_pressed.png");
  }
  .icon-voice{
    background: url("../../../../static/images/im_chatting_setmode_voice_btn_normal.png") no-repeat;
    background-size: 100%;
  }
  .icon-voice:active{
    background-image: url("../../../../static/images/im_chatting_setmode_voice_btn_pressed.png");
  }
  .icon-biaoqing{
    display: inline-block;
    width: 1.6rem;
    height: 1.6rem;
    background: url("../../../../static/images/im_chatting_biaoqing_btn_normal.png") no-repeat;
    background-size: 100%;
    position: absolute;
    top:.2rem;
    right: 30px;
  }
  .feature-display ul li{
    width:14.28%;
    text-align: center;
    border-right:1px solid #eee;
    box-sizing: border-box;
    float:left;
    color: #999;
    font-size: 0.85rem;
    background-color: #eee;
    padding-top: 0.2rem;
  }
  .feature-display ul li p{
    font-size: 0.85rem;
  }
  .icon-file,.icon-location, .icon-vedio,.icon-vedio,.icon-templet,.icon-scrawl,.icon-takepic,.icon-phone{
    display: inline-block;
    width: 3.1rem;
    height: 3.1rem;
    position: relative;
    border-radius: 5px;
    bottom: -3px;
  }
  .icon-file:active,.icon-location:active, .icon-vedio:active,.icon-vedio:active,.icon-templet:active,.icon-scrawl:active,.icon-takepic:active,.icon-phone:active{
    box-shadow: 0 0 5px 1px #888;
  }
   .icon-file{
     background: url("../../../../static/images/im_file.png") no-repeat;
     background-size: 100%;
   }
  .icon-location{
    background: url("../../../../static/images/im_chat_location_noraml.png") no-repeat;
    background-size: 100%;
  }
  .icon-vedio{
    background: url("../../../../static/images/im_chat_video_normal.png") no-repeat;
    background-size: 100%;
  }
  .icon-templet{
    background: url("../../../../static/images/im_templet.png") no-repeat;
    background-size: 100%;
  }
  .icon-scrawl{
    background: url("../../../../static/images/im_scrawl.png") no-repeat;
    background-size: 100%;
  }
  .icon-takepic{
    background: url("../../../../static/images/im_chat_takepic_normal.png") no-repeat;
    background-size: 100%;
    margin-bottom: 4px;
  }
  .icon-takepic input{
    width: 3.1rem;
    height: 3.1rem;
    opacity: 0;
  }
  .icon-phone{
    background: url("../../../../static/images/im_phone.png") no-repeat;
    background-size: 100%;
  }
  .call-choice{
    width: 26.6rem;
    height: 5.5rem;
    margin: 20% auto;
    color: #fff;
  }
  .call-choice>p{float:left;margin-right:1.5rem;text-align: center}
  .call-choice>p i{
    display: block;
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom:.6rem;
  }
  .call-choice>p:nth-of-type(1) i{
    background: url("../../../../static/images/im_chat_to_call_audio_call_noraml.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .call-choice>p:nth-of-type(2) i{
    background: url("../../../../static/images/im_video_switch_normal.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .call-choice>p:nth-of-type(3) i{
    background: url("../../../../static/images/im_chat_to_call_video_back_haul_normal.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .call-choice>p:nth-of-type(4) i{
    background: url("../../../../static/images/im_chat_to_call_video_on_demand_normal.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .call-choice>p:nth-of-type(4) {
    margin-right: 0;
  }
  .chat-footer .send-btn{
    position: absolute;
    top: .4rem;
    width: 3.3rem;
    right: 0.2rem;
  }
  .chat-footer .send-btn:active{background-color: #427092;}
  .fileborder{
    width: 15rem;
    height: 4rem;
    background-color: #fff;
    margin: 0 0.35rem;
  }
  .videoborder{
    width:5rem;
    height: 4rem;
    background-color: #fff;
    margin: 0 0.35rem;
  }
  .fileborder div{float: left;}
  .fileborder .file-name{
    height: 4rem;
    line-height: 4rem;
    font-size: 1rem;
    width:65%;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    position:relative;
  }
  .videoborder .video-box{
    height: 4rem;
    line-height: 4rem;
    font-size: 1rem;
    width:100%;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    position:relative;
  }
  .videoborder .video-box>i{
    background:url("../../../../static/images/im_chat_to_call_video_on_demand_normal.png") no-repeat;
    background-size:100%;
    width:50px;
    height:50px;
    position:absolute;
    left:16px;
    top:6px;
  }
  .fileborder .file-img{
   width: 2rem;
    height: 2rem;
    margin: 1rem;
    background: url("./../../../../static/images/im_file.png") no-repeat;
    background-size:2rem 2rem;
  }
  .photoborder{
    text-align: right;
    margin: 0 0.35rem;
  }
  .photos{
    width: 8rem;
    height: 5rem;
    margin-right:.2em;
    margin-bottom: 0;
    border:1px solid #eee
  }
  #divCenter,#videoBox {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #fff;
    position:absolute;
    top:0;
    left:0;
    z-index:10002;
    overflow:hidden;
  }
  #divCenter>img{
    width:50%;
    height:60%;
    margin-top:10%;
    margin-left:25%;
  }
  .windowBlack{
    width:100%;
    height:100%;
    background:rgba(0,0,0,.6);
    position:fixed;
    top: 100%;
    left:0;
    z-index:10000;
    -moz-transition: top ease 200ms;
    -o-transition: top ease 200ms;
    -webkit-transition: top ease 200ms;
    transition: top ease 200ms;
  }
  .trans{
    top: 0!important;
  }
  /*复制*/
  #copy,#trans{
    border-radius: 16px;
    background: #000;
    height:22px;
    position: fixed;
    bottom: 3em;
    left: 41%;
    padding:4px 5px;
    display: inline-block;
    z-index: 99;
  }
  #trans{
    left: 44%;
  }
  #copy ul li,#trans ul li{
    float: left;
    color: #fff;
    padding: 0 5px;
  }
  #copy ul li:nth-of-type(2){
    border-right: 1px solid #717171;
    border-left: 1px solid #717171;
  }
  #trans ul li:nth-of-type(1){
    border-right: 1px solid #717171;
  }
  #paste{
    z-index: 99;
    position: fixed;
    bottom: 3em;
    left: 41%;
    background: #f0f1ef;
    border-radius: 8px;
    border: 1px solid #4aabc1;
    padding: 5px;
  }
  .questReply{
    width:22%;
    margin: 0 auto;
    font-size: 0.8rem;
    background-color: gainsboro;
    border-radius: 5%;
  }
  .questReply .forOk{
    font-size: 0.8rem;
    border: none;
    color: #2d8b56
  }
  .sureReply{
    width: 16%;
    margin: 0 auto;
    font-size: 0.8rem;
    background-color: gainsboro;
    border-radius: 5%;
  }
  #videoBox i{
    position:absolute;
    left:20px;
    top:20px;
  }
</style>

