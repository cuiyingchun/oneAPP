<template>
  <div class="detaibox c">
    <div class="top">
      <span @click="goBack"><i class="icon-back"></i>返回</span>
      个人资料
    </div>
    <div class="ifm">
      <img :src="'http://localhost:3000/sdcard/data/config/images/'+self.image">
      <span>{{self.nickName}}</span>
    </div>
    <div class="list">
      <ul class="list-inner">
        <li><i class="log1"></i><span>{{self.position}}</span></li>
        <li><i class="log2"></i><span>{{self.phoneNum}}</span></li>
        <li><i class="log3"></i><span>{{self.address}}</span></li>
        <li><i class="log4"></i><span>{{self.gender}}</span></li>
        <li><i class="log5"></i><span>{{self.description}}</span></li>
      </ul>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue';
  import {DB,GroupDB} from '@/assets/js/db';
    export default{
      data(){
        return {
          self:this.$route.params.self,
          other: this.$route.params.other,
          groupUri: this.$route.params.groupUri,
          isGroupInfo: this.$route.params.isGroupInfo,//判断是否从群组详情页跳入
        }
      },
      mounted(){
        if(this.groupUri){
          this.getChatGroup();
        }
      },
      methods: {
        getChatGroup(){
          let _this = this;
          let dbGroup = new DB("Group");
          dbGroup.queryConfig({"groupInfo.groupUri": _this.groupUri},function (err,res) {
            if(err){
              console.log(err.message);
            }else{
              _this.group = res[0];
            }
          })
        },
        goBack(){
          if(this.groupUri && !this.isGroupInfo){
            this.$router.push({name: 'ChatGroup', params: {group:this.group}});
          }else if(this.groupUri && this.isGroupInfo){
            this.$router.push({name: 'GroupInfo', params: {group:this.group}});
          }else if(this.other && !this.groupUri){
            this.$router.push({name: 'Chat', params: {user:this.other}});
          }else{
            this.$router.push({name: 'ChatHistory', params: {user:this.other}});
          }
        }
      }
    }
</script>

<style>
 /* .infoDetail-ul .messageLog{
    width:1.6em;
    height:1.6em;
    background-size:100%;
    display:inline-block;
    position:absolute;
    top:.5rem;
    left:3%;
  }*/
 .detaibox.c .list{
   bottom: 0;
 }
 .detaibox.c .list-inner li i{
   width:1.2rem;
   height:1.7rem;
   top:.4rem;
   margin-right:.4rem;
 }
  .log1{
    background:url("../../../../static/images/im_medle_icon.png");
    background-size:100%;
  }
  .log2{
    background:url("../../../../static/images/im_cellphon_icon.png");
    background-size:100%;
  }
  .log3{
    background:url("../../../../static/images/im_pub_goup_card.png");
    background-size:100%;
  }
  .log4{
    background:url("../../../../static/images/im_gender_icon.png");
    background-size:100%;
  }
  .log5{
    background:url("../../../../static/images/im_pub_goup_theme.png");
    background-size:100%;
  }
</style>
