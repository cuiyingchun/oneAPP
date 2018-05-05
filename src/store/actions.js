import * as actionsTypes from './actions-types';
import {DB} from '../assets/js/db.js';
import {generateUUID,calls,io,mapFn,otherFn} from '../assets/js/utils';
import states from './state';
import router from '../router';
export default {
  //固定用法，这里的dispatch是异步操作时用
  [actionsTypes.SET_MAP_CLICK_LISTENER]({commit, state, dispatch},{that}) {
    /*地球实体，获取坐标系*/
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let clickHandler = new GeoBOS.GeoVis.ScreenSpaceEventHandler(viewer.scene.canvas);
    clickHandler.setInputAction((event) => {
      console.log("地球的点击事件");
      let cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
      //自己位置
      if(states.isFix){
        states.nowPoint.longitude = mapFn.cartesianToCoords(ellipsoid, cartesian).longitude;
        states.nowPoint.latitude = mapFn.cartesianToCoords(ellipsoid, cartesian).latitude;
        states.isFix = false;
        viewer.entities.add({
          id:'test',
          position: cartesian,
          point: {
            color: GeoBOS.GeoVis.Color.RED,
            pixelSize: 4,
            outlineColor: GeoBOS.GeoVis.Color.BLACK,
            outlineWidth: 2
          }
        });
      }
      //将屏幕坐标转为二维笛卡尔坐标
      let windowPosition = mapFn.getWindowPosition(event);
      //把二维笛卡尔坐标转换为地球上的坐标
      let pickedObject = viewer.scene.pick(windowPosition);
      if (GeoBOS.GeoVis.defined(pickedObject)) {
        let entity = pickedObject.id;
        console.log("entity");
        console.log(entity);
        switch (entity.name) {
          case 'img':
            let dbPlot = new DB("plotMessage");
            dbPlot.queryConfig({name:'img'},function(err, res){
              if(err){
                console.log('failed with:' + err.message)
              }else{
                if(res){
                  for(let i=0;i<res.length;i++){
                    if((res[i].uuid == entity._id||res[i].uuid ==entity.pos)&&res[i].adhoc == 'true'){
                      let plot = res[i];
                      console.log("点击的是nage标绘");
                      console.log(res[i]);
                      $(".circle").empty();
                      $(".circle").show();
                      $(".circle").append('<div class="ring">'+
                        '<a class="menuItem fa fa-2x tosee">查看</a>'+
                        '<a class="menuItem fa fa-2x tomodify">编辑</a>'+
                        '<a class="menuItem fa fa-2x sendPlot">发送</a>'+
                        '<a class="menuItem fa fa-2x deleteplot">删除</a>'+
                        '</div>'+
                        '<a class="center fa fa-2x"></a>'+
                        '<div class="see" style="display:none">'+
                        '<table>'+
                        '<tbody>'+
                        '<tr><td>名称</td><td>3002</td></tr>'+
                        '<tr><td>经度</td><td>'+res[i].longitude+'</td></tr>'+
                        '<tr><td>纬度</td><td>'+res[i].latitude+'</td></tr>'+
                        '<tr><td>属性</td><td>'+res[i].attribute+'</td></tr>'+
                        '<tr><td>数量</td><td>'+res[i].number+'</td></tr>'+
                        '<tr><td>状态</td><td>'+res[i].condition+'</td></tr>'+
                        '</tbody>'+
                        '</table>'+
                        '<button class="close">关闭</button>'+
                        '</div>');
                      var items = document.querySelectorAll('.menuItem');
                      for(var i = 0, l = items.length; i < l; i++) {
                        items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
                        items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
                      }
                      let windPos = viewer.scene.cartesianToCanvasCoordinates(GeoBOS.GeoVis.Cartesian3.fromDegrees(plot.longitude,plot.latitude));
                      $("#handle .circle").css({left:(windPos.x-50),top:(windPos.y-50)});
                      $(".tosee").click(function(){
                        $(".see").show();
                      });
                      $(".close").click(function(){
                        $(".see").hide();
                      });
                      $(".tomodify").click(function(){
                        $("#handle").hide();
                        $("#plotview").show();
                        $(".plot-box").hide();
                        $(".plot-box111").show();
                        states.showTemp = true;
                        states.tempToggle = false;
                        $(".quitPost").hide();
                        $(".quitUpdate").show();
                        states.plotInfo.plotUrl = plot.plotUrl;
                        states.plotInfo.longitude = plot.longitude;
                        states.plotInfo.latitude = plot.latitude;
                        states.plotInfo.attribute = plot.attribute;
                        states.plotInfo.arms = plot.arms;
                        states.plotInfo.number = plot.number;
                        states.plotInfo.condition = plot.condition;
                        states.plotInfo.descript = plot.descript;
                        states.plotInfo.uuid = plot.uuid;
                        states.plotInfo.audio = '';
                        states.plotInfo.audioReceive = '';
                        states.plotInfo.video ='';
                        states.plotInfo.videoReceive ='';
                        states.plotInfo.pictrue = "";
                        states.plotInfo.pictrueReceive = "";
                        if(plot.pictrue.indexOf("files") != -1){
                          states.plotInfo.pictrueReceive = plot.pictrue;
                        }else{
                          states.plotInfo.pictrue = plot.pictrue;
                        }
                        if(plot.audio.indexOf("files")!=  -1){
                          states.plotInfo.audioReceive = plot.audio;
                        }else {
                          states.plotInfo.audio = plot.audio;
                        }
                        if(plot.video.indexOf("files") != -1){
                          states.plotInfo.videoReceive = plot.video;
                        }else{
                          states.plotInfo.video = plot.video;
                        }
                      });
                      $(".deleteplot").click(function(){
                        new Promise(function(resolve){
                          mapFn.deletePlot(entity);
                          dbPlot.removeByUUID(plot.uuid,{ multi: true },function(err){
                            if(err){
                              console.log(err);
                            }else{
                              console.log("the entity is removed");
                            }
                          });
                          resolve(entity);
                        }).then(function(){
                          mapFn.readCount();
                        });
                        //delete属性用于删除标绘
                        plot.operate = 'D';
                        //添加删除标绘的方法,io.send发送plot
                        for(let i=0;i<states.currentUserAll.length;i++){
                          if(states.currentUserAll[i].uniqueId !=states.account.uniqueId){
                            mapFn.sendPlot(plot,states.currentUserAll[i].sipid,that);
                          }
                        }
                        $(".circle").hide();
                      });
                      $(".sendPlot").click(function(){
                        for(let i=0;states.currentUserAll.length;i++) {
                          mapFn.sendPlot(plot,states.currentUserAll[i].sipid,that);
                        }
                        if(plot.pictrue&&plot.pictrue.indexOf("map_plotting_photo_default")== -1){
                          mapFn.sendPlotsFiles(plot.pictrue,plot.uuid);
                          //for(let i = 0;i<plot.pictrue.length;i++){}
                        }
                        if(plot.audio){
                          mapFn.sendPlotsFiles(plot.audio,plot.uuid);
                        }
                        if(plot.video){
                          mapFn.sendPlotsFiles(plot.video,plot.uuid);
                        }
                        $(".circle").hide();
                      })
                    }
                  }}
              }
            });
            break;
          case 'person':
            $(".circle").empty();
            $(".circle").show();
            $(".circle").append('<div class="ring">'+
              '<a class="menuItem fa fa-2x">视频</a>'+
              '<a class="menuItem fa fa-2x tochat">会话</a>'+
              '<a class="menuItem fa fa-2x tosee">查看</a>'+
              '<a class="menuItem fa fa-2x toPath">轨迹</a>'+
              '<a class="menuItem fa fa-2x toGuide">引导</a>'+
              '<a class="menuItem fa fa-2x toCall">语音</a>'+
              '</div>'+
              '<a class="center fa fa-2x"></a>'+
              '<div class="see" style="display:none">'+
              '<table>'+
              '<tbody>'+
              '<tr><td>名称</td><td>'+entity.senderObj.position+entity.senderObj.nickName+'</td></tr>'+
              '<tr><td>经度</td><td>'+entity.positionP.longitude+'</td></tr>'+
              '<tr><td>纬度</td><td>'+entity.positionP.latitude+'</td></tr>'+
              /*'<tr><td>高程</td><td>111</td></tr>'+*/
              '<tr><td>数量</td><td>'+entity.memberNumber+'</td></tr>'+
              '<tr><td>状态</td><td>'+entity.condition+'</td></tr>'+
              '</tbody>'+
              '</table>'+
              '<button class="close">关闭</button>'+
              '</div>');
            var items = document.querySelectorAll('.menuItem');
            for(var i = 0, l = items.length; i < l; i++) {
              items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
              items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            }
            let windPos = viewer.scene.cartesianToCanvasCoordinates(GeoBOS.GeoVis.Cartesian3.fromDegrees(entity.positionP.longitude,entity.positionP.latitude));
            $("#handle .circle").css({left:(windPos.x-50),top:(windPos.y-50)});
            $(".tosee").click(function(){
              $(".see").show();
            });
            //通话
            $(".toCall").click(function(){
              states.call.dialUser = entity.senderObj;
              if(states.currentUser.communicationMode == "ADHOC"){
                calls.initCall(states.account.sipid);/*本机IP*/
                calls.makeCall(entity.senderObj.sipid);/*接收方IP*/
              }else if(states.currentUser.communicationMode == "SATCOM"){
                calls.sendCallRequest(sim, entity.senderObj.phoneNum);
                calls.storeCallMessage(states.account, states.call.dialUser, 'radio', 'Y');
              }
              states.call.isDial = true;
              states.call.showDial = true;
            });
            $(document).on("click",".tochat",function(){
              router.push({name:"Chat",params:{user:entity.senderObj,where:"handle"}});
            });
            $(document).on("click",".toPath",function(){
              $(".circle").hide();
              $("#pathBtn").show();
              let dbPlot = new DB("plotMessage");
              dbPlot.queryConfig({pathUser:entity._id, isPath:true},function(err,res){
                if(err){
                  console.log(err);
                }else{
                  console.log('查询噜噜噜噜11-------------');
                  console.log(res);
                  if(res.length){
                    let paths = res[0].paths;
                    let pathsCartesian3 = [];
                    for(let i=0;i<paths.length;i++){
                      pathsCartesian3.push(GeoBOS.GeoVis.Cartesian3.fromDegreesArray([paths[i].longitude,paths[i].latitude])[0]);
                    }
                    console.log("pathsCartesian3啦啦啦--------------");
                    console.log(pathsCartesian3);
                    viewer.entities.removeById("polyline");
                    viewer.entities.add({
                      id: 'polyline',
                      polyline: {
                        positions: pathsCartesian3[0],
                        width: 2,
                        material: GeoBOS.GeoVis.Color.GREEN
                      }
                    });
                    viewer.entities.getById('polyline').polyline = {
                      positions: pathsCartesian3,
                      width: 2,
                      material: GeoBOS.GeoVis.Color.GREEN
                    };
                  }
                }
              });
            });
            $(".toGuide").click(function(){
              let lonLat = {
                nickName:entity.senderObj.nickName,
                plotUrl :entity.senderObj.image,
                longitude:entity.positionP.longitude,
                latitude:entity.positionP.latitude,
                ip:entity.senderObj.sipid,
                cartesian: viewer.camera.pickEllipsoid(event.position, ellipsoid)
              };
              router.push({name:'Guide',params:{userObj:lonLat}})
            });
            $(".close").click(function(){
              $(".see").hide();
            });
            break;
          case 'account':
            $(".circle").empty();
            $(".circle").show();
            $(".circle").append('<div class="ring">'+
              '<a class="menuItem fa fa-2x tosee1">查看</a>'+
              '<a class="menuItem fa fa-2x toPath">轨迹</a>'+
              '</div>'+
              '<a class="center fa fa-2x"></a>'+
              '<div class="see" style="display:none">'+
              '<table>'+
              '<tbody>'+
              '<tr><td>名称</td><td>'+entity.senderObj.position+entity.senderObj.nickName+'</td></tr>'+
              '<tr><td>经度</td><td>'+entity.positionP.longitude+'</td></tr>'+
              '<tr><td>纬度</td><td>'+entity.positionP.latitude+'</td></tr>'+
              '</tbody>'+
              '</table>'+
              '<button class="close">关闭</button>'+
              '</div>');
            var items = document.querySelectorAll('.menuItem');
            for(var i = 0, l = items.length; i < l; i++) {
              items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
              items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            }
            let windPoss = viewer.scene.cartesianToCanvasCoordinates(GeoBOS.GeoVis.Cartesian3.fromDegrees(entity.positionP.longitude,entity.positionP.latitude));
            $("#handle .circle").css({left:(windPoss.x-50),top:(windPoss.y-50)});
            $(".toPath").click(function(){
              $(".circle").hide();
              $("#pathBtn").show();
              mapFn.guideShow(entity._id);
            });
            $(".close").click(function(){
              $(".see").hide();
            });
            $(".tosee1").click(function(){
              $(".see").show();
            });
            break;
        }
        $(".circle").addClass("open");
        $(document).bind("click",function(e){
          var target = $(e.target);
          if(target.closest(".circle").length == 0){
            $(".circle").hide();
          }
        });
      }
    },GeoBOS.GeoVis.ScreenSpaceEventType.LEFT_CLICK);

  },
  [actionsTypes.SET_MAP_CLICK_POLYLINE]({commit, state, dispatch},{longitudeG,latitudeG}) {
    let point = 0;
    let cartesians = [];
    let distance = 0;
    /*地球实体，获取坐标系*/
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let clickHandler = new GeoBOS.GeoVis.ScreenSpaceEventHandler(viewer.scene.canvas);
    cartesians.push(GeoBOS.GeoVis.Cartesian3.fromDegrees(longitudeG,latitudeG));
    clickHandler.setInputAction((event) => {
      //将屏幕坐标转为二维笛卡尔坐标
      let windowPosition = mapFn.getWindowPosition(event);
      //把二维笛卡尔坐标转换为地球上的坐标
      let pickedObject = viewer.scene.pick(windowPosition);
      /*点击地球任意位置可以获得对应的坐标*/
      //以下两行代码去掉，则地球上的任意点的坐标不可得，点击后为undefined
      let cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
      if (!cartesian)
        return;
      cartesians.push(cartesian);
      states.mapLonLa.cartesians.push(cartesian);
      states.mapLonLa.cartesianLead.push(mapFn.cartesianToCoords(ellipsoid, cartesian));
      viewer.entities.add({
        position: cartesian,
        point: {
          color: GeoBOS.GeoVis.Color.RED,
          pixelSize: 2,
          outlineColor: GeoBOS.GeoVis.Color.RED,
          outlineWidth: 0
        }
      });
      if (point === 0) {
        point++;
      } else {
        if (!viewer.entities.getById('polyline')){
          viewer.entities.add({
            id: 'polyline',
            polyline: {
              positions: cartesians,
              width: 1,
              material: GeoBOS.GeoVis.Color.GREEN
            }
          });
          viewer.entities.add({
            id: 'endline',
            polyline: {
              positions: cartesians,
              width: 1,
              material: GeoBOS.GeoVis.Color.RED
            }
          });
        } else {
          viewer.entities.getById('polyline').polyline = {
            positions: cartesians,
            width: 1,
            material: GeoBOS.GeoVis.Color.GREEN
          };
          viewer.entities.getById('endline').polyline = {
            positions: [cartesians[cartesians.length - 1],cartesians[0]],
            width: 1,
            material: GeoBOS.GeoVis.Color.RED
          };
        }
        distance += GeoBOS.GeoVis.Cartesian3.distance(cartesians[cartesians.length - 2], cartesian);
        document.getElementById('distance').innerHTML = "距离为：" + (distance / 1000).toFixed(3) + "KM";  //转换为千米
      }

    },GeoBOS.GeoVis.ScreenSpaceEventType.LEFT_CLICK);

  },
  [actionsTypes.SET_IO_RECEIVER_LISTENER]({commit, state, dispatch}) {
    var db = new DB('Message');
    var dbPlot = new DB("plotMessage");
  },
  [actionsTypes.SET_ADHOC_RECEIVER_LISTENER]({commit, state, dispatch}) {
    var db = new DB('Message');
    var dbPlot = new DB("plotMessage");
    var dbInit = new DB("initMessage");
    if (window.atelier){
      GeoBOS.adhoc.onMessageReceived.addListener('bos.iecas.app',listener);
      GeoBOS.adhoc.onFileReceived.addListener('bos.iecas.app',(msg) => {
        let _this = this;
        let res = JSON.parse(msg);
        console.log("自组网接收到的文件");
        console.log(res);
        /*接收标绘*/
        dbInit.queryConfig({name:'img'},function(err,res1){
          if(err){
            console.log("initMessage"+err)
          }else{
            if(res1.length){
              for(let i=0;i<res1.length;i++){
                if(res1[i].uid ==res.uid ){
                  console.log("自组网查询标绘");
                  console.log(res1);
                  if(res1[i].type=="pictrue"){
                    states.plotInfo.pictrueReceive="http://localhost:3000"+res.fileName;
                    updatePlot(res1[i].uuid,{pictrue: states.plotInfo.pictrueReceive});
                  }
                  if(res1[i].type=="audio"){
                    states.plotInfo.audioReceive=res.fileName;
                    updatePlot(res1[i].uuid,{audio: res.fileName});
                  }
                  if(res1[i].type=="video"){
                    states.plotInfo.videoReceive=res.fileName;
                    updatePlot(res1[i].uuid,{video: res.fileName});
                  }
                }
              }
            }
          }
        });
        /*接收消息*/
        dbInit.queryConfig({name:'message'},function(err,res1){
          if(err){
            console.log(err)
          }else{
            if(res1.length){
              for(let i=0;i<res1.length;i++){
                if(res1[i].uid ==res.uid ){
                  console.log("自组网查询消息");
                  console.log(res1[i]);
                  if(!(res1[i].groupUri) && res1[i].msgType){

                    let ul = $('#PUL');
                    let num = io.creatRand();
                    var msg = {
                      name : "message",
                      adhoc : 'true',
                      msg : res.fileName,
                      msgType : res1[i].msgType,
                      isRead : "N",//是否已读，默认N
                      noReadCount:0,
                      isConfirm : "N",//是否需要确认,默认N 不需要
                      isResponse :"N",//是否受到相应,默认N 不需要
                      msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
                      isDelete : "N",//是否删除,默认N
                      sender : res1[i].sender,//发送者
                      receiver : res1[i].receiver,//接受者
                      identity: res1[i].receiver+"_"+res1[i].sender,
                      sendImage : res1[i].sendImage,//发送者头像
                      nickName : res1[i].nickName,
                      chatImage:res1[i].sendImage,
                      chatName : res1[i].nickName,
                      sendDate : io.formatDateTime(res1[i].timestamp),
                      msgStatus : "init",//init,sender,success,fail
                      moduleUser : states.account.uniqueId,//当前账号的使用uri
                      uuid:generateUUID.creatUuid()
                    };
                    if(res1[i].msgType =="picture" ){
                      var options={
                        content: '[图片]',
                        sound:states.messageSetting.sound,
                        vibration:states.messageSetting.vibrate
                      };
                      if(states.nowPage == "Chat"){
                        new Promise(function(resolve){
                          msg.isRead = "Y";
                          resolve(true);
                        }).then(function(){
                          io.receivePhotoTemplate(ul,io.formatDateTime(res1[i].timestamp),res1[i].sendImage,res.fileName,res1[i].sender,'');
                        });
                      }else{
                        $(".contactReadCount").css("display","block");
                      }
                    }
                    if(res1[i].msgType =="audio"){
                      var options={
                        content: '[语音]',
                        sound:states.messageSetting.sound,
                        vibration:states.messageSetting.vibrate
                      };
                      if(states.nowPage == "Chat"){
                        new Promise(function(resolve){
                          msg.isRead = "Y";
                          resolve(true);
                        }).then(function(){
                          io.receiveAudioTemplate(ul,io.formatDateTime(res1[i].timestamp),res1[i].sendImage,res.fileName,res1[i].sender,'');
                        });
                      }else{
                        $(".contactReadCount").css("display","block");
                      }
                    }
                    if(res1[i].msgType == "file"){
                      var options={
                        content: '[文件]',
                        sound:states.messageSetting.sound,
                        vibration:states.messageSetting.vibrate
                      };
                      if(states.nowPage == "Chat"){
                        new Promise(function(resolve){
                          msg.isRead = "Y";
                          resolve(true);
                        }).then(function(){
                          io.receiveFileTemplate(ul,io.formatDateTime(res1[i].timestamp),res1[i].sendImage,num,res.fileName,res1[i].sender,'');
                        });
                      }else{
                        $(".contactReadCount").css("display","block");
                      }
                    }
                    if(res1[i].msgType =="video"){
                      var options={
                        content: '[视频]',
                        sound:states.messageSetting.sound,
                        vibration:states.messageSetting.vibrate
                      };
                      if(states.nowPage == "Chat"){
                        new Promise(function(resolve){
                          msg.isRead = "Y";
                          resolve(true);
                        }).then(function(){
                          io.receiveVedioTemplate(ul,io.formatDateTime(res1[i].timestamp),res1[i].sendImage,num,res.fileName,res1[i].sender,'');
                        });
                      }else{
                        $(".contactReadCount").css("display","block");
                      }
                    }
                    otherFn.notify(res1[i].nickName, options);
                  }
                  if(res1[i].groupUri) {
                    let ul = $('#ullGroup');
                    let num = io.creatRand();
                    var msg = {
                      name : "message",
                      adhoc : 'true',
                      msg : res.fileName,
                      msgType : "",
                      isRead : "N",//是否已读，默认N
                      noReadCount:0,
                      isConfirm : "N",//是否需要确认,默认N 不需要
                      isResponse :"N",//是否受到相应,默认N 不需要
                      msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
                      isDelete : "N",//是否删除,默认N
                      sender : res1[i].sender,//发送者
                      sendImage : res1[i].sendImage,//发送者头像
                      sendDate : io.formatDateTime(res1[i].timestamp),
                      groupUri : res1[i].groupUri,
                      msgStatus : "init",//init,sender,success,fail
                      moduleUser : states.account.uniqueId,//当前账号的使用uri
                      uuid:generateUUID.creatUuid()
                    };
                    if(res1[i].msgType =="picture"){
                      var options={
                        content: '[图片]',
                        sound:states.messageSetting.sound,
                        vibration:states.messageSetting.vibrate
                      };
                      if(states.nowPage == "groupChat"){
                        new Promise(function(resolve){
                          msg.isRead = "Y";
                          resolve(true);
                        }).then(function(){
                          io.receivePhotoTemplate(ul,io.formatDateTime(res1[i].timestamp),res1[i].sendImage,res.fileName,res1[i].sender,res1[i].groupUri);
                        });
                      }else{
                        $(".contactReadCount").css("display","block");
                      }
                    }
                    if(res1[i].msgType =="audio"){
                      var options={
                        content: '[语音]',
                        sound:states.messageSetting.sound,
                        vibration:states.messageSetting.vibrate
                      };
                      if(states.nowPage == "groupChat"){
                        new Promise(function(resolve){
                          msg.isRead = "Y";
                          resolve(true);
                        }).then(function(){
                          io.receiveAudioTemplate(ul,io.formatDateTime(res1[i].timestamp),res1[i].sendImage,res.fileName,res1[i].sender,res1[i].groupUri);
                        });
                      }else{
                        $(".contactReadCount").css("display","block");
                      }
                    }
                    if(res1[i].msgType == "file"){
                      var options={
                        content: '[文件]',
                        sound:states.messageSetting.sound,
                        vibration:states.messageSetting.vibrate
                      };
                      if(states.nowPage == "groupChat"){
                        new Promise(function(resolve){
                          msg.isRead = "Y";
                          resolve(true);
                        }).then(function(){
                          io.receiveFileTemplate(ul,io.formatDateTime(res1[i].timestamp),res1[i].sendImage,num,res.fileName,res1[i].sender,res1[i].groupUri);
                        });
                      }else{
                        $(".contactReadCount").css("display","block");
                      }
                    }
                    if(res1[i].msgType =="video"){
                      var options={
                        content: '[视频]',
                        sound:states.messageSetting.sound,
                        vibration:states.messageSetting.vibrate
                      };
                      if(states.nowPage == "groupChat"){
                        new Promise(function(resolve){
                          msg.isRead = "Y";
                          resolve(true);
                        }).then(function(){
                          io.receiveVedioTemplate(ul,io.formatDateTime(res1[i].timestamp),res1[i].sendImage,num,res.fileName,res1[i].sender,res1[i].groupUri);
                        });
                      }else{
                        $(".contactReadCount").css("display","block");
                      }
                    }
                    otherFn.notify(res1[i].groupUri, options);
                  }
                  $(".bottom_one").css("backgroundPosition","0 -4.46rem");
                  $(".icon-receivevoice").click(function(){
                    let path = $(this).next("span").html();
                    $(this).addClass("active");
                    var options = {
                      src: ["/sdcard/" + path],
                      html5: true
                    };
                    var sound = GeoBOS.media.AudioPlayer.getInstance(options);
                    sound.on('end', function () {
                      $(".chat-list .hesay .icon-receivevoice").removeClass("active");
                    });
                    sound.play();
                  });
                  $(".photos").click(function(){
                    _this.picShow = true;
                    $("#divCenter").find("img").prop("src",$(this).prop("src"));
                  });
                  $("#divCenter").click(function(){
                    _this.picShow = false;
                  });
                  db.insert(msg,function(err,result){
                    if(err){
                      console.log(err.message);
                    }else{
                      console.log("insert");
                      if(states.currentUser.contact){
                        router.replace("/empty");
                      }
                    }
                  });
                }
              }
            }
          }
        })
      });
      GeoBOS.adhoc.onATMessage.addListener('bos.iecas.app',(msg) => {
        //let data = JSON.parse(msg);
        let data = "00000010110011100010b1";   /*b=11*/
        let str = data.split("").reverse().join("");
        let nodeNum = str[1];
        if(nodeNum>=0&&nodeNum<=9){
          states.currentUser.nodeNum = nodeNum;
        }else{
          nodeNum = nodeNum.charCodeAt();
          if(nodeNum>=97&&nodeNum<=106){
            states.currentUser.nodeNum = nodeNum-87
          }
        }
        for(var i=2;i<str.length;i++){
          if(str[i]!="0"&&(i-2)!=nodeNum){
            states.currentUser.arrNetwork.push(i-2);
          }
        }
      });
    }
    function listener(msg){
      let _this = this;
      console.log("自组网接收到的消息");
      let data1 = JSON.parse(msg);
      let data = JSON.parse(data1.content);
      console.log(data);
      data.moduleUser = states.account.uniqueId;
      if(data.status == 3){
        let msg;
        /*态势信息接收*/
        if(data.msgType == "T"){
          msg = {
            messRemind:'remind',
            isRead : "N",
            sender: data.sender,
            receiver:data.receiver,
            status :data.status,
            msgType:data.msgType,
            sendDate:data.sendDate,
            longitude:data.longitude,
            latitude:data.latitude,
            pointCartesian:data.pointCartesian,
            pointArr:data.pointArr,
            situation:"receiver",
            infoLocation: data.infoLocation,  //信息定位
            targetLocation: data.targetLocation,  // 目标定位
            army: data.army,
            oneself: data.oneself,
            friend: data.friend,
            neutral: data.neutral
          };
          if(states.nowPage == "Receive"){
            if(states.activeName == "state"){
              msg.isRead = "Y";
            }
          }else{
            mapFn.readCount();
          }
          //提醒
          let options={
            sound:states.remind.situationRemind.sound,
            vibration:states.remind.situationRemind.vibrate
          };
          otherFn.notify('态势', options);
        }
        if(data.msgType == "J"){
          msg = {
            messRemind:'remind',
            type:data.type,
            isRead : "N",
            sender: data.sender,
            receiver:data.receiver,
            longitude:data.longitude,
            latitude:data.latitude,
            msgType:data.msgType,
            sendDate:data.sendDate,
            status:data.status,
            situation:"receiver",
            uuid:data.uuid
          };
          if(states.nowPage == "Receive"){
            if(states.activeName == "rescue"){
              msg.isRead = "Y";
            }
          }else{
            mapFn.readCount();
          }
          //提醒
          let options={
            sound:states.remind.rescueRemind.sound,
            vibration:states.remind.rescueRemind.vibrate
          };
          otherFn.notify('救援',options);
        }
        if(data.msgType == "W"){
          msg = {
            messRemind:'remind',
            type:data.type,
            isRead : "N",
            pointCartesian:data.pointCartesian,
            pointArr:data.pointArr,
            sender: data.sender,
            receiver:data.receiver,
            msgType:data.msgType,
            sendDate:data.sendDate,
            status:data.status,
            situation:"receiver",
            warnLevel:data.warnLevel,//预警级别
            uuid:data.uuid
          };
          if(states.nowPage == "Receive"){
            if(states.activeName == "alarm"){
              msg.isRead = "Y";
            }
          }else{
            mapFn.readCount();
          }
          //提醒
          if(data.warnLevel == '一级'){
            let options={
              sound:states.remind.alarmRemind.red,
              vibration:states.remind.alarmRemind.vibrate,
              //led:states.remind.alarmRemind.lamp ? GeoBOS.notification.LED_COLOR_GREEN : GeoBOS.notification.LED_COLOR_ORANGE
            };
            otherFn.notify('一级警报',options);
          }else if(data.warnLevel == '二级'){
            let options={
              sound:states.remind.alarmRemind.orange,
              vibration:states.remind.alarmRemind.vibrate,
              //led:states.remind.alarmRemind.lamp ? GeoBOS.notification.LED_COLOR_GREEN : GeoBOS.notification.LED_COLOR_ORANGE
            };
            otherFn.notify('二级警报',options);
          }else if(data.warnLevel == '三级'){
            let options={
              sound:states.remind.alarmRemind.yellow,
              vibration:states.remind.alarmRemind.vibrate,
              //led:states.remind.alarmRemind.lamp ? GeoBOS.notification.LED_COLOR_GREEN : GeoBOS.notification.LED_COLOR_ORANGE
            };
            otherFn.notify('三级警报',options);
          }else if(data.warnLevel == '四级'){
            let options={
              sound:states.remind.alarmRemind.blue,
              vibration:states.remind.alarmRemind.vibrate,
              //led:states.remind.alarmRemind.lamp ? GeoBOS.notification.LED_COLOR_GREEN : GeoBOS.notification.LED_COLOR_ORANGE
            };
            otherFn.notify('四级警报',options);
          }
        }
        if(data.msgType == "Y"){
          msg = {
            messRemind:'remind',
            type:"",
            isRead : "N",
            sender: data.sender,
            receiver:data.receiver,
            longitude:data.longitude,
            latitude:data.latitude,
            cartesians:data.cartesians,
            cartesianLead:data.cartesianLead,
            msgType:data.msgType,
            sendDate:data.sendDate,
            status:data.status,
            situation:"receiver",
            uuid:data.uuid
          };
          if(states.nowPage == "Receive"){
            if(states.activeName == "lead"){
              msg.isRead = "Y";
            }
          }else{
            mapFn.readCount();
          }
          //提醒
          let options={
            sound:states.remind.guideRemind.sound,
            vibration:states.remind.guideRemind.vibrate
          };
          otherFn.notify('引导', options);
        }
        db.insert(msg, function (err,res) {
          if (err) {
            console.log('failed with:' + err.message);
          } else {
            console.log("插入success");
            console.log(res);
          }
        })
      }else if(data.status == 1){
        let query = {
          type: data.type,
        };
        db.remove(query,{ multi: true }, function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            db.queryConfig({msgType: data.msgType,isRead:"N"},function(err,res){
              if(err){
                console.log(err.message);
              }else{
                if(res.length){
                  if(data.msgType == "T"){
                    mapFn.mapReadCount("state",res.length);
                  }else if(data.msgType == "J"){
                    mapFn.mapReadCount("rescue",res.length);
                  }else if(data.msgType == "W"){
                    mapFn.mapReadCount("alarm",res.length);
                  }else if(data.msgType == "Y"){
                    mapFn.mapReadCount("lead",res.length);
                  }
                }else{
                  if(data.msgType == "T"){
                    $(".stateCount").css("display","none");
                  }else if(data.msgType == "J"){
                    $(".rescueCount").css("display","none");
                  }else if(data.msgType == "W"){
                    $(".alarmCount").css("display","none");
                  }else if(data.msgType == "Y"){
                    $(".leadCount").css("display","none");
                  }

                }
              }
            })
          }
        });
      }
      if(data.name == 'img'&&data.adhoc == 'true') {
        //接收时先判断delete是否为Y，是则删除标绘，否则添加标绘
        if(data.operate == 'D'){
          viewer.entities.removeById(data.uuid);
          dbPlot.removeByUUID(data.uuid,{ multi: true }, function(err,res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              console.log(res.num + ' objects has be removed');
              mapFn.readCount();
            }
          })
        }
        if(data.operate == 'U'){
          data.situation = "receiver";
          data.isRead = "N";
          viewer.entities.removeById(data.oldUuid);
          viewer.entities.add({
            id:data.uuid,
            name: 'img',
            position: GeoBOS.GeoVis.Cartesian3.fromDegrees(data.longitude, data.latitude),
            billboard: {
              image: data.plotUrl,//123.png
              width: 25,
              height: 25,
            },
          });
          dbPlot.updateByUUID(data.oldUuid, data,{}, function(err,res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              console.log("更新数据库");
            }
          });
          if(states.nowPage == "Receive"){
            if(states.activeName == "sketch"){
              data.isRead = "Y";
            }
          }else {
            new Promise(function (resolve) {
              let query = {
                msgType: "S",
                isRead: "N",
                situation:"receiver"
              };
              dbPlot.queryConfig(query, function (err, res) {
                if (err) {
                  console.log(err.message);
                } else {
                  console.log('res---1---sketch-------------------------');
                  console.log(res.length);
                  resolve(res.length);
                }
              })
            }).then(function (value) {
              if(value != 0){
                mapFn.mapBackImage("sketch", value);
              }
            });
          }
        }
        if(data.operate == undefined){
          viewer.entities.add({
            id:data.uuid,
            name: data.name,
            position: GeoBOS.GeoVis.Cartesian3.fromDegrees(data.longitude, data.latitude),
            billboard: {
              image: data.plotUrl,
              width: 25,
              height: 25,
            }
          });
          data.situation = "receiver";
          data.isRead = "N";
          dbPlot.insert(data, function(err, res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              console.log('插入别人发送的标绘成功');
            }
          });
          if(states.nowPage == "Receive"){
            if(states.activeName == "sketch"){
              data.isRead = "Y";
            }
          }else{
            mapFn.readCount();
          }
        }
      }
      if(data.name == 'img'&&data.adhoc == 'false'){
        dbInit.insert(data, function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('插入自组网发送的文件消息标绘');
          }
        });
      }
      if(data.name == 'person'){
        viewer.entities.removeById(data.uuid);
        viewer.entities.add({
          name: data.name,
          sender : data.sender,
          senderObj : data.senderObj,
          positionP : data.positionP,
          memberNumber:data.memberNumber,
          condition:data.condition,
          id:data.uuid,
          position: GeoBOS.GeoVis.Cartesian3.fromDegrees(data.positionP.longitude, data.positionP.latitude),
          billboard: {
            image:"http://localhost:3000/sdcard/data/config/images/"+data.senderObj.image,
            width: 30,
            height: 30,
          }
        });
        //  存数据库
        mapFn.personPlot(data.sender,data.positionP);
      }
      if(data.name == 'plots'){
        let plot = data.plots;
        let count = 0;
        for(let i=0;i<plot.length;i++){
          let query = {
            uuid:plot[i].uuid
          };
          dbPlot.queryConfig(query,function(err,res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              console.log("查询数据库，是否有相同的标绘");
              console.log(res);
              if(res.length){
              }else{
                let entity = viewer.entities.add({
                  id:plot[i].uuid,
                  name: plot[i].name,
                  pos:plot[i].uuid,
                  position: GeoBOS.GeoVis.Cartesian3.fromDegrees(plot[i].longitude, plot[i].latitude),
                  billboard: {
                    image: plot[i].plotUrl,
                    width: 25,
                    height: 25,
                  }
                });
                plot[i].situation = "receiver";
                plot[i].isRead = "N";
                dbPlot.insert(plot[i], function(err, res){
                  if(err){
                    console.log('failed with:' + err.message)
                  }else{
                    console.log('插入别人发送的标绘成功');
                    console.log(res);
                    count += 1;
                    console.log("count----------------");
                    console.log(count);
                    if(count != 0){
                      mapFn.mapBackImage("sketch",count);
                    }
                  }
                });
              }
            }
          })
        }
      }
      if(data.name == 'message'&&data.adhoc == 'true'){
        if(!(data.groupUri) &&data.msgType){
          var msg = {
            name : "message",
            adhoc : 'true',
            msg: data.msg,
            msgType: "text",
            sendDate: data.sendDate,
            sender: data.sender,//发送者
            receiver: undefined,//接受者
            identity: undefined,
            sendImage: data.sendImage,//发送者头像
            nickName: data.nickName,//发送者昵称
            chatImage:data.sendImage,
            chatName : data.nickName,
            statusColor : data.statusColor,
            fontStyle : data.fontStyle,
            chatMany:[],
            uuid: data.uuid,
            isRead: "N",
            isReply:data.isReply,//是否需要回应
            isResponse:data.isResponse,//是否得到回应
            noReadCount:0,
            moduleUser: data.receiver,
            snum: data.num,
          };
          if(!data.chatMany){
            msg.receiver = data.receiver;
            msg.identity = data.receiver+"_"+data.sender;
            msg.chatImage = data.sendImage;
            msg.chatName = data.nickName;
          }else{
            msg.receiver = state.account.uniqueId;
            msg.identity = state.account.uniqueId+"_"+data.sender;
            msg.chatImage = data.sender.image;
            msg.chatName = data.sender.nickName;
          }
          if(states.nowPage == "Chat"){
            let ul = $('#PUL');
            let num = io.creatRand();
            state.chatStatus.snum  = data.num;
            new Promise(function(resolve){
              msg.isRead = "Y";
              resolve(true);
            }).then(function(){
              io.receiveTemplate(ul,data.sendDate,data.sendImage,num,data.msg,data.statusColor,data.fontStyle,data.isReply,data.isResponse,data.sender,'',data.uuid);
            });
          }else{
            $(".contactReadCount").css("display","block");
          }
          let options={
            content: data.msg,
            sound:states.messageSetting.sound,
            vibration:states.messageSetting.vibrate
          };
          otherFn.notify(data.nickName, options);
        }
        if(data.groupUri){
          var msg = {
            name : "message",
            adhoc : 'true',
            msg: data.msg,
            msgType: "text",
            isRead : "N",//是否已读，默认N
            noReadCount:0,
            msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
            isDelete : "N",//是否删除,默认N
            sendDate: data.sendDate,
            sender: data.sender,//发送者
            sendImage: data.sendImage,//发送者头像
            identity:data.identity,
            groupUri : data.groupUri,
            groupName:data.groupName,
            uuid: generateUUID.creatUuid(),
            moduleUser: states.account.uniqueId,
            num: data.num,
          };
          if(states.nowPage == "groupChat"){
            let ul = $('#ullGroup');
            let num = io.creatRand();
            state.chatStatus.snum  = data.num;
            new Promise(function(resolve){
              msg.isRead = "Y";
              resolve(true);
            }).then(function(){
              io.receiveTemplate(ul,data.sendDate,data.sendImage,num,data.msg,data.statusColor,data.fontStyle,"","",data.sender,data.groupUri,data.uuid);
            });
          }else{
            $(".contactReadCount").css("display","block");
          }
          let options={
            content: data.msg,
            sound:states.messageSetting.sound,
            vibration:states.messageSetting.vibrate
          };
          otherFn.notify(data.groupUri, options);
        }
        $(".bottom_one").css("backgroundPosition","0 -4.46rem");
        db.insert(msg, function (err) {
          if (err) {
            console.log(err.message);
          } else {
            console.log("insert is sucessfull");
            if(states.currentUser.contact){
              router.replace("/empty");
            }
          }
        });
      }
      if(data.name == 'message'&&data.adhoc == 'false'){
        dbInit.insert(data, function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('插入自组网发送的文件消息标绘');
          }
        });
      }
      if(data.name == 'reply'){
        db.update({uuid:data.replyId},{ $set: { isResponse: 'Y' } }, { multi: false },function (err) {
          if(err){
            console.log("fail of update")
          }else {
            io.replyed('Y',data.snum)
          }
        });
      }
      if(data.name == 'group'){
        let db = new DB("Group");
        if(data.onlyType == "create"){
          let msg = {
            name : "group",
            groupF: "2",
            isFail:"N",//是否发送失败 groupF: "2",//1分组，0多人发送 2群组
            groupInfo: data.groupInfo,
            memberInfo: data.memberInfo,//组成员
            chatName:  data.chatName,
            createTime:data.createTime,
            moduleUser:states.account.uniqueId,
            uuid : data.uuid, //唯一uuid
          };
          db.insert(msg, function (err, result) {
            if (err) {
              console.log(err.message);
            } else {
              console.log("创建成功------------------");
              console.warn(result);
            }
          });
        }else if(data.onlyType == "delete"){
          let query = {
            name:"group",
            chatName: data.chatName,
            groupF: "2",
            moduleUser:states.account.uniqueId
          };
          db.remove(query,{},function(err,res){
            if(err){
              console.log(err);
            }else{
              console.log(res);
              console.log("删除成功--------------------------------");
            }
          });
        }else if(data.onlyType == "quit"){
          console.warn(data.memberInfo);
          let query1 = {
            name:"group",
            chatName: data.chatName,
            groupF: "2",
            moduleUser:states.account.uniqueId
          };
          db.update(query1, {$set:{memberInfo:data.memberInfo}},{ multi: true }, function (err, res) {
            if (err) {
              console.log(err);
            } else {
              console.log("退出成功--------------------------------");
              console.log(res);
            }
          });
        }
      }
    }
    function updatePlot(uuid,query){
      dbPlot.updateByUUID(uuid,{ $set: query }, { multi: true },function(err){
        if(err){
          console.log('failed with:' + err.message)
        }else{
          console.log('updated');
          dbPlot.queryConfig({name:'img'},function(err,res){
            if(err){
              console.log("plotMessage"+err)
            }else {
              console.log("更新之后重新查询");
              console.log(res);
            }
          })
        }
      })
    }
  },
  /*[actionsTypes.SET_IO_QUERY_DB]({commit, state, dispatch}) {
   let msgDB = new DB("Message");
   let query = {
   isRead:'N'
   };
   msgDB.queryConfig(query,function(err, result){
   if(err){
   console.log(err.message);
   }else{
   if(result.length){
   $(".bottom_one").css("backgroundPosition","0 -4.44rem");
   }
   }
   });

   },*/
  [actionsTypes.SET_MAP_TAP_LISTENER]({commit, state, dispatch}) {
    let timeOutEvent=0;
    /*地球实体，获取坐标系*/
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let clickHandler = new GeoBOS.GeoVis.ScreenSpaceEventHandler(viewer.scene.canvas);
    clickHandler.setInputAction((event) => {
      //将屏幕坐标转为二维笛卡尔坐标
      let windowPosition = mapFn.getWindowPosition(event);
      //把二维笛卡尔坐标转换为地球上的坐标
      let pickedObject = viewer.scene.pick(windowPosition);
      if (GeoBOS.GeoVis.defined(pickedObject)) {
        let entity = pickedObject.id;
        if(entity.name == "person" || entity.name == "accout"){
          timeOutEvent = setTimeout(function(){
            longPress(windowPosition.x,windowPosition.y,entity)
          },3000);
        }
      }
    },GeoBOS.GeoVis.ScreenSpaceEventType.LEFT_DOWN);

    clickHandler.setInputAction((event) => {
      let block = document.getElementById("visibDiv");
      block.style.left = event.endPosition.x + "px";
      block.style.top = event.endPosition.y + "px";
    },GeoBOS.GeoVis.ScreenSpaceEventType.MOUSE_MOVE);

    clickHandler.setInputAction((event) => {
      clearTimeout(timeOutEvent);
      let block = document.getElementById("visibDiv");
      if(block.style.display == "block"){
        let x =block.style.left.split('p')[0];
        let y =block.style.top.split('p')[0];
        let clientY = (document.documentElement.clientHeight-200)/2;
        if(x>30&&x<190&&y>clientY&&y<(clientY+200)){
          $("#visibDiv").hide();
          let $chatDiv = $("#chatDiv");
          let src = $("#visibDiv").find("img").prop("src");
          console.log(src);
          $chatDiv.append('<img src="'+src+'" />');
        }else{
          console.log("x的值没在范围内");
          console.log(x);
          $("#visibDiv").hide();
        }
      }
      viewer.scene.screenSpaceCameraController.enableZoom = true;
      viewer.scene.screenSpaceCameraController.enableRotate = true;
      viewer.scene.screenSpaceCameraController.enableTilt = true;
    },GeoBOS.GeoVis.ScreenSpaceEventType.LEFT_UP);

    function longPress(x,y,entity){
      console.log("3s之后");
      $(".circle").hide();
      let $visibDiv = $("#visibDiv");
      $visibDiv.css({left:(x-27),top:(y-38)});
      $visibDiv.show();
      $("#chatDiv").show();
      $visibDiv.empty();
      $visibDiv.append('<img src="http://localhost:3000/sdcard/data/config/images/'+entity.senderObj.image+'" />');
      $visibDiv.find("img").css({width:"30px",height:"30px",display:"block",opacity:"0.5"});
      /*禁止地图移动*/
      viewer.scene.screenSpaceCameraController.enableZoom = false;
      viewer.scene.screenSpaceCameraController.enableRotate = false;
      viewer.scene.screenSpaceCameraController.enableTilt = false;
    }
  },
}
