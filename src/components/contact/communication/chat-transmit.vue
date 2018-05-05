<template>
  <div class="transmit">
    <div class="top">
      发送到
      <a style="position: absolute;right: 0.8rem;" @click="goBack">取消</a>
    </div>
    <div class="choosegroup-box">
      <div class="choose-group" v-for="(group,index) in groupList">
        <div class="choose-list" @click="checkUser(group,index)">
          <span>{{group.groupName}}</span>
          <i :class="{'icon-righttri':!group.caretFlat,'icon-downtri':group.caretFlat}"></i>
          <label>0/{{group.members.length}}</label>
        </div>
        <ul class="choose-ull" v-show="group.isShow">
          <li v-for="(child,index) in group.members" @click="transmitUser(index)">
            <a>
              <img :src="'http://localhost:3000/sdcard/data/config/images/'+child.image" />
              <span>{{child.nickName}}</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="choose-group">
        <div class="choose-list" @click="checkUserAll">
          <span>全体成员</span>
          <i :class="{'icon-righttri':!caretFlatAll,'icon-downtri':caretFlatAll}"></i>
          <label>0/{{userAll.length}}</label>
        </div>
        <ul class="choose-ull" v-show="isShowAll">
          <li v-for="(member,index) in userAll" @click="transmitUser(index)">
            <a>
              <img :src="'http://localhost:3000/sdcard/data/config/images/'+member.image" />
              <span>{{member.nickName}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {DB} from '@/assets/js/db';
  import {Group} from '@/assets/js/obj_prototype';
  import {generateUUID,getGroupName,calls,io} from '@/assets/js/utils';
  import * as actionTypes from "@/store/actions-types";
  export default{
    data(){
      return{
        text:this.$route.params.text,
        user:this.$route.params.user,
        type:this.$route.params.type,
        myself:this.$store.state.account,
        caretFlat: false,
        isShow: false,
        caretFlatAll: false,
        isShowAll: false,
        groupList:[],
        users:[],
        userAll:[],
        userNames:[],
        userIps:[]
      }
    },
    mounted(){
      console.log("text11------------------");
      console.log(this.text);
      console.log(this.type);
      this.getGroupInfo();
      this.getUserAll();
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    destroyed(){
      for(let i=0;i<this.users.length;i++){
        this.userNames.push(this.users[i].position+this.users[i].nickName);
        this.userIps.push(this.users[i].sipid);
      }
      let group = new Group();
      group.groupF = "0";
      group.type = "sosDefault";
      group.membersIp = this.userIps;
      group.membersNames = this.userNames;
      group.uuid = generateUUID.creatUuid();
      group.moduleUser = this.$store.state.account.uniqueId;
      getGroupName.insertGroup(group);
    },
    methods:{
      removal(){
        let _this = this;
        var hash = {};
        this.users = this.users.reduce(function(item, next) {
          hash[next.uniqueId] ? '' : hash[next.uniqueId] = true && item.push(next);
          return item
        }, []);
      },
      getUserAll(){
        let _this = this;
        getGroupName.queryUser({},function(value){
          for(let i=0;i<value.length;i++){
            if(!value[i].groupUri && value[i].uniqueId!=_this.$store.state.account.uniqueId){
              _this.userAll.push(value[i]);
            }
          }
        })
      },
      getGroupInfo(){
        let _this = this;
        let uniqueId = this.$store.state.account.uniqueId;
        _this.groupList = getGroupName.groupName(uniqueId);
        console.log(_this.groupList);
        getGroupName.queryUser({},function(value){
          for(let i=0;i<value.length;i++){
            for(let j=0;j<_this.groupList.length;j++) {
              if (value[i].groupUri == _this.groupList[j].groupUri) {
                for (let k = 0; k < value.length; k++) {
                  if (value[i].userUri == value[k].uniqueId) {
                    _this.groupList[j].members.push(value[k]);
                  }
                }
              }
            }
          }
        })
      },
      checkUserAll(){
        if(this.caretFlatAll == false){
          this.caretFlatAll = true;
          this.isShowAll = true;
        }else{
          this.caretFlatAll = false;
          this.isShowAll = false;
        }
      },
      checkUser(group, index){
        if (typeof group.caretFlat == 'undefined') {
          group.caretFlat = true;
          Vue.set(group, "isShow", true);
        } else if (group.caretFlat) {
          group.caretFlat = false;
          Vue.set(group, "isShow", false);
        } else {
          group.caretFlat = true;
          Vue.set(group, "isShow", true);
        }
      },
      goBack(){
        let _this = this;
        _this.$router.push({name: 'Chat', params: {user:_this.user}});
      },
      transmitUser(index){
//          console.log('index-------------------------');
//          console.log(index);
          let _this = this;
          let user = _this.userAll[index];
          console.log("user--------------------------");
          console.log(user);
          if(_this.text != ''){
            new Promise(function(resolve){
              var ul = $('#PUL');
              if(_this.type == "text") {
                io.sendTemplate(ul, io.formatDateTime(new Date()), user.image, io.creatRand(), _this.text);
                // 数据库
                let db = new DB("Message");
                let msg = {
                  name: "message",
                  msg: _this.text,
                  msgType: "text",
                  isRead: "Y",//是否已读，默认N
                  isConfirm: "N",//是否需要确认,默认N 不需要
                  isResponse: "N",//是否受到相应,默认N 不需要
                  msgLevel: "1",//消息级别 1,2,3 一般，重要，紧急。
                  isDelete: "N",//是否删除,默认N
                  sender: _this.myself.uniqueId,//发送者
                  receiver: user.uniqueId,//接受者
                  identity: _this.myself.uniqueId + "_" + user.uniqueId,//发送+接收
                  sendImage: _this.myself.image,//发送者头像
                  chatImage: user.image,
                  nickName: _this.myself.nickName,//发送者昵称
                  chatName: user.nickName,
                  sendDate: io.formatDateTime(new Date()),
                  uuid: generateUUID.creatUuid(),
                  moduleUser: _this.myself.uniqueId
                };
                db.insert(msg, function (err, result) {
                  if (err) {
                    console.log(err.message);
                  } else {
                    console.log('result---------------');
                    console.log(result);
                    return result;
                  }
                });
                GeoBOS.io.send(
                  {
                    type: "socket",
                    address: "192.168.191.7",
                  },
                  JSON.stringify(msg),
                  function (err, res) {
                    if (err) {
                      console.log("send failed with:" + err.message);
                    } else {
//                      console.log(res)
                    }
                  }
                );
              }else if(_this.type == "file"){
                io.sendFileTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,io.creatRand(),_this.text);
                io.sendFile(_this.$store.state.address.addressA,_this.text,"file",_this.myself.uniqueId,user.uniqueId,_this.myself.image,_this.myself.nickName,undefined,user.image,user.nickName);
                let db = new DB("Message");
                let msg = {
                  name : "message",
                  msg : _this.text,
                  msgType : "file",
                  isRead : "Y",//是否已读，默认N
                  isConfirm : "N",//是否需要确认,默认N 不需要
                  isResponse :"N",//是否受到相应,默认N 不需要
                  msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
                  isDelete : "N",//是否删除,默认N
                  sender : _this.myself.uniqueId,//发送者
                  receiver : user.uniqueId,//接受者
                  identity: _this.myself.uniqueId+"_"+user.uniqueId,
                  sendImage : _this.myself.image,//发送者头像
                  nickName : _this.myself.nickName,//发送者昵称
                  chatImage:user.image,
                  chatName : user.nickName,
                  sendDate : io.formatDateTime(new Date()),
                  msgStatus : "init",//init,sender,success,fail
                  moduleUser : _this.myself.uniqueId,//当前账号的使用uri
                  uuid:generateUUID.creatUuid()
                };
                db.insert(msg,function(err,result){
                  if(err){
                    console.log(err.message);
                  }else{
                    console.log(result);
                    return result;
                  }
                });
              }else if(_this.type == "picture"){
                io.sendFile(_this.$store.state.address.addressA,_this.text,"picture",_this.myself.uniqueId,user.uniqueId,_this.myself.image,_this.myself.nickName,undefined,user.image,user.nickName);
                io.sendPhotoTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,_this.text);
                let db = new DB("Message");
                let msg = {
                  name : "message",
                  msg : _this.text,
                  msgType : "picture",
                  isRead : "Y",//是否已读，默认N
                  isConfirm : "N",//是否需要确认,默认N 不需要
                  isResponse :"N",//是否受到相应,默认N 不需要
                  msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
                  isDelete : "N",//是否删除,默认N
                  sender : _this.myself.uniqueId,//发送者
                  receiver : user.uniqueId,//接受者
                  identity: _this.myself.uniqueId+"_"+user.uniqueId,
                  sendImage : _this.myself.image,//发送者头像
                  nickName : _this.myself.nickName,//发送者昵称
                  chatImage:user.image,
                  chatName : user.nickName,
                  sendDate : io.formatDateTime(new Date()),
                  msgStatus : "init",//init,sender,success,fail
                  moduleUser : _this.myself.uniqueId,//当前账号的使用uri
                  uuid:generateUUID.creatUuid()
                };
                db.insert(msg,function(err,result){
                  if(err){
                    console.log(err.message);
                  }else{
                    console.log(result);
                    return result;
                  }
                });
            /*    $(".photos").click(function(){
                  _this.picShow = true;
                  $("#divCenter").find("img").prop("src",$(this).prop("src"));
                });
                $("#divCenter").click(function(){
                  _this.picShow = false;
                })*/
              }else if(_this.type == "audio"){
                io.sendAudioTemplate(ul,io.formatDateTime(new Date()),_this.myself.image,_this.text);
                io.sendFile(_this.$store.state.address.addressA,_this.text,"audio",_this.myself.uniqueId,user.uniqueId,_this.myself.image,_this.myself.nickName,undefined,user.image,user.nickName);
                let msg = {
                  name : "message",
                  msg : _this.text,
                  msgType : "audio",
                  isRead : "Y",//是否已读，默认N
                  isConfirm : "N",//是否需要确认,默认N 不需要
                  isResponse :"N",//是否受到相应,默认N 不需要
                  msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
                  isDelete : "N",//是否删除,默认N
                  sender : _this.myself.uniqueId,//发送者
                  receiver : user.uniqueId,//接受者
                  identity: _this.myself.uniqueId+"_"+user.uniqueId,
                  sendImage : _this.myself.image,//发送者头像
                  nickName : _this.myself.nickName,//发送者昵称
                  chatImage:user.image,
                  chatName : user.nickName,
                  sendDate : io.formatDateTime(new Date()),
                  msgStatus : "init",//init,sender,success,fail
                  uuid:generateUUID.creatUuid()
                };
                let db = new DB("Message");
                db.insert(msg,function(err,result){
                  if(err){
                    console.log(err.message);
                  }else{
                    console.log(result);
                    return result;
                  }
                });
              }
              resolve(true);
            }).then(function(){
              _this.$router.push({name: 'Chat', params: {user:user}});
            })
          }
      }
    }
  }
</script>

<style scoped>
  .transmit .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .transmit .top span{
    position: absolute;
    left: 0;
  }
  .transmit .choose-group{
    position: relative;
    border-bottom:1px solid #e9e9e9;
  }
  .transmit .choosegroup-box{
    margin-top: 3rem;
    margin-bottom: 3.5rem;
  }
  .transmit .choose-list{
    padding-left: 4%;
    line-height: 3.2rem;
    border-bottom: 1px solid #e9e9e9;
  }
  .transmit .choose-list label{
    position: relative;
    right: 1rem;
    text-align: center;
    float: right;
    color: #999;
  }
  .transmit .icon-righttri{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-image: url("../../../../static/images/im_group_indicator_unexpanded01.png");
    background-size: 100%;
    background-repeat: no-repeat;
    position: relative;
    top: 1.1rem;
    margin-right: 1rem;
    float: right;
  }
  .transmit .icon-downtri{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-image: url("../../../../static/images/im_group_indicator_expanded01.png");
    background-size: 100%;
    background-repeat: no-repeat;
    position: relative;
    top: 1.1rem;
    margin-right: 1rem;
    float: right;
  }
  .transmit .choose-ull{
    background:#fff;
  }
  .transmit .choose-ull li{
    border-top:solid 1px #eee;
    height:2.5rem;
    line-height: 2.5rem;
    padding:0 1.6rem;
  }
  .transmit .choose-ull li a{ width:90%;display:inline-block;}
  .transmit .choose-ull li a>img{width:7%;height:7%;float:left;margin-top:.1em;border-radius: 17px;}
  .transmit .choose-ull li a>span { float:left;padding-left:1rem;font-weight: normal}
  .transmit .choose-ull li a>label { float:left;padding-left:1rem;color: blue;font-size: 0.9rem}
</style>
