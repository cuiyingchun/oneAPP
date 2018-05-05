<template>
    <div class="message-reminder">
        <div class="top">
          <span><i class="icon-back" @click="goback()"></i>返回</span>
            信息提示
        </div>
        <div class="content" style="margin-top: 3rem">
            <div class="titleLine border-B">
              <span>紧急救援求助提示</span>
            </div>
          <div class="infoLine border-B">
            <div class="left_info">提示灯</div>
            <div class="right_info">
              <bos-switch v-model="rescueRemind.lamp" class="nextBottom" @change="toggleSetting"></bos-switch>
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="infoLine border-B">
            <div class="left_info">震动</div>
            <div class="right_info">
              <bos-switch v-model="rescueRemind.vibrate" class="nextBottom" @change="toggleSetting"></bos-switch>
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="infoLine">
            <div class="left_info">提示音</div>
            <div class="right_info">
              <bos-switch v-model="rescueRemind.sound" class="nextBottom" @change="toggleSetting"></bos-switch>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="titleLine border-B">
          <span>态势申请提示</span>
        </div>
        <div class="infoLine border-B">
          <div class="left_info">提示灯</div>
          <div class="right_info">
            <bos-switch v-model="situationRemind.lamp" class="nextBottom" @change="toggleSetting"></bos-switch>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="infoLine border-B">
          <div class="left_info">震动</div>
          <div class="right_info">
            <bos-switch v-model="situationRemind.vibrate" class="nextBottom" @change="toggleSetting"></bos-switch>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="infoLine">
          <div class="left_info">提示音</div>
          <div class="right_info">
            <bos-switch v-model="situationRemind.sound" class="nextBottom" @change="toggleSetting"></bos-switch>
          </div>
          <div class="clearfix"></div>
        </div>
      <div class="titleLine border-B">
        <span>引导申请提示</span>
      </div>
      <div class="infoLine border-B">
        <div class="left_info">提示灯</div>
        <div class="right_info">
          <bos-switch v-model="guideRemind.lamp" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="infoLine border-B">
        <div class="left_info">震动</div>
        <div class="right_info">
          <bos-switch v-model="guideRemind.vibrate" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="infoLine">
        <div class="left_info">提示音</div>
        <div class="right_info">
          <bos-switch v-model="guideRemind.sound" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      <!--<div class="titleLine border-B">
        <span>略图调制提示</span>
      </div>
      <div class="infoLine border-B">
        <div class="left_info">提示灯</div>
        <div class="right_info">
          <bos-switch v-model="sketchRemind.lamp" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="infoLine border-B">
        <div class="left_info">震动</div>
        <div class="right_info">
          <bos-switch v-model="sketchRemind.vibrate" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="infoLine">
        <div class="left_info">提示音</div>
        <div class="right_info">
          <bos-switch v-model="sketchRemind.sound" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>-->
      <div class="titleLine border-B">
        <span>威胁告警提示</span>
      </div>
      <div class="infoLine border-B">
        <div class="left_info">提示灯</div>
        <div class="right_info">
          <bos-switch v-model="alarmRemind.lamp" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="infoLine border-B">
        <div class="left_info">震动</div>
        <div class="right_info">
          <bos-switch v-model="alarmRemind.vibrate" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="infoLine border-B">
        <div class="left_info">红色警告提示音</div>
        <div class="right_info">
          <bos-switch v-model="alarmRemind.red" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="infoLine border-B">
        <div class="left_info">橙色警告提示音</div>
        <div class="right_info">
          <bos-switch v-model="alarmRemind.orange" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="infoLine border-B">
        <div class="left_info">黄色警告提示音</div>
        <div class="right_info">
          <bos-switch v-model="alarmRemind.yellow" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="infoLine">
        <div class="left_info">蓝色警告提示音</div>
        <div class="right_info">
          <bos-switch v-model="alarmRemind.blue" class="nextBottom" @change="toggleSetting"></bos-switch>
        </div>
        <div class="clearfix"></div>
      </div>
      </div>

</template>
<script>
  import {DB} from '@/assets/js/db';
    export default{
      data(){
        return {
          //紧急救援救助提示
          rescueRemind:{
            lamp:this.$store.state.remind.rescueRemind.lamp,
            vibrate:this.$store.state.remind.rescueRemind.vibrate,
            sound:this.$store.state.remind.rescueRemind.sound
          },
          //态势申请提示
          situationRemind:{
            lamp:this.$store.state.remind.situationRemind.lamp,
            vibrate:this.$store.state.remind.situationRemind.vibrate,
            sound:this.$store.state.remind.situationRemind.sound
          },
          //引导申请提示
          guideRemind:{
            lamp:this.$store.state.remind.guideRemind.lamp,
            vibrate:this.$store.state.remind.guideRemind.vibrate,
            sound:this.$store.state.remind.guideRemind.sound
          },
          //略图调制提示
          sketchRemind:{
            lamp:this.$store.state.remind.sketchRemind.lamp,
            vibrate:this.$store.state.remind.sketchRemind.vibrate,
            sound:this.$store.state.remind.sketchRemind.sound
          },
          //威胁告警提示
          alarmRemind:{
            lamp:this.$store.state.remind.alarmRemind.lamp,
            vibrate:this.$store.state.remind.alarmRemind.vibrate,
            red:this.$store.state.remind.alarmRemind.red,
            orange:this.$store.state.remind.alarmRemind.orange,
            yellow:this.$store.state.remind.alarmRemind.yellow,
            blue:this.$store.state.remind.alarmRemind.blue
          }
        }
      },
        methods: {
          goback(){
            this.$router.replace("/mePro")
          },
          toggleSetting(){
            let _this = this;
            let dbInit = new DB("initMessage");
            dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{
                $set: {
                  "remind.rescueRemind.lamp": _this.rescueRemind.lamp, "remind.rescueRemind.vibrate": _this.rescueRemind.vibrate,"remind.rescueRemind.sound": _this.rescueRemind.sound,
                  "remind.situationRemind.lamp": _this.situationRemind.lamp, "remind.situationRemind.vibrate": _this.situationRemind.vibrate,"remind.situationRemind.sound": _this.situationRemind.sound,
                  "remind.guideRemind.lamp": _this.guideRemind.lamp, "remind.guideRemind.vibrate": _this.guideRemind.vibrate,"remind.guideRemind.sound":  _this.guideRemind.sound,
                  "remind.sketchRemind.lamp": _this.sketchRemind.lamp, "remind.sketchRemind.vibrate": _this.sketchRemind.vibrate,"remind.sketchRemind.sound": _this.sketchRemind.sound,
                  "remind.alarmRemind.lamp": _this.alarmRemind.lamp, "remind.alarmRemind.vibrate": _this.alarmRemind.vibrate,"remind.alarmRemind.red": _this.alarmRemind.red,"remind.alarmRemind.orange": _this.alarmRemind.orange,"remind.alarmRemind.yellow": _this.alarmRemind.yellow,"remind.alarmRemind.blue": _this.alarmRemind.blue
                }
              },
              {},function(err){
              if(err){
                console.log('failed with:' + err.message)
              }else{
                console.log('success');
              }
            });
            //紧急救援救助提示
            this.$store.state.remind.rescueRemind.lamp = this.rescueRemind.lamp;
            this.$store.state.remind.rescueRemind.vibrate = this.rescueRemind.vibrate;
            this.$store.state.remind.rescueRemind.sound = this.rescueRemind.sound;
            //态势申请提示
            this.$store.state.remind.situationRemind.lamp = this.situationRemind.lamp;
            this.$store.state.remind.situationRemind.vibrate = this.situationRemind.vibrate;
            this.$store.state.remind.situationRemind.sound = this.situationRemind.sound;
            //引导申请提示
            this.$store.state.remind.guideRemind.lamp = this.guideRemind.lamp;
            this.$store.state.remind.guideRemind.vibrate = this.guideRemind.vibrate;
            this.$store.state.remind.guideRemind.sound = this.guideRemind.sound;
            //略图调制提示
            this.$store.state.remind.sketchRemind.lamp = this.sketchRemind.lamp;
            this.$store.state.remind.sketchRemind.vibrate = this.sketchRemind.vibrate;
            this.$store.state.remind.sketchRemind.sound = this.sketchRemind.sound;
            //威胁告警提示
            this.$store.state.remind.alarmRemind.lamp = this.alarmRemind.lamp;
            this.$store.state.remind.alarmRemind.vibrate = this.alarmRemind.vibrate;
            this.$store.state.remind.alarmRemind.red = this.alarmRemind.red;
            this.$store.state.remind.alarmRemind.orange = this.alarmRemind.orange;
            this.$store.state.remind.alarmRemind.yellow = this.alarmRemind.yellow;
            this.$store.state.remind.alarmRemind.blue = this.alarmRemind.blue;
          }
        }
    }
</script>

<style>
  .infoLine{
    width:94%;
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
  .message-reminder .right_info span{
    font-size:0.95rem;
  }
  .clearfix {
    overflow: auto;
  }
  .titleLine{
    height: 3rem;
    line-height: 3rem;
    background-color: #e4e4e4;
    padding-left: 10px;
  }
  .border-B {
    border-bottom:1px solid gainsboro;
  }
  .bos-switch{
    display: inline-block;
    float: right;
    height: 2.2rem;
    top:.5rem;
  }
  .message-reminder .bos-switch__core{
    border-color: #d1d1d1;
    background-color: #d1d1d1;
  }
  .message-reminder .bos-switch__input:checked+.bos-switch__core{
    border-color: #9ee75a;
    background-color: #9ee75a;
  }
</style>
