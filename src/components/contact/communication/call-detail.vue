<template>
  <div>
    <div class="tab_content">
      <header class="calldetail-head"><span @click="toContact"><i class="icon-back"></i>返回</span><h1>通话详情</h1></header>
      <div class="information">
        <img :src="'http://localhost:3000/sdcard/data/config/images/'+user.image">
        <span>{{user.position}}{{user.nickName}}</span>
        <p>
          <i class="icon-delete" style="position: relative;top: -0.09rem;" @click="deleteAll"></i>
          <i class="icon-detail" @click="toInfo()"></i>
        </p>
      </div>
      <div class="record-box">
          <div class="record-group">
            <div class="record-list" v-for="(record,index) in recordList">
              <i class="icon-group"></i>
              <p>
                <span>{{record.senderNickName}}</span>---<span>{{record.receiverNickName}}</span>：
                <span style="color: #999">{{record.callDate}}</span>
                <span style="color: #999">{{record.callType == 'radio'?'音频呼叫':'视频呼叫'}}</span>
                <span style="color: #999">{{record.isAccept == 'Y'?'已接':'未接'}}</span>
              </p>
              <p>
                <i class="icon-deletegroup" @click="deleteOne(record.callDate)"></i>
              </p>
            </div>
          </div>
        </div>
    </div>
    <div class="detail_menu">
      <div class="footer" id="footer">
        <ul>
          <li @click="callOne"><i></i>音频电话</li>
          <li><i></i>视频电话</li>
          <li><i></i>消息</li>
          <li><i></i>视频回传</li>
          <li><i></i>视频点播</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {DB} from '@/assets/js/db';
  import * as actionTypes from "@/store/actions-types";
  export default{
    name:"CallDetail",
    data() {
      return {
        recordList:[],
        user:this.$route.params.user
      }
    },
    mounted(){
      this.$store.state.contactName = 'second';
      this.getRecord();
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    methods: {
      getRecord(){
        let _this = this;
        let recordLists = [];
        let db = new DB("Message");
        db.queryConfig({name: 'call', $or: [{ receiver: _this.user.uniqueId }, { sender : _this.user.uniqueId }]},function(err,res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log("查询单人通话记录");
            console.log(res);
            for(let i = 0; i < res.length; i++){
              recordLists.push(res[i]);
            }
          }
        })
        _this.recordList = recordLists;
      },
      toContact(){
        this.$router.replace("/contact");
      },
      deleteOne(date) {
        let records =this.recordList;
        this.$confirm('确定删除该消息?', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(function (index) {
          records.splice(index, 1);
          let msgDB = new DB("Message");
          let query = {
            callDate: date
          };
          msgDB.remove(query,{ multi: true },function(err){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              console.log('objects has be removed');
            }
          })
        })
      },
      deleteAll() {
        let _this = this;
        let records =this.recordList;
        this.$confirm('确定删除全部消息记录?', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          records.splice(0, records.length);
          let msgDB = new DB("Message");
          let query = {
            identity: _this.$store.state.account.uniqueId + _this.user.uniqueId
          };
          msgDB.remove(query,{ multi: true },function(err){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              console.log('objects has be removed');
            }
          })
        })
      },
      toInfo(){
        let _this =this;
        this.$router.push({name: 'DetailInformation', params: {user:_this.user}});
      },
      callOne(){
        this.$store.state.call.dialUser = this.user;
        this.$store.state.call.isDial = true;
        this.$store.state.call.showDial = true;
        if(this.$store.state.currentUser.communicationMode == "ADHOC"){
          calls.initCall(this.$store.state.account.sipid);/*此处为本机ip*/
          calls.makeCall(this.user.sipid);/*此处为接收方ip*/
        }else if(this.$store.state.currentUser.communicationMode == "SATCOM"){
          calls.sendCallRequest(sim, this.user.phoneNum);//sim暂时不清楚传什么参数
          calls.storeCallMessage(this.$store.state.account, this.$store.state.call.dialUser, 'radio', 'Y');
        }
      },
    }
  }
</script>

<style>
  .detail_menu > .footer{
    position: fixed;
    bottom:0;
    width:100%;
    line-height:3rem;
    border-top:solid 1px #eee;
    border-bottom:solid 1px #eee;
    background:#fff;
    z-index:1001;
  }
  .detail_menu > .footer > ul > li{
    width:20%;
    text-align: center;
    border-right:1px solid #eee;
    box-sizing: border-box;
    float:left;
    color: #999;
    font-size: 0.9rem;
  }
  .detail_menu > .footer > ul > li:nth-last-child(1) {border-right:none;}

  .calldetail-head{
    text-align: center;
    position: fixed;
    top: 0;
    z-index: 1002;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    background: url("../../../../static/images/im_header_bg.png") no-repeat;
    background-size: 100% 3rem;
    font-size: 1rem;
    color: #fff;
  }
  .calldetail-head h1{
    font-weight: normal;
    margin: 0;
    font-size: 1.2rem;
    margin-right: 4rem;
  }
  .calldetail-head span{
    float: left;
    font-size: 1rem;
  }
  .calldetail-head .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .information{
    border-top: 5px solid #ededed;
    border-bottom: 8px solid #cfd3d6;
    background-color: #ffffff;
    position: fixed;
    top: 3rem;
    z-index: 1001;
    width: 100%;
  }
  .information img{
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    margin: .3rem 1rem 0 .6rem;
  }
  .information span{
    position:relative;
    bottom: 1.7rem;
  }
  .information p{
    float: right;
    margin-top: 2rem;
    margin-right: 1.4rem;
  }
  .information .icon-delete,.information .icon-detail,.record-list .icon-deletegroup {
    width: 1.2rem;
    height: 1.2rem;
    display: inline-block;
  }
  .information .icon-delete{
    background: url("../../../../static/images/im_delete.png") no-repeat;
    background-size: 100%;
    margin-right: 1rem;
  }
  .information .icon-detail{
    background: url("../../../../static/images/im_detail.png") no-repeat;
    background-size: 100%;
  }
  .record-list .icon-deletegroup{
    background: url("../../../../static/images/im_delete_group.png") no-repeat;
    background-size: 100%;
    margin-right: 1rem;
    position: relative;
    top: 0.3rem;
  }
  .record-list .icon-group{
    float: left;
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background-image: url("../../../../static/images/im_portrait_group.png");
    background-size: 100%;
    background-repeat: no-repeat;
    margin-top: 0.3rem;
    margin-left: 0.6rem;
  }
  .record-group{margin-top: 8.8rem; margin-bottom: 3.1rem;}
  .record-list {overflow:hidden;line-height:2.1rem;border-bottom: 1px solid #eee;margin: 0 0.5rem}
  .record-list p:nth-of-type(1){float:left;}
  .record-list p:nth-of-type(1) span:nth-of-type(1){margin-left:.8rem;}
  .record-list img{width: 5%;float: left;margin-left: 1rem}
  .record-list p:nth-of-type(1) span:nth-of-type(2){margin-left: 0rem;}
  .record-list p:nth-of-type(2){float:right;margin-right:0.5rem;font-size:1rem;}
</style>
