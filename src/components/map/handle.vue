<template>
  <div>
    <div id="handle">
      <div class="out">
        <div class="state" v-show="isShow">
          <ul>
            <li @click="jump('state')"><i></i><span class="stateCount"></span>态势</li>
            <li @click="jump('rescue')"><i></i><span class="rescueCount"></span>救援</li>
            <li @click="jump('alarm')"><i></i><span class="alarmCount"></span>警报</li>
            <li @click="jump('lead')"><i></i><span class="leadCount"></span>引导</li>
            <li @click="jump('sketch')"><i></i><span class="sketchCount"></span>标绘</li>
          </ul>
          <div class="small-compass" style="width: 30%;position: relative;left: -0.8rem;top: 0.1rem;" @click="toCompass">
            <div>
              <div class="pointer"></div>
            </div>
            <div>
              <canvas id="small-canvas" width="30" height="30">      您的浏览器当前版本不支持canvas表签  </canvas>
            </div>
            <div id="small-compass-footer"></div>
          </div>
        </div>
        <span class="contactReadCount" @click="checkCount">未读信息</span>
        <span class="test" @click="Test">测试</span>
        <div class="time" v-show="isShow">
          <p id="demo2" name="input_date" data-lcalendar="2010-01-11,2019-12-31">T+00:00:00</p>
          <P id="count" v-show="false"></P>
        </div>
        <div class="rescue" v-show="isShow">
          <div :class="{'layer':!isLayerShow}" @click="isLayer">
            <i></i><span v-if="!isLayerShow">图层</span>
            <span v-if="isLayerShow" class="xx"><i class="icon-quit"></i></span>
          </div>
          <div :class="{'help':!isRescueShow}" @click="isRescue">
            <i></i><span v-if="!isRescueShow">救援</span>
            <span v-if="isRescueShow" class="xx"><i class="icon-quit"></i></span>
          </div>
          <div class="warn" @click="isWarn">
            <i></i><span>警报</span>
          </div>
        </div>
        <div>
          <div class="layerPanel" v-show="isLayerShow">
            <ul>
              <li><p>高分 <bos-switch class="layerSwitch" v-model="highMark"></bos-switch></p></li>
              <li>
                <p><span>敌<bos-switch class="sp layerSwitch" v-model="army" @change="toggleSwitch"></bos-switch></span>
                  <span>我<bos-switch class="layerSwitch" v-model="oneself" @change="toggleSwitch"></bos-switch></span>
                </p>
                <p><span>友<bos-switch class="sp layerSwitch" v-model="friend" @change="toggleSwitch"></bos-switch></span>
                  <span>中<bos-switch class="layerSwitch" v-model="neutral" @change="toggleSwitch"></bos-switch></span>
                </p>
              </li>
              <li>
                <p>
                  <span>陆<bos-switch class="sp layerSwitch" v-model="land" @change="toggleSwitch"></bos-switch></span>
                  <span>海<bos-switch class="layerSwitch" v-model="sea" @change="toggleSwitch"></bos-switch></span>
                </p>
                <p><span>空<bos-switch class="layerSwitch" v-model="sky" @change="toggleSwitch"></bos-switch></span></p>
              </li>
              <li><p><span>自身轨迹<bos-switch class="layerSwitch" v-model="selfTrajectory"></bos-switch></span></p></li>
              <li><p><span>略图调制<bos-switch class="layerSwitch" v-model="sketchModulation"></bos-switch></span></p></li>
            </ul>
          </div>
        </div>
        <div>
          <div class="rescuePanel" v-show="isRescueShow">
            <p :class="{'active': resMethod == 1}" @click="resMethod = 1"><span>车辆遇险</span></p>
            <p :class="{'active': resMethod == 2}" @click="resMethod = 2"><span>落水</span></p>
            <p :class="{'active': resMethod == 3}" @click="resMethod = 3"><span>火灾</span></p>
            <div>
              <bos-radio label="救援发布" v-model="rescue" @click.native = "forSos"></bos-radio>
              <bos-radio label="救援撤销" v-model="rescue" @click.native = "forNosos"></bos-radio>
            </div>
            <bos-button class="sure" type="primary" @click="sendSos">确定发送</bos-button>
          </div>
        </div>
        <div class="near" v-show="isShow">
          <p @click="controlPerspective('forward')"></p>
          <p @click="controlPerspective('backward')"></p>
        </div>
        <div class="fix" @click="nowPosition"></div>
        <div class="free">空闲状态</div>
        <span class="rate">1:{{$store.state.mapRate}}</span>
        <div class="rate-border" :style="{width:$store.state.rateBorder}"></div>
      </div>
      <div class="map-footer">
        <ul>
          <li @click="toCommand"><i></i>作战协同</li>
          <li @click="toPlotView"><i></i>侦察标绘</li>
          <li @click="toContact"><i></i>通讯录</li>
          <li @click="toTs"><i></i>态势共享</li>
          <li><i></i>态势回放</li>
          <!--<li @click="toControl"><i></i>安全管理</li>-->
          <li @click="toMe"><i></i>本机设置</li>
          <!--<li><i></i>略图调制</li>-->
          <li @click="toTools"><i></i>小工具</li>
        </ul>
      </div>
      <!--圆形菜单-->
      <div class="circle">
      </div>
      <!--关闭路径-->
      <button id="pathBtn" @click="closePath">关闭轨迹</button>
      <!--聊天区域-->
      <div id="chatDiv"></div>
      <!--隐形区域-->
      <div id="visibDiv" ></div>
    </div>
    <div id="plotview">
      <div class="plot-box">
        <div class="tab-box">
          <div :class="{'activec':currentTab=='common'}" @click="toggleTab('common')"><a>常用</a></div>
          <div :class="{'activec':currentTab=='fixed'}" @click="toggleTab('fixed')"><a>固定</a></div>
          <div :class="{'activec':currentTab=='motor'}" @click="toggleTab('motor')"><a>机动</a></div>
          <div :class="{'activec':currentTab=='other'}" @click="toggleTab('other')"><a>其他</a></div>
        </div>
        <!--<Common :is="currentTab" keep-alive v-if="this.$store.state.showTemp"></Common>-->
        <Common :is="currentTab" keep-alive ></Common>
      </div>
      <div class="plot-box plot-box111">
        <div class="tab-box">
          <div :class="{'activec':currentTab2=='message'}" @click="toggleTab2('message')"><a>信息</a></div>
          <div :class="{'activec':currentTab2=='photo'}" @click="toggleTab2('photo')"><a>图片</a></div>
          <div :class="{'activec':currentTab2=='voice'}" @click="toggleTab2('voice')"><a>录音</a></div>
          <div :class="{'activec':currentTab2=='vedio'}" @click="toggleTab2('vedio')"><a>视频</a></div>
          <div :class="{'activec':currentTab2=='describe'}" @click="toggleTab2('describe')"><a>描述</a></div>
        </div>
        <Message :is="currentTab2" keep-alive v-if="this.$store.state.showTemp"></Message>
        <!--<Message :is="currentTab2" keep-alive ></Message>-->
      </div>
    </div>
    <div class="warn-box">
      <p id="demo3" name="input_date" data-lcalendar="2010-01-11,2019-12-31">{{nowTime}}</p>
      <input type="text" @click="moveMap" value="移动地图" readonly/>
      <input type="text" v-show="point1" value="区域范围1" readonly/>
      <input type="text" v-show="point2" value="区域范围2" readonly/>
      <div class="warn-list">
        <p :class="{'active': warnMethod == 1}" @click="warnMethod = 1"><span>空 袭</span></p>
        <p :class="{'active': warnMethod == 2}" @click="warnMethod = 2"><span>袭 扰</span></p>
        <p :class="{'active': warnMethod == 3}" @click="warnMethod = 3"><span>核生化</span></p>
      </div>
      <hr/>
      <div class="warn-btn">
        <bos-radio label="预警发布" v-model="warning" style="color:#fff;" @click.native = "forwarn"></bos-radio>
        <bos-radio label="预警撤销" v-model="warning" style="color:#fff" @click.native = "fornowarn"></bos-radio>
      </div>
      <hr/>
      <div class="warn-level">
        <p :class="{'active': warnMethod1 == 4}" @click="warnMethod1 = 4"><span>四级</span></p>
        <p :class="{'active': warnMethod1 == 5}" @click="warnMethod1 = 5"><span>三级</span></p>
        <p :class="{'active': warnMethod1 == 6}" @click="warnMethod1 = 6"><span>二级</span></p>
        <p :class="{'active': warnMethod1 == 7}" @click="warnMethod1 = 7"><span>一级</span></p>
      </div>
      <div class="warn-button">
        <bos-button class="quit" type="primary" @click="quit1">退出</bos-button>
        <bos-button class="posted" type="primary" @click="sub">提交发布</bos-button>
      </div>
    </div>
    <div class="plot-box-TS" v-if="this.$store.state.tsFlag">
      <div class="tab-box-TS">
        <div :class="{'activet':currentTab_TS=='situation'}" @click="toggleTab_TS('situation')"><a>态势</a></div>
        <!--<div :class="{'activet':currentTab_TS=='highf'}" @click="toggleTab_TS('highf')"><a>高分</a></div>-->
      </div>
      <situation :is="currentTab_TS" keep-alive></situation>
    </div>
    <div class="compass-main" @click="closeCompass" v-show="compass">
      <div class="compass-title">指南针</div>
      <div class="compass-content">
        <div class="compass"></div>
      </div>
      <div class="canvasContent">
        <canvas id="canvas" class="canvas" width="320" height="320">您的浏览器当前版本不支持canvas表签</canvas>
      </div>
      <div class="compass-footer" id="footer-tip"></div>
    </div>
    <router-view></router-view>

    <bos-button type="text" @click="messageBox"></bos-button>
  </div>
</template>
<script>
  import Vue from 'vue';
  import $ from 'jquery';
  import router from '../../router';
  import appService from '@/assets/js/service';
  import Common from '@/components/map/plot/common';
  import Fixed from '@/components/map/plot/fixed';
  import Motor from '@/components/map/plot/motor';
  import Other from '@/components/map/plot/other';
  import Message from '@/components/map/plot/message';
  import Photo from '@/components/map/plot/photo';
  import Voice from '@/components/map/plot/voice';
  import Vedio from '@/components/map/plot/vedio';
  import Describe from '@/components/map/plot/describe';
  import {DB} from '@/assets/js/db';
  import {generateUUID,io,calls,mapFn} from '@/assets/js/utils';
  import situation from '@/components/situation-share/situation.vue';
  import point from "@/assets/js/plotPicture";
  import MapView from "./zone";
  export default {
    name: 'Handle',
    data () {
      return {
        isShow:true,
        isLayerShow:false,
        isRescueShow:false,
        currentView:"state",
        currentTab: 'common',
        currentTab2: 'message',
        currentTab_TS:'situation',
        resMethod:undefined,
        warnMethod:undefined,
        warnMethod1:undefined,
        issos: 1,
        sosType: '',
        warnType:'',
        iswarn:1,
        army: this.$store.state.army,
        oneself: this.$store.state.oneself,
        friend: this.$store.state.friend,
        neutral: this.$store.state.neutral,
        land: this.$store.state.land,
        sea: this.$store.state.sea,
        sky: this.$store.state.sky,
        nowTime:io.formatDateTime(new Date()),
        rescue: '',
        warning:'',
        mapPoint:undefined,
        pointArr:[],
        pointIds:[],
        point1:undefined,
        point2:undefined,
        pointCartesian:[],
        compass:false,
        sosText:this.$route.params.sos,
      }
    },
    created() {
      let _this = this;
      this.$root.hub.$on("change", () => {
        _this.currentTab2 = 'message';
      });
    },
    mounted() {
      let _this =this;
      /*消息区未读消息*/
      mapFn.readCount();
      this.getSosDefault();
      //加载地图标绘
      this.getPlots();
      this.$router.replace('/mapView');
      this.sosPos();
      this.timeChose("#demo2");
      this.timeChose("#demo3");
      //指南针
      mapFn.placement(document.getElementsByClassName("canvas")[0],document.getElementById('footer-tip'));
      this.drawCanvas();
      mapFn.placement(document.getElementById("small-canvas"),document.getElementById('small-compass-footer'));
      this.drawSmallCompass();
      //this.changeRateBorder();
      $(document).bind("keyup",function(e){
        var theEvent = e||window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if(code ==4){
          console.log("手机返回");
          //history.pushState(null, null, location.href );
          //_this.messageBox();
          _this.$router.go(-1);
        }
      });
      /*监听电话*/
      if (window.atelier && this.$store.state.currentUser.communicationMode == "ADHOC") {
        GeoBOS.call.addCallIncomingListener((ip) => {
          console.log("----------call incoming call-------------"+ip);
          //获取来电方信息
          let dbGroupMember = new DB('GroupMember');
          dbGroupMember.queryConfig({sipid:ip},function(err,res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
              _this.$store.state.call.dialUser = res[0];
              calls.storeCallMessage(res[0], _this.$store.state.account, 'radio', 'N');
              _this.$store.state.call.isDial = false;
              _this.$store.state.call.showDial = true;
            }
          })
        });
      }else if(this.$store.state.currentUser.communicationMode == "SATCOM"){
        GeoBOS.satcom.onATMessage.addListener('bos.iecas.app', (msg) => {
          console.log("recv_Cmd:msg " + msg);
          console.log("recv_Cmd:body " + JSON.parse(msg).body);
          var msgObj = JSON.parse(msg);
          var dsub = msgObj.dsub;
          console.log("recv_Cmd:dsub " + dsub);
          if (dsub == 0x7e) {
            var body = JSON.parse(msgObj.body);
            var simId = body.sim_id;
            var num = body.number;
            var phoneState = body.state;
            if (phoneState == 1) {
              //来电振铃
              let dbGroupMember = new DB('GroupMember');
              /*根据号码获取对应的成员*/
              dbGroupMember.queryConfig({phoneNum:num},function(err,res){
                if(err){
                  console.log('failed with:' + err.message)
                }else{
                  _this.$store.state.call.dialUser = res[0];
                  calls.storeCallMessage(res[0], _this.$store.state.account, 'radio', 'N');
                  _this.$store.state.call.isDial = false;
                  _this.$store.state.call.showDial = true;
                }
              })
            }
          }
        });
      }
    },
    updated(){
      this.contactReadCount();
      this.$store.state.army = this.army;
      this.$store.state.oneself = this.oneself;
      this.$store.state.friend = this.friend;
      this.$store.state.neutral = this.neutral;
      this.$store.state.land = this.land;
      this.$store.state.sea = this.sea;
      this.$store.state.sky = this.sky;
    },
    components:{
      MapView,
      Common,
      Fixed,
      Motor,
      Other,
      Message,
      Photo,
      Voice,
      Vedio,
      Describe,
      situation
    },
    methods:{
      getPlots(){
        mapFn.getPlot(this.oneself,this.army,this.friend,this.neutral,this.land,this.sea,this.sky);
      },
//        关闭路径
      closePath(){
        viewer.entities.removeById("polyline");
        $("#pathBtn").hide();
      },
//        测试点击
      Test(){
        this.$router.push("/test");
      },
      messageBox() {
        let _this = this;
        this.$confirm('是否退出该应用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log("$router.go(-1)");
          GeoBOS.appman.close();
        })
      },
      /*通讯录未读*/
      contactReadCount(){
        let db = new DB('Message');
        let query = {
          name:"message",
          isRead:"N"
        };
        db.queryConfig(query,function(err,res){
          if(err){
            console.log(err.message);
          }else{
            if(res.length != 0){
              $(".contactReadCount").css("display","block");
            }else{
              $(".contactReadCount").css("display","none");
            }
          }
        })
      },
      /*未读点击事件*/
      checkCount(){
        this.$router.replace("/contact");
      },
      /* 移动地图*/
      moveMap(){
        this.mapPoint = new point.MapPoint(this.pointArr,this.pointCartesian,this.pointIds);
      },
      controlPerspective(type){
        mapFn.controlCamera(type);
        //this.changeRateBorder();
      },
      sosPos() {
        let _this = this;
        let item = this.sosText;
        if(item){
          if(item.msgType=='J'){
            viewer.entities.add({
              id:_this.$store.state.account.uniqueId+"sos",
              name: 'sos',
              position: GeoBOS.GeoVis.Cartesian3.fromDegrees(item.longitude, item.latitude),
              point: {
                color: GeoBOS.GeoVis.Color.RED,
                pixelSize: 6,
                outlineColor: GeoBOS.GeoVis.Color.Black,
                outlineWidth: 3
              }
            });
          }else if(item.msgType=='Y'){
            viewer.entities.add({
              id: 'endline',
              polyline: {
                positions: item.cartesians[0],
                width: 1,
                material: GeoBOS.GeoVis.Color.RED
              }
            });
            viewer.entities.add({
              id: 'polyline',
              polyline: {
                positions: item.cartesians[0],
                width: 1,
                material: GeoBOS.GeoVis.Color.GREEN
              }
            });
            viewer.entities.getById('polyline').polyline = {
              positions: item.cartesians,
              width: 1,
              material: GeoBOS.GeoVis.Color.GREEN
            };
            viewer.entities.getById('endline').polyline = {
              positions: [item.cartesians[item.cartesians.length - 1],item.cartesians[0]],
              width: 1,
              material: GeoBOS.GeoVis.Color.RED
            };
            for(let i = 0;i<item.cartesians.length;i++){
              viewer.entities.add({
                id:"lead",
                position: item.cartesians[i],
                point: {
                  color: GeoBOS.GeoVis.Color.RED,
                  pixelSize: 4,
                  outlineColor: GeoBOS.GeoVis.Color.BLACK,
                  outlineWidth: 2
                }
              });
            }
            let distance=0;
            distance += GeoBOS.GeoVis.Cartesian3.distance(item.cartesians[item.cartesians.length - 2], item.cartesians[0]);
            $("#map").after('<p style="position:fixed;top:20%;left:5%">距离为：' + (distance / 1000).toFixed(3) + 'KM</p>');
          } else if(item.msgType=='S'){
          }
          viewer.camera.flyTo({
            destination: GeoBOS.GeoVis.Cartesian3.fromDegrees(item.longitude, item.latitude,1000),
            duration: 1.0
          });
        }
      },
      toggleTab_TS: function(tab) {
        this.currentTab_TS = tab;
      },
      timeChose(demo){
        let calendardatetime = new lCalendar();
        calendardatetime.init({
          'trigger': demo,
          'type': 'datetime',
          'idName': demo
        });
      },
      getSosDefault(){
        let _this = this;
        let dbGroup = new DB('group');
        dbGroup.queryConfig({groupF:"0",moduleUser:_this.$store.state.account.uniqueId},function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            _this.$store.state.recourseMembers.emergencyMembersNames = [];
            _this.$store.state.recourseMembers.emergencyMembersIp = [];
            _this.$store.state.recourseMembers.shareMembersNames = [];
            _this.$store.state.recourseMembers.shareMembersIp = [];
            for(let i=0;i<res.length;i++){
              if(res[i].type == "sosDefault"){
                  for(let j=0;j<res[i].members.length;j++){
                    _this.$store.state.recourseMembers.emergencyMembersNames.push(res[i].members[j].position + res[i].members[j].nickName);
                    _this.$store.state.recourseMembers.emergencyMembersIp.push(res[i].members[j].sipid);
                  }
              }
              if(res[i].type == "tsDefault"){
                for(let j=0;j<res[i].members.length;j++){
                  _this.$store.state.recourseMembers.shareMembersNames.push(res[i].members[j].position + res[i].members[j].nickName);
                  _this.$store.state.recourseMembers.shareMembersIp.push(res[i].members[j].sipid);
                }
              }
            }
            console.log(_this.$store.state.recourseMembers.emergencyMembersIp);
          }
        });
      },
      toCommand(){
        this.commonRemove();
        this.$router.replace("/contact");
      },
      toPlotView(){
        $("#handle").hide();
        $("#plotview").show();
        $(".plot-box").show();
        $(".plot-box111").hide();
        this.currentTab = "common";
        this.currentTab2 = "message";
        this.$store.state.showTemp = true;
        this.toUp();
      },
      toTs(){
        $("#handle").hide();
        $("#plotview").hide();
        $(".plot-box").hide();
        $(".plot-box111").hide();
        this.$store.state.tsFlag = true;
      },
      toUp(){
        document.documentElement.scrollTop = document.body.scrollTop =0;
      },
      toContact(){
        this.commonRemove();
        this.$router.replace("/address-list");
      },
      toMe(){
        this.commonRemove();
        this.$router.replace('/mePro');
      },
      jump(current){
        this.commonRemove();
        this.$router.push({name: 'Receive', params: {id:(current)}});
      },
      toggleSwitch(){
        let _this = this;
        let db1 = new DB('plotMessage');
        db1.queryConfig({name:'img'},function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else {
            for(let i = 0; i < res.length; i++){
              viewer.entities.removeById(res[i].uuid);
            }
            //加载地图标绘
            _this.getPlots();
          }
        });
      },
      isLayer(){
        if(this.isLayerShow == true){
          this.isLayerShow = false;
        }else{
          this.isLayerShow = true;
          this.isRescueShow = false;
        }
      },
      isRescue(){
        let _this = this;
        if(this.isRescueShow == true){
          this.isRescueShow = false;
          $(".rescuePanel p").each(function () {
            if ($(this).hasClass("active")){
              _this.resMethod = '';
            }
          });
          this.rescue = '';
        }else{
          this.isRescueShow = true;
          this.isLayerShow = false;
        }
      },
      isWarn(){
        $("#handle").hide();
        $("#plotview").hide();
        $(".warn-box").show();
      },
      toTools(){
        this.commonRemove();
        this.$router.replace("/tools")
      },
      toggleTab: function(tab) {
        this.currentTab = tab;
      },
      toggleTab2: function(tab) {
        this.currentTab2 = tab;
      },
      quit1(){
        let _this = this;
        $(".warn-box").hide();
        $("#handle").show();
        $(".warn-list p").each(function () {
          if($(this).hasClass("active")){
            _this.warnMethod = '';
          }
        });
        $(".warn-level p").each(function () {
          if($(this).hasClass("active")){
            _this.warnMethod1 = '';
          }
        });
        this.warning = '';
        for(let i=0;i<_this.pointIds.length;i++){
          viewer.entities.removeById(_this.pointIds[i]);
        }
        viewer.entities.removeById("polyline");
        if(this.$store.state.pointCartesian.length){
          point.MapPoint.prototype.destroy();
        }
      },
      forSos(){
        this.issos = 3;
      },
      forNosos(){
        this.issos = 1;
      },
      sendSos(){
        let _this = this;
        let db = new DB('Message');
        $(".rescuePanel p").each(function () {
          if ($(this).hasClass("active")){
            _this.sosType = $(this).children("span").html();
          }
        });
        let sosdoc = {
          messRemind:'remind',
          msgType: "J",
          isRead:"Y",
          sender: _this.$store.state.account,
          receiver: "default",
          type: _this.sosType,
          longitude:_this.$store.state.nowPoint.longitude,
          latitude:_this.$store.state.nowPoint.latitude,
          sendDate: io.formatDateTime(new Date()),
          status: _this.issos,
          situation:"sender",
          moduleUser:_this.$store.state.account.uniqueId,
          uuid:generateUUID.creatUuid()
        };
        if(_this.issos==1){
          mapFn.insertDb(sosdoc,"救援撤销发送完成",_this);
          let query = {
            type: _this.sosType,
          };
          db.remove(query, function(err, res) {
            if (err) {
              console.log('failed with:' + err.message)
            } else {
              console.log(res.num);
            }
          });
        }else{
          mapFn.insertDb(sosdoc,"救援发送完成",_this);
        }
        this.isRescueShow = false;
        $(".rescuePanel p").each(function () {
          if ($(this).hasClass("active")){
            _this.resMethod = '';
          }
        });
        this.rescue = '';
      },
      //预警发布--------
      forwarn(){
        this.iswarn=3
      },
      fornowarn(){
        this.iswarn = 1
      },
      //提交发布
      sub(){
        let _this = this;
        _this.pointCartesian = _this.$store.state.pointCartesian;
        _this.pointArr = _this.$store.state.pointArr;
        let db = new DB('Message');
        $(".warn-list p").each(function () {
          if($(this).hasClass("active")){
            _this.warnType = $(this).children("span").html();
          }
        });
        $(".warn-level p").each(function () {
          if($(this).hasClass("active")){
            _this.warnLevel = $(this).children("span").html();
          }
        });
        let warndoc={
          messRemind:'remind',
          type:_this.warnType,//预警类型
          isRead:"Y",
          sender: _this.$store.state.account,
          receiver: "default",
          situation:"sender",
          status:_this.iswarn,
          msgType:"W",
          pointCartesian:_this.pointCartesian,
          pointArr:_this.pointArr,
          warnLevel:_this.warnLevel,//预警级别
          warnTime:document.getElementById("demo3").innerHTML,
          sendDate:io.formatDateTime(new Date()),
          moduleUser:_this.$store.state.account.uniqueId,
          uuid:generateUUID.creatUuid()
        };
        //创建预警数组
        if(_this.iswarn==1){
          mapFn.insertDb(warndoc,"警报撤销发送完成",_this);
          let query = {
            type: _this.warnType,
          };
          db.remove(query, function(err, res) {
            if (err) {
              console.log('failed with:' + err.message)
            } else {
              console.log(res.num);
            }
          });
        }else {
          mapFn.insertDb(warndoc,"警报发送完成",_this);
        }
        for(let i=0;i<_this.pointIds.length;i++){
          viewer.entities.removeById(_this.pointIds[i]);
        }
        viewer.entities.removeById("polyline");
        point.MapPoint.prototype.destroy();
        $(".warn-box").hide();
        $("#handle").show();
        $(".warn-list p").each(function () {
          if($(this).hasClass("active")){
            _this.warnMethod = '';
          }
        });
        $(".warn-level p").each(function () {
          if($(this).hasClass("active")){
            _this.warnMethod1 = '';
          }
        });
        this.warning = '';
      },
      //指南针
      drawCanvas() {
        var canvas = document.getElementById('canvas'), context = canvas.getContext('2d');
        var CENTROID_RADIUS = 30,
          CENTROID_STROKE_STYLE = 'rgba(255, 255, 0, 0)',
          CENTROID_FILL_STYLE = 'rgba(255, 255, 255, 0.6)',//圆心
          RING_INNER_RADIUS = 20, RING_OUTER_RADIUS = 30,
          ANNOTATIONS_FILL_STYLE = 'rgba(255, 255, 255, 1)',//刻度文字
          ANNOTATIONS_TEXT_SIZE = 12,

          TICK_WIDTH = 20,
          TICK_LONG_STROKE_STYLE = 'rgba(255, 255, 255, 1)',
          TICK_SHORT_STROKE_STYLE = 'rgba(255, 255, 255,1)',//刻度

          TRACKING_DIAL_STROKING_STYLE = 'rgba(255, 255, 255, 0.9)',//外圈圆

          /*     GUIDEWIRE_STROKE_STYLE = 'goldenrod',
           GUIDEWIRE_FILL_STYLE = 'rgba(255, 255, 255, 0.6)', */

          circle = {
            x : canvas.width / 2,
            y : canvas.height / 2,
            radius : 120
          };

        //Functions..........................................................

        function drawGrid(color, stepx, stepy) {
          context.save()

          /* context.shadowColor = undefined;
           context.shadowOffsetX = 0;
           context.shadowOffsetY = 0;  */

          context.strokeStyle = color;
          /* 	context.fillStyle = 'rgba(255, 255, 255, 1)'; */
          context.lineWidth = 0.8;

          //context.translate(context.canvas.width/2,context.canvas.height/2);

          context.fillRect(0, 0, context.canvas.width,
            context.canvas.height);
        }

        function drawDial() {
          var loc = {
            x : circle.x,
            y : circle.y
          };//刻度盘

          drawCentroid(); //圆心
          drawRing(); //外圆环
          drawTickInnerCircle();//内圆
          drawTicks();//刻度
          drawAnnotations();//刻度数字
        }

        function drawCentroid() {
          context.beginPath();
          context.save();
          context.strokeStyle = CENTROID_STROKE_STYLE;
          context.fillStyle = CENTROID_FILL_STYLE;
          context.arc(circle.x, circle.y, CENTROID_RADIUS, 0,
            Math.PI * 2, false);
          context.stroke();
          context.fill();
          context.restore();
        }

        function drawRing() {
          drawRingOuterCircle();

          context.strokeStyle = 'rgba(250, 250, 250, 0.2)';
          context.arc(circle.x, circle.y, circle.radius
            + RING_INNER_RADIUS, 0, Math.PI * 2, false);

          context.fillStyle = 'rgba(250, 250, 250, 0.2)';//圆环填充
          context.fill();
          context.stroke();
        }

        function drawRingOuterCircle() {

          context.strokeStyle = TRACKING_DIAL_STROKING_STYLE;
          context.beginPath();
          context.arc(circle.x, circle.y, circle.radius
            + RING_OUTER_RADIUS, 0, Math.PI * 2, true);
          context.stroke();
        }

        function drawTickInnerCircle() {
          context.save();
          context.beginPath();
          context.strokeStyle = 'rgba(250, 250, 250, 0.6)';//圆圈内
          context
            .arc(circle.x, circle.y, circle.radius
              + RING_INNER_RADIUS - TICK_WIDTH, 0,
              Math.PI * 2, false);
          context.stroke();
          context.restore();
        }

        function drawTick(angle, radius, cnt) {
          var tickWidth = cnt % 5 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;

          context.beginPath();

          context.moveTo(circle.x + Math.cos(angle)
            * (radius - tickWidth), circle.y + Math.sin(angle)
            * (radius - tickWidth));

          context.lineTo(circle.x + Math.cos(angle) * (radius), circle.y
            + Math.sin(angle) * (radius));

          context.strokeStyle = TICK_SHORT_STROKE_STYLE;
          context.stroke();
        }

        function drawTicks() {
          var radius = circle.radius + RING_INNER_RADIUS, ANGLE_MAX = 2 * Math.PI, ANGLE_DELTA = Math.PI / 60, tickWidth;

          context.save();

          for (var angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++) {
            drawTick(angle, radius, cnt++);
          }

          context.restore();
        }
        //标绘刻度
        function drawAnnotations() {
          var radius = circle.radius + RING_INNER_RADIUS;

          context.save();
          /*     context.fillStyle = ANNOTATIONS_FILL_STYLE;
           context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';  */

          for (var angle = 0; angle < 2 * Math.PI - Math.PI / 360; angle += Math.PI / 12) {
            //东西南北
            if (angle == 0) {
              ANNOTATIONS_FILL_STYLE = 'rgba(255, 0, 0, 1)',//刻度文字
                ANNOTATIONS_TEXT_SIZE = 25,
                context.fillStyle = ANNOTATIONS_FILL_STYLE;
              context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';
              context.fillText("北", circle.x + Math.sin(angle)
                * (radius - TICK_WIDTH * 2), circle.y
                - Math.cos(angle) * (radius - TICK_WIDTH * 2));

            } else if ((angle * 180 / Math.PI).toFixed(0) == 90) {
              ANNOTATIONS_FILL_STYLE = 'rgba(255, 255, 255, 1)',//刻度文字
                ANNOTATIONS_TEXT_SIZE = 25,
                context.fillStyle = ANNOTATIONS_FILL_STYLE;
              context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';
              context.fillText("东", circle.x + Math.sin(angle)
                * (radius - TICK_WIDTH * 2), circle.y
                - Math.cos(angle) * (radius - TICK_WIDTH * 2));
            } else if ((angle * 180 / Math.PI).toFixed(0) == 180) {
              ANNOTATIONS_FILL_STYLE = 'rgba(255, 255, 255, 1)',//刻度文字
                ANNOTATIONS_TEXT_SIZE = 25,
                context.fillStyle = ANNOTATIONS_FILL_STYLE;
              context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';
              context.fillText("南", circle.x + Math.sin(angle)
                * (radius - TICK_WIDTH * 2), circle.y
                - Math.cos(angle) * (radius - TICK_WIDTH * 2));
            } else if ((angle * 180 / Math.PI).toFixed(0) == 270) {
              ANNOTATIONS_FILL_STYLE = 'rgba(255, 255, 255, 1)',//刻度文字
                ANNOTATIONS_TEXT_SIZE = 25,
                context.fillStyle = ANNOTATIONS_FILL_STYLE;
              context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';
              context.fillText("西", circle.x + Math.sin(angle)
                * (radius - TICK_WIDTH * 2), circle.y
                - Math.cos(angle) * (radius - TICK_WIDTH * 2));
            } else {
              ANNOTATIONS_FILL_STYLE = 'rgba(255, 255, 255, 1)',//刻度文字
                ANNOTATIONS_TEXT_SIZE = 12,
                context.fillStyle = ANNOTATIONS_FILL_STYLE;
              context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';
              /* context.beginPath(); */
              context.fillText((angle * 180 / Math.PI).toFixed(0),
                circle.x + Math.sin(angle)
                * (radius - TICK_WIDTH * 2), circle.y
                - Math.cos(angle)
                * (radius - TICK_WIDTH * 2));
            }

          }
          context.restore();
        }
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        drawGrid('lightgray', 10, 10);
        drawDial();
      },
      toCompass(){
        this.compass = true;
      },
      closeCompass(){
        this.compass = false;
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
      drawSmallCompass() {
        var canvas = document.getElementById('small-canvas'), context = canvas
          .getContext('2d');

        let CENTROID_RADIUS = 5,
          CENTROID_STROKE_STYLE = 'rgba(255, 255, 0, 0)',
          CENTROID_FILL_STYLE = 'rgba(255, 255, 255, 0.5)',//圆心

          RING_INNER_RADIUS = 10, RING_OUTER_RADIUS = 15,

          /*ANNOTATIONS_FILL_STYLE = 'rgba(255, 255, 255, 1)',//刻度文字
           ANNOTATIONS_TEXT_SIZE = 12,*/

          TICK_WIDTH = 5,
          TICK_LONG_STROKE_STYLE = 'rgba(255, 255, 255, 1)',
          TICK_SHORT_STROKE_STYLE = 'rgba(255, 255, 255,1)',//刻度

          TRACKING_DIAL_STROKING_STYLE = 'rgba(255, 255, 255, 0.9)',//外圈圆

          /*     GUIDEWIRE_STROKE_STYLE = 'goldenrod',
           GUIDEWIRE_FILL_STYLE = 'rgba(255, 255, 255, 0.6)', */

          circle = {
            x : canvas.width / 2,
            y : canvas.height / 2,
            //radius : 140
            radius : 3
          };

        //Functions..........................................................

        function drawGrid(color, stepx, stepy) {
          context.save()

          /* context.shadowColor = undefined;
           context.shadowOffsetX = 0;
           context.shadowOffsetY = 0;  */

          context.strokeStyle = color;
          /* 	context.fillStyle = 'rgba(255, 255, 255, 1)'; */
          context.lineWidth = 0.8;

          //context.translate(context.canvas.width/2,context.canvas.height/2);

          context.fillRect(0, 0, context.canvas.width,
            context.canvas.height);
        }

        function drawDial() {
          var loc = {
            x : circle.x,
            y : circle.y
          };//刻度盘

          drawCentroid(); //圆心
          /* drawCentroidGuidewire(loc); *///指针
          drawRing(); //外圆环
          drawTickInnerCircle();//内圆
          drawTicks();//刻度
          //drawAnnotations();//刻度数字
        }

        function drawCentroid() {
          context.beginPath();
          context.save();
          context.strokeStyle = CENTROID_STROKE_STYLE;
          context.fillStyle = CENTROID_FILL_STYLE;
          context.arc(circle.x, circle.y, CENTROID_RADIUS, 0,
            Math.PI * 2, false);
          context.stroke();
          context.fill();
          context.restore();
        }

        function drawCentroidGuidewire(loc) {
          var angle = -Math.PI / 4, radius, endpt;

          radius = circle.radius + RING_OUTER_RADIUS;

          if (loc.x >= circle.x) {
            endpt = {
              x : circle.x + radius * Math.cos(angle),
              y : circle.y + radius * Math.sin(angle)
            };
          } else {
            endpt = {
              x : circle.x - radius * Math.cos(angle),
              y : circle.y - radius * Math.sin(angle)
            };
          }

          context.save();

          context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
          context.fillStyle = GUIDEWIRE_FILL_STYLE;

          context.beginPath();
          context.moveTo(circle.x, circle.y);
          context.lineTo(endpt.x, endpt.y);
          context.stroke();

          context.beginPath();
          context.strokeStyle = TICK_LONG_STROKE_STYLE;
          context.arc(endpt.x, endpt.y, 5, 0, Math.PI * 2, false);
          context.fill();
          context.stroke();

          context.restore();
        }

        function drawRing() {
          drawRingOuterCircle();

          context.strokeStyle = 'rgba(250, 250, 250, 0.2)';
          context.arc(circle.x, circle.y, circle.radius
            + RING_INNER_RADIUS, 0, Math.PI * 2, false);

          context.fillStyle = 'rgba(250, 250, 250, 0.2)';//圆环填充
          context.fill();
          context.stroke();
        }

        function drawRingOuterCircle() {

          context.strokeStyle = TRACKING_DIAL_STROKING_STYLE;
          context.beginPath();
          context.arc(circle.x, circle.y, circle.radius
            + RING_OUTER_RADIUS, 0, Math.PI * 2, true);
          context.stroke();
        }

        function drawTickInnerCircle() {
          context.save();
          context.beginPath();
          context.strokeStyle = 'rgba(250, 250, 250, 0.6)';//圆圈内
          context
            .arc(circle.x, circle.y, circle.radius
              + RING_INNER_RADIUS - TICK_WIDTH, 0,
              Math.PI * 2, false);
          context.stroke();
          context.restore();
        }

        function drawTick(angle, radius, cnt) {
          var tickWidth = cnt % 5 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;

          context.beginPath();

          context.moveTo(circle.x + Math.cos(angle)
            * (radius - tickWidth), circle.y + Math.sin(angle)
            * (radius - tickWidth));

          context.lineTo(circle.x + Math.cos(angle) * (radius), circle.y
            + Math.sin(angle) * (radius));

          context.strokeStyle = TICK_SHORT_STROKE_STYLE;
          context.stroke();
        }

        function drawTicks() {
          var radius = circle.radius + RING_INNER_RADIUS, ANGLE_MAX = 2 * Math.PI, ANGLE_DELTA = Math.PI / 60, tickWidth;

          context.save();

          for (var angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++) {
            drawTick(angle, radius, cnt++);
          }

          context.restore();
        }
        //标绘刻度
        function drawAnnotations() {
          var radius = circle.radius + RING_INNER_RADIUS;

          context.save();
          /*     context.fillStyle = ANNOTATIONS_FILL_STYLE;
           context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';  */

          for (var angle = 0; angle < 2 * Math.PI - Math.PI / 360; angle += Math.PI / 12) {
            //东西南北
            if (angle == 0) {
              ANNOTATIONS_FILL_STYLE = 'rgba(255, 0, 0, 1)',//刻度文字
                ANNOTATIONS_TEXT_SIZE = 25,
                context.fillStyle = ANNOTATIONS_FILL_STYLE;
              context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';
              context.fillText("北", circle.x + Math.sin(angle)
                * (radius - TICK_WIDTH * 2), circle.y
                - Math.cos(angle) * (radius - TICK_WIDTH * 2));

            } else if ((angle * 180 / Math.PI).toFixed(0) == 90) {
              ANNOTATIONS_FILL_STYLE = 'rgba(255, 255, 255, 1)',//刻度文字
                ANNOTATIONS_TEXT_SIZE = 25,
                context.fillStyle = ANNOTATIONS_FILL_STYLE;
              context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';
              context.fillText("东", circle.x + Math.sin(angle)
                * (radius - TICK_WIDTH * 2), circle.y
                - Math.cos(angle) * (radius - TICK_WIDTH * 2));
            } else if ((angle * 180 / Math.PI).toFixed(0) == 180) {
              ANNOTATIONS_FILL_STYLE = 'rgba(255, 255, 255, 1)',//刻度文字
                ANNOTATIONS_TEXT_SIZE = 25,
                context.fillStyle = ANNOTATIONS_FILL_STYLE;
              context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';
              context.fillText("南", circle.x + Math.sin(angle)
                * (radius - TICK_WIDTH * 2), circle.y
                - Math.cos(angle) * (radius - TICK_WIDTH * 2));
            } else if ((angle * 180 / Math.PI).toFixed(0) == 270) {
              ANNOTATIONS_FILL_STYLE = 'rgba(255, 255, 255, 1)',//刻度文字
                ANNOTATIONS_TEXT_SIZE = 25,
                context.fillStyle = ANNOTATIONS_FILL_STYLE;
              context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';
              context.fillText("西", circle.x + Math.sin(angle)
                * (radius - TICK_WIDTH * 2), circle.y
                - Math.cos(angle) * (radius - TICK_WIDTH * 2));
            } else {
              ANNOTATIONS_FILL_STYLE = 'rgba(255, 255, 255, 1)',//刻度文字
                ANNOTATIONS_TEXT_SIZE = 12,
                context.fillStyle = ANNOTATIONS_FILL_STYLE;
              context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';
              /* context.beginPath(); */
              context.fillText((angle * 180 / Math.PI).toFixed(0),
                circle.x + Math.sin(angle)
                * (radius - TICK_WIDTH * 2), circle.y
                - Math.cos(angle)
                * (radius - TICK_WIDTH * 2));
            }

          }
          context.restore();
        }

        //Initialization...................................................
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        drawGrid('lightgray', 10, 10);
        drawDial();
      },
      nowPosition(){
        let _this =this;
        viewer.camera.flyTo({
          destination: GeoBOS.GeoVis.Cartesian3.fromDegrees(_this.$store.state.nowPoint.longitude,_this.$store.state.nowPoint.latitude,1500),
          duration: 0.0
        });
        viewer.entities.add({
          id:'nowPosition',
          position: GeoBOS.GeoVis.Cartesian3.fromDegrees(_this.$store.state.nowPoint.longitude,_this.$store.state.nowPoint.latitude),
          point: {
            color: GeoBOS.GeoVis.Color.RED,
            pixelSize: 3,
            outlineColor: GeoBOS.GeoVis.Color.BLACK,
            outlineWidth: 3
          }
        });
      },
      commonRemove(){
        viewer.entities.removeById(this.$store.state.account.uniqueId+"sos");
        viewer.entities.removeById("endline");
        viewer.entities.removeById("polyline");
        viewer.entities.removeById("lead");
        viewer.entities.removeById("nowPosition");
        viewer.entities.removeById("test");
      }
    },
  }
</script>

<style>
  /*关闭路径*/
  #pathBtn{
    position: fixed;
    left: 45%;
    font-size: 12px;
    bottom: 14%;
    padding: 5px;
    display: none;
  }
  /*隐形区域*/
  #visibDiv{
    border:1px solid black;
    position:absolute;
    width:30px;
    height:30px;
    display:none;
  }
  /*聊天区域*/
   #chatDiv{
     position:fixed;
     left:30px;
     width:160px;
     height:200px;
     top:50%;
     margin-top:-100px;
     border:1px solid black;
     display:none;
   }
  #chatDiv>img{
    width:30px;
    height:30px;
    display:inline-block;
    margin:5px 10px;
  }
  /*测试*/
  .test{
    background-color: rgb(249, 249, 1);
    border-radius: 1em;
    color: #f73f06;
    padding: .8em;
    position: fixed;
    min-height: 1em;
    line-height: 1em;
    width: 1em;
    top: .3em;
    left: 76.6%;
    font-size: .7em;
    border: none;
    box-shadow: 0 0 10px #59670d;
  }
  /*通讯录未读提示*/
  .contactReadCount{
    background-color: rgb(249, 249, 1);
    border-radius: 1em;
    color: #f73f06;
    padding: .8em;
    position: fixed;
    min-height: 1em;
    line-height: 1em;
    width: 2em;
    top: .3em;
    left: 39.6%;
    font-size: .7em;
    border: none;
    box-shadow: 0 0 10px #59670d;
    display:none;
  }
  /*提醒圆标*/
  .stateCount,.rescueCount,.alarmCount,.leadCount,.sketchCount{
    background: red;
    border-radius: 1em;
    padding: .2em;
    position: absolute;
    left: 3.2em;
    top: .2em;
    font-size: .6em;
    color: white;
    min-width: 1.1em;
    min-height: 1em;
    line-height: 1em;
    text-align: center;
    display: none;
  }
  /*圆形菜单*/
  #handle {height:0;}
  #handle .fa-2x {font-size: .8em;  }
  #handle a{font-size:14px;text-decoration:none;outline:0;}
  #handle .circle,.ring{height:100px;position:relative;width:100px;}
  #handle .circle{top:60px;left:60px;display:inline-block;position: relative;transform-origin: 50% 50%;}
  #handle .ring{
    background-color:rgba(0,0,0,0.5);
    border-radius:50%;
    opacity:0;
    -webkit-transform-origin:50% 50%;
    -moz-transform-origin:50% 50%;
    transform-origin:50% 50%;
    -webkit-transform:scale(0.1) rotate(-270deg);
    -moz-transform:scale(0.1) rotate(-270deg);
    -transform:scale(0.1) rotate(-270deg);
    -webkit-transition:all 0.4s ease-out;
    -moz-transition:all 0.4s ease-out;
    transition:all 0.4s ease-out;
  }
  #handle .open .ring{opacity:1;-webkit-transform:scale(1) rotate(0deg);-moz-transform:scale(1) rotate(0deg);-transform:scale(1) rotate(0deg);}
  #handle .center{
    background-color:rgba(153,153,153,0.5);
    border-radius:50%;
    transform-origin: 50% 50%;
    border:2px solid #fff;
    bottom:0;
    left:0;
    right:0;
    top:0;
    color:white;
    height:20px;
    width:20px;
    line-height:80px;
    margin:auto;
    position:absolute;
    text-align:center;
    -webkit-transition:all 0.4s ease-out;
    -moz-transition:all 0.4s ease-out;
    transition:all 0.4s ease-out;
  }
  #handle .open .center{border-color:#aaa;}
  #handle .menuItem{border-radius:50%;color:#eee;display:block;height:20px;line-height:40px;margin-left:-20px;margin-top:-20px;position:absolute;text-align:center;width:40px;}
  #handle .menuItem:active{color:#3d4425;}
  .see{
    display: inline-block;
    min-width:150px;
    min-height:6.7rem;
    transform-origin: 0 0;
    position: absolute;
    top:1rem;
    left:4.4rem;
    z-index:20002;
    border:1px solid #aaa;
    background-color: rgb(226, 221, 221)
  }
  table>tbody{
    background-color: #a2b597;
  }
  table>tbody>tr>td{
    padding: .1rem .4rem;
    font-size: .9rem;
  }
  .close{
    width: 4.4rem;
    border-radius: .5rem;
    line-height: 1.5rem;
    margin: 1% 27%;
    color: #fff;
    background-color: #4c9e6c;
    border: 0;
  }
  /*body的定位去掉，不然影响地图*/
  body {
    height: 100%;
    width: 100%;
    position: inherit !important;
    margin: 0;
    clear:both;
  }
  .layerPanel{
    width:33%;
    border:1px solid #eee;
    position: absolute;
    right:.2rem;
    top:5.8rem;
    z-index:20002;
    background-color:#3d4425 ;
  }
  .rescuePanel{
    width:33%;
    border:1px solid #eee;
    position: absolute;
    right:.2rem;
    top:9.05rem;
    z-index:20002;
    background-color:#3d4425 ;
  }
  .layerPanel>ul{
    padding:.3rem 1rem;
  }
  .layerPanel>ul>li{
    font-size:.9rem;
    color:#fff;
    border-bottom:solid 1px #898a82;
  }
  .layerPanel>ul>li:nth-last-child(1){border-bottom:none;}
  .layerPanel>ul>li>p{height:1.4rem;padding:.3rem 0;}
  .layerPanel>ul>li>p>span{width:40%;float:left;display:block;}
  .layerPanel>ul>li:nth-last-of-type(1)>p>span,.layerPanel>ul>li:nth-last-of-type(2)>p>span{
    width:100%;
  }
  .bos-switch.layerSwitch{
    height:1.4rem !important;
    top:0 !important;
    display: inline-block;
    float:right;
    clear:both;
  }
  .rescuePanel>p:nth-of-type(1){
    background:url("../../../static/plotimg/map_sostype_bus.png") no-repeat;
    background-size:100%;
  }
  .rescuePanel>p:nth-of-type(2){
    background:url("../../../static/plotimg/map_sostype_fallingwater.png") no-repeat;
    background-size:100%;
  }
  .rescuePanel>p:nth-of-type(3){
    background:url("../../../static/plotimg/map_sostype_fire.png") no-repeat;
    background-size:100%;
  }
  .rescue .xx{ font-size:2.8rem;line-height:36px;font-family:"Corbel";}
  .rescuePanel>div {padding:.8rem 0;clear:both;border-bottom:solid 1px #516448;}
  .active{border:solid 1px red;}
  .rescuePanel>p{
    width:4rem;
    height:4rem;
    border:1px solid #000;
    margin-top:.3rem;
    float:left;
    margin-left:.14rem;
    box-sizing: border-box;
    position:relative;
  }
  .rescuePanel>p.active{border:solid 1px #85c54b;}
  .rescuePanel>p>span{
    width:100%;
    height:1.2rem;
    display:block;
    position:absolute;
    left:0;
    bottom:0;
    background:rgba(0,0,0,0.5);
    color:#fff;
    font-size:.8rem;
  }
  .map-footer{
    position:fixed;
    bottom:0;
    width: 100%;
    height: 27px;
    line-height:30px;
    color:#fff;
    overflow-x:auto;
    overflow-y:hidden;
    background:url("../../../static/images/im_header_bg.png") no-repeat;
    padding:10px 0;
    z-index:20001;
  }
  .map-footer>ul{ width: 858px;height:100%;}
  .map-footer>ul>li{
    padding:0 16px;
    height: 100%;
    float: left;
    border-right:solid 1px #5f6a4a;
  }
  .map-footer>ul>li:active{
    padding:0 16px;
    height: 100%;
    float: left;
    color: #c2c2c2;
    border-right:solid 1px #5f6a4a;
  }
  .map-footer>ul>li:nth-last-child(1){border-right:none;}
  .map-footer>ul>li>i{
    width:30px;
    height:30px;
    background:url("../../../static/plotimg/map_home_menu_icon_fight.png") no-repeat left center;
    background-size:100%;
    float:left;
  }
  .map-footer>ul>li:nth-of-type(2)>i{background:url("../../../static/plotimg/map_home_menu_icon_plotting.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(3)>i{background:url("../../../static/plotimg/map_home_menu_icon_cantact.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(4)>i{background:url("../../../static/plotimg/map_home_menu_icon_tsshare.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(5)>i{background:url("../../../static/plotimg/map_home_receive_icon_guide_no.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(6)>i{background:url("../../../static/plotimg/map_home_menu_icon_security.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(7)>i{background:url("../../../static/plotimg/map_home_menu_icon_me.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(8)>i{background:url("../../../static/plotimg/map_home_menu_icon_doodle.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(9)>i{background:url("../../../static/plotimg/map_home_menu_icon_tool.png") no-repeat left center;background-size:100%;}
  /*激活时*/
  .map-footer>ul>li:nth-of-type(1):active>i{background:url("../../../static/plotimg/map_home_menu_icon_fight_active.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(2):active>i{background:url("../../../static/plotimg/map_home_menu_icon_plotting_active.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(3):active>i{background:url("../../../static/plotimg/map_home_menu_icon_cantact_active.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(4):active>i{background:url("../../../static/plotimg/map_home_menu_icon_tsshare_active.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(5):active>i{background:url("../../../static/plotimg/map_home_receive_icon_guide_no_active.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(6):active>i{background:url("../../../static/plotimg/map_home_menu_icon_security_active.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(7):active>i{background:url("../../../static/plotimg/map_home_menu_icon_me_active.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(8):active>i{background:url("../../../static/plotimg/map_home_menu_icon_doodle_active.png") no-repeat left center;background-size:100%;}
  .map-footer>ul>li:nth-of-type(9):active>i{background:url("../../../static/plotimg/map_home_menu_icon_tool_active.png") no-repeat left center;background-size:100%;}
  .state{
    position:absolute;
    left:.1rem;
    top:.1rem;
    display: inline-block;
  }
  .state>ul{
    height: 2.6rem;
    background: url(../../../static/images/im_header_bg.png) no-repeat;
    display: inline-block;
    border-radius: 4px;
  }
  .state>ul>li{
    float:left;
    padding:.3rem .5rem;
    font-size:.9rem;
    color:#fff;
    position: relative;
  }
  .state>ul>li:active{
    float:left;
    padding:.3rem .5rem;
    font-size:.9rem;
    color:#c2c2c2;
    position: relative;
  }
  .state>ul>li>i{
    width:30px;
    height:16px;
    display:block;
    background:url("../../../static/plotimg/map_home_receive_icon_req_no.png") no-repeat;
    background-size:100%;
  }
  .state>ul>li:nth-of-type(1):active>i{
    background:url("../../../static/plotimg/map_home_receive_icon_req_no_active.png") no-repeat;
    background-size:100%;
  }
  .state>ul>li:nth-of-type(2)>i {
    background:url("../../../static/plotimg/map_home_receive_icon_sos_no.png") no-repeat;
    background-size:100%;
  }
  .state>ul>li:nth-of-type(2):active>i{
    background:url("../../../static/plotimg/map_home_receive_icon_sos_no_active.png") no-repeat;
    background-size:100%;
  }
  .state>ul>li:nth-of-type(3)>i {
    background:url("../../../static/plotimg/map_home_receive_icon_danger_no.png") no-repeat;
    background-size:100%;
  }
  .state>ul>li:nth-of-type(3):active>i {
    background:url("../../../static/plotimg/map_home_receive_icon_danger_no_active.png") no-repeat;
    background-size:100%;
  }
  .state>ul>li:nth-of-type(4)>i {
    background:url("../../../static/plotimg/map_home_receive_icon_guide_no.png") no-repeat;
    background-size:100%;
  }
  .state>ul>li:nth-of-type(4):active>i {
    background:url("../../../static/plotimg/map_home_receive_icon_guide_no_active.png") no-repeat;
    background-size:100%;
  }
  .state>ul>li:nth-of-type(5)>i {
    background:url("../../../static/plotimg/map_home_menu_icon_doodle.png") no-repeat;
    background-size:100%;
  }.state>ul>li:nth-of-type(5):active>i {
     background:url("../../../static/plotimg/map_home_menu_icon_doodle_active.png") no-repeat;
     background-size:100%;
   }
  .time{
    height:2.6rem;
    line-height: 2.6rem;
    background: url(../../../static/images/im_header_bg.png) no-repeat;
    display: inline-block;
    padding:0 .8rem;
    border-radius: 4px;
    position: absolute;
    right:.2rem;
    top:.1rem;
  }
  .warnTime{
    height:2.6rem;
    line-height: 2.6rem;
    background:#ffffff;
    display: inline-block;
    padding:0 .8rem;
    border-radius: 4px;
    position: absolute;
    right:.2rem;
    top:.1rem;
  }
  .rescue,.near{
    position: absolute;
    right:.2rem;
    display: inline-block;
  }
  .rescue{
    top:3rem;
  }
  .near{
    right:.2rem;
    bottom:3rem;
  }
  .rescue>div{
    width:46px;
    height:40px;
    background:rgba(0,0,0,0.4);
    padding:3px 0;
    border-radius:4px;
    color:#fff;
    margin-bottom:5px;
    text-align:center;
  }
  .rescue>div:active{
    width:46px;
    height:40px;
    background:rgba(0,0,0,0.5);
    padding:3px 0;
    border-radius:4px;
    color:#fff;
    margin-bottom:5px;
    text-align:center;
  }
  .rescue>div>span{font-size:.9rem;}
  .rescue>div.help,.rescue>div.warn{color:#e7d117;}
  .rescue .layer>i{background:url("../../../static/plotimg/map_home_send_icon_maplayer.png") no-repeat;}
  .rescue .help>i{background:url("../../../static/plotimg/map_home_send_icon_sos.png") no-repeat;}
  .rescue .warn>i{background:url("../../../static/plotimg/map_home_send_icon_danger.png") no-repeat;}
  .rescue .layer>i,.rescue .help>i,.rescue .warn>i{
    width:22px;
    height:22px;
    display:block;
    background-size:100%;
    margin:0 12px;
  }
  .near>p:nth-of-type(1){background:url("../../../static/plotimg/map_zoomin.png") no-repeat; background-size:100%;}
  .near>p:nth-of-type(2){background:url("../../../static/plotimg/map_zoomout.png") no-repeat; background-size:100%;}
  .near>p:nth-of-type(1):active{background:url("../../../static/plotimg/map_zoomin_sel.png") no-repeat; background-size:100%;}
  .near>p:nth-of-type(2):active{background:url("../../../static/plotimg/map_zoomout_sel.png") no-repeat; background-size:100%;}
  .near>p{
    width:40px;
    height:40px;
  }
  .fix{
    width:40px;
    height:40px;
    position:absolute;
    bottom:3rem;
    left:.2rem;
    background:url("../../../static/plotimg/map_location.png") no-repeat;
    background-size:100%;
  }
  .fix:active{
    background:url("../../../static/plotimg/map_location_sel.png") no-repeat;
    background-size:100%;
  }
  .free{
    color:#fff;
    font-size:.8rem;
    border-radius:4px;
    position:absolute;
    bottom:3rem;
    right:3rem;
    padding:.3rem .5rem;
    background:rgba(0,0,0,0.4);
  }
  .rate{
    font-size: 0.9rem;
    position:absolute;
    bottom:3.3rem;
    left: 2.9rem;
  }
  .rate-border{
    height: 0.1rem;
    width: 3rem;
    border: 1px solid #000;
    border-top: 0;
    position: absolute;
    bottom: 3.2rem;
    left: 2.8rem;
  }
  .bos-switch__core::before{ background-color:#898a82; }
  .bos-switch__core{ background-color:#898a82;border:solid 1px #898a82;}
  .bos-switch__input:checked+.bos-switch__core{border-color:#85c54b;background-color:#85c54b;}
  .icon-quit{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: url("../../../static/images/im_base_quit.png") no-repeat;
    background-size: 100%;
    position: relative;
    top: 0.2rem;
  }
  #plotview{display:none;}
  .plot-box{
    width:38%;
    height:97%;
    padding:5px;
    position:absolute;
    top:0;
    left:0;
    background:#3d4425;
  }
  .tab-box{ width:3.5rem;}
  .tab-box>div{
    width:100%;
    height:3.4rem;
    text-align:center;
    line-height:3.4rem;
    color:#fff;
    background:#666c53;
    border-radius:8px 0 0 8px;
    margin-bottom:6px;
  }
  .tab-box>div.activec{background:#888e6b;}
  .plot-box111{display:none;}
  .warn-box{
    position:absolute;
    top:0;
    left:0;
    width:38%;
    height:98.8%;
    background:#6b7353;
    overflow-y: auto;
    display:none;
    border: 2px solid black;
  }
  .warn-box>hr{
    width:90%;
    margin-left: .7rem;
    border-bottom: 1px solid #7d9282;
    border-top: 0;
    border-left: 0;
    border-right: 0;
  }
  .warn-box>input{
    width:90%;
    height:2.2rem;
    margin:6px 5%;
    display:block;
    text-align:center;
  }
  .warn-box>p{
    width:90%;
    height:2.4rem;
    line-height: 2.4rem;
    margin:6px 5%;
    background-color: #fff;
    text-align: center;
    border-radius: 5%;
  }
  .warn-box>input:nth-of-type(0),.warn-box>input:nth-of-type(1){
    background:#ebeded;
    border-radius:5px;
  }
  .warn-box>input:nth-of-type(1){ color:blue; }
  .warn-box>input:nth-of-type(2),.warn-box>input:nth-of-type(3){
    height:1.6rem;
    font-size:.8rem;
    color:#fff;
    text-align:left;
    border-bottom:solid 1px #7d9282;
  }
  .warn-list,.warn-level{
    padding:2% 10%;
    overflow:hidden;
    margin-left: .9rem;
  }
  .warn-list{ margin-left: 1.3rem;}
  .warn-btn{
    padding:3%;
    margin-left: 1.2rem;
    overflow:hidden;
  }
  .warn-list>p{
    width:28%;
    height:4rem;
    margin-right:2%;
    float:left;
    box-sizing: border-box;
    position:relative;
    text-align:center;
  }
  .warn-list>p:nth-last-child(1){
    margin-right:0;
    background:url("../../../static/plotimg/map_dangertype_hsh.png") no-repeat;
    background-size:100%;
  }
  .warn-list>p:nth-of-type(1){
    background:url("../../../static/plotimg/map_dangertype_ks.png") no-repeat;
    background-size:100%;
  }
  .warn-list>p:nth-of-type(2){
    background:url("../../../static/plotimg/map_dangertype_xr.png") no-repeat;
    background-size:100%;
  }
  .warn-list>p.active,.warn-level>p.active{border:solid 1px #85c54b;}
  .warn-list>p>span,.warn-level>p>span{
    width:100%;
    height:1.2rem;
    line-height:1.2rem;
    display:block;
    position:absolute;
    left:0;
    bottom:0;
    background:#2b2c24;
    color:#fff;
    font-size:.8rem;
  }
  .warn-btn .bos-radio .bos-radio__label{
    width:50%;
    display:inline-block;
    white-space:normal;
    color:#fff;
    /*padding-left: 0;*/
  }
  .warn-btn .bos-radio{width:40%;margin-left: 14px;}
  .warn-btn .bos-radio .bos-radio__input {margin-top:-20px;}
  .warn-level>p{
    width:44%;
    height:3rem;
    margin-bottom:.5rem;
    box-sizing: border-box;
    margin-right:.5rem;
    float:left;
    text-align:center;
    background:blue;
    position:relative;
  }
  .warn-level>p:nth-of-type(2), .warn-level>p:nth-of-type(4){margin-right:0;}
  .warn-level>p:nth-of-type(2){background:yellow;}
  .warn-level>p:nth-of-type(3){background:orangered;}
  .warn-level>p:nth-of-type(4){background:red;}
  .warn-button{text-align:center;padding-bottom:.3rem;}
  .warn-button .posted{margin-left:3px;}
  .warn-button .bos-button{ width:45%;padding:10px 0;}
  .warn-button .bos-button--primary {background-color:#afb5a0;border-color:#6d7162;}

  /*态势共享*/
  .plot-box-TS{
    width:38%;
    height:97%;
    padding:5px;
    position:absolute;
    top:0;
    left:0;
    background:#3d4425;
  }
  .tab-box-TS{ width:3.5rem;}
  .tab-box-TS>div{
    width:100%;
    height:3.4rem;
    text-align:center;
    line-height:3.4rem;
    color:#fff;
    background:#666c53;
    border-radius:8px 0 0 8px;
    margin-bottom:6px;
  }
  .resReadSos{
    position:absolute;
    top:0;
    left:0;
    width:38%;
    height:98.8%;
    background:#6b7353;
    overflow-y: auto;
    display:none;
    border: 2px solid black;
  }
  .tab-box-TS > div.activet{background:#888e6b;}
  /*指南针*/
  .compass-main {
    position: fixed;
    top:0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    /*flex-direction: column;*/
    justify-content: center;
    align-items: center;
    z-index: 111011;
  }
  .compass-title {
    width: 100%;
    height: 48px;
    font-size: 16px;
    line-height: 48px;
    text-align: center;
    color: black;
    background-color: white;
  }
  .compass-content {
    position:absolute;
    width: 100%;
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .compass {
    width: 300px;
    height: 300px;
    margin-top:0;
    background: url("../../../static/images/compass.png") no-repeat center center;
    background-size: 300px 300px;
    border-radius: 50%;
    z-index: 50;
    transform: rotate(-90deg);
  }
  .compass-footer {
    width: 100%;
    height: 48px;
    color: black;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
  }
  .canvasContent {
    position: relative;
    z-index: 2;
    top: 0;
    left: 21px;
    width: 360px;
    height: 491px;
    transform: rotate(-90deg);
  }
  .canvas {
    z-index: 2;
    margin-top: 65.5px;
    border-radius:180px;
  }
  .small-compass {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .small-compass>div:nth-of-type(1) {
    position:absolute;
    width: 100%;
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .pointer {
    width: 50px;
    height: 50px;
    margin-top:0;
    background: url("../../../static/images/small_compass.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    border-radius: 50%;
    z-index: 50;
    transform: rotate(-90deg);
    position: relative;
    top: -1.5rem;
  }
  .small-compass>div:nth-of-type(2) {
    position: relative;
    z-index: 2;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
  }
  .small-compass>div:nth-of-type(3) {
    width: 100%;
    height: 48px;
    color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    position: relative;
    top: -2.5rem;
    left: 2.7rem;
  }
  #small-canvas {
    z-index: 2;
    margin-top: 65.5px;
    border-radius:180px;
    position: relative;
    top: -66px;
  }
</style>


