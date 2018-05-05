<template>
    <div>
      <div class="top">
        <span @click="goback"><i class="icon-back"></i>返回</span>
        添加群组成员
      </div>
      <div class="choosegroup-group" style="top: 3.5rem">
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
      <div class="nextButton" >
        <bos-button type="danger" @click="addSuccess">完成</bos-button>
      </div>
    </div>
</template>
<script>
  import Vue from 'vue';
  import {Group} from '@/assets/js/obj_prototype';
  import {generateUUID,getGroupName,io} from '@/assets/js/utils';
  import {DB} from '@/assets/js/db';
    export default{
      name: 'AddGroupNext',
        data(){
          return {
            caretFlatAll: false,
            caretSelectAll: false,
            caretSelectChildAll: false,
            isShowAll: false,
            users:[],
            userAll:[],
            myself:this.$store.state.account,
            group:this.$route.params.group,
            groupInfo:this.$route.params.groupInfo,
            allGroupName: this.$route.params.allGroupName,
          }
        },
        mounted(){
          let _this = this;
          if(this.$route.params.group){
            this.users = this.$route.params.group.memberInfo;
            _this.getUserAll();
          }
          if(this.$route.params.groupInfo){
            this.getUserAll();
          }
        },
        methods: {
          goback(){
            let _this = this;
            if(this.$route.params.group){
              this.$router.push({name: 'GroupInfo', params: {group:_this.group}});
            }else if(this.$route.params.groupInfo){
              this.$router.push({name: 'AddGroup', params: {groupInfo: this.groupInfo,allGroupName: this.allGroupName}});
            }
          },
          getUserAll(){
            let _this = this;
            getGroupName.queryUser({},function(value){
              for(let i=0;i<value.length;i++){
                if(!value[i].groupUri && value[i].uniqueId!=_this.$store.state.account.uniqueId){
                  _this.userAll.push(value[i]);
                }
              }
              _this.alreadyExist();
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
              this.users.push(member);
              console.log(this.users)
            } else if (member.caretSelectChildAll) {
              this.$confirm('是否删除该成员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                Vue.set(member, "caretSelectChildAll", false);
                _this.caretSelectAll = false;
                for (let i = 0; i < _this.users.length; i++) {
                  if (member.uniqueId == _this.users[i].uniqueId) {
                    _this.users.splice(i, 1);
                    console.log(_this.users)
                  }
                }
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              });
            } else {
              Vue.set(member, "caretSelectChildAll", true);
              this.users.push(member);
            }
            this.removal();
          },
          removal(){
            var hash = {};
            this.users = this.users.reduce(function(item, next) {
              hash[next.uniqueId] ? '' : hash[next.uniqueId] = true && item.push(next);
              return item
            }, []);
          },
          deleteConfirm() {
            this.$confirm('是否删除该成员?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
          alreadyExist(){
            let _this = this;
            //全体成员
            for(let i = 0; i < this.userAll.length; i++){
              for(let j = 0; j < this.users.length; j++){
                if(this.userAll[i].uniqueId == this.users[j].uniqueId){
                  Vue.set(_this.userAll[i], "caretSelectChildAll", true);
                }
              }
            }
          },
          addSuccess(){
            let _this = this;
            if(this.$route.params.group){
              let dbGroup = new DB('group');
              dbGroup.update({uuid: _this.$route.params.group.uuid}, { $push: { memberInfo: { $each: [], $slice: 0 } } }, {}, function (err, num) {
                if(err){
                  console.log(err);
                }else{
                  dbGroup.update({uuid: _this.$route.params.group.uuid}, { $push: { memberInfo: { $each: _this.users } } }, {}, function (err1, num1) {
                    if(err1){
                      console.log(err1);
                    }else{
                      dbGroup.queryConfig({uuid: _this.$route.params.group.uuid},function (err2,res2) {
                        if(err2){
                          console.log(err2.messages);
                        }else{
                          _this.group = res2[0];
                          _this.$router.push({name: 'GroupInfo', params: {group:(_this.group)}});
                        }
                      })
                    }
                  })
                }
              })
            } else{
              let db = new DB("Group");
              let query;
              new Promise(function(resolve){
                let groupInfo = {
                  name:  _this.groupInfo.groupName,// 群组名称
                  groupUri: generateUUID.creatUuid(),//群组uri
                  creator : _this.myself.uniqueId,//创建者群主
                  creatorName : _this.myself.nickName,//创建者群主
                  subject : _this.groupInfo.groupTheme,//主题
                  notice : _this.groupInfo.groupBulletin,//通知
                  type : "public",//private 分组，public 群组,sosDefault 救援求助对象
                };
                let groupList = [];
                groupList = _this.users;
                groupList.push(_this.myself);
                query = {
                  name: "group",
                  groupF: "2",//1分组，0多人发送 2群组
                  groupInfo: groupInfo,
                  memberInfo:groupList,//组成员
                  chatName:  _this.groupInfo.groupName,
                  createTime:io.formatDateTime(new Date()),
                  moduleUser : _this.myself.uniqueId,//当前账号的使用uri
                  uuid : generateUUID.creatUuid(), //唯一uuid
                };
                db.insert(query, function(err, res) {
                  if (err) {
                    console.log('failed with:' + err.message)
                  } else {
                    console.log("插入成功");
                    console.warn(res);
                    resolve(true);
                  }
                });
                //发送给成员
                let message = {
                  name : "group",
                  isFail:"N",//是否发送失败
                  groupF: "2",//1分组，0多人发送 2群组
                  groupInfo: groupInfo,
                  memberInfo: groupList,//组成员
                  chatName:  _this.groupInfo.groupName,
                  moduleUser : _this.myself.uniqueId,//当前账号的使用uri
                  uuid : query.uuid, //唯一uuid
                  onlyType:"create" //"create"是创建，"delete"是解散，"quit"是退出
                };
                for(let i = 0; i<_this.users.length;i++){
                    if(_this.users[i].uniqueId != _this.$store.state.account.uniqueId){
                      GeoBOS.adhoc.sendMessage(
                        {
                          uid: "abcdefg",
                          content:JSON.stringify(message),
                          destIp: _this.users[i].sipid,
                          type: "Ip"
                        },
                        function(err) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log("success");
                          }
                        }
                      );
                    }
                }
              }).then(function(){
                _this.$router.replace("/address-list");
              })
            }
          }
        }
    }
</script>
<style scoped>
  .choose-group-ull {
    background: #fff;
    margin-bottom: 3rem;
  }
</style>
