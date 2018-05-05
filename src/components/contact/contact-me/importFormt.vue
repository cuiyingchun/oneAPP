<template>
  <div class="tm">
    <header class="hd"><span @click="toCommunication"><i class="icon-back"></i>返回</span><h1>模板消息</h1></header>
    <div class="contact-group" v-if="investigation.length">
      <div class="contact-list" @click="checkUserF()">
        <p>
          <i v-bind:class="{'bos-icon-caret-right':!caretFlatF,'bos-icon-caret-bottom':caretFlatF}"></i>
          <span>侦察类</span>
        </p>
      </div>
      <i class="bos-icon-more" @click="showChoice3"></i>
      <ul class="contact-ull" v-show="isShowF">
        <li v-for="item in investigation">{{item.name}}</li>
        <!--<li>天气状况</li>-->
      </ul>
    </div>
    <!--<div class="contact-group">
      <div class="contact-list" @click="checkUserX()">
        <p>
          <i v-bind:class="{'bos-icon-caret-right':!caretFlatX,'bos-icon-caret-bottom':caretFlatX}"></i>
          <span>协同类</span>
        </p>
      </div>
      <i class="bos-icon-more" @click="showChoice3"></i>
      <ul class="contact-ull" v-show="isShowX">
        <li>测试模板3</li>
      </ul>
    </div>-->
    <div class="leadin" @click="importFot()">
      <div class="leadin-btn">
        导入格式短语
      </div>
    </div>
  </div>
</template>

<script>
  import * as actionTypes from "@/store/actions-types";
  import {DB} from "@/assets/js/db"
  import {otherFn} from '@/assets/js/utils';
  export default {
    data () {
      return {
        caretFlatF: false,
        caretFlatX: false,
        isShowF: false,
        isShowX: false,
        templateName: '',
        investigation:[]
      }
    },
    mounted(){
      otherFn.importTemplate(this.investigation);
      this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
    },
    methods: {
      toCommunication(){
        this.$router.replace("/me");
      },
      checkUserF(){
        if(!this.caretFlatF){
          this.caretFlatF=true;
          this.isShowF=true;
        }else{
          this.caretFlatF=false;
          this.isShowF=false;
        }
      },
      checkUserX(){
        if(!this.caretFlatX){
          this.caretFlatX=true;
          this.isShowX=true;
        }else{
          this.caretFlatX=false;
          this.isShowX=false;
        }
      },
      importFot(){
          let _this = this;
          GeoBOS.filePicker.pickFile(function (err, filePath) {
            if(err){
              return console.log(err.message);
            }
            console.log("导入模板");
            console.log(filePath);
            let filename=filePath[0].substring(filePath[0].lastIndexOf("/")+1,filePath[0].length);
            var formt = {
              type:"template",
              name:filename,
              filePath:filePath[0],
              moduleUser: _this.$store.state.account.uniqueId,
            };
              _this.investigation.push(formt);
            let dbInit = new DB("initMessage");
            dbInit.insert(formt, function (err) {
              if (err) {
                console.log('failed with:' + err.message);
              } else {
                console.log("template is successfull")
              }
            })
          });
      }
    }
  }
</script>

