<template>
  <div class="quitUpdate">
    <bos-button type="primary" @click="flotQuit">退出</bos-button>
    <bos-button type="primary" @click="flotUpdate">更改</bos-button>
  </div>
</template>
<script>
  import {DB} from '@/assets/js/db';
  import {generateUUID,mapFn,io} from '@/assets/js/utils';
  import {User,Group,GroupMember,Message,CallHistory,MapMessage,SharePeople,plotImg} from '@/assets/js/obj_prototype';
  import PlotPicture from '@/assets/js/plotPicture';
  export default{
    data(){
      return{
        uuid: this.$store.state.plotInfo.uuid,
        plotName:undefined,
        plotAttr:undefined
      }
    },
    mounted(){
      let _this = this;
      let dbPlot = new DB("plotMessage");
      dbPlot.queryByUUID(this.uuid,function(err, res){
        if(err){
          console.log('failed with:' + err.message)
        }else{
          if(res.length){
            _this.plotName = res[0].plotUrl;
            _this.plotAttr = res[0].attribute;
          }
        }
      })
    },
    methods:{
      flotQuit(){
        $("#plotview").hide();
        $("#handle").show();
        $(".plot-box").show();
        $(".plot-box111").hide();
        this.$root.hub.$emit("change", 'message');
        this.$store.state.showTemp = false;
        this.$store.state.tempToggle = true;
        this.$store.state.plotInfo.attribute = '我';
        this.$store.state.plotInfo.number = 0;
        this.$store.state.plotInfo.arms = '陆';
        this.$store.state.plotInfo.condition = '完整';
        this.$store.state.plotInfo.pictrue = './static/plotimg/map_plotting_photo_default.png';
        this.$store.state.plotInfo.audio = '';
        this.$store.state.plotInfo.audioReceive = '';
        this.$store.state.plotInfo.video = '';
        this.$store.state.plotInfo.descript = '';
        this.$store.state.plotInfo.pictrueReceive = "";
      },
      flotUpdate(){
        let _this = this;
        $("#plotview").hide();
        $("#handle").show();
        $(".plot-box").show();
        $(".plot-box111").hide();
        this.$root.hub.$emit("change", 'message');
        this.$store.state.showTemp = false;
        this.$store.state.tempToggle = true;
        let dbPlot = new DB("plotMessage");
        let position = GeoBOS.GeoVis.Cartesian3.fromDegrees(this.$store.state.plotInfo.longitude, this.$store.state.plotInfo.latitude);
        let plotUrl = '';
        let index = _this.plotName.lastIndexOf(".");
        if(_this.plotAttr == '敌' || _this.plotAttr == '我' || _this.plotAttr == '友'){
          if(this.$store.state.plotInfo.attribute == '敌'){
            plotUrl  = _this.plotName.substring(0, index-2)+'-1'+'.png';
          }else if(this.$store.state.plotInfo.attribute == '我' || this.$store.state.plotInfo.attribute == '友'){
            plotUrl  = _this.plotName.substring(0, index-2)+'-2'+'.png';
          }else{
            plotUrl = _this.plotName.substring(0, index-2)+'.png';
          }
        }else{
          if(this.$store.state.plotInfo.attribute == '敌'){
            plotUrl  = _this.plotName.substring(0, index)+'-1'+'.png';
          }else if(this.$store.state.plotInfo.attribute == '我' || this.$store.state.plotInfo.attribute == '友'){
            plotUrl  = _this.plotName.substring(0, index)+'-2'+'.png';
          }else{
            plotUrl = _this.plotName;
          }
        }
        let entity = viewer.entities.add({
          name: 'img',
          position: position,
          billboard: {
            image: plotUrl,//123.png
            width: 25,
            height: 25,
          },
        });
        let query = {
          plotUrl: plotUrl,
          isRead : "Y",
          attribute: this.$store.state.plotInfo.attribute,
          number: this.$store.state.plotInfo.number,
          arms: this.$store.state.plotInfo.arms,
          condition: this.$store.state.plotInfo.condition,
          pictrue: this.$store.state.plotInfo.pictrue,
          audio: this.$store.state.plotInfo.audio,
          video: '/Camera/'+this.$store.state.plotInfo.video,
          descript: this.$store.state.plotInfo.descript,
          uuid: entity._id,
        };
        dbPlot.updateByUUID(this.uuid,{ $set:query }, { multi: true },function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log(res.num + ' objects has be updated');
            dbPlot.queryAll(function(err,res){
              if(err){
                console.log(err.message);
              }else{
                console.log("更新标绘读取数据库");
                console.log(res);
              }
            })
          }
        });
        viewer.entities.removeById(_this.uuid);
        let plot = {
          name: 'img',
          adhoc:"true",
          plotUrl: plotUrl,
          moduleUser : this.$store.state.account.uniqueId,
          attribute: this.$store.state.plotInfo.attribute,
          number: this.$store.state.plotInfo.number,
          arms: this.$store.state.plotInfo.arms,
          condition: this.$store.state.plotInfo.condition,
          pictrue: this.$store.state.plotInfo.pictrue,
          audio: this.$store.state.plotInfo.audio,
          video: this.$store.state.plotInfo.video,
          descript: this.$store.state.plotInfo.descript,
          longitude :this.$store.state.plotInfo.longitude,
          latitude : this.$store.state.plotInfo.latitude,
          operate: 'U',
          isShow:true,
          msgType:"S",
          sendDate:io.formatDateTime(new Date()),
          sender:this.$store.state.account,
          uuid: entity._id,
          oldUuid: this.uuid
        };
        for(let i=0;i<_this.$store.state.currentUserAll.length;i++){
          if(_this.$store.state.currentUserAll[i].uniqueId !=_this.$store.state.account.uniqueId){
            mapFn.sendPlot(plot,_this.$store.state.currentUserAll[i].sipid,_this);
          }
        }
        if(plot.pictrue&&plot.pictrue.indexOf("map_plotting_photo_default")== -1){
          this.adhocSendPlotFile("/sdcard"+"/Camera/"+plot.pictrue.substring(plot.pictrue.lastIndexOf("/")+1,plot.pictrue.length),"pictrue",plot.uuid);
           /* GeoBOS.io.sendFile({
              address: _this.$store.state.otherIP,  //type默认为'socket'
              path: plot.pictrue
            }, {
              timestamp: new Date(),
              name:'img',
              uuid:plot.uuid,
              oldUuid:_this.uuid
            }, function(err){
              if(err) {
                console.log(err.message);
              }
            });*/
        }
        if(plot.audio){
          this.adhocSendPlotFile("/sdcard"+plot.audio,"audio",plot.uuid);
          /* GeoBOS.io.sendFile({
             address: _this.$store.state.otherIP,  //type默认为'socket'
             path: plot.audio
           }, {
             timestamp: new Date(),
             name:'img',
             uuid:plot.uuid,
             oldUuid:_this.uuid
           }, function(err){
             if(err) {
               console.log(err.message);
             }
           });*/
      }
        if(plot.video){
          this.adhocSendPlotFile("/sdcard"+plot.video,"video",plot.uuid);
          /*GeoBOS.io.sendFile({
            address: _this.$store.state.otherIP,  //type默认为'socket'
            path: plot.video
          }, {
            timestamp: new Date(),
            name:'img',
            uuid:plot.uuid
          }, function(err){
            if(err) {
              console.log(err.message);
            }
          });*/
        }
        this.$store.state.plotInfo.attribute = '我';
        this.$store.state.plotInfo.number = 0;
        this.$store.state.plotInfo.arms = '陆';
        this.$store.state.plotInfo.condition = '完整';
        this.$store.state.plotInfo.pictrue = './static/plotimg/map_plotting_photo_default.png';
        this.$store.state.plotInfo.audio = '';
        this.$store.state.plotInfo.audioReceive = '';
        this.$store.state.plotInfo.video = '';
        this.$store.state.plotInfo.descript = '';
        this.$store.state.plotInfo.pictrueReceive = '';
      },
      adhocSendPlotFile(path,type,uuid){
        let _this = this;
        if(this.$store.state.currentUser.communicationMode == "ADHOC"){
          for(let i=0;i<_this.$store.state.currentUserAll.length;i++){
            if(_this.$store.state.currentUserAll[i].uniqueId !=_this.$store.state.account.uniqueId){
              let uid = GeoBOS.util.uuid();
              let options = {
                uid: uid,
                filePath:path,
                destIp: this.$store.state.currentUserAll[i].sipid,
                type: "Ip",
              };
              GeoBOS.adhoc.sendFile(options, function(err){
                if(err){
                  console.log("自组网发送de文件"+err);
                }else{
                  console.log("sendFile success!");
                  let msg = {
                    name:'img',
                    adhoc:"false",
                    type:type,
                    timestamp: io.formatDateTime(new Date()),
                    uid: uid,
                    uuid:uuid,
                    oldUuid:_this.uuid
                  };
                  let option = {
                    uid: "abcdefg",
                    content:JSON.stringify(msg),
                    destIp: _this.$store.state.currentUserAll[i].sipid,
                    type: "Ip"
                  };
                  GeoBOS.adhoc.sendMessage(option, (err) => {
                    console.log("自组网发送成功");
                  });
                }
              });
            }
          }

        }
      }
    }
  }
</script>
