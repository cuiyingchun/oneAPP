<template>
    <div class="tm" style="position: relative;">
      <header class="hd"><span @click="toTemplate()"><i class="icon-back"></i>返回</span><h1>{{this.templatePageName}}</h1></header>
      <div class="contend" style="padding-top: 0.5rem;">
        <!--<span>在时间，对（目标）进行火力压制</span>-->
        <div v-if="this.templatePageName == '侦察目标'" class="foraid">
          <span>在[</span>
          <div class="tmLine">
            <bos-button @click.native="open('picker3')" size="large">12:05</bos-button>
            <date-time-picker ref="picker3" type="time" v-model="value3" @confirm="handleChange">
            </date-time-picker>
            <div class="rate-borderT"></div>
          </div>
          <span>] (</span>
          <div class="tmLine"><div><input type="text" placeholder="文本" style="width: 2rem;" class="text"></div><div class="rate-borderT2"></div></div>
          <span> )前，侦察[</span>
          <div class="tmLine"><div style="color: red" @click="goEarth">X坐标，Y坐标</div><div class="rate-borderT7"></div></div>
          <span>]的[</span>
          <div class="tmLine"><div style="background-color:#1c8de0;"><select name="hurt" class class="hurt"><option value="毁伤情况" selected>毁伤情况</option><option value="火力配系">火力配系</option> <option value="部队部署">部队部署</option></select> </div><div class="rate-borderT"></div></div>
          <span> ],[</span>
          <div class="tmLine"><div style="background-color:#a9acb1;"> 目标编号 </div><div class="rate-borderT"></div></div>
          <span>]</span>
        </div>
        <div v-if="this.templatePageName == '天气状况'" class="weatherSituation">
          <span>预计[</span>
          <div class="tmLine"><div style="background-color:#1c8de0;"><select name="time" class="hours"><option value="24小时">24小时</option><option value="48小时">48小时</option></select> </div></div>
          <span>内[</span>
          <div class="tmLine"><div><a style="color: red">地点</a></div> <div class="rate-borderT2"></div></div>
          <span> ]半径（）米将出现[</span>
          <div class="tmLine"><div style="background-color:#a9acb1;"><select name="weather" class="weather">
            <option value="雨">雨</option>
            <option value="雪">雪</option>
            <option value="沙尘暴">沙尘暴</option>
            <option value="晴">晴</option>
          </select> </div><div class="rate-borderT"></div></div>
        </div>
        <div v-if="this.templatePageName == '测试模板'" class="test">
          <span>在(</span>
          <div class="tmLine"><div><a style="color: red">时间</a></div> <div class="rate-borderT2"></div></div>
          <span>），[</span>
          <div class="tmLine"><div><a style="color: red">目标</a></div> <div class="rate-borderT2"></div></div>
          <span>]进行[</span>
          <div class="tmLine"><div><select name="doStyle" class="doStyle">
            <option value="暂时压制">暂时压制</option>
            <option value="空袭">空袭</option>
            <option value="破环">破坏</option></select></div> <div class="rate-borderT"></div>
          </div>
          <span>]</span>
        </div>
        <!--<div>在[12:31:05] <div class="rate-border"></div>(文本 <div class="rate-border"></div>)前，侦察[X坐标，Y坐标]的[受伤情况],[目标编号]s </div>-->
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
          <bos-button type="danger" class="send-btn" style="width: 76%" @click="sendTemplate">发送消息</bos-button>
          <!--<i id="talk_icon" :class="{'icon-voice':way,'icon-keyboard':!way}" @click="selectWay" v-show="!textContentShow"></i>-->
        </div>
      </div>
    </div>

</template>
<script>
  import $ from 'jquery';
  //import Clipboard from 'clipboard';
  import {DB,GroupDB} from '@/assets/js/db';
  import {generateUUID,getGroupName,calls,io} from '@/assets/js/utils';
  import * as actionTypes from "@/store/actions-types";
    export default{
        data(){
            return {
              templatePageName: '',
              statusShow: false,
              fontShow: false,
              responseSelect: false,
              user: this.$route.params.user,
              ul: this.$route.params.ul,
              isGroup: this.$route.params.isGroup,
              value3:null,
              spanlines:[],
              myself:this.$store.state.account,
            }
        },
        mounted(){
          this.templatePageName = this.$route.params.templateName;
          console.warn(this.templatePageName);
        },
        methods: {
          open(picker) {
            this.$refs[picker].open();
          },

          handleChange(value) {
            $(".foraid span").eq(1).text(value.toString())
            console.log($(".foraid span").eq(1).text());
//            Toast({
//              message: '已选择 ' + value.toString(),
//              position: 'bottom'
//            });
          },
          toTemplate(){
//              this.$router.replace("/me/template-message");
            this.$router.push({name: 'TemplateMessage', params: {user:this.user,isGroup:this.isGroup}});
          },
          showStatus(){
            if (this.fontShow == true){
              this.fontShow = false;
            }
            this.statusShow = !this.statusShow;
          },
          getFontColor(classname,color,infolevel){
            document.getElementById("color").className = classname;
            this.$store.state.chatStatus.statusColor =color;
            this.$store.state.chatStatus.infoLevel =infolevel;
            this.statusShow = false;
          },
          selectResponse(){
            this.responseSelect = !this.responseSelect;
          },
          goEarth(){
            console.log("走2");
              this.$router.replace("/handle");
          },
          sendTemplate(){
            var num=io.creatRand();
            let str = '';
           if (this.templatePageName == '侦察目标'){
             let a = $(".foraid>span").eq(0).text();
             str += a;
             a = $(".foraid span").eq(1).text();
             str += a;
             a = $(".foraid>span").eq(1).text();
             str += a;
             a = $(".text").val();
             str += a;
             a = $(".foraid>span").eq(2).text();
             str += a;
             a = $(".foraid>span").eq(3).text();
             str += a;
             a = $(".hurt").val();
             str += a;
             a = $(".foraid>span").eq(4).text();
             str += a;
             a = $(".foraid>span").eq(5).text();
             str += a;;
             console.log(str)
           }else if (this.templatePageName == '天气状况'){
             let a = $(".weatherSituation>span").eq(0).text();
             str += a;
             a = $(".hours").val();
             str += a;
             a = $(".weatherSituation>span").eq(1).text();
             str += a;
             a = $(".weatherSituation>span").eq(2).text();
             str += a;
             a = $(".weatherSituation>span").eq(3).text();
             str += a;
             a = $(".weather").val();
             str += a;
             console.log(str)
           }else if (this.templatePageName == '测试模板'){
             let a = $(".test>span").eq(0).text();
             str += a;
             a = $(".test>span").eq(1).text();
             str += a;
             a = $(".test>span").eq(2).text();
             str += a;
             a = $(".doStyle").val();
             str += a;
             a = $(".test>span").eq(3).text();
             str += a;
             console.log(str)
           }
//            this.spanlines.push($(".foraid span").text());
            let db = new DB("Message");
           if(this.isGroup == false){
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
             db.insert(msg,function(err,result){
               if(err){
                 console.log(err.message);
               }else{
                 console.warn(result);
                 return result;
               }
             });
             let ul = this.ul;
             io.sendTemplate(ul,io.formatDateTime(new Date()),this.myself.image,num,str,msg.statusColor,msg.fontStyle,msg.isFail,msg.sender,msg.receiver,false);
             this.$router.push({name: 'Chat', params: {user:this.user,isGroup:this.isGroup}});
           }else if(this.isGroup == true){
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
             this.$router.push({name: 'ChatGroup', params: {group:this.user,isGroup:this.isGroup}});
            }

          }
        }
    }
</script>

<style>
  .tmLine{
    display: inline-block;
  }
  .rate-borderT2{
    height: .1rem;
    width: 2rem;
    border: 1px solid #000;
    border-top: 0;
    position: absolute;
    text-align: center;
  }
  .rate-borderT{
    height: .1rem;
    width: 4rem;
    border: 1px solid #000;
    border-top: 0;
    position: absolute;
    text-align: center;
  }
  .rate-borderT7{
    height: .1rem;
    width: 7rem;
    border: 1px solid #000;
    border-top: 0;
    position: absolute;
    text-align: center;
  }
  .hurt,.hours,.weather,.doStyle{
    background-color: #1c8de0;
    border:none;
  }
  .hurt:hover,.hours:hover,.weather:hover,.doStyle:hover{
    border: none;
  }
  .tmLine button{
    padding: 2px 6px;
    background: #a9acb1;
  }
</style>
