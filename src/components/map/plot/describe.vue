<template>
  <div class="commom-box">
    <div class="plot-img-box message-box voice-box">
      <p>描述</p>
      <textarea v-model="description"></textarea>
      <bos-button type="primary" @click="toPhrase">格式化短语</bos-button>
    </div>
    <quit-post v-show="tempToggle"></quit-post>
    <quit-update v-show="!tempToggle"></quit-update>
    <!--<quit-post @plotSubmit="myPlot"></quit-post>-->
    <div class="phrase" v-show="phraseShow">
      <div class="top">
        详细资料
        <span class="back" @click="toDescript()"><i class="bos-icon-arrow-left" ></i>返回</span>
      </div>
      <p class="phrase-box">
        该地出现
        <bos-select  placeholder="选择障碍物" v-model="obstacles">
          <bos-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label"></bos-option>
        </bos-select>
        ，高/深 <input type="number" placeholder="高/深" v-model="height"/>
        ，宽 <input type="number" placeholder="宽度" v-model="width"/>，绕行
        <bos-select  placeholder="选择难度" v-model="diffty">
          <bos-option v-for="item in diffs" :key="item.value" :label="item.label" :value="item.label"></bos-option>
        </bos-select>
      </p>
      <div class="phrase-btn">
        <bos-button type="primary" @click="phraseBtn">确定</bos-button>
      </div>
    </div>
  </div>
</template>
<script>
  import quitPost from './quit-post.vue';
  import quitUpdate from './quit-update.vue';
  import * as actionTypes from "@/store/actions-types";
  export default{
    name:'describe',
    data(){
        return {
          phraseShow:false,
          options: [{
            value: '选项1',
            label: '铁丝网'
          }, {
            value: '选项2',
            label: '路障'
          }, {
            value: '选项3',
            label: '坍塌'
          }, {
            value: '选项4',
            label: '巨石'
          }],
          diffs: [{
            value: '选项1',
            label: '困难'
          }, {
            value: '选项2',
            label: '不可能'
          }, {
            value: '选项3',
            label: '容易'
          }],
          value: '',
          description: this.$store.state.plotInfo.descript,
          obstacles:'',
          height:'',
          width:'',
          diffty:'',
          uuid:undefined,
          plotObj:undefined,
          tempToggle :this.$store.state.tempToggle
        }
    },
    mounted(){
      //this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    updated(){
      this.$store.state.plotInfo.descript = this.description;
      console.log(this.$store.state.plotInfo.descript);
    },
    components:{
       quitPost,
       quitUpdate
      },
    methods:{
      toPhrase(){
        this.phraseShow=true;
      },
      toDescript(){
        this.phraseShow=false;
      },
      phraseBtn(){
        if(this.obstacles==''||this.height==''||this.width==''||this.diffty==''){
            alert("请填写完整");
        }else{
          this.phraseShow=false;
          this.description="该地出现"+this.obstacles+"，高/深"+this.height+"米，宽"+this.width+"米，绕行"+this.diffty;
        }
      },
    }
  }
</script>
<style>
  .voice-box .bos-button--primary{
    background:#e9efed;
    border-color:#e9efed;
    color:#000;
  }
  .voice-box textarea{
    width:90%;
    height:6rem;
    margin-left:.3rem;
    padding:4px;
    line-height:1.4rem;
    font-size:.9rem;
    font-family:"微软雅黑";
    background:#6b7150;
    resize:none;
  }
  .phrase{
    width:100%;
    height:100%;
    position:fixed;
    top:0;
    left:0;
    background:#fff;}
  .phrase>i{
    float:right;
    margin:5%;
  }
  .phrase-box{padding-top:10%;text-align:center;}
  .phrase-box .bos-select{width:8rem;}
  .phrase-box>input{
    width:3.4rem;
    text-indent:10px;
    border-bottom:solid 1px #999;
  }
  .phrase .phrase-btn{text-align:center;padding-top:3rem;}
  .phrase-btn .bos-button--primary {width:20%;}
</style>
