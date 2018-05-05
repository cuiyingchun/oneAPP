<template>
  <div>
    <div class="top" style="position: relative">
      <span @click="toTools"><i class="icon-back"></i>返回</span>
      地图
      <a style="position: absolute;right: 0.8rem;" @click="clearMap">清空</a>
    </div>
    <span class="what-measure"></span>
    <router-view></router-view>
  </div>
</template>

<script>
  import $ from 'jquery';
  import router from '../../router';
  import * as actionTypes from '@/store/actions-types';
  import mapView from './zone.vue'
  export default {
    name: 'Measure',
    data () {
      return {
        whatMeasure:undefined,
        cartesians:[],
        distance:this.$route.params.distance,
        angle:this.$route.params.angle,
        circleArea:this.$route.params.circle,
        polygonArea:this.$route.params.polygon,
      }
    },
    components:{
      mapView
    },
    created(){
      this.$router.replace('/measureMapView');
    },
    mounted() {
    /*  window.viewer = new GeoBOS.GeoVis.Viewer('measure-map', {
        imageryProvider: GeoBOS.GeoVis.createTileMapServiceImageryProvider({
          url: 'http://localhost:3000/sdcard/mapsource/SJZMAPSTREET/'
        }),
      });
      viewer.camera.flyTo({
        destination: GeoBOS.GeoVis.Cartesian3.fromDegrees(114.501571655273,38.044422363536,1500),
        duration: 0.0
      });
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);*/


      if(this.distance){
        console.log(this.distance);
        //测量距离
        this.measureDistance();
      }else if(this.angle){
        console.log(this.angle);
        //测量角度
        this.measureAngle();
      }else if(this.circleArea){
        console.log(this.circleArea);
      }else if(this.polygonArea){
        console.log(this.polygonArea);
        //测量多边形面积
        this.measurePolygonArea();
      }
    },
    methods:{
      toTools(){
        this.$router.replace("/tools")
      },
      clearMap(){
        viewer.entities.removeAll();
        this.cartesians = [];
        if(this.distance){
          $('.what-measure').html('距离：0m');
        }else if(this.angle){
          $('.what-measure').html('角度：0°');
        }else if(this.circleArea){

        }else if(this.polygonArea){
          $('.what-measure').html('面积：0㎡');
        }
      },
      /*屏幕坐标转化成二维笛卡尔坐标*/
      getWindowPosition(event) {
        let windowPosition = void 0;
        let pos = event.position || window.event;
        windowPosition = new GeoBOS.GeoVis.Cartesian2(pos.x, pos.y);
        return windowPosition;
      },
      /*三维笛卡尔坐标转经纬度坐标*/
      cartesianToCoords(ellipsoid, cartesian) {
        let cartographic = ellipsoid.cartesianToCartographic(cartesian);
        let longitudeFloat = parseFloat(GeoBOS.GeoVis.Math.toDegrees(cartographic.longitude).toFixed(8));
        let latitudeFloat = parseFloat(GeoBOS.GeoVis.Math.toDegrees(cartographic.latitude).toFixed(8));
        return {longitude: longitudeFloat, latitude: latitudeFloat};
      },
      //测量距离
      measureDistance(){
        let point = 0;
        //let cartesians = [];
        let distance = 0;
        /*地球实体，获取坐标系*/
        let _this = this;
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let clickHandler = new GeoBOS.GeoVis.ScreenSpaceEventHandler(viewer.scene.canvas);
        clickHandler.setInputAction((event) => {
          //将屏幕坐标转为二维笛卡尔坐标
          let windowPosition = _this.getWindowPosition(event);
          //把二维笛卡尔坐标转换为地球上的坐标
          let pickedObject = viewer.scene.pick(windowPosition);
          /*点击地球任意位置可以获得对应的坐标*/
          //以下两行代码去掉，则地球上的任意点的坐标不可得，点击后为undefined
          let cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
          if (!cartesian)
            return;
          if(_this.cartesians.length == 0){
            distance = 0;
          }
          _this.cartesians.push(cartesian);
          viewer.entities.add({
            position: cartesian,
            point: {
              color: GeoBOS.GeoVis.Color.RED,
              pixelSize: 4,
              outlineColor: GeoBOS.GeoVis.Color.RED,
              outlineWidth: 1
            }
          });
          if (point === 0) {
            point++;
          } else {
            if (!viewer.entities.getById('polyline')){
              viewer.entities.add({
                id: 'polyline',
                polyline: {
                  positions: _this.cartesians,
                  width: 1,
                  material: GeoBOS.GeoVis.Color.BLACK
                }
              });
            } else {
              viewer.entities.getById('polyline').polyline = {
                positions: _this.cartesians,
                width: 1,
                material: GeoBOS.GeoVis.Color.BLACK
              };
            }
          }
          if(_this.cartesians.length > 1) {
            distance += GeoBOS.GeoVis.Cartesian3.distance(_this.cartesians[_this.cartesians.length - 2], cartesian);
            $('.what-measure').html('距离：' + distance.toFixed(3) + 'm');
            console.log(distance);
          }
        },GeoBOS.GeoVis.ScreenSpaceEventType.LEFT_CLICK);
      },
      //测量角度
      measureAngle(){
        let point = 0;
        //let cartesians = [];
        let angle = 0;
        /*地球实体，获取坐标系*/
        let _this = this;
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let clickHandler = new GeoBOS.GeoVis.ScreenSpaceEventHandler(viewer.scene.canvas);
        clickHandler.setInputAction((event) => {
          //将屏幕坐标转为二维笛卡尔坐标
          let windowPosition = _this.getWindowPosition(event);
          //把二维笛卡尔坐标转换为地球上的坐标
          let pickedObject = viewer.scene.pick(windowPosition);
          /*点击地球任意位置可以获得对应的坐标*/
          //以下两行代码去掉，则地球上的任意点的坐标不可得，点击后为undefined
          let cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
          if (!cartesian)
            return;
          if(_this.cartesians.length < 3){
            _this.cartesians.push(cartesian);
            viewer.entities.add({
              position: cartesian,
              point: {
                color: GeoBOS.GeoVis.Color.RED,
                pixelSize: 4,
                outlineColor: GeoBOS.GeoVis.Color.RED,
                outlineWidth: 1
              }
            });
            if (point === 0) {
              point++;
            } else {
              if (!viewer.entities.getById('polyline')){
                viewer.entities.add({
                  id: 'polyline',
                  polyline: {
                    positions: _this.cartesians,
                    width: 1,
                    material: GeoBOS.GeoVis.Color.BLACK
                  }
                });
              } else {
                viewer.entities.getById('polyline').polyline = {
                  positions: _this.cartesians,
                  width: 1,
                  material: GeoBOS.GeoVis.Color.BLACK
                };
              }
            }
          }
          if(_this.cartesians.length == 3){
            angle = GeoBOS.GeoVis.measure.getAngle([_this.cartesianToCoords(ellipsoid,_this.cartesians[0]).longitude, _this.cartesianToCoords(ellipsoid,_this.cartesians[0]).latitude,
              _this.cartesianToCoords(ellipsoid,_this.cartesians[1]).longitude, _this.cartesianToCoords(ellipsoid,_this.cartesians[1]).latitude,
              _this.cartesianToCoords(ellipsoid,_this.cartesians[2]).longitude, _this.cartesianToCoords(ellipsoid,_this.cartesians[2]).latitude]);
            $('.what-measure').html('角度：'+angle+'°');
            console.log(angle);
          }
        },GeoBOS.GeoVis.ScreenSpaceEventType.LEFT_CLICK);
      },
      //测量多边形面积
      measurePolygonArea(){
        let point = 0;
        let tudeArray = [];
        let polygonArea = 0;
        /*地球实体，获取坐标系*/
        let _this = this;
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let clickHandler = new GeoBOS.GeoVis.ScreenSpaceEventHandler(viewer.scene.canvas);
        clickHandler.setInputAction((event) => {
          //将屏幕坐标转为二维笛卡尔坐标
          let windowPosition = _this.getWindowPosition(event);
          //把二维笛卡尔坐标转换为地球上的坐标
          let pickedObject = viewer.scene.pick(windowPosition);
          /*点击地球任意位置可以获得对应的坐标*/
          //以下两行代码去掉，则地球上的任意点的坐标不可得，点击后为undefined
          let cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
          if (!cartesian)
            return;
          if(_this.cartesians.length == 0){
            tudeArray = [];
          }
          _this.cartesians.push(cartesian);
          viewer.entities.add({
            position: cartesian,
            point: {
              color: GeoBOS.GeoVis.Color.RED,
              pixelSize: 4,
              outlineColor: GeoBOS.GeoVis.Color.RED,
              outlineWidth: 1
            }
          });
          if (point === 0) {
            point++;
          } else {
            if(_this.cartesians.length > 2){
              if (!viewer.entities.getById('polygon')){
                viewer.entities.add({
                  id: 'polygon',
                  polygon: {
                    hierarchy: _this.cartesians,
                    width: 1,
                    material: GeoBOS.GeoVis.Color.BLACK,
                    outlineColor: GeoBOS.GeoVis.Color.RED,
                    outlineWidth: 1
                  }
                });
              } else {
                viewer.entities.getById('polygon').polygon = {
                  hierarchy: _this.cartesians,
                  width: 1,
                  material: GeoBOS.GeoVis.Color.BLACK,
                  outlineColor: GeoBOS.GeoVis.Color.RED,
                  outlineWidth: 1
                };
              }
            }
          }
          if(_this.cartesians.length > 2){
            for(let i = 0; i < _this.cartesians.length; i++){
              tudeArray.push(_this.cartesianToCoords(ellipsoid,_this.cartesians[i]).longitude);
              tudeArray.push(_this.cartesianToCoords(ellipsoid,_this.cartesians[i]).latitude);
            }
            polygonArea = GeoBOS.GeoVis.measure.getArea(tudeArray);
            $('.what-measure').html('面积：'+polygonArea+'㎡');
            console.log(polygonArea);
          }
        },GeoBOS.GeoVis.ScreenSpaceEventType.LEFT_CLICK);
      },
    }
  }
</script>

<style>
  #measure-map {
    position: absolute;
    top:3rem;
    width: 100%;
    height: 100%;
    z-index:-1;
  }
  .what-measure{
    position: absolute;
    margin: 1% 0 0 1%;
  }
</style>
