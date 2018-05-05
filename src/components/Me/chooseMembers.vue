<template>
  <div>
    <div class="choosegroup-box">
      <div class="choosegroup-group" v-for="(group,index) in groupList">
        <i :class="{ 'icon-nochoose':!group.caretSelect, 'icon-choose':group.caretSelect}" @click="toggle(group,index)"></i>
        <div class="choosegroup-list" @click="checkUser(group,index)">
          <span>{{group.groupName}}</span>
          <i :class="{'icon-righttri':!group.caretFlat,'icon-downtri':group.caretFlat}"></i>
          <label>0/{{group.members.length}}</label>
        </div>
        <ul class="choose-group-ull" v-show="group.isShow">
          <li v-for="child in group.members">
            <i :class="{ 'icon-nochoose-children':!child.caretSelectChild, 'icon-choose-children':child.caretSelectChild}" @click="toggleChild(group,child,index)"></i>
            <a>
              <img :src="'http://localhost:3000/sdcard/data/config/images/'+child.image" />
              <span>{{child.nickName}}</span><br/>
              <label>{{child.sipid}}</label>
            </a>
          </li>
        </ul>
      </div>
      <div class="choosegroup-group">
        <i :class="{ 'icon-nochoose':!caretSelectAll, 'icon-choose':caretSelectAll}" @click="toggleAll"></i>
        <div class="choosegroup-list" @click="checkUserAll">

          <span>全体成员</span>
          <i :class="{'icon-righttri':!caretFlatAll,'icon-downtri':caretFlatAll}"></i>
          <label>0/{{userAll.length}}</label>
        </div>
        <ul class="choose-group-ull" v-show="isShowAll">
          <li v-for="member in userAll">
            <i :class="{ 'icon-nochoose-children':!member.caretSelectChildAll, 'icon-choose-children':member.caretSelectChildAll}" @click="toggleChildAll(member,index)"></i>
            <a>
              <img :src="'http://localhost:3000/sdcard/data/config/images/'+member.image" />
              <span>{{member.nickName}}</span><br/>
              <label>{{member.sipid}}</label>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="sendfooter" v-if="type == 'chatMany'">
      <div class="send-btn" @click="toChat">
        确定并发送
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {DB} from '@/assets/js/db';
  import {Group} from '@/assets/js/obj_prototype';
  import {generateUUID,getGroupName} from '@/assets/js/utils';
  export default{
    data(){
      return{
        caretFlat: false,
        caretSelect: false,
        caretSelectChild: false,
        isShow: false,
        caretFlatAll: false,
        caretSelectAll: false,
        caretSelectChildAll: false,
        isShowAll: false,
        users:[],
        groupList:[],
        userAll:[],
      }
    },
    mounted(){
      let _this = this;
      let dbGroup = new DB('group');
      _this.getGroupInfo();
      _this.getUserAll();
      if(this.type=="sos"){
        dbGroup.queryConfig({type:"sosDefault"},function(err, res){
          if(err){
            console.log(err)
          }else{
            if(res.length){
              _this.users = res[0].members;
             /* _this.getGroupInfo();
              _this.getUserAll();*/
            }
          }
        })
      }
      if(this.type=="ts"){
        dbGroup.queryConfig({type:"tsDefault"},function(err, res){
          if(err){
            console.log(err)
          }else{
            if(res.length){
              _this.users = res[0].members;
              /*_this.getGroupInfo();
              _this.getUserAll();*/
            }
          }
        })
      }
    },
    destroyed(){
      let _this = this;
      let dbGroup = new DB('group');
      if(this.type=="sos"){
        dbGroup.queryConfig({type:"sosDefault"},function(err, res){
          if(err){
            console.log(err)
          }else{
            if(res.length){
              dbGroup.update({type:"sosDefault"}, {$set:{ members: _this.users}}, {multi: true}, function (err, num) {
                if(err){
                  console.log(err);
                }else{
                  console.log(num);
                }
              })
            }else if(!res.length){
              let group = new Group();
              group.groupF = "0";
              group.type = "sosDefault";
              group.members = _this.users;
              group.uuid = generateUUID.creatUuid();
              group.moduleUser = _this.$store.state.account.uniqueId;
              getGroupName.insertGroup(group);
            }
          }
        })
      }
      if(this.type=="ts"){
        dbGroup.queryConfig({type:"tsDefault"},function(err, res){
          if(err){
            console.log(err)
          }else{
            if(res.length){
              dbGroup.update({type:"tsDefault"}, {$set:{ members: _this.users}}, {multi: true}, function (err, num) {
                if(err){
                  console.log(err);
                }else{
                  console.log(num);
                }
              })
            }else if(!res.length){
              let group = new Group();
              group.groupF = "0";
              group.type = "tsDefault";
              group.members = _this.users;
              group.uuid = generateUUID.creatUuid();
              group.moduleUser = _this.$store.state.account.uniqueId;
              getGroupName.insertGroup(group);
            }
          }
        })
      }
    },
    props:["type"],
    methods:{
      removal(){
        var hash = {};
        this.users = this.users.reduce(function(item, next) {
          hash[next.uniqueId] ? '' : hash[next.uniqueId] = true && item.push(next);
          return item;
        }, []);
      },
      getUserAll(){
        let _this = this;
        getGroupName.queryUser({},function(value){
            console.log("选择成员");
            console.log(value);
          for(let i=0;i<value.length;i++){
            if(!value[i].groupUri && value[i].uniqueId != _this.$store.state.account.uniqueId){
              _this.userAll.push(value[i]);
            }
          }
          _this.alreadySelect();
        })
      },
      getGroupInfo(){
        let _this = this;
        let uniqueId = this.$store.state.account.uniqueId;
        _this.groupList = getGroupName.groupName(uniqueId);
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
          _this.alreadySelect();
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
      toggleAll(){
        let _this = this;
        if(this.caretSelectAll == false){
          this.caretSelectAll = true;
          for (let i = 0; i < _this.userAll.length; i++) {
            _this.users.push(_this.userAll[i]);
          }
        }else{
          this.caretSelectAll = false;
          for (let i = 0; i < _this.userAll.length; i++) {
            for (let j = 0; j < _this.users.length; j++) {
              if (_this.userAll[i].uniqueId == _this.users[j].uniqueId) {
                _this.users.splice(j, 1);
              }
            }
          }
        }
        this.userAll.forEach(function (item, index) {
          if (typeof item.caretSelectChildAll == 'undefined', _this.caretSelectAll) {
            Vue.set(item, "caretSelectChildAll", _this.caretSelectAll);
          }
          else {
            item.caretSelectChildAll = _this.caretSelectAll;
          }
        });
        _this.removal();
      },
      toggleChildAll(member,index){
        let _this = this;
        if (typeof member.caretSelectChildAll == 'undefined') {
          Vue.set(member, "caretSelectChildAll", true);
          _this.users.push(member);
          console.log(_this.users)
        } else if (member.caretSelectChildAll) {
          Vue.set(member, "caretSelectChildAll", false);
          this.caretSelectAll = false;
          for (let i = 0; i < _this.users.length; i++) {
            if (member.uniqueId == _this.users[i].uniqueId) {
              _this.users.splice(i, 1);
            }
          }
        } else {
          Vue.set(member, "caretSelectChildAll", true);
          _this.users.push(member);
        }
        _this.removal();
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
      toggle(group, index){
        let _this = this;
        if (typeof group.caretSelect == 'undefined') {
          Vue.set(group, "caretSelect", true);
          for (let i = 0; i < group.members.length; i++) {
            _this.users.push(group.members[i]);
          }
          console.log(_this.users)
        } else if (group.caretSelect) {
          Vue.set(group, "caretSelect", false);
          for (let i = 0; i < group.members.length; i++) {
            for (let j = 0; j < _this.users.length; j++) {
              if (group.members[i].uniqueId == _this.users[j].uniqueId) {
                _this.users.splice(j, 1);
              }
            }
          }
        } else {
          Vue.set(group, "caretSelect", true);
          for (let i = 0; i < group.members.length; i++) {
            _this.users.push(group.members[i]);
          }
        }
        group.members.forEach(function (item, index) {
          if (typeof item.caretSelectChild == 'undefined', group.caretSelect) {
            Vue.set(item, "caretSelectChild",group.caretSelect);
          }
          else {
            item.caretSelectChild = group.caretSelect;
          }
        });
        _this.removal();
      },
      toggleChild(group,child, index){
        let _this = this;
        if (typeof child.caretSelectChild == 'undefined') {
          Vue.set(child, "caretSelectChild", true);
          _this.users.push(child);
          console.log(_this.users)
        } else if (child.caretSelectChild) {
          Vue.set(child, "caretSelectChild", false);
          Vue.set(group, "caretSelect", false);
          for (let i = 0; i < _this.users.length; i++) {
            if (child.uniqueId == _this.users[i].uniqueId) {
              _this.users.splice(i, 1);
            }
          }
        } else {
          Vue.set(child, "caretSelectChild", true);
          _this.users.push(child);
        }
        _this.removal();
      },
      alreadySelect(){
        let _this = this;
        if(this.type=="sos"){
          //全体成员
          for(let i = 0; i < this.userAll.length; i++){
            for(let j = 0; j < this.users.length; j++){
              if(this.userAll[i].uniqueId == this.users[j].uniqueId){
                Vue.set(_this.userAll[i], "caretSelectChildAll", true);
              }
            }
          }
          //分组成员
          for(let i = 0; i < this.groupList.length; i++){
            for(let j = 0; j < this.groupList[i].members.length; j++){
              for(let k = 0; k < this.users.length; k++){
                if(this.groupList[i].members[j].uniqueId == this.users[k].uniqueId){
                  Vue.set(_this.groupList[i].members[j], "caretSelectChild", true);
                }
              }
            }
          }
        }
        if(this.type=="ts"){
          //全体成员
          for(let i = 0; i < this.userAll.length; i++){
            for(let j = 0; j < this.users.length; j++){
              if(this.userAll[i].uniqueId == this.users[j].uniqueId){
                Vue.set(_this.userAll[i], "caretSelectChildAll", true);
              }
            }
          }
          //分组成员
          for(let i = 0; i < this.groupList.length; i++){
            for(let j = 0; j < this.groupList[i].members.length; j++){
              for(let k = 0; k < this.users.length; k++){
                if(this.groupList[i].members[j].uniqueId == this.users[k].uniqueId){
                  Vue.set(_this.groupList[i].members[j], "caretSelectChild", true);
                }
              }
            }
          }
        }
      },
      toChat(){
        let _this = this;
        if(this.users.length){
          _this.$router.push({name:"ChatMany",params:{chatUsers:_this.userNames,chatIps:_this.userIps,chatIds:_this.userIds}})
        }else{
          this.$message.error('请选择成员');
        }
      }
    }
  }
</script>

<style>
  .choosegroup-group{
    position: relative;
  }
  .choosegroup-box{
    margin-top: 3rem;
    margin-bottom: 3.5rem;
  }
  .choosegroup-list{
    padding-left: 4%;
    line-height: 3.2rem;
    border-bottom: 1px solid #e9e9e9;
  }
  .choosegroup-list span{
    margin-left: 0.9rem;
  }
  .choosegroup-list label{
    position: relative;
    right: 1rem;
    text-align: center;
    float: right;
    color: #999;
  }
  .icon-nochoose{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../static/images/im_radiobutton_multi_nochoose.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: absolute;
    top: .85rem;
    left: .6rem;
  }
  .icon-choose{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../static/images/im_radiobutton_multi_choose.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: absolute;
    top: .85rem;
    left: .6rem;
  }
  .icon-righttri{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url("../../../static/images/im_group_indicator_unexpanded01.png") no-repeat;
    background-size: 100%;
    position: relative;
    top: 1.1rem;
    margin-right: 1rem;
    float: right;
  }
  .icon-downtri{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url("../../../static/images/im_group_indicator_expanded01.png") no-repeat;
    background-size: 100%;
    position: relative;
    top: 1.1rem;
    margin-right: 1rem;
    float: right;
  }
  .icon-nochoose-children,.icon-choose-children{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.2rem;
    position: relative;
    top: 1.15rem;
  }
  .icon-nochoose-children{
    background: url("../../../static/images/im_radiobutton_multi_nochoose.png") no-repeat;
    background-size: 100%;
  }
  .icon-choose-children{
    background: url("../../../static/images/im_radiobutton_multi_choose.png") no-repeat;
    background-size: 100%;
  }
  .choose-group-ull{
    background:#fff;
  }
  .choose-group-ull li{
    border-top:solid 1px #eee;
    height:3.7rem;
    line-height: 1.5rem;
    padding:0 1.2rem;
  }
  .choose-group-ull li a{ width:90%;display:inline-block;}
  .choose-group-ull li a>img{width:8%;height:8%;margin-top:.15rem;float:left;border-radius: 50%}
  .choose-group-ull li a>span { float:left;padding-left:1rem;}
  .choose-group-ull li a>label { float:left;padding-left:1rem;color: blue;font-size: 0.9rem}
</style>
