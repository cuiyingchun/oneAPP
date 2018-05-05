<template>
<div id="information">
  <div class="top">
    <span><i class="icon-back" @click="goBack()"></i>返回</span>
    基本信息
  </div>
  <div class="content" style="margin-top: 3rem">
    <div class="titleline border-B">
      <div class="left_info">
        <img src="./../../../static/plotimg/map_settings_information_icon_id.png">
        <span style="position: relative;top: 0.1rem;">ID</span>
      </div>
      <div class="right_info">
        <span>{{id}}</span>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="infoline border-B">
      <div class="left_info"><span>名称</span></div>
      <div class="right_info"><span>{{name}}</span></div>
      <div class="clearfix"></div>
    </div>
    <div class="infoline border-B">
      <div class="left_info"><span>级别</span></div>
      <div class="right_info"><span>{{$store.state.account.position}}</span></div>
      <div class="clearfix"></div>
    </div>
    <div class="infoline">
      <div class="left_info"><span>上显图标</span></div>
      <div class="right_info"> <img class="avatar-Info" :src="'http://localhost:3000/sdcard/data/config/images/'+$store.state.account.image"> </div>
      <div class="clearfix"></div>
    </div>
    <div class="titleline border-B">
      <div class="left_info">
        <img src="./../../../static/plotimg/map_settings_information_icon_position.png">
        <span style="position: relative;top: 0.1rem;">位置</span>
      </div>
      <div class="right_info"><span>{{isLocate?'已定位':'未定位'}}</span></div>
      <div class="clearfix"></div>
    </div>
    <div class="infoline border-B">
      <div class="left_info"><span>经度</span></div>
      <div class="right_info">
        <span>{{longitude}}</span>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="infoline border-B">
      <div class="left_info"><span>纬度</span></div>
      <div class="right_info">
        <span>{{latitude}}</span>
      </div>
      <div class="clearfix"></div>
    </div>
    <!--<div class="infoline">
      <div class="left_info"><span>高程</span></div>
      <div class="right_info"><span>{{  }}</span></div>
      <div class="clearfix"></div>
    </div>-->
    <div class="titleline border-B">
      <div class="left_info">
        <img src="./../../../static/plotimg/map_settings_information_icon_status.png">
        <span style="position: relative;top: 0.1rem;">状态</span>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="infoline border-B">
      <div class="left_info"><span>成员数量</span></div>
      <div class="right_info">
        <img src="./../../../static/plotimg/uibase_common_round_pre.png" alt="small" @click="reduceNumber">
        <span class="condition-info">{{memberNumber}}</span>
        <img src="./../../../static/plotimg/uibase_common_round_next.png" alt="big" @click="increaseNumber">
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="infoline">
      <div class="left_info"><span>状态</span></div>
      <div class="right_info">
        <img src="./../../../static/plotimg/uibase_common_round_pre.png" alt="small" @click="changeCondition">
        <span class="condition-info">{{conditionDetail}}</span>
        <img src="./../../../static/plotimg/uibase_common_round_next.png" alt="small" @click="changeCondition">
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="titleline border-B">
      <div class="left_info">
        <img src="./../../../static/plotimg/map_settings_information_icon_range.png"/>
        <span style="position: relative;top: 0.1rem;">目标编号范围</span>
      </div>
      <div class="right_info"><span>3001-4000</span></div>
      <div class="clearfix"></div>
    </div>
  </div>
</div>
</template>
<script>
  import {DB} from '@/assets/js/db';
  export default{
    data(){
      return{
        id: this.$store.state.account.uniqueId,
        name: this.$store.state.account.nickName,
        memberNumber: this.$store.state.condition.memberNumber,
        conditionDetail: this.$store.state.condition.conditionDetail,
        isLocate: undefined,
        longitude: '',
        latitude:'',
      }
    },
    mounted(){
      this.getNowLocation();
    },
    methods:{
      getNowLocation(){
        if(this.$store.state.nowPoint.longitude != 114.50 && this.$store.state.nowPoint.latitude != 38.04){
          this.isLocate = true;
          this.longitude = this.$store.state.nowPoint.longitude;
          this.latitude = this.$store.state.nowPoint.latitude;
        }
      },
      goBack(){
        this.$router.replace("/mePro")
      },
      reduceNumber(){
        if(this.memberNumber!=0){
          this.memberNumber--;
        }
        this.updateDb(this.memberNumber,this.conditionDetail);
        this.$store.state.condition.memberNumber = this.memberNumber;
      },
      increaseNumber() {
        this.memberNumber++;
        this.updateDb(this.memberNumber,this.conditionDetail);
        this.$store.state.condition.memberNumber = this.memberNumber;
      },
      changeCondition() {
        if(this.conditionDetail == "一般") {
          this.conditionDetail = "良好";
        }
        else if(this.conditionDetail == "良好"){
          this.conditionDetail = "一般";
        }
        this.updateDb(this.memberNumber,this.conditionDetail);
        this.$store.state.condition.conditionDetail = this.conditionDetail;
      },
      updateDb(memberNumber,conditionDetail){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{ $set: { "condition.memberNumber":memberNumber,"condition.conditionDetail":conditionDetail } }, { multi: true },function(err){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('success');
          }
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
    background: url("../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: absolute;
    top: 0.8rem;
    left: 0.5rem;
  }
  .content{
    overflow-y: auto;
  }
  .titleline{
    padding: 0 1.2rem 0 6px;
    height: 3rem;
    line-height: 3rem;
    background-color: #e4e4e4;
  }
  .titleline img{
    width:20px;
    height: 20px;
    margin-bottom: -6px;
  }
  .right_info img{
    width:20px;
    height: 20px;
    margin-bottom: -6px;
  }
  .border-B {
    border-bottom:1px solid gainsboro;
  }
  .infoline {
    width:94%;
    margin: 0 auto;
    height: 3rem;
    line-height: 3rem;
  }
  .infoline .avatar-Info{
    width:30px;
    height: 30px;
    border-radius: 50%;
    position: relative;
    top:0.25rem;
  }
   /*img{
     width:25px;
     height: 25px;
     margin-bottom: -6px;
  }*/
  .left_info {
    float: left;
  }
  .right_info {
    float: right;
  }
  #information .right_info span{
    font-size: 0.95rem;
  }
  .condition-info{
    font-size: 0.95rem;
    position: relative;
    top: 0.1rem;
    width: 50px;
    display: inline-block;
    text-align: center;
  }
</style>
