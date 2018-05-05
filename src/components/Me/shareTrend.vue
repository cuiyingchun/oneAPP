<template>
  <div id="shareTrend">
    <div class="top">
      <span><i class="icon-back" @click="goback"></i>返回</span>
      态势共享
    </div>
    <div class="content" style="margin-top: 3rem">
      <div class="trendLine border-B">
        <div class="left_info" @click="toTsChoice"><span>共享对象</span></div>
        <div class="right_info">
          <span style="position: relative;top: 0.1rem;font-size: 0.95rem">全部好友</span>
          <i class="shareTrand-arrow-right"></i>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="trendLine border-B">
        <div class="left_info"><span>转发对象</span></div>
        <div class="right_info">
          <i class="shareTrand-arrow-right"></i>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="trendLine border-B">
        <div class="left_info"><span>状态更新周期</span></div>
        <div class="right_info">
          <img src="./../../../static/plotimg/uibase_common_round_pre.png" alt="small" @click="reduce">
          <span class="condition-info">{{number}}</span>
          <img src="./../../../static/plotimg/uibase_common_round_next.png" alt="big" @click="increase">
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="trendLine border-B">
        <div class="left_info"><span>显示起始时刻</span></div>
        <div class="right_info">
          <bos-button @click.native="open('picker1')" size="mini" style="margin-top: 0.1rem;">选择起始时间</bos-button>
          <date-time-picker ref="picker1" v-model="value" @confirm="handleChange">
          </date-time-picker>
          <i class="shareTrand-arrow-right"></i>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="trendLine border-B">
        <div class="left_info"><span>清除历史时刻</span></div>
        <div class="right_info">
          <i class="shareTrand-arrow-right"></i>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import {DB} from '@/assets/js/db';
  export default{
    data(){
      return {
        number: this.$store.state.updateCycle
      }
    },
    methods: {
      goback(){
        this.$router.replace("/mePro")
      },
      reduce(){
        if(this.number!=1){
          this.number--;
        }
        this.updateDb(this.number);
      },
      increase() {
        this.number++;
        this.updateDb(this.number);
      },
      toTsChoice(){
        this.$router.replace("/mePro/tschoosesend");
      },
      updateDb(number){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{updateCycle: number},function(err){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('success');
          }
        });
        this.$store.state.updateCycle = number;
      }
    }
  }
</script>

<style>
  #shareTrend .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  #shareTrend .top span{
    position: absolute;
    left: 0;
  }
  /*img{
    width:20px;
    height: 20px;
    margin-bottom: -6px;
  }*/
  .border-B {
    border-bottom:1px solid gainsboro;
  }
  .trendLine{
    width: 94%;
    margin: 0 auto;
    height: 3rem;
    line-height: 3rem;
  }
  .left_info {
    float: left;
  }
  .right_info {
    float: right;
  }
  .right_info .bos-button span{
    font-size: 0.9rem;
    position: relative;
    top:0.1rem;
  }
  .clearfix {
    overflow: auto;
  }
  .shareTrand-arrow-right{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../static/plotimg/icon_list_indicator.png") no-repeat;
    background-size: 70%;
    position: relative;
    top: 0.9rem;
    right: -0.5rem;
  }
</style>
