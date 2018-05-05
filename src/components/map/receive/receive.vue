<template>
  <div id="receive">
    <bos-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <bos-tab-pane label="态势申请" name="state">
        <div class="state-content" v-for="(item,index) in tsValue">
          <div class="left">
            <span>{{item.sendDate_date}}</span>
            <span>{{item.sendDate_time}}</span>
            <img v-if="item.situation=='receiver'" src="../../../../static/plotimg/map_receive_list_item_receive.png"/>
            <img v-if="item.situation=='sender'" src="../../../../static/plotimg/map_receive_list_item_send.png"/>
            <img src="../../../../static/plotimg/map_receive_list_item_spot.png"/>
          </div>
          <div class="middle" @click="toResInfo2(item)">
            <span style="margin-top: .2rem;display: block;" v-if="item.infoLocation == 'Y'">信息定位：开</span>
            <span style="margin-top: .2rem;display: block;" v-if="item.infoLocation == 'N'">信息定位：关</span>
            <span v-if="item.targetLocation == 'Y'">目标定位：开</span>
            <span v-if="item.targetLocation == 'N'">目标定位：关</span><br/>
            坐标范围：<br/>
            <span v-if="item.pointArr[0].longitude">{{item.pointArr[0].longitude}}，{{item.pointArr[0].latitude}}<br/>
              {{item.pointArr[1].longitude}}，{{item.pointArr[1].latitude}}</span><br/>
          </div>
          <div class="right" @click="toResInfo2(item)">
            <span style="margin-top: .2rem;display: block;"></span>
            发送人<br/>
            {{item.sender.position}}{{item.sender.nickName}}<br/><br/>
            接收人<br/>
            {{$store.state.account.position}}{{$store.state.account.nickName}}<br/>
            <i class="bos-icon-arrow-right"></i>
          </div>
          <div class="disDel"><i class="icon-disDel" @click="iconDel(index,'T')"></i></div>
        </div>
      </bos-tab-pane>
      <bos-tab-pane label="紧急救援" name="rescue">
        <div class="rescue-content" v-for="(item,index) in sosValue">
          <div class="rescue-content">
            <div class="left">
              <span>{{item.sendDate_date}}</span>
              <span>{{item.sendDate_time}}</span>
              <img v-if="item.situation=='receiver'" src="../../../../static/plotimg/map_receive_list_item_receive.png"/>
              <img v-if="item.situation=='sender'" src="../../../../static/plotimg/map_receive_list_item_send.png"/>
              <img src="../../../../static/plotimg/map_receive_list_item_spot.png"/>
            </div>
            <div class="middle" @click="checkoutSos(item)">
              <img v-if="item.type=='车辆遇险'" src="../../../../static/plotimg/map_sostype_bus.png">
              <img v-if="item.type=='落水'" src="../../../../static/plotimg/map_sostype_fallingwater.png">
              <img v-if="item.type=='火灾'" src="../../../../static/plotimg/map_sostype_fire.png">
              <span style="margin-top: .2rem;display: block;">类型：{{item.type}}<br/></span>
              <span>经度：{{item.longitude}}<br/></span>
              <span>纬度：{{item.latitude}}</span>
            </div>
            <div class="right" @click="checkoutSos(item)">
              <span style="margin-top: .2rem;display: block;"></span>
              发送人<br/>
              {{item.sender.position}}{{item.sender.nickName}}<br/>
              <i class="bos-icon-arrow-right"></i>
            </div>
            <div class="disDel"><i class="icon-disDel" @click="iconDel(index,'J')"></i></div>
          </div>
        </div>
      </bos-tab-pane>
      <bos-tab-pane label="威胁预警" name="alarm">
        <div class="alarm-content" v-for="(item,index) in warnValue">
          <div class="left">
            <span>{{item.sendDate_date}}</span>
            <span>{{item.sendDate_time}}</span>
            <img v-if="item.situation=='receiver'" src="../../../../static/plotimg/map_receive_list_item_receive.png"/>
            <img v-if="item.situation=='sender'" src="../../../../static/plotimg/map_receive_list_item_send.png"/>
            <img src="../../../../static/plotimg/map_receive_list_item_spot.png"/>
          </div>
          <div class="middle" @click="toResInfo(item)">
            <img v-if="item.type == '空 袭'" src="../../../../static/plotimg/map_dangertype_ks.png"/>
            <img v-if="item.type == '袭 扰'" src="../../../../static/plotimg/map_dangertype_xr.png"/>
            <img v-if="item.type == '核生化'" src="../../../../static/plotimg/map_dangertype_hsh.png"/>
            <span style="margin-top: .2rem;display: block;">类型：{{item.type}}<br/></span>
            <span>级别：{{item.warnLevel}}<br/></span>
            <span>操作：预警发布<br/></span>
            <span>坐标范围<br/></span>
            <span v-if="item.pointArr.length">{{item.pointArr[0].longitude}}，{{item.pointArr[0].latitude}}<br/></span>
            <span v-if="item.pointArr.length">{{item.pointArr[1].longitude}}，{{item.pointArr[1].latitude}}</span>
          </div>
          <div class="right" @click="toResInfo(item)">
            <span style="margin-top: .2rem;display: block;"></span>
            发送人<br/>
            {{item.sender.position}}{{item.sender.nickName}}<br/>
            <i class="bos-icon-arrow-right"></i>
          </div>
          <div class="disDel"><i class="icon-disDel" @click="iconDel(index,'W')"></i></div>
        </div>
      </bos-tab-pane>
      <bos-tab-pane label="引导" name="lead">
        <div class="lead-content" v-for="(item,index) in leadValue">
          <div class="left">
            <span>{{item.sendDate_date}}</span>
            <span>{{item.sendDate_time}}</span>
            <img v-if="item.situation=='receiver'" src="../../../../static/plotimg/map_receive_list_item_receive.png"/>
            <img v-if="item.situation=='sender'" src="../../../../static/plotimg/map_receive_list_item_send.png"/>
            <img src="../../../../static/plotimg/map_receive_list_item_spot.png"/>
          </div>
          <div class="middle" @click="toHandle(item)">
            <span style="margin-top: .2rem;display: block;">引导线：<br/></span>
            <span v-for="carLead in item.cartesianLead">{{carLead.longitude}}, {{carLead.latitude}}<br/></span>
          </div>
          <div class="right" @click="toHandle(item)">
            <span style="margin-top: .2rem;display: block;"></span>
            发送人<br/>
            {{item.sender.nickName}}<br/><br/>
            接收人<br/>
            {{$store.state.account.position}} {{$store.state.account.nickName}}<br/>
            <i class="bos-icon-arrow-right"></i>
          </div>
          <div class="disDel"><i class="icon-disDel" @click="iconDel(index,'Y')"></i></div>
        </div>
      </bos-tab-pane>
      <bos-tab-pane label="标绘详情" name="sketch">
        <div class="sketch-content" v-for="(item,index) in sketchValue">
          <div class="left">
            <span>{{item.sendDate_date}}</span>
            <span>{{item.sendDate_time}}</span>
            <img v-if="item.situation=='receiver'" src="../../../../static/plotimg/map_receive_list_item_receive.png"/>
            <img v-if="item.situation=='sender'" src="../../../../static/plotimg/map_receive_list_item_send.png"/>
            <img src="../../../../static/plotimg/map_receive_list_item_spot.png"/>
          </div>
          <div class="middle" @click="toHandle(item)">
            <span style="margin-top: .2rem;display: block;">经度：{{item.longitude}}<br/></span>
            <span>纬度：{{item.latitude}}</span><br/>
            <span>属性：{{item.attribute}} &nbsp;&nbsp; 数量：{{item.number}}&nbsp;&nbsp; 兵种：{{item.arms}}</span><br/>
            <span>描述：{{item.descript}}</span>
          </div>
          <div class="right" @click="toPlots(item)">
            <span style="margin-top: .2rem;display: block;"></span>
            发送人<br/>
            {{item.sender.position}}{{item.sender.nickName}}<br/><br/>
            <i class="bos-icon-arrow-right"></i>
          </div>
          <div class="disDel"><i class="icon-disDel"  @click="iconDel(index,'S')"></i></div>
        </div>
      </bos-tab-pane>
    </bos-tabs>
    <img class="del-img" src="../../../../static/plotimg/map_receive_list_item_deleteall.png" @click="del"/>
    <span id="back" @click="backH">
        <i class="bos-icon-close"></i>
      </span>
  </div>

</template>
<script>
  import $ from 'jquery';
  import Vue from 'vue';
  import {DB} from '@/assets/js/db';
  import {generateUUID,getGroupName,calls,io,mapFn} from '@/assets/js/utils';
  export default{
    data(){
      return{
        activeName: undefined,
        tsValue: [],
        sosValue: [],
        warnValue: [],
        leadValue:[],
        sketchValue:[]
      }
    },
    mounted(){
      this.$store.state.nowPage="Receive";
      this.activeName = this.$route.params.id;
      this.$store.state.activeName=this.activeName;
    },
    watch:{
      activeName:function(){
        if(this.activeName == "state"){
          this.queryTs();
          this.$store.state.activeName="state";
        }
        if(this.activeName == "rescue"){
          this.querySos();
          this.$store.state.activeName="rescue";
        }
        if(this.activeName == "alarm"){
          this.queryWarn();
          this.$store.state.activeName="alarm";
        }
        if(this.activeName == "lead"){
          this.queryLead();
          this.$store.state.activeName="lead";
        }
        if(this.activeName == "sketch"){
          this.querySketch();
          this.$store.state.activeName="sketch";
        }
        }
    },
    methods:{
      handleClick(tab, event) {
        console.log(tab, event);
      },
      backH(){
        this.$router.replace('/handle');
      },
      //to预警
      toResInfo(item){
        this.$store.state.tabwarn=true;
        this.$store.state.tabts=false;
        this.$router.push({name: 'ResInformation', params: {warnInfo:item}});
      },
      //to态势
      toResInfo2(item){
        this.$store.state.tabts=true;
        this.$store.state.tabwarn=false;
        this.$router.push({name: 'ResInformation', params: {warnInfo:item}});
      },
      toHandle(item){
        this.$router.push({name: 'Handle', params: {sos:item}});
      },
      queryTs(){
        this.tsValue = [];
        let db = new DB('Message');
        let query = {
          msgType: "T",
        };
        this.sortMessages(db,query,this.tsValue);
      },
      querySos(){
        this.sosValue = [];
        let db = new DB('Message');
        let query = {
          msgType: "J",
        };
        this.sortMessages(db,query,this.sosValue);
      },
      queryWarn(){
        this.warnValue = [];
        let db = new DB('Message');
        let query = {
          msgType: "W",
        };
        this.sortMessages(db,query,this.warnValue);
      },
      queryLead(){
        this.leadValue = [];
        let db = new DB('Message');
        let query = {
          msgType: "Y",
        };
        this.sortMessages(db,query,this.leadValue);
      },
      querySketch(){
        this.sketchValue = [];
        let db = new DB('plotMessage');
        let query = {
          msgType: "S",
          isShow:true
        };
        this.sortMessages(db,query,this.sketchValue);
      },
      //消息按时间排序
      sortMessages(db,query,Value){
        db.queryConfig(query, function(err, res) {
          if (err) {
            console.log('failed with:' + err.message)
          } else {
            let value = res;
            let sendDate = [];
            for(let i=0;i<value.length;i++){
              sendDate.push(new Date(value[i].sendDate).getTime());
            }
            let sendDateSort = sendDate.sort(io.sortNumberSub);
            let sendDateSortQ = [];
            for(let i=0;i<sendDateSort.length;i++){
              sendDateSortQ.push(io.formatDateTime(new Date(sendDateSort[i])));
            }
            let sendDateSortQq = sendDateSortQ.filter(function(element,index,self){
              return self.indexOf(element) === index;
            });
            for(let i=0;i<sendDateSortQq.length;i++){
              for(let j=0;j<value.length;j++){
                if(sendDateSortQq[i]==value[j].sendDate){
                  let arr=value[j].sendDate.split(" ");
                  value[j].sendDate_date = arr[0];
                  value[j].sendDate_time = arr[1];
                  Value.push(value[j]);
                }
              }
            }
            db.update(query,{ $set: { isRead: 'Y' } }, { multi: true },function(err,res){
              if(err){
                console.log(err.message);
              }else{
                console.log("消息按时间排序------------");
                console.log(res);
              }
            });
          }
        });
      },
      //点击跳转
      checkoutSos(item){
        this.$router.push({name: 'Handle', params: {sos: item}});
      },
      del(){
        let _this = this;
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let cond ;
          let db = new DB('Message');
          let dbPlot = new DB('plotMessage');
          if(_this.activeName == "state"){
            cond = {
              msgType:"T"
            };
            $('.state-content').css("display","none");
          }else if(_this.activeName == "rescue"){
            cond = {
              msgType:"J"
            };
            $('.rescue-content').css("display","none");
          }else if(_this.activeName == "alarm"){
            cond = {
              msgType:"W"
            };
            $(".alarm-content").css("display","none");
          }else if(_this.activeName == "lead"){
            cond = {
              msgType:"Y"
            };
            $(".lead-content").css("display","none");
          }
          else if(_this.activeName == "sketch"){
            let query = {
              msgType:"S",
            };
            cond = {
              isShow:false
            };
            $(".sketch-content").css("display","none");
            dbPlot.update(query,{ $set: { isShow: false } }, { multi: true },function(err,res){
              if(err){
                console.log(err.message)
              }else{
                console.log("sketch-success--------");
                console.log(res);
              }
            });
          }
          db.remove(cond,{ multi: true },function(err,res){
            if(err){
              console.log(err.message)
            }else{
              console.log("success");
            }
          });
        })
      },
      iconDel(index,type){
        let _this = this;
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let cond ;
          let db = new DB('Message');
          let dbPlot = new DB('plotMessage');
          if(_this.activeName == "state"){
            let now = _this.tsValue[index];
            cond = {
              msgType:type,
              uuid:now.uuid
            };
            _this.tsValue.splice(index,1);
          }else if(_this.activeName == "rescue"){
            let now = _this.sosValue[index];
            cond = {
              msgType:type,
              uuid:now.uuid
            };
            _this.sosValue.splice(index,1);
          }else if(_this.activeName == "alarm"){
            let now = _this.warnValue[index];
            cond = {
              msgType:type,
              uuid:now.uuid
            };
            _this.warnValue.splice(index,1);
          }else if(_this.activeName == "lead"){
            let now = _this.leadValue[index];
            cond = {
              msgType:type,
              uuid:now.uuid
            };
            _this.leadValue.splice(index,1);
          }
          else if(_this.activeName == "sketch"){
            let now = _this.sketchValue[index];
            let query = {
              msgType:type,
              uuid:now.uuid
            };
            cond = {
              isShow:false
            };
            _this.sketchValue.splice(index,1);
            dbPlot.update(query,{ $set: { isShow: false } }, { multi: true },function(err,res){
              if(err){
                console.log(err.message)
              }else {
                console.log(res);
              }
              })
          }
          db.remove(cond,{ multi: true },function(err,res){
            if(err){
              console.log(err.message)
            }else{
              console.log(res);
            }
          });
        })
      },
  },
    beforeDestroy(){
      this.$store.state.nowPage="";
    }
}
</script>
<style>
  #back {
    position: absolute;
    top: .5rem;
    right:.5rem;
  }
  #receive{
    height:100%;
  }
  #receive .bos-tab-pane{position: relative;}
  #receive .bos-tabs__nav{
    background: url("../../../../static/images/im_header_bg.png") no-repeat;
    border-top-right-radius: .5rem;
    border-top-left-radius: .5rem;
    width:100%;
    white-space: nowrap;
    text-align: center;
  }
  #receive .bos-tabs__item{
    padding: 0 16px;
    color:#fff !important;
    width: 20% !important;
    height: 42px;
    box-sizing: border-box;
    line-height: 42px;
    float: left;
    list-style: none;
    font-size: 14px;
    margin:0 !important;
  }
  #receive .bos-tabs--border-card{
    padding:.5rem;
    height:100%;
    border:none !important;
    background-color:#5f6a4a !important;
    background-color:#5f6a4a !important;
  }
  #receive .bos-tabs--border-card>.bos-tabs__header .bos-tabs__item{
    padding:0 1.3rem !important;
    border-right:2px solid #5f6a4a !important;
    border-left:2px solid #5f6a4a !important;
    border-top-right-radius: .5rem;
    border-top-left-radius: .5rem;
  }
  #receive .bos-tabs--border-card>.bos-tabs__header .bos-tabs__item:nth-of-type(1){
    border-left: none !important;
  }
  #receive .bos-tabs__nav-scroll{
    background-color:#5f6a4a;
  }
  #receive .bos-tabs--border-card>.bos-tabs__header{
    background-color: #5f6a4a;
  }
  #receive .bos-tabs__header{
    position: fixed;
    top:.5rem !important;
    width:80% !important;
  }
  #receive .bos-tabs--border-card>.bos-tabs__header .bos-tabs__item.is-active{
    color:#000 !important;
    border-top-right-radius: .6rem;
    border-top-left-radius: .6rem;
  }
  #receive .bos-tabs__content{
    background-color: #fff;
    border-top-right-radius: .5rem;
    border-bottom-left-radius: .5rem;
    border-bottom-right-radius: .5rem;
    min-height:16.9rem;
    height:16.9rem;
    margin-top:2.6rem !important;
  }
  #receive .bos-tabs--border-card>.bos-tabs__content{
    padding:3px 9px 9px 9px !important;
    overflow-y: auto;
  }
  #receive .state-img,.rescue-img,.alarm-img,.lead-img,.sketch-img{
    position: absolute;
    bottom: .5rem;
    left: .1rem;
    width: 1.4rem;
    height: 1.4rem;
  }
  #receive .del-img{
    position:absolute;
    bottom: .4rem;
    left: .2rem;
    width: 30px;
    height: 30px;
  }
  /*内容部分*/
  .state-content,.rescue-content,.alarm-content,.lead-content,.sketch-content{
    width:100%;
    height:7rem;
    min-height:7rem;
    position: relative;
    clear:both;
    margin-top:.5rem;
  }
  .rescue-content{
    height:5rem;
    min-height:5rem;
  }
  .alarm-content{
    height:8rem;
    min-height:8rem;
  }
  .state-content>.left,.rescue-content>.left,.alarm-content>.left,.lead-content>.left,.sketch-content>.left{
    width:20%;
    height:100%;
    float:left;
    position: relative;
    border-right:2px solid #cdcfd2;
  }
  .state-content>.left>span,.rescue-content>.left>span,.alarm-content>.left>span,.lead-content>.left>span,.sketch-content>.left>span{
    display: inline;
    float:right;
    clear:both;
    margin-right:.8rem;
    font-size: .8rem;
  }
  .state-content>.left>span:nth-of-type(1),.rescue-content>.left>span:nth-of-type(1),.alarm-content>.left>span:nth-of-type(1),.lead-content>.left>span:nth-of-type(1),.sketch-content>.left>span:nth-of-type(1){
    background-color: #97a8be;
    border-radius: .4rem;
    padding:0 .2rem;
  }
  .state-content>.left>img:nth-of-type(1),.rescue-content>.left>img:nth-of-type(1),.alarm-content>.left>img:nth-of-type(1),.lead-content>.left>img:nth-of-type(1),.sketch-content>.left>img:nth-of-type(1){
    position: absolute;
    top:2.2rem;
    left:5rem;
    width: 20px;
  }
  .state-content>.left>img:nth-of-type(2),.rescue-content>.left>img:nth-of-type(2),.alarm-content>.left>img:nth-of-type(2),.lead-content>.left>img:nth-of-type(2),.sketch-content>.left>img:nth-of-type(2){
    position: absolute;
    left:6.6rem;
  }
  .state-content>.middle,.rescue-content>.middle,.alarm-content>.middle,.lead-content>.middle,.sketch-content>.middle{
    width:44%;
    height:100%;
    float:left;
    background-color: #f9dc84;
    font-size: 12px;
    margin-left:.8rem;
    border-left:3px solid #deb13c;
    padding:0 .2rem;
    overflow:scroll;
  }
  .sketch-content>.middle{
    overflow-y: auto;
  }
  .state-content>.middle>span{
    font-size: .7rem;
    line-height: 1.4rem;
  }
  .rescue-content>.middle>span{
    font-size: 12px;
    margin-left:.1rem;
    line-height: 1.6rem;
  }
  .alarm-content>.middle>span{
    font-size: 10px;
    margin-left:.1rem;
  }
  .lead-content>.middle>span{
    font-size: 12px;
    margin-left:.1rem;
  }
  .sketch-content>.middle>span{
    font-size: 12px;
    margin-left:.1rem;
    margin-top:.5rem;
  }
  .rescue-content>.middle>img,.alarm-content>.middle>img,.lead-content>.middle>img{
    width:35%;
    height:3.8rem;
    float: left;
    padding:2.1rem 0.5rem;
    /*padding-right: .6rem;*/
  }
  .rescue-content>.middle>img{  padding:.6rem 0.4rem; }
  .state-content>.right,.rescue-content>.right,.alarm-content>.right,.lead-content>.right,.sketch-content>.right{
    width:22%;
    height: 100%;
    float:left;
    position: relative;
    padding:0 .2rem;
    font-size: 12px;
    margin-left: .1rem;
    background-color: rgb(240, 248, 250);
  }
  .state-content>.right>i,.rescue-content>.right>i,.alarm-content>.right>i,.lead-content>.right>i,.sketch-content>.right>i{
    position: absolute;
    left:7rem;
    top:2.7rem;
  }
  .rescue-content>.right>i{
    top:2rem;
  }
  .alarm-content>.right>i{
    top:3.3rem;
  }
  .lead-content>.right>i{
    top:3rem;
  }
  .sketch-content>.right>i{
    top:1.3rem;
  }
  .state-content>.disDel,.rescue-content>.disDel,.alarm-content>.disDel,.lead-content>.disDel,.sketch-content>.disDel{
    width:8%;
    height: 100%;
    float:left;
   /* position: relative;
    padding:0 .2rem;
    font-size: 12px;
    margin-left: .1rem;*/
  }
  .state-content>.disDel>i,.rescue-content>.disDel>i,.alarm-content>.disDel>i,.lead-content>.disDel>i,.sketch-content>.disDel>i{
    display: inline-block;
    width: 35%;
    margin-top: 2em;
    margin-left: 1.2em;
    height: 1.2rem;
    background: url("../../../../static/images/im_delete_group.png") no-repeat;
    background-size: 100%;
  }
  .state-content>.disDel>i{
    margin-top: 2.6em;
  }
  .alarm-content>.disDel>i{
    margin-top: 3.3em;
  }
  .lead-content>.disDel>i{
    margin-top: 2.5em;
  }
  .sketch-content>.disDel>i{
    margin-top: 2.6em;
  }
</style>
