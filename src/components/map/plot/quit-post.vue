<template>
  <div class="quitPost">
    <bos-button type="primary" @click="flotQuit">退出</bos-button>
    <bos-button type="primary" @click="flotSubmit">提交</bos-button>
  </div>
</template>
<script>
  import {DB} from '@/assets/js/db';
  import {generateUUID,io,mapFn} from '@/assets/js/utils';
  import {Message,CallHistory,MapMessage,SharePeople,plotImg} from '@/assets/js/obj_prototype';
  import PlotPicture from '@/assets/js/plotPicture'
  export default{
    data(){
      return{
      }
    },
    methods:{
      flotQuit(){
        $("#plotview").hide();
        $("#handle").show();
        $(".plot-box").show();
        $(".plot-box111").hide();
        this.$root.hub.$emit("change", 'message');
        this.$store.state.showTemp = false;
        viewer.entities.removeById(this.$store.state.plotView.plotId);
        this.$store.state.plotView.plotPicture.destroy();
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
      flotSubmit(){
        let _this = this;
        $("#plotview").hide();
        $("#handle").show();
        $(".plot-box").show();
        $(".plot-box111").hide();
        this.$root.hub.$emit("change", 'message');
        this.$store.state.showTemp = false;
        let dbPlot = new DB("plotMessage");
        let plot = new plotImg();
        let index = this.$store.state.plotInfo.plotUrl.lastIndexOf(".");
        plot.name = 'img';
        plot.adhoc="true";
        if(this.$store.state.plotInfo.attribute == '敌'){
          plot.plotUrl  = this.$store.state.plotInfo.plotUrl.substring(0, index)+'-1'+'.png';
        }else if(this.$store.state.plotInfo.attribute == '我' || this.$store.state.plotInfo.attribute == '友'){
          plot.plotUrl  = this.$store.state.plotInfo.plotUrl.substring(0, index)+'-2'+'.png';
        }else{
          plot.plotUrl = this.$store.state.plotInfo.plotUrl;
        }
        plot.moduleUser = this.$store.state.account.uniqueId;
        plot.longitude = this.$store.state.plotInfo.longitude;
        plot.latitude = this.$store.state.plotInfo.latitude;
        plot.attribute = this.$store.state.plotInfo.attribute;
        plot.number = this.$store.state.plotInfo.number;
        plot.arms = this.$store.state.plotInfo.arms;
        plot.situation = this.$store.state.plotInfo.situation;
        plot.isRead = "Y";
        plot.msgType = this.$store.state.plotInfo.msgType;
        plot.condition = this.$store.state.plotInfo.condition;
        plot.pictrue = this.$store.state.plotInfo.pictrue;
        plot.audio = this.$store.state.plotInfo.audio;
        plot.video = this.$store.state.plotInfo.video;
        plot.descript = this.$store.state.plotInfo.descript;
        plot.sender = this.$store.state.account;
        plot.isShow = true;
        plot.sendDate = io.formatDateTime(new Date());
        let entity = viewer.entities.add({
          name: 'img',
          position: _this.$store.state.plotPosition,
          billboard: {
            image: plot.plotUrl,//123.png
            width: 25,
            height: 25,
          },
        });
        plot.uuid = entity._id;
        //往数据库中插入标绘信息
        dbPlot.insert(plot, function(err,res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('标绘插入成功');
            console.log(res);
          }
        });
        for(let i=0;i<_this.$store.state.currentUserAll.length;i++){
          if(_this.$store.state.currentUserAll[i].uniqueId !=_this.$store.state.account.uniqueId){
            mapFn.sendPlot(plot,_this.$store.state.currentUserAll[i].sipid,_this);
          }
        }
        viewer.entities.removeById(_this.$store.state.plotView.plotId);
        this.$store.state.plotView.plotPicture.destroy();
        if(plot.pictrue&&plot.pictrue.indexOf("map_plotting_photo_default")== -1){
          mapFn.sendPlotsFiles("/Camera/"+plot.pictrue.substring(plot.pictrue.lastIndexOf("/")+1,plot.pictrue.length),plot.uuid,"pictrue", _this);
        }
        if(plot.audio){
          mapFn.sendPlotsFiles(plot.audio,plot.uuid,"audio", _this);
        }
        if(plot.video){
          mapFn.sendPlotsFiles(plot.video,plot.uuid,"video", _this);
        }
        this.$store.state.plotInfo.attribute = '我';
        this.$store.state.plotInfo.number = 0;
        this.$store.state.plotInfo.arms = '陆';
        this.$store.state.plotInfo.condition = '完整';
        this.$store.state.plotInfo.pictrue = './static/plotimg/map_plotting_photo_default.png';
        this.$store.state.plotInfo.audio = '';
        this.$store.state.plotInfo.audioReceive = '';
        this.$store.state.plotInfo.video = '';
        this.$store.state.plotInfo.descript = '无';
        this.$store.state.plotInfo.pictrueReceive = "";
        let query = {
          name:'imgCommon',
          plotUrl:_this.$store.state.plotInfo.plotUrl,
          moduleUser:_this.$store.state.account.uniqueId
        };
//        常用
        dbPlot.queryConfig(query,function(err,res){
            if(err){
              console.log('failed with:' + err.message);
            }else{
                if(res.length){
                  dbPlot.update(query,{ $set: { count: res[0].count+1 } }, { multi: true },function(err){
                    if(err){
                      console.log("err message");
                    }else{
                      console.log("update success");
                    }
                  })
                }else{
                  let plotCommon = {
                    name:'imgCommon',
                    plotUrl:_this.$store.state.plotInfo.plotUrl,
                    count:1,
                    moduleUser:_this.$store.state.account.uniqueId
                  };
                  dbPlot.insert(plotCommon,function(err,res){
                      if(err){
                          console.log("insert failure")
                      }else{
                          console.log("imgCommon success");
                      }
                  })
                }
            }
        });
      },
    }
  }
</script>
