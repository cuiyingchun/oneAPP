<template lang="html">
  <div class="hand-paint">
  <!--头部-->
    <div class="paint-header">
      <div class="top" style="position: relative">
        <span @click="toChat"><i class="icon-back"></i>返回</span>
        手绘
        <a class="selection">
          <label>
            <a href="javascript:;" class="take-picture">照相
              <input class="photograph" type="file" accept="image/*" capture="camera" />
            </a>
          </label>
          <label>
            <a href="javascript:;" class="take-picture">图库
              <input class="gallery" type="file"/>
            </a>
          </label>
          <label id="xiazai" @click="sendCanvas">发送</label>
        </a>
      </div>
    </div>
<!--画布-->
    <!--用于存放图片 需要与第一个canvas合并-->
    <canvas id="pic-cavs"></canvas><br/>
    <canvas id="draw-cavs" style="position: absolute;top: 3rem;"></canvas><br/>
    <!--<div class="era hidden"></div>-->
<!--底部-->
    <div class="handpaint_menu">
      <div class="footer" id="footer">
        <ul>
          <li>颜色<input id="yanse" :value="color" style="width: 0;height: 0;"/><colorPicker v-model="color"></colorPicker></li>
          <li><input type="range" id="cuxi" value="5"  min="1" max="10"></li>
          <li class="design" v-html="" @click="openFigure = !openFigure;">画笔
            <div class="figurePicker">
              <div class="figure" :class="{open:openFigure}">
              <ul>
                <li id="rect">矩形</li>
                <li id="round">圆形</li>
                <li id="brush">涂鸦</li>
              </ul>
              </div>
            </div>
          </li>
          <!--<li class="eraser">橡皮</li>-->
          <li id="chexiao">撤销</li>
          <li id="qingping">清空</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery';
  //import 'jcanvas';
  import {DB} from '@/assets/js/db';
  import colorPicker from './colorPicker.vue'
  import {generateUUID,io} from '@/assets/js/utils';
  import * as actionTypes from "@/store/actions-types";
  export default {
    name: 'HandPaint',
    data() {
      return {
        user:this.$route.params.user,
        group:this.$route.params.group,
        myself:this.$store.state.account,
        ul:this.$route.params.ul,
        pictures: undefined,
        color:undefined,
        openFigure:false,
        isInsert:false,

        //canvas相关
        canvas:undefined,
        context:undefined,
        imgLayer:[],//储存图像数组，用于撤销
        drawWay:'pen',
        startX:undefined,
        startY:undefined,
        endX:undefined,
        endY:undefined
      }
    },
    components:{
      colorPicker
    },
    mounted(){
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
      this.takePicture();
      //canvas相关
      this.setPixel();
      this.readyToDraw();
      //this.drawRect();
      this.revoke();
      this.changeThickness();
      this.clearCanvas();
    },
    methods: {
      toChat(){
        let _this = this;
        if(this.user){
          this.$router.push({name: 'Chat', params: {user:_this.user}});
        }else if(this.group){
          this.$router.push({name: 'ChatGroup', params: {group:_this.group}});
        }
      },
      takePicture() {
        let _this = this;
        $(".take-picture").on("change","input[type='file']",function(){
          let filePath=$(this).val();
          if(filePath.indexOf("jpg")!=-1 || filePath.indexOf("png")!=-1){
            let arr=filePath.split('\\');
            let fileName=arr[arr.length-1];
            _this.pictures = "http://localhost:3000/sdcard/Camera/"+fileName;
            console.log("打印文件名");
            console.log(fileName);

            let canvas = document.getElementById("pic-cavs");
            let context = canvas.getContext("2d");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight-106;
            context.clearRect(0,0,canvas.width,canvas.height);
            let image = new Image();
            image.src = _this.pictures;
            image.onload = function () {
              let canvasWidth = canvas.width;
              let canvasHeight = canvas.height;
              let viewWidth = image.width;
              let viewHeight = image.height;
              let scaleX = canvasWidth*viewWidth/viewHeight;
              let scaleY = canvasWidth*viewHeight/viewWidth;
              if(viewWidth > viewHeight){
                //横拍图
                context.drawImage(this,0,0,viewWidth,viewHeight,(canvasWidth-canvasWidth/2)/2,(canvasHeight-scaleY/2)/2,canvasWidth/2,scaleY/2);
              }else{
                //竖拍图
                context.drawImage(this,0,0,viewWidth,viewHeight,(canvasWidth-scaleX/2)/2,0,scaleX/2,canvasWidth/2);
              }
            }
            _this.isInsert = true;
          }else{
            console.log("拍照上传有误，请重新拍照");
            return false;
          }
        })
      },
      //canvas相关
      setPixel(){
        this.canvas = document.getElementById("draw-cavs");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight-106;
      },
      readyToDraw(){
        //为canvas添加监听
        let _this = this;
        $(_this.canvas).bind("touchstart touchmove touchend",function(event){
          //判断事件类型
          switch(event.type){
            case "touchstart":
              _this.startX = event.originalEvent.targetTouches[0].clientX;
              _this.startY = event.originalEvent.targetTouches[0].clientY-53;
              /*if(!draw){
                  $(".era").removeClass("hidden").addClass("show");
                  $(".era").css({"left":startX-10+"px","top":startY+41+"px"});
                  context.clearRect(startX-10,startY-7,20,20);
              }*/
              //复制图像，为了撤销
              let imgData=_this.context.getImageData(0,0,_this.canvas.width,_this.canvas.height);
              //加入数组
              _this.imgLayer.push(imgData);
              break;
            case "touchmove":
              _this.endX = event.originalEvent.targetTouches[0].clientX;
              _this.endY = event.originalEvent.targetTouches[0].clientY-53;
              if(_this.drawWay == 'pen'){
                _this.context.beginPath();
                _this.context.moveTo(_this.startX,_this.startY);
                _this.context.lineTo(_this.endX,_this.endY);
                _this.context.lineWidth = $("#cuxi").val();
                _this.context.strokeStyle = $("#yanse").val();
                _this.context.closePath();
                _this.context.stroke();
                _this.startX = _this.endX;
                _this.startY = _this.endY;
              }/*else{
                    $(".era").css({"left":endX-10+"px","top":endY+41+"px"});
                    context.clearRect(endX-10,endY-7,20,20);
                }*/
              break;
            case "touchend":
              //$(".era").removeClass("show").addClass("hidden");
              break;
          }
        })
      },
      drawRect(){
        console.log('画矩形')
        let _this=this;
        //canvas 的矩形框
        let canvasRect = this.canvas.getBoundingClientRect();
        console.log(canvasRect)
        //矩形框的左上角坐标
        let canvasLeft=canvasRect.left;
        let canvasTop=canvasRect.top;

        let layer=0;
        let layerIndex=layer;
        let layerName="layer";
        let x=0;
        let y=0;

        //设置画笔颜色和宽度
        let color="red";
        let penWidth=2;

        $(_this.canvas).bind("touchstart touchmove touchend",function(event){
          //判断事件类型
          switch(event.type){
            case "touchstart":

              layerIndex++;
              layer++;
              layerName+=layerIndex;

              x = event.originalEvent.targetTouches[0].clientX-canvasLeft;
              y = event.originalEvent.targetTouches[0].clientY-canvasTop;

              $(".draw-cavs").addLayer({
                type: 'rectangle',
                strokeStyle: color,
                strokeWidth: penWidth,
                name:layerName,
                fromCenter: false,
                x: x, y: y,
                width: 1,
                height: 1
              });

              $(".draw-cavs").drawLayers();
              $(".draw-cavs").saveCanvas();

              break;
            case "touchmove":

              let width = event.originalEvent.targetTouches[0].clientX-canvasLeft-x;
              let height = event.originalEvent.targetTouches[0].clientY-canvasTop-y;

              $(".draw-cavs").removeLayer(layerName);

              $(".draw-cavs").addLayer({
                type: 'rectangle',
                strokeStyle: color,
                strokeWidth: penWidth,
                name:layerName,
                fromCenter: false,
                x: x, y: y,
                width: width,
                height: height
              });

              $(".draw-cavs").drawLayers();

              break;
            case "touchend":

              $(".draw-cavs").removeLayer(layerName);

              $(".draw-cavs").addLayer({
                type: 'rectangle',
                strokeStyle: color,
                strokeWidth: penWidth,
                name:layerName,
                fromCenter: false,
                x: x, y: y,
                width: width,
                height: height
              });

              $(".draw-cavs").drawLayers();
              $(".draw-cavs").saveCanvas();

              break;
          }
        })
      },
      //撤销
      revoke(){
        let _this = this;
        $('#chexiao').click(function() {
          if(_this.imgLayer.length){
            _this.context.putImageData(_this.imgLayer.pop(),0,0);
          }
        });
      },
      //切换线条粗细
      changeThickness(){
        let _this = this;
        $("#cuxi").change(function(event) {
          _this.context.lineWidth = $(this).val();
        });
      },
      //清屏
      clearCanvas(){
        let _this = this;
        $('#qingping').click(function(event) {
          _this.context.clearRect(0,0,_this.canvas.width,_this.canvas.height);
        });
      },
      sendCanvas(){
        let _this = this;
        let mainCanvas;
        let mergeCanvas
        if(this.isInsert){
          mainCanvas = document.getElementById("pic-cavs");
          mergeCanvas = document.getElementById("draw-cavs");
          mainCanvas.getContext("2d").drawImage(mergeCanvas,0,0);
        }else{
          mainCanvas = document.getElementById("draw-cavs");
          mergeCanvas = document.getElementById("pic-cavs");
          mainCanvas.getContext("2d").drawImage(mergeCanvas,0,0);
        }
        let image = mainCanvas.toDataURL("image/png");
        //let w=window.open('about:blank','image from canvas');
        //w.document.write("<img src='"+image+"' alt='from canvas'/>");
        this.$store.state.canvasPicture = image;
        //let image = mainCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        /*window.location.href=image;
        console.log("保存成功")*/
        console.log(image)

        let db = new DB("Message");
        let msg = {
          name : "message",
          msg : image,
          msgType : "picture",
          isRead : "Y",//是否已读，默认N
          noReadCount:0,
          isConfirm : "N",//是否需要确认,默认N 不需要
          isResponse :"N",//是否受到相应,默认N 不需要
          msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
          isDelete : "N",//是否删除,默认N
          isFail:"N",//是否发送失败
          sender : _this.myself.uniqueId,//发送者
          receiver : _this.user.uniqueId,//接受者
          identity: _this.myself.uniqueId+"_"+_this.user.uniqueId,
          sendImage : _this.myself.image,//发送者头像
          nickName : _this.myself.nickName,//发送者昵称
          chatImage:_this.user.image,
          chatName : _this.user.nickName,
          sendDate : io.formatDateTime(new Date()),
          msgStatus : "init",//init,sender,success,fail
          moduleUser : _this.myself.uniqueId,//当前账号的使用uri
          uuid:generateUUID.creatUuid(),
          isPaint:true
        };
        /*io.sendFile(_this.$store.state.address.addressB,image,"picture",_this.myself.uniqueId,_this.user.uniqueId,_this.myself.image,
          _this.myself.nickName,undefined,_this.user.image,_this.user.nickName,msg.uuid);*/
        db.insert(msg,function(err,result){
          if(err){
            console.log(err.message);
          }else{
            console.warn("发送图片result------------------");
            _this.$router.push({name: 'Chat', params: {user:_this.user}});
          }
        });
      },
    }
  };
</script>
<style>
  /*会话页面的样式编写*/
  .paint-header .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .paint-header .top .selection{
    position: absolute;
    right: 0.8rem;
  }
  .paint-header .top .selection label{
    margin: 0 0.2rem;
  }

  .handpaint_menu > .footer{
    position: fixed;
    bottom:0;
    width:100%;
    line-height:2.5rem;
    background: rgba(0,0,0,.07);
    z-index:1001;
  }
  .handpaint_menu > .footer > ul > li{
    float:left;
    width:17%;
    margin: 1.5%;
    text-align: center;
    box-sizing: border-box;
    background-color: #fafbf6;
    color: #4a8bcb;
    font-size: 1rem;
  }
  .take-picture{
    border-radius: 3px;
    text-decoration: none;
    color: #fff;
  }
  .photograph{
    width: 2.6rem;
    position: absolute;
    overflow: hidden;
    right: 5.2rem;
    top: .6rem;
    opacity: 0;
  }
  .gallery{
    width: 2.6rem;
    position: absolute;
    overflow: hidden;
    right: 2.6rem;
    top: .6rem;
    opacity: 0;
  }

  .hidden {
    display: none;
  }
  .era {
    width: 20px;
    height: 20px;
    background-color: rosybrown;
    position: absolute;
  }
  #cuxi{
    width: 6rem;
    position: relative;
    top: .4rem;
  }

  .figure{
    position: fixed;
    top: 9.6rem;
    left: 15.5rem;
    width: 90px;
    background: #fff;
    border: 1px solid #ddd;
    visibility: hidden;
    border-radius: 2px;
    margin-top: 2px;
    padding: 10px;
    padding-bottom: 5px;
    box-shadow: 0 0 5px rgba(0,0,0,.15);
    opacity: 0;
    transition: all .3s ease;
  }
  .hand-paint .figure.open{visibility: visible;opacity: 1;}
</style>

