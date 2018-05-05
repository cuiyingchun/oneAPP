<template>
  <div>
    <div class="top" style="position: relative">
      <span @click="toAddressList"><i class="icon-back"></i>返回</span>
      复制到分组
    </div>
    <div class="copylist">
      <ul>
        <li v-for="group in groupListC" @click="copyGroup(group)">{{group.groupName}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {User,Group,GroupMember,Message,CallHistory} from '@/assets/js/obj_prototype';
  import {generateUUID,getGroupName,calls} from '@/assets/js/utils';
  export default{
    name:'CopyMember',
    data(){
      return{
        groupList:[],
        groupListC:[],
        copyObj:this.$route.params.uid
      }
    },
    mounted(){
      this.getGroups();
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
      },
      copyGroup(group){

        let _this = this;
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
  .copylist ul li{
    height:2.4rem;
    line-height: 2.4rem;
    padding: 0 2%;
    border-bottom: 1px solid #e9e9e9;
  }
</style>
