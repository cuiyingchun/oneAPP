<template>
  <div class="commom-box">
    <bos-button type="primary" class="tai" @click="moveMap">移动地图</bos-button>
    <div class="situation-box message-box">
      <p>经度 {{$store.state.currentUser.longitude}}</p>
      <p>纬度 {{$store.state.currentUser.latitude}}</p>
      <div class="choose-person">人员选择： <span>{{choosePerson}}</span></div>
      <div class="filter">
        过滤器：
        <ul>
          <li>
            <bos-checkbox v-model="army" @change="getPlot">对手</bos-checkbox>
            <bos-checkbox v-model="oneself" @change="getPlot">我</bos-checkbox>
          </li>
          <li>
            <bos-checkbox v-model="friend" @change="getPlot">友</bos-checkbox>
            <bos-checkbox v-model="neutral" @change="getPlot">中立</bos-checkbox>
          </li>
        </ul>
      </div>
      <div class="quitTs">
        <bos-button type="primary" @click="flotQuit">撤销</bos-button>
        <bos-button type="primary" @click="applyPlot">申请</bos-button>
        <bos-button type="primary" @click="sendPlots">推送</bos-button>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery';
  import {DB} from '@/assets/js/db';
  import {io,mapFn} from '@/assets/js/utils';
  import {Message,CallHistory,MapMessage,SharePeople,plotImg} from '@/assets/js/obj_prototype';
  import point from "@/assets/js/plotPicture";
  export default{
    name:"situation",
    data(){
      return {
        army: false,
        oneself: false,
        friend: false,
        neutral: false,
        choosePerson: '',
        plots:this.$store.state.areaPlots,
        pointArr:[],
        pointCartesian:[],
        pointIds:[],
      }
    },
    mounted(){
      this.getShareMembers();
    },
    methods:{
//        移动地图
      moveMap(){
        this.mapPoint = new point.MapPoint(this.pointArr,this.pointCartesian,this.pointIds);
      },
//      其他
      getShareMembers(){
        let _this = this;
        if (this.$store.state.recourseMembers.shareMembersNames){
          for(let i = 0; i < _this.$store.state.recourseMembers.shareMembersNames.length; i++){
            _this.choosePerson = _this.$store.state.recourseMembers.shareMembersNames[i]+ ',' +_this.choosePerson;
          }
        }
        this.choosePerson = this.choosePerson.substr(1, 10) + "...";
      },
      getPlot(){
        let _this = this;
        _this.plots.splice(0, _this.plots.length);
        let plots = _this.$store.state.areaPlots;
          for(let i = 0; i < plots.length; i++){
            if (plots[i].name=="img") {
              if(plots[i].attribute == '我' && _this.oneself == true){
                _this.plots.push(plots[i]);
              }else if(plots[i].attribute == '敌' && _this.army == true){
                _this.plots.push(plots[i]);
              }else if(plots[i].attribute == '友' && _this.friend == true){
                _this.plots.push(plots[i]);
              }else if(plots[i].attribute == '中' && _this.neutral == true){
                _this.plots.push(plots[i]);
              }
            }
          }
        console.log(_this.plots)
      },
      //申请
      applyPlot(){
        let _this = this;
        _this.pointCartesian = _this.$store.state.pointCartesian;
        _this.pointArr = _this.$store.state.pointArr;
        let msg = {
          messRemind:'remind',
          isRead : "Y",
          sender: _this.$store.state.account,
          receiver:"default",
          msgType:"T",
          status: 3,
          situation:"sender",
          infoLocation: "Y",  //信息定位
          targetLocation: "Y",  // 目标定位
          pointCartesian:_this.pointCartesian,
          pointArr:_this.pointArr,
          army: _this.army,
          oneself: _this.oneself,
          friend: _this.friend,
          neutral: _this.neutral,
          longitude:this.$store.state.currentUser.longitude,
          latitude:this.$store.state.currentUser.latitude,
          moduleUser:_this.$store.state.account.uniqueId,
          sendDate:io.formatDateTime(new Date())
        };
        let db = new DB('Message');
        mapFn.insertDb(msg,"态势申请发送完成","ts",_this);
        $("#handle").show();
        $("#plotview").hide();
        $(".plot-box").hide();
        $(".plot-box111").hide();
        this.$store.state.tsFlag = false;
        for(let i=0;i<_this.pointIds.length;i++){
          viewer.entities.removeById(_this.pointIds[i]);
        }
        viewer.entities.removeById("polyline");
        point.MapPoint.prototype.destroy();
      },
      //推送
      sendPlots(){
        let _this = this;
        _this.getPlot();
        let db = new DB('Message');
        let msg ={
          sendDate: io.formatDateTime(new Date()),
          name:"plots",
          pointCartesian:_this.pointCartesian,
          pointArr:_this.pointArr,
          sender: _this.$store.state.account,
          receiver: "default",
          plots: _this.plots,
          situation:"sender",
          isRead:"N",
          msgType:"S",
          isShow:true
        };
        db.insert(msg, function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log(res);
          }
          for(let i=0;i<_this.$store.state.recourseMembers.shareMembersIp.length;i++){
            GeoBOS.io.send(
              {
                type: "socket",
                address:_this.$store.state.recourseMembers.shareMembersIp[i],
              },
              JSON.stringify(msg),
              function (err) {
                if (err) {
                  console.log("send failed with:" + err.message);
                }
                console.warn("发送完成");
              });
          }

        });
        $("#handle").show();
        $("#plotview").hide();
        $(".plot-box").hide();
        $(".plot-box111").hide();
        this.$store.state.tsFlag = false;
        for(let i=0;i<_this.pointIds.length;i++){
          viewer.entities.removeById(_this.pointIds[i]);
        }
        viewer.entities.removeById("polyline");
        point.MapPoint.prototype.destroy();
      },
      flotQuit(){
        let db = new DB('plotMessage');
        this.plots=[];
        db.drop(function(err){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('success');
          }
        });
        $("#handle").show();
        $("#plotview").hide();
        $(".plot-box").hide();
        $(".plot-box111").hide();
        this.$store.state.tsFlag = false;
        for(let i=0;i<this.pointIds.length;i++){
          viewer.entities.removeById(this.pointIds[i]);
        }
        viewer.entities.removeById("polyline");
        if(this.$store.state.pointCartesian.length){
          point.MapPoint.prototype.destroy();
        }
      }
    }
  }
</script>
<style>
  .bos-button--primary.tai{
    background-color:#e9efed;
    border-color:#e9efed;
    color:#000;
    margin:14px 0 10px 20px;
  }
  .situation-box{
    height:82% ;
    padding:0 ;
  }
  .tai+.message-box>p:nth-of-type(2){border-bottom:solid 1px #999;}
  .choose-person{text-align:left;padding:8px;}
  .choose-person>span{border-bottom:solid 1px #5e72bb;width:100%;display:inline-block;line-height: 1.4rem;margin-top: 0.3rem;text-overflow: ellipsis;}
  .filter{text-align:left;padding:8px;padding-top: 0}
  .filter>ul>li{padding-top:14px;}
  .filter>ul>li .bos-checkbox{width:40%;}
  .quitTs .bos-button--primary{
    width: 30%;
    height: 2.2rem;
    margin-left: 2.5%;
    float: left;
    text-align: center;
  }
  .quitTs .bos-button--primary>span{
    text-align: center;
    font-size: .8rem;
    position: relative;
    left: -0.11rem;
  }
</style>
