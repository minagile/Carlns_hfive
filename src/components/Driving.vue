<template>
  <div class="driving">
    <div class="headertop" @click="$router.push({name: 'HelloWorld'})"><van-icon name="arrow-left" /> 车险分期</div>
    <div class="upload">
      <p>请上传行驶证内部照片</p>
      <div class="up">
        <div class="font box">
          <img src="../assets/img/left.png" alt="">
          <div class="imgShow"></div>
          <input type="file" @change="fileImage($event, 1)" accept="image/*" capture="camera">
        </div>
        <div class="back box">
          <img src="../assets/img/right.png" alt="">
          <div class="imgShow"></div>
          <input type="file" @change="fileImage($event, 2)" accept="image/*" capture="camera">
        </div>
        <!-- <div class="font box">
          <img src="../assets/img/driving.png" alt="">
          <div class="imgShow"></div>
          <input  type="file" @change="fileImage($event, 1)" accept="image/*" capture="camera">
        </div> -->
      </div>
      <div class="span">若信息不准确，请重新上传或修改</div>
    </div>
    <van-cell title="行驶证有效期：" :value="time" style="margin-top: 0.1rem;" />
    <div class="btn">
      <van-button size="large" round @click="next" >确定</van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { Req } from '../assets/js/http.js'
export default {
  name: 'Driving',
  data () {
    return {
      username: '',
      password: '',
      checked: true,
      filez: {},
      filey: {},
      time: '2119-08-05'
    }
  },
  mounted () {
  },
  methods: {
    next () {
      var formData = new FormData()
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      formData.append('orderId', sessionStorage.getItem('orderId'))
      formData.append('effectiveDate', this.time)
      formData.append('license', this.filez)
      formData.append('licenseBack', this.filey)
      // console.log(formData)
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner'
      })
      this.$http.post(Req + '/fd/insure/carCertificate', formData, config).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          Toast.clear()
          this.$router.push({name: 'Card'})
        } else {
          Toast(res.data.msg)
        }
      })
    },
    fileImage (e, i) {
      var that = this
      var file = e.target.files[0]
      if (file.name.split('.')[1] !== 'png' && file.name.split('.')[1] !== 'gif' && file.name.split('.')[1] !== 'jpg' && file.name.split('.')[1] !== 'jpeg' && file.name.split('.')[1] !== 'bmp' && file.name.split('.')[1] !== 'pdf') {
        Toast('请上传图片')
      } else {
        var imgSize = file.size / 1024
        if (imgSize > 5 * 1024) {
          Toast('请上传大小不要超过5M的图片')
        } else {
          var reader = new FileReader()
          reader.readAsDataURL(file) // 读出 base64
          reader.onloadend = function () {
            // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
            var dataURL = reader.result
            var avatar = dataURL
            e.target.previousElementSibling.style.backgroundImage = 'url(' + avatar + ')'
            if (i === 1) {
              that.filez = file
            }
            if (i === 2) {
              that.filey = file
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-checkbox {
  font-size: 0.16rem;
  color: #666666;
  padding-left: 0.25rem;
  margin-top: 0.2rem;
}
.driving {
  background: #f2f2f2;
  height: 100%;
  // height: calc(100% - 0.2rem);
  // padding-top: 0.2rem;
  font-size: 0.16rem;
  .upload {
    background: #fff;
    p {
      font-size: 0.17rem;
      text-align: center;
      line-height: 0.7rem;
    }
    .up {
      overflow: hidden;
      width: 3.5rem;
      margin: 0 auto;
      .box {
        width: 1.66rem;
        height: 1.44rem;
        // border: 0.01rem solid #ccc;
        float: left;
        position: relative;
        img {
          width: 100%;
        }
        .imgShow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 100% 100%;
        }
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        // background-image: url(../assets/img/font.png);
        // background-repeat: no-repeat;
        // background-size: cover;
        &.font {
          margin-right: 0.11rem;
        }
      }
    }
    .span {
      text-align: center;
      font-size: 0.12rem;
      color: #BCBBBB;
      padding: 0.09rem 0 0.4rem;
    }
  }
  .btn {
    text-align: center;
    position: fixed;
    width: 100%;
    bottom: 0.1rem;
  }
}
</style>
