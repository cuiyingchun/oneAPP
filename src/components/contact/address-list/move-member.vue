<template>
  <div>
    <div class="top" style="position: relative">
      <span @click="toAddressList"><i class="icon-back"></i>返回</span>
      移动到分组
    </div>
    <div class="movelist">
      <ul>
        <li v-for="group in groupListC" @click="moveGroup(group)">{{group.groupName}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {User,Group,GroupMember,Message,CallHistory} from '@/assets/js/obj_prototype';
  import {generateUUID,getGroupName,calls} from '@/assets/js/utils';
  import * as actionTypes from "@/store/actions-types";
  export default{
    name:"MoveMember",
    data(){
      return{
        groupList:[],
        groupListC:[],
        copyObj:this.$route.params.user,
        oldGroup:this.$route.params.group
      }
    },
    mounted(){
      this.getGroups();
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    methods:{
      toAddressList(){
        this.$router.replace("/address-list");
      },
      getGroups(){
        let _this = this;
        let uniqueId = this.$store.state.account.uniqueId;
        _this.groupList = getGroupName.groupName(uniqueId);
        /*let uniqueId = {
          moduleUser:_this.$store.state.account.uniqueId
        };
        getGroupName.groupName(uniqueId, function(value){
          for(let i = 0; value.length; i++){
            _this.groupList.push(value[i]);
          }
        });*/
        let query = {
          userUri:this.copyObj.uniqueId
        };
        getGroupName.queryUser(query, function(value){
          for(var i = 0; i < _this.groupList.length; i++){
            var obj = _this.groupList[i];
            var num = obj.groupUri;
            var isExist = false;
            for(var j = 0; j < value.length; j++){
              var aj = value[j];
              var n = aj.groupUri;
              if(n == num){
                isExist = true;
                break;
              }
            }
            if(!isExist){
              _this.groupListC.push(obj);
            }
          }
        })
        //let groupingMembers = getGroupName.queryUser(query);
        /*setTimeout(function(){
          for(var i = 0; i < _this.groupList.length; i++){
            var obj = _this.groupList[i];
            var num = obj.groupUri;
            var isExist = false;
            for(var j = 0; j < groupingMembers.length; j++){
              var aj = groupingMembers[j];
              var n = aj.groupUri;
              if(n == num){
                isExist = true;
                break;
              }
            }
            if(!isExist){
              _this.groupListC.push(obj);
            }
          }
        },1000);*/
        /*let arr = function(){
         return new Promise(function(resolve){
         let groupingMembers = getGroupName.queryUser(query);
         resolve(groupingMembers);
         })
         };
         let arr1 = arr();
         arr1.then(function(member){
         for(var i = 0; i < _this.groupList.length; i++){
         var obj = _this.groupList[i];
         var num = obj.groupUri;
         var isExist = false;
         for(var j = 0; j < member.length; j++){
         var aj = member[j];
         var n = aj.groupUri;
         if(n == num){
         isExist = true;
         break;
         }
         }
         if(!isExist){
         _this.groupListC.push(obj);
         }
         }
         });*/
      },
      moveGroup(group){
        let _this = this;
        getGroupName.deleteMemberGroup(this.oldGroup.groupUri,this.copyObj.uniqueId);
        let groupmember = new GroupMember();
        groupmember.userUri = this.copyObj.uniqueId;
        groupmember.groupUri = group.groupUri;
          getGroupName.insertUser(groupmember,function(){
            _this.$router.replace("/address-list");
          });
      }
    }
  }
</script>

<style>
  .icon-back{
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
  .movelist ul li{
    height:2.4rem;
    line-height: 2.4rem;
    padding: 0 2%;
    border-bottom: 1px solid #e9e9e9;
  }
</style>
