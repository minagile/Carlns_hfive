<template>
  <div class="card">
    <div class="headertop" @click="$router.push({name: 'Driving'})"><van-icon name="arrow-left" /> 车险分期</div>
    <div class="upload">
      <p>请上传本人身份证正反面照片</p>
      <div class="up">
        <div class="font box">
          <img src="../assets/img/font.png" alt="">
          <div class="imgShow"></div>
          <input type="file" @change="fileImage($event, 1)" accept="image/*" capture="camera">
        </div>
        <div class="back box">
          <img src="../assets/img/back.png" alt="">
          <div class="imgShow"></div>
          <input type="file" @change="fileImage($event, 2)" accept="image/*" capture="camera">
        </div>
      </div>
      <!-- <div class="span">若信息不准确，请重新上传或修改</div>
      <van-cell-group>
        <van-field input-align="right" v-model="username" clearable label="姓名" placeholder="请输入身份证姓名"/>
        <van-field input-align="right" v-model="password" clearable label="联系方式" placeholder="请输入您的联系方式" />
      </van-cell-group> -->
    </div>
    <!-- <van-checkbox v-model="checked">我已阅读并同意《xxxx车险协议》</van-checkbox> -->
    <div class="btn">
      <van-button size="large" round @click="next" >下一步</van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { Req } from '../assets/js/http.js'
export default {
  name: 'Card',
  data () {
    return {
      username: '',
      password: '',
      checked: true,
      filez: {},
      filef: {}
    }
  },
  mounted () {
    // POST /fd/insure/addIdCard
  },
  methods: {
    next () {
      var formData = new FormData()
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      formData.append('orderId', sessionStorage.getItem('orderId'))
      formData.append('idCard', this.filez)
      formData.append('backCard', this.filef)
      // console.log(formData)
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner'
      })
      this.$http.post(Req + '/fd/insure/addIdCard', formData, config).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          Toast.clear()
          this.$router.push({name: 'Aging'})
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
            // console.log(i)
            // console.log(avatar)
            e.target.previousElementSibling.style.backgroundImage = 'url(' + avatar + ')'
            if (i === 1) {
              that.filez = file
            }
            if (i === 2) {
              that.filef = file
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
.card {
  background: #f2f2f2;
  height: 100%;
  // height: calc(100% - 0.2rem);
  // padding-top: 0.2rem;
  font-size: 0.16rem;
  .upload {
    min-height: 2.6rem;
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
