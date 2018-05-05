<template>
    <div class="remote-control">
        <div class="top">
          <span @click="goback"><i class="icon-back"></i>返回</span>
          远程控制
          <i class="refresh" style="font-style:normal;">刷新</i>
        </div>
        <div class="content" style="margin-top: 3rem">
          <bos-table :data="tableData" style="width: 100%">
            <bos-table-column prop="number" label="序号" class="tablewidth"></bos-table-column>
            <bos-table-column prop="name" label="名称" class="tablewidth"></bos-table-column>
            <bos-table-column prop="job" label="角色" class="tablewidth"></bos-table-column>
            <bos-table-column prop="safeNumber" label="安全等级" class="tablewidth"></bos-table-column>
          </bos-table>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
              tableData: [{
                number: '1',
                name: '王小虎',
                job: '连',
                safeNumber: '2'
              }, {
                number: '2',
                name: '王小虎',
                job: '连',
                safeNumber: '2'
              }, {
                number: '3',
                name: '王小虎',
                job: '连',
                safeNumber: '2'
              }, {
                number: '4',
                name: '王小虎',
                job: '连',
                safeNumber: '2'
              }]
            }
        },
        methods: {
            goback(){
              this.$router.replace("/handle")
            }
        }
    }
</script>

<style>
  .icon-back {
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .top span{
    position: absolute;
    left: 0;
  }
  .refresh{
    display: inline-block;
    width: 2rem;
    height: 1.7rem;
    position: absolute;
    right: 1.2rem;
  }
  .tablewidth{
    width: 25%;
    text-align: center;
  }
</style>
