import state from '../../store/state';
import {DB} from '../../assets/js/db';
let clickHandler;
let PlotPicture = function(img_url) {
  let ellipsoid = viewer.scene.globe.ellipsoid;  /*地球实体，获取坐标系*/
  //在地球上添加事件监听的类
  clickHandler = new GeoBOS.GeoVis.ScreenSpaceEventHandler(viewer.scene.canvas);
  //注册监听事件
  clickHandler.setInputAction((event) => {
    //获得地球上三维笛卡尔坐标
    let cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
    //标绘的监听事件，输出经纬度
    //console.log(cartesianToCoords(ellipsoid, cartesian));
    state.plotView.longitude = cartesianToCoords(ellipsoid, cartesian).longitude;
    state.plotInfo.longitude = cartesianToCoords(ellipsoid, cartesian).longitude;
    state.plotView.latitude = cartesianToCoords(ellipsoid, cartesian).latitude;
    state.plotInfo.latitude = cartesianToCoords(ellipsoid, cartesian).latitude;
    if(!cartesian)
      return;
    //添加图片实体或图绘
    if(state.plotView.plotId){
      viewer.entities.removeById(state.plotView.plotId);
    }
    let entity = viewer.entities.add({
      name: 'img',
      position: cartesian,
      billboard: {
        image: img_url,//123.png
        width: 25,
        height: 25,
      },
    });
    state.plotPosition = cartesian;
    state.plotView.plotId = entity.id;
    // PlotPicture.prototype.destroy();   //一个图绘只能标注一次
    $(".plot-box").hide();
    $(".plot-box111").show();
    //获取点击的经纬度
    $(".message-box p").eq(0).find("span").html(cartesianToCoords(ellipsoid, cartesian).longitude);
    $(".message-box p").eq(1).find("span").html(cartesianToCoords(ellipsoid, cartesian).latitude);
  }, GeoBOS.GeoVis.ScreenSpaceEventType.LEFT_CLICK)//具体绑定的事件
};
//销毁，点击下一个图绘销毁之前选中的那个图绘
PlotPicture.prototype.destroy = function() {
  if(!clickHandler.isDestroyed()) {
    clickHandler.destroy();
  }
};
/*屏幕坐标转化成二维笛卡尔坐标*/
function getWindowPosition(event) {
  let windowPosition = void 0;
  let pos = event.position || window.event;
  windowPosition = new GeoBOS.GeoVis.Cartesian2(pos.x, pos.y);
  return windowPosition;
}
/*三维笛卡尔坐标转经纬度坐标*/
function cartesianToCoords(ellipsoid, cartesian) {
  let cartographic = ellipsoid.cartesianToCartographic(cartesian);
  let longitudeFloat = parseFloat(GeoBOS.GeoVis.Math.toDegrees(cartographic.longitude).toFixed(8));
  let latitudeFloat = parseFloat(GeoBOS.GeoVis.Math.toDegrees(cartographic.latitude).toFixed(8));
  return {longitude: longitudeFloat, latitude: latitudeFloat};
}
//移动地图
let mapHandler;
let MapPoint = function(pointArr,pointCartesian,pointIds) {
  let _this = this;
  pointArr = [];
  pointCartesian = [];
  let ellipsoid = viewer.scene.globe.ellipsoid;  /*地球实体，获取坐标系*/
  //在地球上添加事件监听的类
  mapHandler = new GeoBOS.GeoVis.ScreenSpaceEventHandler(viewer.scene.canvas);
  mapHandler.setInputAction((event) => {
    let cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
    if(!cartesian)
      return;
    //添加point
    if(pointArr.length<1){
      let point1 = viewer.entities.add({
        position: cartesian,
        point: {
          color: GeoBOS.GeoVis.Color.RED,
          pixelSize: 3,
          outlineWidth: 2,
          outlineColor:GeoBOS.GeoVis.Color.BLACK
        }
      });
      pointArr.push(cartesianToCoords(ellipsoid, cartesian));
      pointIds.push(point1._id);
    }else if(pointArr.length == 1){
      let point2 = viewer.entities.add({
        position: cartesian,
        point: {
          color: GeoBOS.GeoVis.Color.RED,
          pixelSize: 3,
          outlineWidth: 2,
          outlineColor:GeoBOS.GeoVis.Color.BLACK
        }
      });
      pointArr.push(cartesianToCoords(ellipsoid, cartesian));
      pointIds.push(point2._id);
      // console.log('pointArr=====------------');
      // console.log(pointArr);//经度纬度
      state.pointArr = pointArr;
      judgePoint(pointArr);
      let positions1 = GeoBOS.GeoVis.Cartesian3.fromDegreesArray([pointArr[0].longitude,pointArr[0].latitude]);
      let positions2 = GeoBOS.GeoVis.Cartesian3.fromDegreesArray([pointArr[0].longitude,pointArr[1].latitude]);
      let positions3 = GeoBOS.GeoVis.Cartesian3.fromDegreesArray([pointArr[1].longitude,pointArr[1].latitude]);
      let positions4 = GeoBOS.GeoVis.Cartesian3.fromDegreesArray([pointArr[1].longitude,pointArr[0].latitude]);
      let positions5 = GeoBOS.GeoVis.Cartesian3.fromDegreesArray([pointArr[0].longitude,pointArr[0].latitude]);//原点
      for(let i=0;i<positions1.length;i++){
        pointCartesian.push(positions1[i]);
        pointCartesian.push(positions2[i]);
        pointCartesian.push(positions3[i]);
        pointCartesian.push(positions4[i]);
        pointCartesian.push(positions5[i]);
      }
      state.pointCartesian = pointCartesian;
      console.log("pointCartesian--------------------");
      console.log(pointCartesian);//三维笛卡尔

      viewer.entities.add({
        id: 'polyline',
        polyline: {
          positions: pointCartesian[0],
          width: 1,
          material: GeoBOS.GeoVis.Color.GREEN
        }
      });
      viewer.entities.getById('polyline').polyline = {
        positions: pointCartesian,
        width: 1,
        material: GeoBOS.GeoVis.Color.GREEN
      };
    }
  }, GeoBOS.GeoVis.ScreenSpaceEventType.LEFT_CLICK)//具体绑定的事件
};
MapPoint.prototype.destroy = function() {
  console.log("态势");
  console.log(mapHandler.isDestroyed());
  if(!mapHandler.isDestroyed()) {
    mapHandler.destroy();
  }
};
function judgePoint(arr){
  let db = new DB("plotMessage");
  let plots = [];
  let areaPlots = [];
  new Promise(function(resolve){
    db.queryAll(function(err, res){
      if(err){
        console.log('failed with:' + err.message)
      }else{
        for(let i = 0; i < res.length; i++){
          if(res[i].name == "img"){
            plots.push(res[i]);
          }
        }
        resolve(plots);
      }
    });
  }).then(function(value){
    // console.log("PPPP-------------");
    // console.log(value);
    // console.log(value.length);
      for(let i=0;i<value.length;i++){
        // console.log(arr[0].latitude);
        // console.log(arr[1].latitude);
        // console.log(arr[0].longitude);
        // console.log(arr[1].longitude);
        // console.log(value[i].longitude);
        // console.log(value[i].latitude);
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
      console.log("area---------------------");
      console.log(areaPlots);
      state.areaPlots = areaPlots;
  })
}
export default {PlotPicture,MapPoint,judgePoint};
