<template>
  <div>
    <div id="map">
    </div>
    <bos-button type="text" @click="messageBox"></bos-button>
  </div>
</template>
<script>
  import {DB} from '@/assets/js/db';
  import {mapFn} from '@/assets/js/utils';
  import * as actionTypes from '@/store/actions-types';
  import resInfo from '@/components/map/resInformation';
  export default {
    name: 'MapView',
    data () {
      return {
        scrolled: ''
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
      viewer.scene.fxaa = false;
      /*自组网初始化*/
      if(this.$store.state.currentUser.communicationMode = "ADHOC"){
        mapFn.adhocInit(this.$store.state.account.sipid);
      }
      this.$store.dispatch(actionTypes.SET_ADHOC_RECEIVER_LISTENER);
      this.sendCurrentPos();
    },
    activated() {
      let _this = this;
      /*手指缩放地图*/
      this.handler();
      /*注册全球点击监听事件*/
      this.$store.dispatch(actionTypes.SET_MAP_CLICK_LISTENER,{that:_this});
      this.$store.dispatch(actionTypes.SET_MAP_TAP_LISTENER);
      /*监听地图移动*/
      document.body.addEventListener('touchmove', this.handleScroll, false);
      /*setInterval(function(){
        _this.sendCurrentPos();
      },60000);*/
    },
    methods:{
      sendCurrentPos(){
        mapFn.sendCurrentPosition();
      },
      handler (){
        let _this = this;
        $('#map').bind("touchmove touchend",function(event) {
          switch(event.type) {
            case "touchmove":
              viewer.scene.postRender.addEventListener(function () {
                let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).height;
                _this.$store.state.mapRate = cameraHeight.toFixed(0);
                //_this.changeRateBorder()
              });
              break;
            case "touchend":
              viewer.scene.postRender.removeEventListener(function (){
              });
              break;
          }
        })
      },
      /*changeRateBorder(){
        let len = this.$store.state.mapRate.toString().length;
        switch(len)
        {
          case 1:
            this.$store.state.rateBorder = '1.4rem';
            break;
          case 2:
            this.$store.state.rateBorder = '1.9rem';
            break;
          case 3:
            this.$store.state.rateBorder = '2.4rem';
            break;
          case 4:
            this.$store.state.rateBorder = '2.8rem';
            break;
          case 5:
            this.$store.state.rateBorder = '3.3rem';
            break;
          case 6:
            this.$store.state.rateBorder = '3.7rem';
            break;
        }
      },*/
      handleScroll () {
        this.scrolled = window.scroll > 0;
        $(".circle").empty();
      },
    }
  }
</script>
<style>
  #map {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index:-1;
  }
</style>
