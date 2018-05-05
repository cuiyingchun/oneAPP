<template>
  <div class="commom-box">
    <div class="plot-img-box">
      <p v-for="(item, index) in imgDate">
        <img :src="item" :class="{'plot-active':ind === index}" @click="plot(item, index)"/>
      </p>
    </div>
    <quit></quit>
  </div>
</template>
<script>
  import quit from './quit.vue';
  import plot from '@/assets/js/plotPicture'
  export default{
    name:"common",
    data(){
      return {
        imgDate:[],
        plotPicture :undefined,
        ind: ''
      }
    },
    mounted(){
      this.$store.state.plotInfo.plotUrl = "";
      for(let i=1;i<91;i++){
        this.imgDate.push("./static/plotimg/fixed/fixed-"+i+".png");
      }
      for(let i=1;i<166;i++){
        this.imgDate.push("./static/plotimg/doodle/doo-"+i+".png");
      }
    },
    components:{
      quit
    },
    methods:{
      plot(item, index){
        this.ind = index;
        if(this.$store.state.plotInfo.plotUrl == ""){
        this.newPlot(item);
        }else if(this.$store.state.plotInfo.plotUrl != item){
          this.plotPicture.destroy();
          this.newPlot(item);
        }
      },
      newPlot(item){
        this.plotPicture = new plot.PlotPicture(item);
        this.$store.state.plotInfo.plotUrl = item;
        this.$store.state.plotView.plotPicture = this.plotPicture;
      }
    },
    beforeDestroy(){
      if(this.plotPicture){
        this.plotPicture.destroy();
      }
    }
  }
</script>
<style>

</style>
