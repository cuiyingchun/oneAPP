<template>
  <div class="adhoc-ptt">
    <header class="pttHd" style="position: relative">
      <span @click="toMe"><i class="icon-back"></i>返回</span>
      数字对讲
    </header>
    <div class="pttCon">
      <p class="tapPtt">长按组播</p>
    </div>
    <!--<div>
      <i></i>
      <p>广播</p>
    </div>-->
  </div>
</template>
<script>
  import {DB} from '@/assets/js/db';
  import {mapFn} from '@/assets/js/utils';
  export default {
      name:'AdhocPtt',
     data(){
        return {
          myself:this.$store.state.account,
        }
     },
    mounted(){
         this.tapPtt();
    },
    methods:{
      toMe(){
        this.$router.replace("/me");
      },
      tapPtt(){
        let timeOutDiv;
        let _this = this;
        $(".pttCon").on({
          touchstart: function(e){
            $(this).css("backgroundColor","#01f5e9");
            timeOutDiv = setTimeout(function(){
                console.log("ptt开始---------------------");
                _this.pttStart();
            },2000);
            e.preventDefault();
          },
//          touchmove: function(){
//            clearTimeout(_this.timeOutDiv);
//            _this.timeOutDiv = 0;
//          },
          touchend: function(){
              clearTimeout(timeOutDiv);
              _this.pttStop();
              console.log("ptt结束---------------------");
              $(this).css("backgroundColor","#ccc");
              return false;
          }
        });
      },
      pttStart(){
        // 数字对讲
        let db = new DB('GroupMember');
        let ips = [];
        let _this = this;
        console.log("ptt1------------------------------");
        new Promise(function(resolve){
          db.queryAll(function(err,res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
//              console.log(res);
              for(let i=0;i<res.length;i++){
                if(_this.myself.sipid != res[i].sipid){
                  ips.push(res[i].sipid);
                }
              }
              console.warn(ips);
              resolve(ips);
            }
          })
        }).then(function(ips){
          let options;
//            for(let i=0;i<ips.length;i++){   //单对多
              options = {
                type: "Ip",
                destIp: "192.168.1.111"   //单对单
              };
              GeoBOS.adhoc.startPTT(options, function(err){
                if(err){
                  console.log("ptt开始错误----------------");
                  console.log(err);
                }else{
                  console.warn("startPTT success!");
                }
              });
//            }
        });
      },
      pttStop(){
        console.log("ptt2------------------------------");
        GeoBOS.adhoc.stopPTT(function(err){
          if(err){
            console.log("ptt结束错误----------------");
          }else{
            console.warn("stopPTT success!");
          }
        });
      }
    }
  }
</script>
<style>
  .adhoc-ptt .pttHd{
    text-align: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    background: url("../../../../static/images/im_header_bg.png") no-repeat;
    background-size: 100% 3rem;
    font-size: 1.2rem;
    color: #fff;
  }
  .adhoc-ptt .pttHd span{
    position: absolute;
    left: 0;
  }
  .adhoc-ptt .pttHd .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .adhoc-ptt{
    width:100%;
    height:100%;
    overflow:hidden;
  }
  .adhoc-ptt>.pttCon{
    width:160px;
    height:160px;
    background-color:#ccc;
    border-radius:80px;
    position:absolute;
    left:50%;
    top:50%;
    margin-left:-80px;
    margin-top:-80px;
  }
  .adhoc-ptt>.pttCon:active{ background:#2d8b56;}
  .adhoc-ptt>.pttCon>p{
   text-align:center;
    padding-top:160px;
  }
</style>
