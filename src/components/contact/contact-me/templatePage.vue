<template>
    <div class="tm" style="position: relative;">
      <header class="hd"><span @click="toTemplate()"><i class="icon-back"></i>返回</span><h1>{{this.name}}</h1></header>
      <!--<div id="contend" style="padding-top: 0.5rem;" v-html="data"></div>-->
      <div id="contend" style="padding-top: 0.5rem;">
        <iframe width="100%" frameborder=0 scrolling=auto :src="'http://localhost:3000'+filePath" id="iframeT"></iframe>
      </div>
      <div class="chat-footer">
        <div class="footer" style="height: 2.3rem;line-height: 2.3rem">
          <div class="somechoice" style="display: inline-block;margin-top: 0.5rem;margin-left: 1.5rem; width: 20%;">
            <span @click="showStatus">状态<i class="icon-level1" id="color"></i></span>
            <div class="status" v-show="statusShow">
              <ul>
                <li>一般<i class="icon-level1" id="yellow" @click="getFontColor('icon-level1','#e7d117',1)"></i></li>
                <li>紧急<i class="icon-level2" id="oriange" @click="getFontColor('icon-level2','#FF882B',2)"></i></li>
                <li>非常紧急<i class="icon-level3" id="red" @click="getFontColor('icon-level3','#bb120b',3)"></i></li>
              </ul>
            </div>
            <span @click="selectResponse">应答<i :class="{'icon-checkon':responseSelect,'icon-checkoff':!responseSelect}"></i></span>
          </div>
          <bos-button type="danger" class="send-btn" style="width: 76%" @click="sendTemplateT">发送消息</bos-button>
          <!--<i id="talk_icon" :class="{'icon-voice':way,'icon-keyboard':!way}" @click="selectWay" v-show="!textContentShow"></i>-->
        </div>
      </div>
    </div>

</template>
<script>
  import $ from 'jquery';
  import {DB} from '@/assets/js/db';
  import {generateUUID,io} from '@/assets/js/utils';
  import * as actionTypes from "@/store/actions-types";
    export default{
        data(){
            return {
              statusShow: false,
              fontShow: false,
              responseSelect: false,
              name: this.$route.params.name,
              filePath: this.$route.params.filePath,
              user: this.$route.params.user,
              group:this.$route.params.group,
              ul: this.$route.params.ul,
              myself:this.$store.state.account,
              data:undefined
            }
        },
       methods:{
         showStatus(){
           if (this.fontShow == true){
             this.fontShow = false;
           }
           this.statusShow = !this.statusShow;
         },
         getFontColor(className,color,infoLevel){
           document.getElementById("color").className = className;
           this.$store.state.chatStatus.statusColor =color;
           this.$store.state.chatStatus.infoLevel =infoLevel;
           this.statusShow = false;
         },
         selectResponse(){
           this.responseSelect = !this.responseSelect;
         },
         sendTemplateT(){
           let _this = this;
           var num=io.creatRand();
           console.log($("#iframeT").contents().find("#data").html());
           var str = $("#iframeT").contents().find("#data").html();
           let db = new DB("Message");
           if(this.user){
             let msg = {
               name : "message",
               msg : str,
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
               fontStyle: this.$store.state.chatStatus.fontStyle,
               chatMany :"",
               uuid : generateUUID.creatUuid(),
               moduleUser:this.myself.uniqueId
             };
             GeoBOS.io.send(
               {
                 type: "socket",
                 address: _this.$store.state.address.addressB,
               },
               JSON.stringify(msg),
               function (err, res) {
                 if (err) {
                   _this.$store.state.msgFail.css("display","block");
                   let uuid ={
                     uuid : msg.uuid
                   };
                   let update = {
                     isFail : "Y"
                   };
                   db.update(uuid,update,function(err, res){
                     if(err){
                       console.log('failed with:' + err.message)
                     }else{
                       console.log(res.num + ' objects has be updated');
                     }
                   });
                   console.log("send failed with:" + err.message);
                 } else {
                   console.log("发送成功")
                 }
               }
             );
             db.insert(msg,function(err,result){
               if(err){
                 console.log(err.message);
               }else{
                 console.warn(result);
                 return result;
               }
             });
             let ul = _this.ul;
             io.sendTemplate(ul,io.formatDateTime(new Date()),this.myself.image,num,str,msg.statusColor,msg.fontStyle,msg.isFail,msg.sender,msg.receiver,false);
             this.$router.push({name: 'Chat', params: {user:this.user}});
           }else if(this.group){
             let msg = {
               name : "message",
               msg : str,
               msgType : "text",
               isRead : "Y",//是否已读，默认N
               isConfirm : "N",//是否需要确认,默认N 不需要
               isResponse : "N",//是否受到相应,默认N 不需要
               msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
               isDelete : "N",
               sender : this.myself.uniqueId,//发送者
               sendImage : this.myself.image,//发送者头像
               sendDate : io.formatDateTime(new Date()),
               statusColor:this.$store.state.chatStatus.statusColor,
               fontStyle: this.$store.state.chatStatus.fontStyle,
               groupUri : this.user.groupInfo.name,
               msgStatus :"init",//init,sender,success,fail
               moduleUser : this.myself.uniqueId,
               uuid : generateUUID.creatUuid()
             };
             db.insert(msg,function(err,result){
               if(err){
                 console.log(err.message);
               }else{
                 console.warn(result);
                 return result;
               }
             });
             GeoBOS.io.send(
               {
                 type: "socket",
                 address: this.$store.state.address.addressB,
               },
               JSON.stringify(msg),
               function (err, res) {
                 if (err) {
                   console.log(state.msgFail);
                   state.msgFail.css("display","block");
                   let uuid ={
                     uuid : msg.uuid
                   };
                   let update = {
                     isFail : "Y"
                   };
                   db.update(uuid,update,function(err, res){
                     if(err){
                       console.log('failed with:' + err.message)
                     }else{
                       console.log(res.num + ' objects has be updated');
                     }
                   });
                   console.log("send failed with:" + err.message);
                 } else {
                   console.log(res)
                 }
               }
             );
             let ul = this.ul;
             io.sendTemplate(ul,io.formatDateTime(new Date()),this.myself.image,num,str,msg.statusColor,msg.fontStyle,msg.isFail,msg.sender,msg.groupUri,true);
             this.$router.push({name: 'ChatGroup', params: {group:this.group}});
            }
          }
        }
    }
</script>
<style>

</style>
