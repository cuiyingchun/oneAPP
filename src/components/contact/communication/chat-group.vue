<template>
  <div>
    <div class="tab_content">
      <header class="chat-head">
        <span @click="toContact"><i class="icon-back"></i>返回</span>
        <h1>{{group.groupInfo.name}}</h1>
        <i class="icon-headersetting" @click="toMembers"></i>
      </header>
      <section class="chat-box" :style="{backgroundColor: backgroundColor}" @click="closeDis">
        <section class="chat-list">
          <ul id="ullGroup" style="overflow: scroll">
          </ul>
        </section>
      </section>
    </div>
    <div class="chat-footer">
      <div class="footer">
        <i class="icon-feature"></i>
        <!--<i class="icon-feature" @click="showFeature"></i>-->
        <div class="somechoice" style="display: inline-block">
          <span @click="showStatus">状态<i class="icon-level1" id="color"></i></span>
          <div class="status" v-show="statusShow">
            <ul>
              <li>一般<i class="icon-level1" id="yellow" @click="getFontColor('icon-level1','#e7d117',1)"></i></li>
              <li>紧急<i class="icon-level2" id="oriange" @click="getFontColor('icon-level2','#FF882B',2)"></i></li>
              <li>非常紧急<i class="icon-level3" id="red" @click="getFontColor('icon-level3','#bb120b',3)"></i></li>
            </ul>
          </div>
          <!--<span @click="selectResponse">应答<i :class="{'icon-checkon':responseSelect,'icon-checkoff':!responseSelect}"></i></span>-->
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
            <i v-show="sayShow"></i>
            <p id="saysome">{{say}}</p>
          </div>
        </div>
        <bos-button type="primary" size="small" class="send-btn" v-show=false>发送</bos-button>
        <i id="talk_icon" :class="{'icon-voice':way,'icon-keyboard':!way}" @click="selectWay" v-show="!textContentShow"></i>
      </div>
      <!--更多功能-->
      <div class="feature-display" style="display: none">
        <ul>
          <li style="width: 16.66%">
            <div @click="filePiker">
              <i class="icon-file"></i>
              <p>文件</p>
            </div>
          </li>
          <li style="width: 16.66%">
            <div @click="selectSend()">
              <i class="icon-location"></i>
              <p>位置共享</p>
            </div>
          </li>
          <li style="width: 16.66%">
            <div @click="cameraPiker">
              <i class="icon-vedio"></i>
              <p>视频</p>
            </div>
          </li>
          <li style="width: 16.66%">
            <div @click="toFormatPhrase">
              <i class="icon-templet"></i>
              <p>格式短语</p>
            </div>
          </li>
          <li style="width: 16.66%">
            <div @click="toHandPaint">
              <i class="icon-scrawl"></i>
              <p>手绘</p>
            </div>
          </li>
          <li style="width: 16.66%">
            <div>
              <a class="icon-takepic">
                <input type="file" accept="image/*" capture="camera">
              </a>
              <p>拍照</p>
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
  //import Clipboard from 'clipboard';
  import {DB} from '@/assets/js/db';
  import {generateUUID,getGroupName,io} from '@/assets/js/utils';
  export default{
      name:"ChatGroup",
    data() {
      return {
        group:this.$route.params.group,
        where:this.$route.params.where,
        myself:this.$store.state.account,
        fontShow:false,
        statusShow:false,
        sayShow : false,
        picShow : false,
        way:true,
        imgUrl : undefined,
        textContent:'',
        bgColor: '#fff',
        selColor: '',
        textContentShow:false,
        messageList:[],
        photoPath: '',
        timeOutEvent : 0,
        say : "按住说话",
        otherIps:[],
        num:0,
        backgroundColor: this.$store.state.backgroundColor,
        copyText:"",
        pasteText:this.$store.state.pasteText,
        nowText: "",
        nowDate:'',
        transText:"",
        textType:"",
        timers:undefined
      }
    },
    mounted(){
          console.log("qunzu");
          console.log(this.group);
      this.$store.state.nowPage = "groupChat";
      this.$store.state.chatStatus.fontStyle = "3";
      this.$store.state.chatStatus.statusColor = '#e7d117';
      this.$store.state.chatStatus.infoLevel = 1;
      $(".Input_text").css("color","black");
      $(".Input_text").css("font-weight","normal");
      $(".Input_text").css("text-decoration","none");
      let _this = this;
      this.timers = setInterval(function(){if($(".Input_text").html() == ''){
        $('.send-btn').hide();
        $("#talk_icon").show();
      }else{
        $('.send-btn').show();
        $("#talk_icon").hide();
      }
        _this.Record_init();
      },500);
      this.checkoutRecord();
      this.chatGroup();
      this.sendPictrue();
      this.longTap();
      this.getSip();
    },
    methods: {
//    获得sipid
      getSip(){
          let _this = this;
          for(let i=0;i<_this.group.memberInfo.length;i++){
              if(_this.group.memberInfo[i].uniqueId != _this.myself.uniqueId){
                _this.otherIps.push(_this.group.memberInfo[i].sipid);
              }
          }
      },
      closeDis(){
        io.closeDisplay();
      },
      // 聊天记录
      checkoutRecord(){
        let _this = this;
        let db = new DB('Message');
        let query = {
          groupUri : this.group.groupInfo.groupUri,
        };
        new Promise(function(resolve){
          db.queryConfig(query,function(err,res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              resolve(res);
            }
          })
        }).then(function(value){
          io.historyChat(value,$("#ullGroup"),_this.myself,_this.group.groupInfo.groupUri);
        }).then(function(){
          io.scrollBottom("ullGroup");
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
          $(".file-name>video").click(function(){
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
      chatGroup(){
        let msg = {
          name : "message",
          adhoc : 'true',
          msg : "",
          msgType : "text",
          isRead : "Y",//是否已读，默认N
          msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
          isDelete : "N",
          sender : this.myself.uniqueId,//发送者
          sendImage : this.myself.image,//发送者头像
          sendDate :"",
          statusColor:this.$store.state.chatStatus.statusColor,
          fontStyle:this.$store.state.chatStatus.fontStyle,
          identity: this.group.groupInfo.groupUri,
          groupUri : this.group.groupInfo.groupUri,
          groupName:this.group.groupInfo.name,
          msgStatus :"init",//init,sender,success,fail
          moduleUser : this.myself.uniqueId,
          uuid : generateUUID.creatUuid(),
          num:'',//模板随机数
        };
        $('.Main').myEmoji(this.myself,this.group,this.otherIps,msg);
      },
      sendPictrue() {
        let _this = this;
        $(".icon-takepic").on("change","input[type='file']",function(){
          let filePath=$(this).val();
          if(filePath.indexOf("jpg")!=-1 || filePath.indexOf("png")!=-1){
            let arr=filePath.split('\\');
            let fileName=arr[arr.length-1];
            var photoPath = "/Camera/"+fileName;
            // 前端数据显示效果
            let ul = $('#ullGroup');
            let db = new DB("Message");
            let msg = {
              name : "message",
              adhoc : 'true',
              msg : photoPath,
              msgType : "picture",
              isRead : "Y",//是否已读，默认N
              noReadCount:0,
              msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
              isDelete : "N",//是否删除,默认N
              isFail:"N",//是否发送失败
              sender : _this.myself.uniqueId,//发送者
              identity:_this.group.groupInfo.groupUri,
              groupUri : _this.group.groupInfo.groupUri,
              groupName:_this.group.groupInfo.name,
              sendImage : _this.myself.image,//发送者头像
              sendDate : io.formatDateTime(new Date()),
              msgStatus : "init",//init,sender,success,fail
              moduleUser : _this.myself.uniqueId,//当前账号的使用uri
              uuid:generateUUID.creatUuid()
            };
            io.sendPhotoTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,photoPath,msg.isFail,msg.sender,'',msg.groupUri);
            io.scrollBottom("ullGroup");
            for(let i=0;i<_this.otherIps.length;i++){
              io.sendFile(_this.otherIps[i],photoPath,"picture",_this.myself.uniqueId,"",_this.myself.image,
                _this.myself.nickName,_this.group.uniqueId,"","",msg.uuid);
            }
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
      filePiker(){
        let _this = this;
        GeoBOS.filePicker.pickFile(function (err, filePath) {
          if (err) {
            return console.log(err.message);
          }
          //let mfileName = filePath[0].substring(filePath[0].lastIndexOf("\/") + 1, filePath[0].length);
          /*前台显示*/
          let ul = $('#ullGroup');
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
            msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
            isDelete : "N",//是否删除,默认N
            isFail:"N",//是否发送失败
            sender : _this.myself.uniqueId,//发送者
            identity:_this.group.groupInfo.groupUri,
            groupUri : _this.group.groupInfo.groupUri,
            groupName:_this.group.groupInfo.name,
            sendImage : _this.myself.image,//发送者头像
            sendDate : io.formatDateTime(new Date()),
            msgStatus : "init",//init,sender,success,fail
            moduleUser : _this.myself.uniqueId,//当前账号的使用uri
            uuid:generateUUID.creatUuid()
          };
          if(filePath[0].indexOf("jpg")!= -1){
            msg.msgType = 'picture';
            io.sendPhotoTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,filePath[0],msg.isFail, msg.sender,"",msg.groupUri);
          }else if(filePath[0].indexOf("aac")!= -1){
            msg.msgType = 'audio';
            io.sendAudioTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,filePath[0],msg.isFail,msg.sender,"",msg.groupUri);
          }else if(filePath[0].indexOf("mp4")!= -1){
            msg.msgType = 'video';
            io.sendVedioTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,num,filePath[0],msg.isFail,msg.sender,"",msg.groupUri);
          }else{
            io.sendFileTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,num,filePath[0],msg.isFail,msg.sender,"",msg.groupUri);
          }
          io.scrollBottom("ullGroup");
          $('.feature-display').css('display','none');
          for(let i=0;i<_this.otherIps.length;i++){
            io.sendFile(_this.otherIps[i],filePath,msg.msgType,_this.myself.uniqueId,"",_this.myself.image,
              _this.myself.nickName,_this.group.groupInfo.groupUri,"","",msg.uuid);
          }
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
            let ul = $('#ullGroup');
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
              msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
              isDelete : "N",//是否删除,默认N
              isFail:"N",//是否发送失败
              sender : _this.myself.uniqueId,//发送者
              identity:_this.group.groupInfo.groupUri,
              groupUri : _this.group.groupInfo.groupUri,
              groupName:_this.group.groupInfo.name,
              sendImage : _this.myself.image,//发送者头像
              sendDate : io.formatDateTime(new Date()),
              msgStatus : "init",//init,sender,success,fail
              moduleUser : _this.myself.uniqueId,//当前账号的使用uri
              uuid:generateUUID.creatUuid()
            };
            io.sendVedioTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,num,filePath,msg.isFail,msg.sender,"",msg.groupUri);
            io.scrollBottom("ullGroup");
            for(let i=0;i<_this.otherIps.length;i++){
              io.sendFile(_this.otherIps[i],filePath,"video",_this.myself.uniqueId,"",_this.myself.image,
                _this.myself.nickName,_this.group.groupInfo.groupUri,"","",msg.uuid);
            }
            db.insert(msg,function(err,result){
              if(err){
                console.log(err.message);
              }else{
                return result;
              }
            });
          }
          $('.feature-display').css('display','none');
        });
      },
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
            _this.sayShow = false;
            _this.say = "按住说话";
            _this.recorder.stop();
            return false;
          }
        })
      },
      longPress(){
        this.timeOutEvent = 0;
        this.sayShow = true;
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
            let ul = $('#ullGroup');
            let msg = {
              name : "message",
              adhoc : 'true',
              msg : filePath,
              msgType : "audio",
              isRead : "Y",//是否已读，默认N
              noReadCount:0,
              msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
              isDelete : "N",//是否删除,默认N
              isFail:"N",//是否发送失败
              sender:_this.myself.uniqueId,
              sendImage:_this.myself.image,
              identity:_this.group.groupInfo.groupUri,
              groupUri :_this.group.groupInfo.groupUri,
              groupName:_this.group.groupInfo.name,
              sendDate : io.formatDateTime(new Date()),
              msgStatus : "init",//init,sender,success,fail
              moduleUser : _this.myself.uniqueId,//当前账号的使用uri
              uuid:generateUUID.creatUuid()
            };
            io.sendAudioTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,filePath,msg.isFail,msg.sender,"",msg.groupUri);
            io.scrollBottom("ullGroup");
            for(let i=0;i<_this.otherIps.length;i++){
              io.sendFile(_this.otherIps[i],filePath,"audio",_this.myself.uniqueId,"",_this.myself.image,
                _this.myself.nickName,_this.group.groupInfo.groupUri,"","",msg.uuid);
            }
            let db = new DB("Message");
            db.insert(msg,function(err,result){
              if(err){
                console.log(err.message);
              }else{
                return result;
              }
            });
            _this.audioPlay();
          });
        });
      },
      selectSend(){
        io.selectSend(this.textContentShow);
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
      closeStatus(){
          this.statusShow = false;
      },
      selectWay(){
        this.way = !this.way;
      },
      toContact(){
        clearInterval(this.timers);
        if(this.where == "contact"){
          this.$router.go(-1);
        }else{
          this.$router.replace("/address-list");
        }
      },
      toMembers(){
        let _this = this;
        clearInterval(this.timers);
        this.$router.push({name: 'GroupInfo', params: {group:(_this.group)}});
      },
      toFormatPhrase(){
        let _this = this;
        let ul = $('#ullGroup');
        clearInterval(this.timers);
        this.$router.push({name: 'TemplateMessage', params: {user:_this.group,ul:ul}});
      },
      toHandPaint(){
        let _this = this;
        let ul = $('#ullGroup');
        clearInterval(this.timers);
        this.$router.push({name: 'HandPaint', params: {group:_this.group,ul:ul}});
      },
      getFontColor(className,color,infolevel){
        document.getElementById("color").className = className;
        this.$store.state.chatStatus.statusColor =color;
        this.$store.state.chatStatus.infoLevel =infolevel;
        this.statusShow = false;
      },
      getFontStyle(fontStyle,url){
        this.$store.state.chatStatus.fontStyle =fontStyle;
        io.fontStyleDiv(fontStyle);
        $(".icon-show").css("background",'url('+url+') no-repeat');
        $(".icon-show").css("background-size","97%");
        this.fontShow = false;
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
          clearInterval(this.timers);
          this.$router.push({name:'ChatTransmit',params:{text:this.copyText,type:this.textType,user:this.user}});
        }
        if(type == "more"){
          this.transText = this.$store.state.transText;
          this.textType = this.$store.state.textType;
          clearInterval(this.timers);
          this.$router.push({name:'ChatTransmit',params:{text:this.transText,type:this.textType,user:this.user}});
        }
      }
    },
    beforeDestroy(){
      this.$store.state.nowPage = "";
    }
  }
</script>
<style>
  .chat-head .icon-headersetting{
    display: inline-block;
    width: 1.33rem;
    height: 1.33rem;
    background: url("../../../../static/images/im_header_setting.png") no-repeat;
    background-size: 100%;
    position: absolute;
    top:0.855rem;
    right: 1.2rem;
  }
  .chat-list #ullGroup .mysay>.whatsay>i,.chat-list #ullGroup .mysay>.photoshow>i{
    display: none;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_msg_state_fail_resend.png") no-repeat;
    background-size: 100%;
    position: absolute;
    top:0.8rem;
    left: -1.6rem;
  }
  .chat-list #ullGroup .mysay>.photoshow>i{
    position: relative;
    left: -1.6rem;
    top: -3em;
  }
</style>
