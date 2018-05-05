<template>
  <div class="commom-box">
    <div class="plot-img-box message-box">
      <p>图片</p>
      <ul class="picture-box">
        <li>
          <a href="javascript:;" class="take-photo">拍照
            <input class="photo-input" type="file" accept="image/*" capture="camera" />
          </a>
        </li>
        <li v-if="photoPathSend">
          <img :src="photoPathSend" />
        </li>
        <li v-if="photoPathRec">
          <img :src="photoPathRec" />
        </li>
      </ul>
    </div>
    <quit-post v-show="tempToggle"></quit-post>
    <quit-update v-show="!tempToggle"></quit-update>
  </div>
</template>
<script>
  import $ from 'jquery';
  import quitUpdate from './quit-update.vue';
  import quitPost from './quit-post.vue';
  export default{
    name:'photo',
    data(){
      return {
        photoPathSend: this.$store.state.plotInfo.pictrue,
        photoPathRec: this.$store.state.plotInfo.pictrueReceive,
        tempToggle :this.$store.state.tempToggle
      }
    },
    components:{
      quitPost,
      quitUpdate
    },
    mounted(){
        console.log("拍照");
        console.log(this.photoPathSend);
        console.log(this.photoPathRec);
        this.takePhoto();
    },
    updated(){
      this.$store.state.plotInfo.pictrue = this.photoPathSend;
      this.$store.state.plotInfo.pictrueReceive = this.photoPathRec;
    },
    methods:{
      takePhoto() {
        let _this = this;
        $(".take-photo").on("change","input[type='file']",function(){
          let filePath=$(this).val();
          if(filePath.indexOf("jpg")!=-1 || filePath.indexOf("png")!=-1){
            let arr=filePath.split('\\');
            let fileName=arr[arr.length-1];
            _this.photoPathSend = "http://localhost:3000/sdcard/Camera/"+fileName;
          }else{
            console.log("拍照上传有误，请重新拍照");
            return false;
          }
        })
      },
    }
  }
</script>
<style>
  .bos-button{padding:10px 0;}
  .picture-box{padding:0 7px;position: relative;top:-2.8rem;}
  .picture-box li{width:100%;overflow:hidden;margin-bottom:16px;}
  .picture-box li:nth-of-type(1){position: relative;top:2.65rem;}
  .picture-box li>img{
    width:60%;
    height: 4rem;
    border:solid 2px #fff;
    display:inline-block;
    float:left;
    margin-bottom: 0.2rem;
  }
  .take-photo{
    padding: 4px 10px;
    height: 20px;
    line-height: 20px;
    position: relative;
    right: 2px;
    float: right;
    background:#e9efed;
    border-color:#e9efed;
    border-radius: 3px;
    text-decoration: none;
    color: #000;
  }
  .photo-input{
    width: 3.3rem;
    position: absolute;
    overflow: hidden;
    right: 0;
    top: 0;
    opacity: 0;
  }
</style>
