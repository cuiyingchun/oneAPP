<template>
  <div class="tab_content">
    <div class="top">
      <span @click="toMe"><i class="icon-back"></i>返回</span>
      通讯应用
    </div>
    <div class="avatar" style="margin-top: 3rem;position: fixed">
      <p><img :src="'http://localhost:3000/sdcard/data/config/images/'+currentAccount.image"></p>
    </div>
    <div class="person-list">
      <ul class="person-info">
        <li><i class="icon-nickname"></i><span>昵称：</span><span>{{currentAccount.nickName}}</span></li>
        <li><i class="icon-job"></i><span>职务：</span><span>{{currentAccount.position}}</span></li>
        <li><i class="icon-sex"></i><span>性别：</span><span>{{currentAccount.gender}}</span></li>
        <li><i class="icon-log"></i><span>日志打印：</span><span>关闭</span></li>
      </ul>
    </div>
          <div class="forbutton">
            <bos-button type="danger" class="logout" @click="exits">注销</bos-button>
          </div>
        </div>
</template>
<script>
  import {DB} from '@/assets/js/db';
    import * as actionTypes from "@/store/actions-types";
    export default{
        data(){
            return {
              currentAccount: this.$store.state.account
            }
        },
        methods: {
          toMe() {
            this.$router.replace("/me");
          },
          exits(){
            let _this = this;
            let dbInit = new DB("initMessage");
            GeoBOS.accounts.logout(function(err){
               if(err){
                  console.log('failed with:' + err.message);
               }else{
                 dbInit.update({autoLogin: true},{ $set: { autoLogin: false } }, { multi: true },function(err){
                   if(err){
                    console.log('failed with:' + err.message)
                   }else{
                    console.log('success');
                     viewer.entities.removeAll();
                     _this.$router.replace("/login");
                   }
                 });

               }
            });
          }
        }
    }
</script>

<style>
  .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .top span{
    position: absolute;
    left: 0;
  }
  .avatar{
    border-bottom: 8px solid #cfd3d6;
    background-color: #ffffff;
    width: 100%;
    padding:4px 0 12px;
    text-align: center;
  }
  .avatar>p{width:100%;text-align:center;height:3.4rem;position:relative;}
  .avatar img{
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    display:block;
    position:absolute;
    top:0;
    left:50%;
    margin-left:-2rem;
  }
  .person-list{
    width: 99.1%;
    overflow: hidden;
    position: fixed;
    top: 7.85rem;
    bottom: 2.75rem;
  }
  .person-list ul{
    background-color: #fff;
    list-style: none;
    padding: 0 0.9rem;
    margin-top: 0;
  }
  .person-list ul li{
    height: 3rem;
    line-height: 3rem;
    border-bottom: 1px solid #e9e9e9;
  }
  .person-list ul li i{
    padding-right: 0.2rem;
  }
  .person-list ul li span{
    font-size: .95rem;
    position: relative;
    top: .15rem;
  }
  .person-info{
    height: 96%;
    width: 99%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .person-info li i:nth-of-type(2){float:right;margin-right:10px;margin-top:8px;}
  .forbutton{
    width:100%;
    text-align: center;
    position:fixed;
    bottom: 0;
    background: #ebebeb;
    padding: 1%;
  }
  .logout{
    margin: 10px auto;
    width: 80%;
  }
  .icon-nickname{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_icon.png") no-repeat;
    background-size: 1.5rem;
    position: relative;
    top: .5rem;
    margin-right: .4rem;
  }
  .icon-job{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_icon_position.png") no-repeat;
    background-size: 1.5rem;
    position: relative;
    top: .5rem;
    margin-right: .4rem;
  }
  .icon-sex{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_icon_gender.png") no-repeat;
    background-size: 1.5rem;
    position: relative;
    top: .5rem;
    margin-right: .4rem;
  }
  .icon-log{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../../../static/images/im_icon_offline.png") no-repeat;
    background-size: 1.5rem;
    position: relative;
    top: .5rem;
    margin-right: .4rem;
  }
</style>
