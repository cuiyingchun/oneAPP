<template>
  <div class="commom-box">
    <div class="plot-img-box message-box voice-box">
      <p>视频</p>
      <video width="55%" id="video-box1" v-if="$store.state.plotInfo.video"  :src="'http://localhost:3000/sdcard/'+$store.state.plotInfo.video" autoplay @click="fullScreen">
      </video>
      <video width="55%" id="video-box2" v-if="$store.state.plotInfo.videoReceive" :src="'http://localhost:3000/sdcard/'+$store.state.plotInfo.videoReceive" autoplay @click="fullScreen">
      </video>
      <br/>
      <bos-button type="primary" @click="pickCamera">录 制</bos-button>
      <br/>
      <bos-button type="primary" class="play-video" @click="playVideo">{{vedioMsg}}</bos-button>
    </div>
    <quit-post v-show="tempToggle"></quit-post>
    <quit-update v-show="!tempToggle"></quit-update>
    <div id="videoBoxPlot" style="display:none;" :style="{width:widthH+'px',height:heightH+'px'}">
      <video width="50%" id="videoCenterPlot" src=""></video>
      <i class="bos-icon-close"></i>
    </div>
  </div>
</template>
<script>
  import quitPost from './quit-post.vue';
  import quitUpdate from './quit-update.vue';
  export default{
    name:'shi',
    data(){
      return {
        tempToggle :this.$store.state.tempToggle,
        cameraName:undefined,
        vedioMsg:"播 放",
        widthH:window.screen.width,
        heightH:window.screen.height

      }
    },
    mounted(){
      if(this.$store.state.plotInfo.video){
        var video = document.getElementById("video-box1");
      }
      if(this.$store.state.plotInfo.videoReceive){
        var video = document.getElementById("video-box2");
      }
      if(video){
        setTimeout(function(){
          video.pause();
        },500);
      }
      $(".bos-icon-close").click(function(){
        $("#videoBoxPlot").hide();
        let videoO = document.getElementById("videoCenterPlot");
        videoO.pause();
      })
    },
    components:{
      quitPost,
      quitUpdate
    },
    methods:{
      pickCamera(){ /*video.duration*/
        let _this = this;
        GeoBOS.filePicker.pickCamera(function (err, cameraPath) {
          if(err){
            return console.log(err.message);
          }
          console.log('camera path:' + cameraPath);
          //_this.cameraName = cameraPath.substring(cameraPath.lastIndexOf("\/") + 1, cameraPath.length);
          _this.$store.state.plotInfo.video = cameraPath;
        });
      },
      playVideo(){
        let _this = this;
        if(this.$store.state.plotInfo.video){
          var video = document.getElementById("video-box1");
        }
        if(this.$store.state.plotInfo.videoReceive){
          var video = document.getElementById("video-box2");
        }
        if(video.paused){
          video.play();
          this.vedioMsg = "暂 停";
        }else{
          video.pause();
          this.vedioMsg = "播 放 ";
        }
        video.addEventListener('ended', function () {
          _this.vedioMsg = "播 放";
        }, false);
      },
      fullScreen(){
        if(this.$store.state.plotInfo.video){
          var video = document.getElementById("video-box1");
        }
        if(this.$store.state.plotInfo.videoReceive){
          var video = document.getElementById("video-box2");
        }
        let videoO = document.getElementById("videoCenterPlot");
        let oDiv = document.getElementById("videoBoxPlot");
        videoO.src = video.src;
        oDiv.style.display = "block";
        videoO.play();
        videoO.onclick=function(){
          if(videoO.paused){
            videoO.play();
          }else{
            videoO.pause();
          }
        }
      },
    }
  }
</script>
<style>
  :-webkit-full-screen video {
    width: 100%;
    height: 100%;
  }
  :-moz-full-screen video{
    width: 100%;
    height: 100%;
  }
  .voice-box .bos-button--primary{
    background:#e9efed;
    border-color:#e9efed;
    color:#000;
  }
  .bos-button.play-video{ margin-left:-3px;margin-top:20px;}
  .voice-box>img{
    width:60%;
    height:4rem;
    margin-bottom:1rem;
    border:solid 2px #fff;
    display:block;
    margin-left:32px;
  }
  #videoBoxPlot{
    background:#fff;
    position:absolute;
    top:-5px;
    left:-3.5rem;
    z-index:20004;
    overflow:hidden;
  }
  #videoBoxPlot #videoCenterPlot{margin-left:25%;}
  #videoBoxPlot .bos-icon-close{
    position:absolute;
    top:20px;
    left:20px;
  }
</style>
