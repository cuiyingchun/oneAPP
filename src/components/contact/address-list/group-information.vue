<template>
  <div class="group-info">
    <div class="top" style="position: fixed">
      <span @click="toChatGroup"><i class="icon-back"></i>返回</span>
      群组信息
    </div>
    <div class="group-name">
      <span style="margin-left: 1rem">群组名称：</span>
      <span>{{group.groupInfo.name}}</span>
    </div>
    <div class="list-content">
      <ul class="list-info">
        <li><i class="icon-2"></i><span>群组公告:</span><span class="groupInfo"> {{group.groupInfo.notice}}</span></li>
        <li><i class="icon-3"></i><span>群组主题:</span><span class="groupInfo"> {{group.groupInfo.subject}}</span></li>
        <li><i class="icon-4"></i><span>我的群名片:</span><span class="groupInfo"> {{myself.nickName}}</span></li>
        <li id="groupPeople">
          <i class="icon-5"></i><span>群成员列表:</span>
          <div class="groupPeople">
            <div class="groupPerson"  v-for="member in group.memberInfo">
              <div class="personImg" @click="toInfo(member)">
                <img :src="'http://localhost:3000/sdcard/data/config/images/'+member.image" >
              </div>
              <p>{{member.nickName}}</p>
            </div>
            <img  src="../../../../static/images/im_contact_add_icon.png" style="float: right;margin-top: .1rem;margin-right: 1.5rem;" @click="addMembers">
          </div>
        </li>
        <li @click="toHistory"><i class="icon-6"></i><span>聊天记录</span></li>
        <li @click="toChatBackground"><i class="icon-7"></i><span>聊天背景设置</span></li>
        <li><button class="outGroup" @click="dissolveGroup">{{out}}</button></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {io} from '@/assets/js/utils';
  import {DB} from '@/assets/js/db';
  export default {
    name:"GroupInfo",
    data () {
      return {
        group:this.$route.params.group,
        creator:undefined,
        out:"退出该群",
        myself:this.$store.state.account
      }
    },
    mounted(){
      this.isCreator();
    },
    methods: {
      toInfo(self){
        this.$router.push({name:"SelfInfo",params:{self:self,groupUri:this.group.groupInfo.groupUri,isGroupInfo:true}});
      },
      addMembers(){
        let _this = this;
        this.$router.push({name: 'AddGroupNext', params: {group:_this.group}});
      },
      isCreator(){
        let _this = this;
        _this.creator = _this.group.groupInfo.creator;
        if(_this.creator == _this.$store.state.account.uniqueId){
          _this.out = "解散该群";
        }
      },
      dissolveGroup(){
        let _this = this;
        let members = _this.group.memberInfo;
        let db = new DB("Group");
        if(_this.out == "解散该群"){
          this.$confirm('确定要解散该群吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
//              删除群组
            new Promise(function(resolve) {
              let query = {
                name: "group",
                chatName: _this.group.groupInfo.name,
                groupF: "2",
              };
              db.remove(query, {}, function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("qun删除成功--------------------------------");
                  console.log(res);
                  resolve(true);
                }
              });
              let msg = {
                name: "group",
                chatName: _this.group.groupInfo.name,
                groupF: "2",
                onlyType: "delete"
              };
              console.log("解散群时的成员");
              console.log(members);
              for (let i = 0; i < members.length; i++) {
                GeoBOS.adhoc.sendMessage(
                  {
                    uid: "abcdefg",
                    content: JSON.stringify(msg),
                    destIp: _this.$store.state.otherIP,
                    type: "Ip"
                  },
                  function (err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("success!delete------------------------------");
                    }
                  }
                );
              }
            }).then(function(){
              _this.$router.replace("/address-list");
            })
          })
        }else{
//          退出群组
          let newMembers = [];
//          console.log("members-----------------------```");
//          console.log(members);
          this.$confirm('确定要退出该群吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            new Promise(function(resolve) {
              for(let i=0;i<members.length;i++){
                if(members[i].nickName != _this.myself.nickName){
                  newMembers.push(members[i]);
                }
              }
              console.log("newmembers11-----------------------```");
              console.log(newMembers);
              let query = {
                name: "group",
                chatName: _this.group.groupInfo.name,
                groupF: "2",
              };
              db.remove(query, {}, function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("qun退出成功--------------------------------");
                  console.log(res);
                  resolve(true);
                }
              });
              let msg = {
                name: "group",
                chatName: _this.group.groupInfo.name,
                groupF: "2",
                onlyType: "quit",
                memberInfo:newMembers
              };
              for (let i = 0; i < members.length; i++) {
                GeoBOS.adhoc.sendMessage(
                  {
                    uid: "abcdefg",
                    content: JSON.stringify(msg),
                    destIp: _this.$store.state.otherIP,
                    type: "Ip"
                  },
                  function (err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("success!delete------------------------------");
                    }
                  }
                );
              }
            }).then(function(){
              _this.$router.replace("/address-list");
            })
          })
        }
      },
      toHistory(){
        let _this = this;
        this.$router.push({name: 'ChatHistory', params: {group:_this.group}});
      },
      toChatGroup(){
        let _this = this;
        this.$router.push({name:'ChatGroup',params:{group:_this.group}});
      },
      toChatBackground(){
        let _this = this;
        this.$router.push({name: 'ChatBackground', params: {group:_this.group}});
      }
    }
  }
</script>
<style>
  .group-info .list-info .outGroup{
    padding: 2px;
    border: none;
    background-color: #ff2638;
    width: 95%;
    height: 2.6rem;
    border-radius: 10px;
    color: white;
    margin-left: 2.5%;
    margin-top: .5%;
  }
  .group-info .top{
    position: relative;
  }
  .group-info .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .group-info .top span{
    position: absolute;
    left: 0;
  }
  .group-name{
    border-top: 5px solid #ededed;
    border-bottom: 8px solid #cfd3d6;
    background-color: #ffffff;
    position: absolute;
    top: 3rem;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    font-size: 20px;
  }
  .group-info .list-content{
    width: 100%;
    margin: 0 auto;
    overflow: scroll;
    position: absolute;
    top: 7rem;
  }
  .group-info ul li{
    height: 3rem;
    line-height: 3rem;
    font-size: 0.9rem;
    border-bottom: 1px solid #e9e9e9;
  }
  .group-info ul li span{
    font-size: .9rem;
  }
  .group-info ul li i{
    position: relative;
    top: .55rem;
    padding-right: .5rem;
    margin-left: .5rem;
  }
  .list-info{
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .list-info .groupInfo{
    color: grey;
    margin-left: 1.5rem;
  }
  .list-info li i:nth-of-type(2){float:right;margin-right:10px;margin-top:8px;}
  #groupPeople{
    height: 8.4rem;
    border-bottom: 5px solid #cfd3d6 ;
  }
  #groupPeople .groupPeople{
    margin-left: 1.5rem;
    overflow-x: scroll;
    overflow-y: hidden;
    height: 5rem;
  }
  #groupPeople .groupPeople .groupPerson{
    float: left;
    margin: 3px 7px;
  }
  .groupPerson p{
    width: 3rem;
    text-align: center;
    font-size: 11px;
    display: block;
    height: 1.5rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1.5rem;
  }
  .groupPerson .personImg{
    height: 3rem;
  }
  .groupPerson .personImg img{
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  .group-info .icon-2,.group-info .icon-3,.group-info .icon-4,.group-info .icon-5,.group-info .icon-6,.group-info .icon-7{
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
    position: relative;
    top: .37rem;
  }
  .group-info .icon-2{
    background: url("../../../../static/images/im_pub_goup_notice.png") no-repeat;
    background-size: 1.5rem;
  }
  .group-info .icon-3{
    background: url("../../../../static/images/im_pub_goup_notice.png") no-repeat;
    background-size: 1.5rem;
  }
  .group-info .icon-4{
    background: url("../../../../static/images/im_pub_goup_card.png") no-repeat;
    background-size: 1.5rem;
  }
  .group-info .icon-5{
    background: url("../../../../static/images/im_pub_goup_mem.png") no-repeat;
    background-size: 1.5rem;
  }
  .group-info .icon-6{
    background: url("../../../../static/images/im_chat_record_icon.png") no-repeat;
    background-size: 1.5rem;
  }
  .group-info .icon-7{
    background: url("../../../../static/images/im_chat_bg_setting_icon.png") no-repeat;
    background-size: 1.5rem;
  }
</style>
