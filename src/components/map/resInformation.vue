<template>
  <div style="height:100%;">
    <div id="map">
    </div>
    <div class="resReadWarn" v-show="tabwarn">
      <div class="resWarnTime">
        <h4>预警时间</h4>
        <p>{{warnInfo.sendDate}}</p>
      </div>
      <div class="resWarnArea">
        <h4>预警范围</h4>
        <p v-if="warnInfo.pointArr[0]">{{warnInfo.pointArr[0].longitude}},{{warnInfo.pointArr[0].latitude}}</p>
        <p v-if="warnInfo.pointArr[1]">{{warnInfo.pointArr[1].longitude}},{{warnInfo.pointArr[1].latitude}}</p>
      </div>
      <div class="resWarnInfo">
        <div class="resWarnInfoLeft">
          <img v-if="warnInfo.type == '空 袭'" src="../../../static/plotimg/map_dangertype_ks.png"/>
          <img v-if="warnInfo.type == '袭 扰'" src="../../../static/plotimg/map_dangertype_xr.png"/>
          <img v-if="warnInfo.type == '核生化'" src="../../../static/plotimg/map_dangertype_hsh.png"/>
        </div>
        <div class="resWarnInfoRight">
          <p>类型：{{warnInfo.type}}</p>
          <p>级别：{{warnInfo.warnLevel}}</p>
          <p>操作：预警发布</p>
        </div>
      </div>
      <div class="resWarnSender">
        <h4>发送人</h4>
        <p>{{warnInfo.sender.nickName}}</p>
      </div>
      <input type="button" value="退出" class="warnBack" @click="goBack">
    </div>
    <!--共享-->
    <div class="resReadTs" v-show="tabts">
      <div class="tsReplyArea">
        <h4>申请区域</h4>
          <p v-if="warnInfo.pointArr[0].longitude">{{warnInfo.pointArr[0].longitude}},{{warnInfo.pointArr[0].latitude}}</p>
          <p v-if="warnInfo.pointArr[1].longitude">{{warnInfo.pointArr[1].longitude}},{{warnInfo.pointArr[1].latitude}}</p>
      </div>
      <div class="tsReplyer">
        <h4>申请人</h4>
        <p>{{warnInfo.sender.nickName}}</p>
      </div>
      <div class="tsSelctor">
        <h4>过滤器</h4>
        <p>
          <input type="checkbox" value="定位">定位
          <input type="checkbox" value="目标">目标
        </p>
      </div>
      <div v-if="warnInfo.situation=='receiver'" class="tsButton">
            <bos-button type="primary" @click="goBack">退出</bos-button>
            <bos-button type="primary" @click="pushLog">推送</bos-button>
      </div>
      <div v-if="warnInfo.situation=='sender'" class="tsButtonBack">
        <bos-button type="primary" @click="goBack">退出</bos-button>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import $ from 'jquery';
  import {DB} from '../../assets/js/db.js';
  import {io,mapFn} from '../../assets/js/utils';
  import * as actionTypes from "@/store/actions-types";
  import point from "@/assets/js/plotPicture";
    export default{
        data(){
          return {
            tabwarn:this.$store.state.tabwarn,
            tabts:this.$store.state.tabts,
            warnInfo:this.$route.params.warnInfo,
            pointCartesian:[],
            pointArr:[],
            plots:[]
          }
        },
        mounted(){
          window.viewer = new GeoBOS.GeoVis.Viewer('map', {
            imageryProvider: GeoBOS.GeoVis.createTileMapServiceImageryProvider({
              url: 'http://localhost:3000/sdcard/mapsource/SJZMAPSTREET/'
            }),
          });
          viewer.camera.flyTo({
            destination: GeoBOS.GeoVis.Cartesian3.fromDegrees(114.501571655273,38.044422363536,1500),
            duration: 0.0
          });

          this.getPlot();
          this.drawPoint();
        },
        methods: {
          resback(){
            this.$router.replace('/zone')
          },
          goBack(){
            this.$router.replace('/handle')
          },
          getPlot(){
            let _this = this;
            let dbPlot = new DB("plotMessage");
            dbPlot.queryConfig({moduleUser:_this.$store.state.account.uniqueId},function(err, res){
              if(err){
                console.log('failed with:' + err.message)
              }else{
                for(let i = 0; i < res.length; i++){
                  if(res[i].attribute == '我'){
                    if(_this.warnInfo.oneself){
                      _this.plots.push(res[i]);
                    }
                    let entity = viewer.entities.add({
                      name: res[i].name,
                      pos:res[i].uuid,
                      position: GeoBOS.GeoVis.Cartesian3.fromDegrees(res[i].longitude, res[i].latitude),
                      show: _this.warnInfo.oneself,
                      billboard: {
                        image: res[i].plotUrl,
                        width: 30,
                        height: 30,
                      }
                    });
                  }else if(res[i].attribute == '敌'){
                      if(_this.warnInfo.army){
                        _this.plots.push(res[i]);
                      }
                    let entity = viewer.entities.add({
                      name: res[i].name,
                      pos:res[i].uuid,
                      position: GeoBOS.GeoVis.Cartesian3.fromDegrees(res[i].longitude, res[i].latitude),
                      show: _this.warnInfo.army,
                      billboard: {
                        image: res[i].plotUrl,
                        width: 30,
                        height: 30,
                      }
                    });
                  }else if(res[i].attribute == '友'){
                    if(_this.warnInfo.friend){
                      _this.plots.push(res[i]);
                    }
                    let entity = viewer.entities.add({
                      name: res[i].name,
                      pos:res[i].uuid,
                      position: GeoBOS.GeoVis.Cartesian3.fromDegrees(res[i].longitude, res[i].latitude),
                      show: _this.warnInfo.friend,
                      billboard: {
                        image: res[i].plotUrl,
                        width: 30,
                        height: 30,
                      }
                    });
                  }else if(res[i].attribute == '中'){
                    if(_this.warnInfo.neutral){
                      _this.plots.push(res[i]);
                    }
                    let entity = viewer.entities.add({
                      name: res[i].name,
                      pos:res[i].uuid,
                      position: GeoBOS.GeoVis.Cartesian3.fromDegrees(res[i].longitude, res[i].latitude),
                      show: _this.warnInfo.neutral,
                      billboard: {
                        image: res[i].plotUrl,
                        width: 30,
                        height: 30,
                      }
                    });
                  }
                }
              }
            });
          },
          pushLog(){
            let _this = this;
            _this.pointArr = _this.warnInfo.pointArr;
            let arr = _this.pointArr;
            new Promise(function(resolve){
              let db = new DB("plotMessage");
              let plotsAll = [];
              let areaPlots = [];
              new Promise(function(resolve){
                db.queryConfig({moduleUser:_this.$store.state.account.uniqueId},function(err, res){
                  if(err){
                    console.log('failed with:' + err.message)
                  }else{
                    for(let i = 0; i < res.length; i++){
                      if(res[i].name == "img"){
                        plotsAll.push(res[i]);
                      }
                    }
                    resolve(plotsAll);
                  }
                });
              }).then(function(value){
                for(let i=0;i<value.length;i++){
                  if(arr[0].latitude > arr[1].latitude){
                    if(arr[0].longitude > arr[1].longitude){
                      //arr[0][0]大
                      if(value[i].latitude>=arr[1].latitude&&value[i].latitude<=arr[0].latitude){
                        if(value[i].longitude>=arr[1].longitude&&value[i].longitude<=arr[0].longitude){
                          areaPlots.push(value[i]);
                        }
                      }
                    }else{
                      //arr[0][1]大
                      if(value[i].latitude>=arr[1].latitude&&value[i].latitude<=arr[0].latitude){
                        if(value[i].longitude<=arr[1].longitude&&value[i].longitude>=arr[0].longitude){
                          areaPlots.push(value[i]);
                        }
                      }
                    }
                  }else{
                    //arr[1][0]大
                    if(arr[0].longitude > arr[1].longitude){
                      if(value[i].latitude<=arr[1].latitude&&value[i].latitude>=arr[0].latitude){
                        if(value[i].longitude>=arr[1].longitude&&value[i].longitude<=arr[0].longitude){
                          areaPlots.push(value[i]);
                        }
                      }
                    }else{
                      //arr[1][1]大
                      if(value[i].latitude<=arr[1].latitude&&value[i].latitude>=arr[0].latitude){
                        if(value[i].longitude<=arr[1].longitude&&value[i].longitude>=arr[0].longitude){
                          areaPlots.push(value[i]);
                        }
                      }
                    }
                  }
                }
                resolve(areaPlots);
              })
            }).then(function(value){
              let plots = [];
              for(let i = 0; i < value.length; i++){
                if(value[i].attribute == '我' && _this.warnInfo.oneself == true){
                  plots.push(value[i]);
                }else if(value[i].attribute == '敌' && _this.warnInfo.army == true){
                  plots.push(value[i]);
                }else if(value[i].attribute == '友' && _this.warnInfo.friend == true){
                  plots.push(value[i]);
                }else if(value[i].attribute == '中' && _this.warnInfo.neutral == true){
                  plots.push(value[i]);
                }
              }
              let msg ={
                sendDate: io.formatDateTime(new Date()),
                sender: _this.$store.state.account,
                receiver: "default",
                plots: plots,
                situation:"sender",
                name: 'plots',
                isRead:"N",
                msgType:"S",
                moduleUser:_this.$store.state.account.uniqueId,
                isShow:true
              };
              for(let i=0;i<_this.$store.state.recourseMembers.shareMembersIp.length;i++){
                mapFn.sendPlot(msg,_this.$store.state.recourseMembers.shareMembersIp[i],_this);
              }
              _this.$router.replace('/handle');
            })
          },
          drawPoint(){
            this.pointCartesian = this.warnInfo.pointCartesian;
            viewer.entities.add({
              id: 'polyline',
              polyline: {
                positions: this.pointCartesian[0],
                width: 1,
                material: GeoBOS.GeoVis.Color.RED
              }
            });
            viewer.entities.getById('polyline').polyline = {
              positions: this.pointCartesian,
              width: 1,
              material: GeoBOS.GeoVis.Color.RED
            };
          }
        },
        beforeDestroy(){
          viewer.entities.removeById("polyline");
        }
    }
</script>

<style scoped>
  #map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  body {
    height: 100%;
    width: 100%;
    position: inherit !important;
    margin: 0;
    clear:both;
    position: relative;
  }
  .resReadWarn{
    width:35%;
    height:20.5rem;
    background:#6b7353;
    overflow-y: auto;
    border: 2px solid black;
    padding: 4px 6px;
    position: absolute;
    top: 0;
    z-index: 100000;
  }
  .resReadWarn div{
    color: #ffffff;
    margin: 5px 0;
  }
  .resReadWarn>div>h4{
    margin: 3px 0;
    line-height: 1.8rem;
    height: 1.8rem;
  }
  .resReadWarn>div>p{
    margin: 2px 5px;
    height:1.1rem;
    line-height: 1.1rem;
    display: inline-block;
    background-color: #5f6a4a;
  }
  .resWarnInfo{
    height: 4rem;
  }
  .resWarnInfoLeft{
    float: left;
    width: 40%;
    margin: 5px;
  }
  .resWarnInfoLeft img{
    width: 80%;
    height: 80%;
    margin-left: 2px;
  }
  .resWarnInfoRight{
    float: left;
    width: 60%;
  }
  .warnBack{
    width: 8rem;
    margin: 2px 2.5rem;
    height: 2.3rem;
    line-height: 2.3rem;
    background-color: #a9acb1;
    border-radius: 5%;
  }
  .resReadTs{
    width:35%;
    height:20.5rem;
    background:#6b7353;
    overflow-y: auto;
    border: 2px solid black;
    padding: 4px 6px;
    position: absolute;
    top: 0;
    z-index: 100000;
  }
  .resReadTs div{
    color: #fff;
    margin: 15px 0;
  }
  .resReadTs>div>h4{
    margin: 3px 0;
    line-height: 1.8rem;
    height: 1.8rem;
  }
  .resReadTs>div>p{
    margin: 2px 5px;
    height:1.1rem;
    line-height: 1.1rem;
    display: inline-block;
    background-color: #5f6a4a;
  }
  .tsButton{
    text-align: center;
    position: absolute;
    bottom: 0;
    height: 2.5rem;
    line-height: 2.5rem;
    width:110%;
  }
  .tsButtonBack{
    text-align: center;
    position: absolute;
    bottom: 0;
    height: 2.5rem;
    line-height: 2.5rem;
    width:100%;
  }
  .tsButton button{
    text-align: center;
    width: 40%;
    float: left;
  }
  .tsButtonBack button{
    text-align: center;
    width: 60%;
    margin: 0 auto;
  }
</style>
