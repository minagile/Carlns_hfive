<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'App',
  mounted () {
    // var isfocus = false
    // 窗口原始高度
    var originalHeight = document.documentElement.clientHeight || document.body.clientHeight
    window.onresize = function () {
      // 改变后的高度
      var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 软键盘弹起与隐藏  都会引起窗口的高度发生变化
      if (resizeHeight < originalHeight) {
        // resizeHeight<originalHeight证明窗口被挤压了
        $('.btn .van-button').css('display', 'none')
      } else {
        $('.btn .van-button').css({'display': 'block', 'margin': '0 auto'})
      }
    }
  }
}
</script>

<style>
* {padding: 0;margin: 0;}
html, body {
  height: 100%;
  font-size: 26.7vw;
}
#app {
  height: 100%;
  font-size: 0.16rem;
}
input::-webkit-input-placeholder {
  color: #999;
}
input:-moz-placeholder {
  color: #999;
}
input::-moz-placeholder {
  color: #999;
}
input:-ms-input-placeholder {
  color: #999;
}
.van-button {
  background: #4B86FE;
  color: #fff;
  width: 3rem;
}
.headertop {
  background: #fff;
  height: 13.33vw;
  line-height: 13.33vw;
  margin-bottom: 2vw;
  padding-left: 3.33vw;
  font-size: 4.267vw;
}
.headertop .van-icon {
  top: 0.5vw;
}
</style>
