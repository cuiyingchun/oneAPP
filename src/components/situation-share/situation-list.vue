<template>
  <div>
    <div class="plot-box">
      <div class="tab-box">
        <div :class="{'activec':currentTab=='taishi'}" @click="toggleTab('taishi')"><a>态势</a></div>
      </div>
      <quit-situation :is="currentTab" keep-alive></quit-situation>
    </div>
  </div>
</template>
<script>
  import zone from '../map/zone';
  import Taishi from './situation';
  export default{
    name:"tslist",
    data () {
      return {
        currentTab: 'taishi',
      };
    },
    mounted(){
    },
    components:{

    },
    methods: {
      toggleTab: function(tab) {
        this.currentTab = tab;
      }
    }
  }
</script>
<style>
  .plot-box{
    width:38%;
    height:97%;
    padding:5px;
    position:absolute;
    top:0;
    left:0;
    background:#3d4425;
  }
  .tab-box{ width:3.5rem;}
  .tab-box>div{
    width:100%;
    height:3.4rem;
    text-align:center;
    line-height:3.4rem;
    color:#fff;
    background:#666c53;
    border-radius:8px 0 0 8px;
    margin-bottom:6px;
  }
  .tab-box>div.activec{background:#888e6b;}
</style>
