<template>
  <div class="commom-box">
    <div class="plot-img-box message-box voice-box">
      <p>音频</p>
      <p id="voiceTip"></p>
      <p v-if="$store.state.plotInfo.audio">{{$store.state.plotInfo.audio}}</p>
      <p v-if="$store.state.plotInfo.audioReceive">{{$store.state.plotInfo.audioReceive}}</p>
      <bos-button type="primary" @click="turnon">开始录音</bos-button>
      <br/>
      <bos-button type="primary" class="stop-voice" @click="turnoff">结束录音</bos-button>
      <br/>
      <bos-button type="primary" class="play-voice" @click="audioPlay">开始播放</bos-button>
    </div>
    <quit-post v-show="tempToggle"></quit-post>
    <quit-update v-show="!tempToggle"></quit-update>
  </div>
</template>
<script>
  import quitPost from './quit-post.vue';
  import quitUpdate from './quit-update.vue';
  export default{
    name:'voice',
    data(){
      return {
        audioPath:"",
        tempToggle :this.$store.state.tempToggle,
        recordInstance:undefined
      }
    },
    components:{
      quitPost,
      quitUpdate
    },
    methods:{
      audioPlay(){
          let _this = this;
          if(this.audioPath){
            var options = {
              src: "/sdcard" + _this.audioPath
            };
          }else if(this.$store.state.plotInfo.audio){
            var options = {
              src: "/sdcard" + _this.$store.state.plotInfo.audio,
            };
          }else if(this.$store.state.plotInfo.audioReceive){
            var options = {
              src: "/sdcard" + _this.$store.state.plotInfo.audioReceive,
            };
          }

        var sound =  GeoBOS.media.AudioPlayer.getInstance(options);
        sound.on('end', function () {
          console.log('Finished!');
        });
        sound.load();
        sound.play();
      },
      turnon(){
        let _this = this;
        GeoBOS.media.AudioRecorder.getInstance((err, recorder) => {
          if (err) {
            return console.log(err.message);
          }
          _this.recordInstance = recorder;

          //监听所有异常事件
          recorder.on('error', function (err) {
            var result = document.getElementById('voiceTip');
            console.log('error:' + err.message);
            result.innerHTML += '监听事件异常' + err.message
          });
          //监听开始录音事件
          recorder.on('start', function () {
            console.log('start:');
          });
          //监听停止录音事件
          recorder.on('stop', function (filePath) {
            _this.audioPath = filePath;
            _this.$store.state.plotInfo.audio = filePath;
          });
          //开始录音
          _this.recordInstance.record()
        })
      },
      turnoff(){
        this.recordInstance.stop();
      }
    }
  }
</script>
<style>
  .voice-box .bos-button--primary{
    background:#e9efed;
    border-color:#e9efed;
    color:#000;
  }
  .bos-button.stop-voice{margin-top:20px;}
  .bos-button.play-voice{margin-left:-3px;margin-top:20px;}
</style>
