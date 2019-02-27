<template>
  <div class="ita-toast" v-show="show"
       :class="{'middle':position==='middle', 'top': position === 'top'}">
    <span>{{ msg }}</span></div>
</template>

<!--<script>-->
  <!--export default {-->
    <!--name: "toast",-->
    <!--data() {-->
      <!--return {-->
        <!--msg: '',-->
        <!--duration: 2000-->
      <!--}-->
    <!--},-->
    <!--methods: {-->

    <!--}-->
  <!--}-->
<!--</script>-->

<style scoped lang="scss">
  .ita-toast {
    position: fixed;
    bottom: 250px;
    left: 50%;
    max-width: 650px;
    padding: 26px 32px;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
    @include fontLight();
    font-size: 28px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: 28px;
    background: rgba(0,0,0,0.80);
    border-radius: 4px;
    z-index: 1000;
  }
  .ita-toast.middle{
    bottom: calc(50% - 40px);
    left: 50%;
  }
  .ita-toast.top{
    bottom: auto;
    left: 50%;
    top: 250px;
  }
  .fadein {
    animation: animate_in 0.25s;
  }
  .fadeout {
    animation: animate_out 0.25s;
    opacity: 0;
  }
  @keyframes animate_in {
    0% {
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  @keyframes animate_out {
    0% {
      opacity: 1;
    }
    100%{
      opacity: 0;
    }
  }
</style>
