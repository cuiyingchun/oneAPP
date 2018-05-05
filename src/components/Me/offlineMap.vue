<template>
    <div id="shareTrend">
        <div class="top">
          <span><i class="icon-back" @click="goback()"></i>返回</span>
            离线地图
        </div>
        <div class="content" style="margin-top: 3rem">
          <div class="address-line">
            <span>北京（矢量）</span>
          </div>
          <div class="address-line">
            <span>石家庄（矢量）</span>
          </div>
          <div class="address-line">
            <span>石家庄（影像）</span>
          </div>
        </div>
    </div>

</template>
<script>
    export default{
        data(){
            return {}
        },
        methods: {
            goback(){
              this.$router.replace("/mePro")
            }
        }
    }
</script>

<style>
  .address-line{
    width: 94%;
    margin: 0 auto;
    border-bottom: 1px solid #e4e4e4;
    height: 3rem;
    line-height: 3rem;
  }
</style>
