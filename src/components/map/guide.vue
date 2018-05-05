<template>
  <div>
    <div id="mapG">
    </div>
    <div id="distance"></div>
    <div class="guide-content">
      <div class="top" style="position: fixed">
        <span @click="toHandle"><i class="icon-back"></i>返回</span>
        被引导人员：{{nickName}}
        <i @click="sendGuide" style="float:right;padding-right:.8rem;font-style: normal">OK</i>
      </div>
      <div class="guide-near">
        <p @click="controlPerspective('forward')"></p>
        <p @click="controlPerspective('backward')"></p>
      </div>
      <div class="guide-fix"></div>
      <span class="guide-rate">2km-----</span>
      <div class="guide-rate-border"></div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {DB,GroupDB} from '@/assets/js/db';
  import {generateUUID,io,mapFn} from '@/assets/js/utils';
  import * as actionTypes from "@/store/actions-types";
  export default {
    name: 'Guide',
    data() {
      return {
        plotUrl:this.$route.params.userObj.plotUrl,
        nickName:this.$route.params.userObj.nickName,
        ip:this.$route.params.userObj.ip,
        scale: 2000,
        longitude:this.$route.params.userObj.longitude,
        latitude:this.$route.params.userObj.latitude
      }
    },
    mounted() {
      let _this = this;
      window.viewer = new GeoBOS.GeoVis.Viewer('mapG', {
        imageryProvider: GeoBOS.GeoVis.createTileMapServiceImageryProvider({
          url: 'http://localhost:3000/sdcard/mapsource/SJZMAPSTREET/'
        }),
      });
      viewer.camera.flyTo({
        destination: GeoBOS.GeoVis.Cartesian3.fromDegrees(_this.longitude,_this.latitude,1500),
        duration: 0.0
      });
      this.getPlot();
      this.$store.dispatch(actionTypes.SET_MAP_CLICK_POLYLINE,{longitudeG:_this.longitude,latitudeG:_this.latitude});
    },
    methods: {
      toHandle(){
        this.$router.go(-1);
      },
      controlPerspective(type){
        mapFn.controlCamera(type);
      },
      getPlot(){
        let _this = this;
        viewer.entities.add({
          name: "person",
          position: GeoBOS.GeoVis.Cartesian3.fromDegrees(_this.longitude, _this.latitude),
          show: true,
          billboard: {
            image: "http://localhost:3000/sdcard/data/config/images/"+_this.plotUrl,
            width: 30,
            height: 30,
          }
        });
        let dbPlot = new DB("plotMessage");
        dbPlot.queryAll(function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            for(let i = 0; i < res.length; i++){
                  viewer.entities.add({
                    name: res[i].name,
                    id:res[i].uuid,
                    position: GeoBOS.GeoVis.Cartesian3.fromDegrees(res[i].longitude, res[i].latitude),
                    show: true,
                    billboard: {
                      image: res[i].plotUrl,
                      width: 25,
                      height: 25,
                    }
                  });
            }
          }
        });
      },
      sendGuide(){
          let _this = this;
        this.$store.state.mapLonLa.cartesians.splice(0, 0, GeoBOS.GeoVis.Cartesian3.fromDegrees(_this.longitude, _this.latitude));
        let leadLa = {
          longitude:this.longitude,
          latitude:this.latitude
        };
        this.$store.state.mapLonLa.cartesianLead.splice(0, 0, leadLa);
        new Promise(function(resolve){
            let msg = {
              messRemind:'remind',
              msgType:"Y",
              isRead:"Y",
              sender:_this.$store.state.account,
              receiver:_this.ip,
              longitude:_this.longitude,
              latitude:_this.latitude,
              cartesians:_this.$store.state.mapLonLa.cartesians,
              cartesianLead:_this.$store.state.mapLonLa.cartesianLead,
              sendDate: io.formatDateTime(new Date()),
              status:3,
              situation:"sender",
              moduleUser:_this.$store.state.account.uniqueId,
              uuid:generateUUID.creatUuid()

            };
            mapFn.sendPlot(msg,_this.ip,_this);/*this.ip*/
            let db = new DB('Message');
            db.insert(msg,function(err,res){
              if(err){
                console.log('failed with:' + err.message)
              }else{
                console.log(res.num + ' objects has be inserted');
              }
            });
            resolve(db);
          }).then(function(value){
            _this.$router.replace("/handle");
          });
      }
    }
  };
</script>
<style>
  /*会话页面的样式编写*/
  .guide-content .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .guide-content .top span:nth-of-type(1){
    position: absolute;
    left: 0;
  }
  #distance{
    position: absolute;
    top: 3rem;
    font-size: 0.95rem;
    margin: 1%;
  }
  .guide-near{
    position: absolute;
    right:.2rem;
    bottom:.3rem;
    display: inline-block;
    z-index: 1001;
  }
  .guide-near>p:nth-of-type(1){background:url("../../../static/plotimg/map_zoomin_sel.png") no-repeat; background-size:100%;}
  .guide-near>p:nth-of-type(2){background:url("../../../static/plotimg/map_zoomout_sel.png") no-repeat; background-size:100%;}
  .guide-near>p{
    width:40px;
    height:40px;
  }
  .guide-fix{
    width:40px;
    height:40px;
    position:absolute;
    bottom:.3rem;
    left:.2rem;
    background:url("../../../static/plotimg/map_location.png") no-repeat;
    background-size:100%;
    z-index: 1001;
  }
  .guide-free{
    color:#fff;
    font-size:.8rem;
    border-radius:4px;
    position:absolute;
    bottom:.3rem;
    right:3rem;
    padding:.3rem .5rem;
    background:rgba(0,0,0,0.5);
    z-index: 1001;
  }
  .guide-rate{
    font-size: 0.9rem;
    position:absolute;
    bottom:.57rem;
    left: 2.9rem;
    z-index: 1001;
  }
  .guide-rate-border{
    height: 0.1rem;
    width: 3rem;
    border: 1px solid #000;
    border-top: 0;
    position: absolute;
    bottom: .47rem;
    left: 2.8rem;
    z-index: 1001;
  }
</style>


