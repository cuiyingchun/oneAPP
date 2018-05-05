<template>
  <div class="commom-box">
    <div class="plot-img-box message-box">
      <p>经度 <span>{{longitude}}</span></p>
      <p>纬度 <span>{{latitude}}</span></p>
      <ul class="message-listp">
        <li>
          <label>属性</label><span><i class="bos-icon-arrow-left" @click="arrowAttribute"></i>{{attribute}}<i class="bos-icon-arrow-right" @click="arrowAttribute"></i></span>
        </li>
        <li>
          <label>数量</label><span><i class="bos-icon-arrow-left" @click="arrowLeftN"></i>{{number}}<i class="bos-icon-arrow-right" @click="arrowRightN"></i></span>
        </li>
        <li>
          <label>兵种</label><span><i class="bos-icon-arrow-left" @click="arrowArms"></i>{{arms}}<i class="bos-icon-arrow-right" @click="arrowArms"></i></span>
        </li>
      </ul>
      <p>
        状态<br/>
        <bos-radio class="radio" v-model="radio" label="完整"></bos-radio>
        <bos-radio class="radio" v-model="radio" label="破损"></bos-radio>
      </p>
    </div>
    <quit-post v-show="tempToggle"></quit-post>
    <quit-update v-show="!tempToggle"></quit-update>
    <!--<quit-post @plotSubmit="myPlot"></quit-post>-->
  </div>
</template>
<script>
  import quitPost from './quit-post.vue';
  import quitUpdate from './quit-update.vue';
  import * as actionTypes from "@/store/actions-types";
  export default{
    name:"message",
    data(){
      return {
        longitude: this.$store.state.plotInfo.longitude,
        latitude: this.$store.state.plotInfo.latitude,
        attribute: this.$store.state.plotInfo.attribute,
        number: this.$store.state.plotInfo.number,
        arms: this.$store.state.plotInfo.arms,
        radio: this.$store.state.plotInfo.condition,
        tempToggle :this.$store.state.tempToggle
      }
    },
    components:{
      quitPost,
      quitUpdate
    },
    mounted(){
      //this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    updated(){
      this.$store.state.plotInfo.attribute = this.attribute;
      this.$store.state.plotInfo.number = this.number;
      this.$store.state.plotInfo.arms = this.arms;
      this.$store.state.plotInfo.condition = this.radio;
    },
    methods:{
      arrowAttribute(){
        if(this.attribute=='我'){
          this.attribute='敌';
        }else if(this.attribute=='敌'){
          this.attribute='友';
        }else if(this.attribute=='友'){
          this.attribute='中';
        }else if(this.attribute=='中'){
          this.attribute='我';
        }
      },
      arrowLeftN(){
        if(this.number!=0){
          this.number--;
        }
      },
      arrowRightN(){
        this.number++;
      },
      arrowArms(){
        if(this.arms=="空"){
          this.arms="海";
        }else if(this.arms=="海"){
          this.arms="陆";
        }else if(this.arms=="陆"){
          this.arms="空";
        }
      },
    }
  }
</script>
<style>
  .message-listp{
    color:#fff;
    padding:0 10px;
    border-bottom:solid 1px #999;
  }
  .message-listp>li{
    line-height:3rem;
  }
  .message-listp label{ width:21%;font-size:.9rem;display:inline-block;}
  .message-listp span{
    width:78%;
    height:2rem;
    line-height:2rem;
    color:#000;
    text-align:center;
    font-size:.9rem;
    background:#edeff5;
    border-radius:4px;
    display:inline-block;
  }
  .message-listp span i:nth-of-type(1){float:left;margin-top:8px;}
  .message-listp span i:nth-of-type(2){float:right;margin-top:8px;}
  .message-box .bos-radio+.bos-radio {margin-left:2rem;}
  .longitude,.latitude{display:none;}
</style>
