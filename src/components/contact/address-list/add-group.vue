<template>
    <div class="c">
      <div class="top">
        <span @click="toback"><i class="icon-back"></i>返回</span>
        新建群组
      </div>
      <div class="group-content">
        <div class="list" style=" position: absolute; top:3rem; bottom: 0; height: 15rem">
          <ul class="list-inner">
            <li><i class="icon-5"></i><span>群组名称：</span><input type="text" v-model="groupName"></li>
            <li><i class="icon-6"></i><span>群组主题：</span><input type="text" v-model="groupTheme"></li>
            <li><i class="icon-7"></i><span>我的名片：</span><input type="text" readonly v-model="myGroupCard"></li>
            <li><i class="icon-8"></i><span>群组公告：</span><input type="text" v-model="groupBulletin"></li>
          </ul>
        </div>
        <div class="nextButton" >
          <bos-button type="danger" @click="toback">取消</bos-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <bos-button type="danger" @click = goNext>下一步</bos-button>
        </div>
      </div>
    </div>

</template>
<script>
    export default{
      name:"AddGroup",
        data(){
            return {
              groupName: '',
              groupTheme: '',
              myGroupCard:this.$store.state.account.nickName,
              groupBulletin:'',
              allGroupName: this.$route.params.allGroupName,
              groupInfo:this.$route.params.groupInfo,
            }
        },
        mounted(){
          if(this.$route.params.groupInfo){
            this.groupName = this.$route.params.groupInfo.groupName;
            this.groupTheme = this.$route.params.groupInfo.groupTheme;
            this.groupBulletin = this.$route.params.groupInfo.groupBulletin;
          }
        },
        methods: {
          toback(){
            this.$router.replace("/address-list");
          },
          goNext(){
            let groupInfo ={
              groupName: this.groupName,
              groupTheme: this.groupTheme,
              groupBulletin: this.groupBulletin,
            }
            if(this.allGroupName.indexOf(this.groupName)>=0){
              this.$message.warning('群名已经存在');
            }else if(this.groupName == ""){
              this.$message.warning('群名不能为空');
            }else{
              this.$router.push({name: 'AddGroupNext', params: {groupInfo: groupInfo,allGroupName: this.allGroupName}})
            }
          }
        }
    }
</script>

<style>
.c .list{
  position: absolute;
  top:0;
  bottom: 0;
}
  .nextButton{
    width: 96%;
    position: fixed;
    top:17.8rem;
    height: 2rem;
    line-height: 2rem;
    background-color: #a9acb1;
    padding: 12px;
    text-align: center;
  }
  .nextButton button{
    width: 6rem;
  }
</style>
