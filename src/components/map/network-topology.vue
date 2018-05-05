<template>
  <div class="tools">
    <div class="top">
      <span @click="toTools"><i class="icon-back"></i>返回</span>
      网络拓扑
    </div>
    <div class="container">
      <div class="dot"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <svg id="lineWrap"></svg>
    </div>
    <div class="container container1">
      <div class="dot"></div>
      <div class="box1">1</div>
      <div class="box1">2</div>
      <div class="box1">3</div>
      <div class="box1">4</div>
      <div class="box1">5</div>
      <div class="box1">6</div>
      <div class="box1">7</div>
      <div class="box1">8</div>
      <div class="box1">9</div>
      <div class="box1">10</div>
      <div class="box1">11</div>
      <div class="box1">12</div>
      <div class="box1">13</div>
      <div class="box1">14</div>
      <div class="box1">15</div>
      <div class="box1">16</div>
      <div class="box1">17</div>
      <div class="box1">18</div>
      <div class="box1">19</div>
      <div class="box1">20</div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery';
  export default {
    name: 'NetworkTopology',
    data(){
      return {

      }
    },
    mounted(){
      this.networkTopology($(".container"),$(".box"),100);
      this.networkTopology($(".container"),$(".box1"),120);
      this.createLine();
      this.topologyLine()
    },
    methods: {
      toTools(){
        this.$router.replace("/tools")
      },
      networkTopology(Container, box, radius){
        //中心点横坐标
        let dotLeft = (Container.width() - $(".dot").width()) / 2;
        //中心点纵坐标
        let dotTop = (Container.height() - $(".dot").height()) / 2;
        //每一个BOX对应的角度;
        let avd = 360 / box.length;
        //每一个BOX对应的弧度;
        let ahd = avd * Math.PI / 180;
        //设置圆的中心点的位置
        $(".dot").css({"left": dotLeft, "top": dotTop});
        box.each(function (index, element) {
          $(this).css({
            "left": Math.sin((ahd * index)) * radius + dotLeft,
            "bottom": Math.cos((ahd * index)) * radius + dotTop
          });
        });
      },
      createLine(){
          if(this.$store.state.currentUser.arrNetwork.length){
            for (let i = 0; i < this.$store.state.currentUser.arrNetwork.length; i++) {
              let svg = document.getElementById("lineWrap");
              let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
              line.setAttribute('x1', "0");
              line.setAttribute('y1', "0");
              line.setAttribute('x2', "200");
              line.setAttribute('y2', "50");
              line.setAttribute('stroke', "#666");
              line.setAttribute('stroke-width', "2");
              line.setAttribute('id', "line" + i);
              svg.appendChild(line);
            }
          }
      },
      //获取元素左上角相对于某一元素的位置
      getElCoordinate(dom) {
        let t = dom.offsetTop;
        let l = dom.offsetLeft;
        let w = dom.offsetWidth;
        let h = dom.offsetHeight;
        dom = dom.offsetParent;
        while (!$(dom).hasClass('container')) {
          t += dom.offsetTop;
          l += dom.offsetLeft;
          dom = dom.offsetParent;
        }
        ;
        return {
          top: t,
          left: l,
          width: w,
          height: h
        };
      },
      getPos(pos1, pos2){
        //分四种情况
        let x1, y1, x2, y2;
        if (pos2.top < pos1.top) {
          //结束点位于左上角
          x1 = pos1.left + pos1.width / 2;
          y1 = pos1.top + pos1.height / 2;
          y2 = pos2.top + pos2.height / 2;
          if (pos2.left < pos1.left) {
            x2 = pos2.left + pos2.width / 2
            //x2 = pos2.left + pos2.width/2
          } else {//右上角
            x2 = pos2.left + pos2.width / 2
          }
        } else {
          x1 = pos1.left + pos1.width / 2;
          y1 = pos1.top + pos1.height / 2;
          x2 = pos2.left + pos2.width / 2;
          y2 = pos2.top + pos2.height / 2
        }
        return {
          start: {x: x1, y: y1},
          end: {x: x2, y: y2}
        }
      },
      move(box1, box2, num){
        let pos1 = this.getElCoordinate(box1);//起点div的位置
        let pos2 = this.getElCoordinate(box2);//终点div的位置
        let start = this.getPos(pos1, pos2).start;
        let end = this.getPos(pos1, pos2).end;
        $("#line"+num).attr({ x1:start.x, y1: start.y, x2: end.x, y2: end.y })
      },
      topologyLine(){
        let _this = this;
        if(this.$store.state.currentUser.arrNetwork.length){
          for(let i=0;i<this.$store.state.currentUser.arrNetwork.length;i++){
            _this.move($('.box')[_this.$store.state.currentUser.nodeNum],$(".box")[_this.$store.state.currentUser.arrNetwork[i]],i);
          }
        }
      }
    }
  }
</script>
<style>
  .container{
    width:300px;
    height:260px;
    position:relative;
    margin:60px auto 0;
  }
  .container1{
    position:absolute;
    top:0;
    left:50%;
    margin-left:-150px;
  }
  .box,.box1{
    position:absolute;
    width:20px;
    height:20px;
    line-height:20px;
    background:#999;
    border-radius:50%;
    z-index:10;
  }
  .box1{
    color:#999;
    background:#fff;
    font-size:.8rem;
    text-align:center;
  }
  .dot{
    position:absolute;
    width:10px;
    height:10px;
  }
  #lineWrap{
    position: absolute;
    left:0;
    top:0;
    overflow:visible;
  }
</style>
