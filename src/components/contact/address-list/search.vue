<template>
    <div>
        <div class="top_search">
          <div class="top">
            <span class="backname" @click="goback()"><i class="icon-back" @click="goback()"></i>返回</span>
            搜索
          </div>
          </div>
        <div class="content" style="margin-top: 3rem; position: relative">
         <div class="searchTitle" style="position: fixed; top: 3rem">
           <div class="selectType">
             <select name="type" id="type" @click="passId">
               <option value="id">姓名</option>
               <option value="nickName" checked>昵称</option>
               <option value="sipid">SipId</option>
             </select>
           </div>
           <div class="searchD">
             <!-- v-model="soso"-->
             <input type="text" placeholder="搜索" id="soso" class="searchI" v-model="soso">
           </div>
          <!-- ：display="!soso.value"-->
           <div class="sobutton" @click="search(soso)">
             <input type="button">搜索
           </div>
           <div class="clearfix"></div>
         </div>
          <div class="searchResult" style="position: fixed; top: 5.5rem">
            <span>搜索结果</span>
          </div>
          <div id="lastresule" style="position: fixed; top: 7.6rem; width: 96%; height: 13rem; overflow-y: scroll">
              <ul class="contact-ull" v-for="item in slist">
                <li @click="goSelfInfo(item)">
                  <a>
                    <img :src="'http://localhost:3000/sdcard/data/config/images/'+item.image" />
                    <span>{{item.position}}-{{item.nickName}}</span>
                  </a>
                </li>
              </ul>
          </div>
        </div>
    </div>
</template>
<script>
    import * as actionTypes from "@/store/actions-types";
    import $ from 'jquery';
    export default{
        data(){
            return {
                soso: '',
                slist:[],
                searchlist: [],
                searchId: 'id',
            }
        },
        mounted(){
          this.$store.dispatch(actionTypes.SET_IO_RECEIVER_LISTENER);
        },
        methods: {
            goback(){
              this.$router.replace("/address-list");
            },
            empty(){
              document.getElementById("soso").value="";
            },
            setSlist(arr) {
              this.slist = JSON.parse(JSON.stringify(arr));
            },
            passId(){
                var myselected = document.getElementById("type");
                let indexs = myselected.selectedIndex;
                this.searchId = myselected.options[indexs].value;
                console.log(this.searchId);
            },
          search(e) {
                console.log(e);
            if (e == ""){
                console.log("搜索不能为空");
                return;
            }else{
              this.setSlist(this.$store.state.currentUserAll);
              var v = e,
                self = this;
              self.searchlist = [];
              if (v) {
                var ss = [];
                // 过滤需要的数据
                self.slist.forEach(function (item) {
                  if (self.searchId == "id") {
                    if (item.id.indexOf(v) > -1) {
                      console.log(item.id)
                      console.log(item.nickName);
                      self.searchlist.push(item.id);
                      ss.push(item);
                    }
                  }else if (self.searchId == "nickName") {
                    if (item.nickName.indexOf(v) > -1) {
                        self.searchlist.push(item.nickName);
                      ss.push(item);
                    }
                  }else{
                    if (item.sipid.indexOf(v) > -1) {
                        self.searchlist.push(item.sipid);
                      ss.push(item);
                    }
                  }
                });
                this.setSlist(ss); // 将过滤后的数据给了slist
              } else {
                // 没有搜索内容，则展示全部数据
                this.setSlist();
              }
            }
          },
          goSelfInfo(selfInfo){
            console.warn(selfInfo);
            this.$router.push({name:'DetailInformation',params:{user:selfInfo}});
          }
        }
    }
</script>
<style>
  .top_search .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .top_search .top span{
    position: absolute;
    left: 0;
  }
    .searchTitle{
      width: 100%;
    }
    .selectType{
      margin: 4.5px 8px;
      width: 20%;
      float: left;
      position: relative;
      top: -0.01rem;
    }
    #type{
      background-color: #bbb;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      border-radius:5px;
      padding: 2px 35px;
      font-size: 16px;
      outline: none;
    }
    .searchD{
      float: left;
      width: 65%;
      margin: 3px 8px;
    }
    .searchI{
      border: 1px solid #999;
      height: 2rem;
      line-height: 2rem;
      width: 100%;
      border-radius:5px;
      padding-left: .2rem;
    }
    .sobutton{
      width: 8%;
      float: left;
      height: 2rem;
      line-height: 2rem;
      background-color:#6ec1ff;
      text-align: center;
      margin-top: 3px;
      padding:1px 5px;
      border-radius: 5px;
      color: #fff;
    }
    .clearfix {
      overfloat: auto;
      clear: both;
    }
    .searchResult{
      border: 1px solid #cfd3d6;
      width: 100%;
      height: 2rem;
      line-height: 2rem;
    }
    .searchResult span{
      display: block;
      width: 4rem;
      margin: 2px auto;
    }
</style>
