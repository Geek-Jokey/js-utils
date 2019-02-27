<template>
  <section class="ita-msg-box" v-show="show">
    <div class="panel">
      <div class="panel-hd"></div>
      <div class="panel-bd">
        <p class="content">{{ content }}</p>
      </div>
      <div class="panel-ft">
        <span @click="cancel()" :class="[ cancelButtonClass ]">{{cancelButtonText}}</span>
        <span @click="confirm()" :class="[ confirmButtonClass ]">{{confirmButtonText}}</span>
      </div>
    </div>
  </section>
</template>

<!--<script>-->
  <!--export default {-->
    <!--name: "ita-msg-box",-->
    <!--data() {-->
      <!--return {-->
        <!--content: ''-->
      <!--}-->
    <!--},-->
    <!--methods: {-->
      <!--cancel() {-->

      <!--},-->
      <!--confirm() {-->

      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<style scoped lang="scss">
  .ita-msg-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.6);
    display: flex;
    align-items: center;
    justify-content: center;

    .panel {
      width: 500px;
      background: #ffffff;
      .panel-bd {
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        @include fontMedium();
        font-size: 32px;
        color: #222222;
        letter-spacing: 0;
        line-height: 180px;
      }
      .panel-ft {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border-top: 1px solid #dddddd;
        height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        @include fontLight();
        font-size: 32px;
        color: #222222;
        letter-spacing: 0;
        line-height: 90px;
        span {
          flex: 1;
          height: 100%;
          text-align: center;
          border-left: 1px solid #dddddd;
          &:first-of-type {
            border-left: none;
          }
        }
      }
    }
  }
</style>
