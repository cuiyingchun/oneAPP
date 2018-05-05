<template>
    <div class="tools">
        <div class="top">
          <span @click="goback"><i class="icon-back"></i>返回</span>
          辅助工具
        </div>
        <div class="content" style="margin-top: 3rem">
           <div class="tools-line border-B">
             <div class="left_info">
               <span @click="toMeasureDistance">折线距离测量</span>
             </div>
             <div class="right_info">
               <i tools-arrow-right></i>
             </div>
             <div class="clearfix"></div>
           </div>
          <div class="tools-line border-B">
            <div class="left_info">
              <span @click="toMeasureCircle">圆面积测量</span>
            </div>
            <div class="right_info">
              <i tools-arrow-right></i>
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="tools-line border-B">
            <div class="left_info">
              <span @click="toMeasurePolygon">多边形面积测量</span>
            </div>
            <div class="right_info">
              <i tools-arrow-right></i>
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="tools-line border-B">
            <div class="left_info">
              <span @click="toMeasureAngle">角度测量</span>
            </div>
            <div class="right_info">
              <i tools-arrow-right></i>
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="tools-line border-B">
          <div class="left_info">
            <span>战术计算</span>
          </div>
          <div class="right_info">
            <i tools-arrow-right></i>
          </div>
          <div class="clearfix"></div>
        </div>
          <div class="tools-line border-B">
            <div class="left_info">
              <span @click="NetworkTopology">网络拓扑</span>
            </div>
            <div class="right_info">
              <i class="tools-arrow-right"></i>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
    </div>
</template>
<script>
    export default{
      data(){
        return {
        }
      },
        methods: {
          goback(){
            this.$router.replace("/handle")
          },
          toMeasureDistance(){
            this.$router.push({name: 'Measure', params: {distance:true}});
          },
          toMeasureAngle(){
            this.$router.push({name: 'Measure', params: {angle:true}});
          },
          toMeasureCircle(){
            this.$router.push({name: 'Measure', params: {circle:true}});
          },
          toMeasurePolygon(){
            this.$router.push({name: 'Measure', params: {polygon:true}});
          },
          NetworkTopology(){
              this.$router.replace("/networkTopology");
          }
        }
    }
</script>

<style>
  .tools .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .tools .top span{
    position: absolute;
    left: 0;
  }
  .content{
    margin-top: 0;
  }
  .border-B {
    border-bottom:1px solid gainsboro;
  }
  .tools-line{
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
  .clearfix {
    overfloat: auto;
  }
  .cell{
    text-align: center;
  }
  .tools-arrow-right{
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
