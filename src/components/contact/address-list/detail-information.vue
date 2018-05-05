<template>
  <div class="detaibox">
    <div class="top">
      <span @click="back1"><i class="icon-back"></i>返回</span>
      详细资料
      <i class="bos-icon-search" @click="toSearch"></i>
    </div>
    <div class="detail-mid">
      <i><img :src="'http://localhost:3000/sdcard/data/config/images/' + user.image" /></i>
      <span><input type="text" readonly :value="user.nickName"></span>
    </div>
    <div class="" style="position: absolute;top: 8.45rem;bottom: 2.75rem;width: 100%">
      <ul class="detail-ul">
        <li>
          <i></i><span>{{user.position}}</span>
        </li>
        <li>
          <i></i><span>{{user.phoneNum}}</span>
        </li>
        <li>
          <i></i><span>{{user.gender}}</span>
        </li>
        <li>
          <i></i><span>级别：{{user.level}}</span>
        </li>
        <li>
          <i></i><span>{{user.description}}</span>
        </li>
      </ul>
    </div>
    <div>
      <ul class="detail-footer">
        <li @click="callOne">音频电话</li>
        <li>视频电话</li>
        <li @click="intoChat">消息</li>
        <li>视频回传</li>
        <li>视频点播</li>
      </ul>
    </div>
  </div>

</template>
<script>
  import {calls} from '@/assets/js/utils';
  export default({
    name: 'DetailInformation',
    data(){
      return {
        user:this.$route.params.user
      }
    },
    methods:{
      back1(){
        this.$router.replace("/address-list");
      },
      intoChat(){
        let _this = this;
        this.$router.push({name:"Chat",params:{user:_this.user}})
      },
      toSearch(){
        this.$router.replace("/search");
      },
      callOne(){
        this.$store.state.call.dialUser = this.user;
        if(this.$store.state.currentUser.communicationMode == "ADHOC"){
          calls.initCall(this.$store.state.account.sipid);/*此处为本机ip*/
          calls.makeCall(this.user.sipid);/*此处为接收方ip*/
        }else if(this.$store.state.currentUser.communicationMode == "SATCOM"){
          calls.sendCallRequest(sim, this.user.phoneNum);//sim暂时不清楚传什么参数
          calls.storeCallMessage(this.$store.state.account, this.$store.state.call.dialUser, 'radio', 'Y');
        }
        this.$store.state.call.isDial = true;
        this.$store.state.call.showDial = true;
      },
    }
  })
</script>
<style>
  .detaibox .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .detaibox .top span{
    position: absolute;
    left: 0;
  }
  .detaibox .top .bos-icon-search:active{
    content: "\E61D";
    color: #696e52;
  }
  .detaibox>.detail-mid {
    background: #fff;
    width:100%;
    position: fixed;
    top:3rem;
    height:4.7rem;
    border-top:solid 4px #eee;
    border-bottom:solid 8px #eee;
    z-index: 1001;
  }
  .detaibox>.detail-mid>i>img{
    width:4rem;
    height:4rem;
    display:inline-block;
    position:absolute;
    top:.4rem;
    left:3%;
    border-radius:50%;
  }
  .detail-mid>span{margin-left: 6rem;line-height:4.7rem;display:inline-block;}
  .detail-ul{margin-bottom: 3.2rem}
  .detail-ul li{
    height:1.8rem;
    line-height:1.8rem;
    margin:5px 0;
    background:#fff;
    padding:1% 3%;
    border-bottom:solid 4px #eee;
    position:relative;
    padding-left:3.4rem;
    font-size:1rem;
  }
  .detail-ul li:nth-of-type(1) i,.detail-ul li:nth-of-type(2) i,.detail-ul li:nth-of-type(3) i,.detail-ul li:nth-of-type(4) i,.detail-ul li:nth-of-type(5) i{
    width:1.6em;
    height:1.6em;
    display:inline-block;
    position:absolute;
    left:3%;
  }
  .detail-ul li:nth-of-type(1) i { background:url("../../../../static/images/im_medle_icon.png");background-size:100%; }
  .detail-ul li:nth-of-type(2) i { background:url("../../../../static/images/im_cellphon_icon.png");background-size:100%; }
  .detail-ul li:nth-of-type(3) i { background:url("../../../../static/images/im_gender_icon.png");background-size:100%; }
  .detail-ul li:nth-of-type(4) i { background:url("../../../../static/images/im_pub_goup_card.png");background-size:100%; }
  .detail-ul li:nth-of-type(5) i { background:url("../../../../static/images/im_comm_ap_about.png");background-size:100%; }
  .detail-footer {
    width:100%;
    height:3.2rem;
    line-height:3.2rem;
    color:#333;
    font-size:0.9rem;
    background:#fff;
    border-top:solid 1px #eee;
    position:fixed;
    bottom:0;
    left:0;
  }
  .detail-footer li{
    width:20%;
    text-align:center;
    border-right:solid 1px #eee;
    float:left;
    box-sizing: border-box;
  }
  .detail-footer li:nth-last-child(1) { border-right:none; }
</style>
