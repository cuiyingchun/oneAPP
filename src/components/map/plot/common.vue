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
  import Vue from 'vue';
  import $ from 'jquery';
  import plot from '@/assets/js/plotPicture'
  import quit from './quit.vue';
  import {DB} from '@/assets/js/db';
  import appService from '@/assets/js/service';
  export default{
    name:"common",
    data(){
      return {
        imgDate:[],
        plotPicture :undefined,
        imgCommonNum:[],
        ind:'',
      }
    },
    mounted(){
      this.$store.state.plotInfo.plotUrl = "";
      this.getCommon();
    },
    components:{
      quit
    },
    methods:{
      getCommon(){
          let _this = this;
        let query = {
          name:'imgCommon',
          moduleUser:this.$store.state.account.uniqueId
        };
        let dbPlot = new DB("plotMessage");
        dbPlot.queryConfig(query,function(err,res){
               if(err){
                   console.log("query error")
               }else{
                   for(let i=0;i<res.length;i++){
                     _this.imgCommonNum.push(res[i].count);
                     _this.imgDate.push(res[i].plotUrl)
                   }
               }
        })
      },
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
  .plot-img-box>p>img{
    border: 1px solid transparent;
  }
  .plot-active{
    background-color: transparent !important;
    border-color: rgba(0, 0, 0, 0.2) !important;
  }
</style>
