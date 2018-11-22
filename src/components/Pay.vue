<template>
  <div class="pay">
    <div class="headertop" @click="$router.push({name: 'Aging'})"><van-icon name="arrow-left" /> 车险分期</div>
    <div class="upload">
      <p>请填写银行卡信息和正面照片</p>
      <div class="up">
        <div class="font box">
          <img src="../assets/img/font.png" alt="">
          <div class="imgShow"></div>
          <input type="file" @change="fileImage($event, 1)" accept="image/*" capture="camera">
        </div>
      </div>
      <div class="span">若信息不准确，请重新上传或修改</div>
      <van-cell-group>
        <van-field input-align="right" v-model="name" clearable label="开户行：" placeholder="请输入开户行"/>
        <van-field input-align="right" v-model="bankCardNo" clearable label="银行卡号：" placeholder="请输入您的银行卡号" />
      </van-cell-group>
    </div>
    <van-cell-group style="margin-top:0.1rem;">
      <van-field input-align="right" v-model="tel" clearable label="手机号：" placeholder="请输入手机号"/>
      <!-- <van-field input-align="right" v-model="password" clearable label="验证码：" placeholder="请输入您的联系方式" /> -->
      <van-field
        v-model="sms"
        center
        clearable
        label="验证码："
      >
        <van-button class="code" slot="button" size="small" round @click="getCode($event)">获取验证码<span v-if="codeshow">{{ count }}s</span></van-button>
      </van-field>
    </van-cell-group>
    <van-checkbox v-model="checked">我已阅读并同意<a :href="url" target="_blank">《代扣授权协议》</a></van-checkbox>
    <div class="btn">
      <van-button size="large" round @click="sure">确定</van-button>
    </div>
    <!-- 弹窗 -->
    <van-dialog
      v-model="show"
      :showConfirmButton="false"
      :before-close="beforeClose"
      :close-on-click-overlay="true"
    >
      <img src="../assets/img/alert.png">
      <!-- <img class="code_img" src="../assets/img/code.png"> -->
      <!-- <img class="code_img" :src="imgCode"> -->
    </van-dialog>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { Req } from '../assets/js/http.js'
export default {
  name: 'Pay',
  data () {
    return {
      name: '',
      bankCardNo: '',
      checked: true,
      sms: '',
      tel: '',
      show: false,
      count: 60,
      codeshow: false,
      file: {},
      imgCode: '',
      url: ''
    }
  },
  mounted () {
    // 二维码
    // this.$fetch('/wechat/createQCode', {orderId: sessionStorage.getItem('orderId')}).then(res => {
    //   // console.log(res.data)
    //   this.imgCode = res.data
    // })
    this.$fetch('/fd/insure/resource', {type: 2}).then(res => {
      // console.log(res)
      this.url = res.data.url
    })
  },
  methods: {
    // 获取验证码
    getCode (e) {
      if (!(/^1[34578]\d{9}$/.test(this.tel))) {
        Toast('请输入正确的手机号')
      } else {
        if (this.codeshow === false) {
          this.codeshow = true
          this.count = 60
          e.target.style.backgroundColor = '#ccc'
          this.clock = window.setInterval(() => {
            this.count--
            if (this.count < 1) {
              this.codeshow = false
              e.target.style.backgroundColor = 'rgba(255,255,255,1)'
              clearInterval(this.clock)
            }
          }, 1000)
          // 接口调用
          var formData = new FormData()
          let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          }
          formData.append('orderId', sessionStorage.getItem('orderId'))
          formData.append('name', this.name)
          formData.append('bankCardNo', this.bankCardNo)
          formData.append('tel', this.tel)
          formData.append('bankCard', this.file)
          this.$http.post(Req + '/fd/insure/addBankCard', formData, config).then(res => {
            Toast(res.data.msg)
          })
        }
      }
    },
    // 确定按钮
    sure () {
      if (this.checked === false) {
        Toast('请先阅读并同意相关协议')
      } else {
        if (this.sms === '') {
          Toast('请输入验证码')
        } else {
          // GET /fd/insure/firstPay
          this.$fetch('/fd/insure/firstPay', {orderId: sessionStorage.getItem('orderId'), code: this.sms}).then(res => {
            // console.log(res)
            if (res.code === 0) {
              this.show = true
            } else {
              Toast(res.msg)
            }
          })
        }
      }
    },
    beforeClose (action, done) {
      if (action === 'confirm') {
        setTimeout(done, 1000)
      } else {
        done()
      }
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
            that.file = file
            var formData = new FormData()
            let config = {
              headers: {'Content-Type': 'multipart/form-data'}
            }
            formData.append('orderId', sessionStorage.getItem('orderId'))
            formData.append('bankCard', file)
            Toast.loading({
              duration: 0,
              forbidClick: true,
              loadingType: 'spinner'
            })
            that.$http.post(Req + '/fd/insure/addBankCardBase64', formData, config).then(res => {
              if (res.data.code === 0) {
                // console.log(res.data)
                Toast.clear()
                e.target.previousElementSibling.style.backgroundImage = 'url(' + avatar + ')'
                Toast(res.data.msg)
                that.bankCardNo = res.data.data.cardNum
                that.name = cardTypeMap(res.data.data.bank)
                // this.show = true
              } else {
                Toast(res.data.msg)
              }
            })
          }
        }
      }
    }
  }
}
function cardTypeMap (data) {
  // console.log(data)
  if (data === 'CCB') return '中国建设银行'
  if (data === 'ICBC') return '中国工商银行'
  if (data === 'ABC') return '中国农业银行'
  if (data === 'BC') return '交通银行'
  if (data === 'CMB') return '招商银行'
  if (data === 'PBC') return '中国人民银行'
  if (data === 'HSBC') return '汇丰银行'
  if (data === 'BOC') return '中国银行'
  return data
}
</script>

<style lang="less" scoped>
.van-dialog {
  width: 3rem;
  background: rgba(0,0,0,0);
  img {
    width: 3rem;
    display: block;
  }
  // .code_img {
  //   width: 0.6rem;
  //   margin: -0.6rem 0 0 2.2rem;
  // }
}
.van-checkbox {
  font-size: 0.16rem;
  color: #666666;
  padding-left: 0.25rem;
  margin-top: 0.2rem;
}
.van-button {
  &.code {
    width:0.98rem;
    height:0.3rem;
    border:0.01rem solid rgba(153,153,153,1);
    border-radius:0.15rem;
    color: rgba(153,153,153,1);
    background-color: #fff;
  }
}
.pay {
  background: #f2f2f2;
  height: 100%;
  // height: calc(100% - 0.2rem);
  // padding-top: 0.2rem;
  .upload {
    background: #fff;
    p {
      font-size: 0.17rem;
      text-align: center;
      line-height: 0.7rem;
    }
    .up {
      overflow: hidden;
      width: 1.68rem;
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
      }
    }
    .span {
      text-align: center;
      font-size: 0.12rem;
      color: #BCBBBB;
      padding: 0.09rem 0 0.2rem 0;
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
