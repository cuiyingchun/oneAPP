<template>
  <div>
    <div class="top" style="position: relative">
      <span @click="toAddressList"><i class="icon-back"></i>返回</span>
      分组管理
    </div>
    <div class="cont">
      <div>
        <input type="text" class="addinput" placeholder="添加分组" v-model="groupName"/>
        <i class="icon-add" @click="addGroups"></i>
        <div class="addborder"></div>
      </div>
      <!--分组-->
      <ul class="grouplist">
        <li v-for="(group,index) in groups"><span>{{group}}</span><i class="icon-delete" @click="deleteGroup(group,index)"></i></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {User,Group,GroupMember,Message,CallHistory} from '@/assets/js/obj_prototype';
  import {generateUUID,getGroupName,calls} from '@/assets/js/utils';
  import * as actionTypes from "@/store/actions-types";
  import {DB} from '@/assets/js/db';
  export default{

    data(){
      return{
        groupName:undefined,
        groups:[],
      }
    },
    mounted(){
      this.getGroups();
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    methods:{
      getGroups(){
        let _this = this;
        let uniqueId = this.$store.state.account.uniqueId;
        let dbGroup = new DB('group');
        /*let queryall = {
          groupF : "1",
          source:"config"
        };
        dbGroup.queryConfig(queryall, function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            if(res.length){
              for(let i=0;i<res.length;i++){
                _this.groups.push(res[i].groupName);
              }
            }
          }
        });*/
        let query = {
          groupF : "1",
          moduleUser: uniqueId
        };
        dbGroup.queryConfig(query, function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            if(res.length){
              for(let i=0;i<res.length;i++){
                _this.groups.push(res[i].groupName);
              }
            }
          }
        });
      },
      toAddressList(){
        this.$router.replace("/address-list");
      },
      addGroups(){
        let groupNames = [];
        for(let i=0;i<this.groups.length;i++){
          groupNames.push(this.groups[i].groupName);
        }
        if(this.groupName != "" && groupNames.indexOf(this.groupName) == -1 && this.groups.indexOf(this.groupName) == -1){
          this.groups.push(this.groupName);
          this.$store.state.groupNames = this.groups;
          let group = new Group();
          group.groupF = "1";
          group.groupName = this.groupName;
          group.uuid = group.groupUri = generateUUID.creatUuid();
          group.moduleUser = this.$store.state.account.uniqueId;
          getGroupName.insertGroup(group);
          this.groupName='';
        }else if(this.groupName == ""){
          this.$message({
            message: '组名不能为空',
            type: 'warning'
          });
        }else {
          this.$message({
            message: '该组名已存在，请重新添加！',
            type: 'warning'
          });
        }
      },
      deleteGroup(group,index){
        let _this = this;
        this.$confirm('确定删除该分组?', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getGroupName.deleteGroup(_this.groups[index]);
          _this.groups.splice(index, 1);
        }).catch(() => {
            console.log("deletegroup-error");
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
  .addinput{
    width: 85%;
    margin-top: 0.6rem;
    margin-left: 0.5rem;
    padding: 0.1rem 0.5rem;
  }
  .addborder{
    width: 85%;
    height: 0.11rem;
    margin-left: 0.5rem;
    padding: 0.1rem 0.2rem;
    border-left: 1px solid #a7a7a7;
    border-right: 1px solid #a7a7a7;
    border-bottom: 1px solid #a7a7a7;
  }
  .icon-add{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_group_add.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: relative;
    top: .55rem;
    left:.6rem;
  }
  .grouplist{ padding:0 2%;}
  .grouplist li{
    height: 3.2rem;
    line-height: 3.2rem;
    border-bottom: 1px solid #e9e9e9;
  }
  .grouplist li span{
    padding: 0 0.7rem;
    display: inline-block;
    width: 90%;
    font-size: 1.05rem;
  }
  .icon-delete{
    display: inline-block;
    width: 1.3rem;
    height: 1.3rem;
    background: url("../../../../static/images/im_delete_group.png") no-repeat;
    background-size: 100%;
    margin-right: 0.2rem;
    position: relative;
    top: .5rem;
    left: .6rem;
  }
</style>
