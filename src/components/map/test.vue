<template>
  <div>
      <!--<div class="all-input-myself">
        <span>自己的IP：</span>
        <input name="ip1" class="ip-input" type="text" @blur="validates" v-model="ip1"/>
      </div>-->
   <!--对方的IP：-->
      <!--<div class="all-input-other">
        <span>对方的IP：</span>
        <input name="ip1-other" class="ip-input" type="text" @blur="validates" v-model="ip2"/>
      </div>-->
      <div class="pos-myself">
        <span>自己的位置（经纬度）：</span>
        <button @click="myFix">定位</button>
        <span>&nbsp;&nbsp;{{nowPoint.longitude}}&nbsp;&nbsp;{{nowPoint.latitude}}</span>
      </div>
      <div>
        <button style="margin-left: 20px;margin-top: 10px;" @click="dropDbAll">清空所有数据库</button>
      </div>
      <button style="margin-left: 20px;" class="back" @click="backH">返回</button>
    </div>
</template>
<script>
  import $ from 'jquery';
  import Vue from 'vue'
  import {DB} from '@/assets/js/db';
  export default{
      name:"Test",
      data(){
          return{
              ipArr:[],
              ip1:"",
              ip2:"",
              nowPoint:{
                longitude:undefined,
                latitude:undefined,
              }
          }
      },
     mounted(){
          if(this.$store.state.nowPoint.longitude && this.$store.state.nowPoint.latitude){
              this.nowPoint.longitude = this.$store.state.nowPoint.longitude;
              this.nowPoint.latitude = this.$store.state.nowPoint.latitude;
          }
          if(this.$store.state.myIP){
            this.ip1 = this.$store.state.myIP;
          }
         if(this.$store.state.otherIP){
           this.ip2 = this.$store.state.otherIP;
         }
     },
     methods:{
       validates(){
          this.$store.state.myIP = this.ip1;
          this.$store.state.otherIP = this.ip2;
        },
       myFix(){
         this.$store.state.isFix = true;
         this.$router.replace('/handle');
       },
       dropDbAll(){
         let _this = this;
         let db1 = new DB('plotMessage');
         let db2 = new DB('Message');
//         let db3 = new DB('initMessage');
         let db4 = new DB('Group');
         db1.queryConfig({name:'img'},function(err, res){
           if(err){
             console.log('failed with:' + err.message)
           }else {
             for(let i = 0; i < res.length; i++){
              viewer.entities.removeById(res[i].uuid);
              }
             db1.remove({ name: 'img' }, { multi: true }, function (err) {
               if(err){
                 _this.$message.error('数据库删除失败，请重试');
               }else{
                 console.log("plotMessage img remove");
               }
             });
           }
         });
         db2.drop(function(err,res){
             if(err){
               _this.$message.error('数据库删除失败，请重试');
             }else{
               console.log("Message img remove");
             }
         });
//         db3.drop(function(err,res){
//           if(err){
//             _this.$message.error('数据库删除失败，请重试');
//           }else{
//             console.log("initMessage removed");
//           }
//         })
         db4.drop(function(err){
           if(err){
             _this.$message.error('数据库删除失败，请重试');
           }else{
             console.log("Message img remove");
           }
         });
       },
       backH(){
         this.$router.replace('/handle');
       }
     }
  }
</script>
<style>
  .ip-input  { width:10rem; height:1.6rem; font:normal 12px 宋体; color:#000; border-bottom:1px solid black; text-align:center; position:relative; top:1px; }
  .all-input-myself,.all-input-other  { width:34em; height:5em; font:normal 8px 宋体; color:#000; }
  .all-input-myself>span,.all-input-other>span{font-size:16px;}
  .pos-myself>span{ font-size: 16px;}
  button{ padding:3px; border:1px solid black;}
  .back{position:relative;top:1em;}
</style>
