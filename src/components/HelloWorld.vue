<template>
  <div class="hello">
    <div class="headertop"><van-icon name="arrow-left" /> 车险分期</div>
    <van-cell-group>
      <p>基本信息</p>
      <van-cell title="姓名：" :value="orderData.name" />
      <van-cell title="联系方式：" :value="orderData.tel" />
      <van-cell title="身份证号码：" :value="orderData.idNumber" />
      <van-cell title="车牌号：" :value="orderData.nameplate" />
    </van-cell-group>
    <van-cell-group style="margin-top: 0.10rem;">
      <p>保单信息</p>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell class="cell" title="商业险：" clickable @click="radio = '1'">
            <template>
              <span class="mo">{{ orderData.commercial }} 元</span>
              <van-radio name="1" />
            </template>
          </van-cell>
          <van-cell class="cell" clickable @click="radio = '2'">
            <template slot="title">
              <span class="van-cell-text">综合险:</span>
              <div style="position:absolute;top: 0.12rem;font-size: 0.12rem;left: 0.7rem;">(商业险+交强险+车船税)</div>
            </template>
            <template>
              <span class="mo">{{ orderData.commercial + orderData.risks }} 元</span>
              <van-radio name="2" />
            </template>
            <!-- <van-radio name="2" /> -->
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-cell title="月付期数：" is-link :value="orderData.stage + '期'" @click="show = true" />
    </van-cell-group>
    <div class="btn">
      <van-button size="large" round  @click="next">下一步</van-button>
    </div>
    <!-- 弹框 -->
    <van-actionsheet v-model="show">
      <van-picker
        show-toolbar
        title="月付期数"
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-actionsheet>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name: 'HelloWorld',
  data () {
    return {
      username: '',
      password: '',
      radio: '1',
      show: false,
      columns: ['12期', '6期', '3期'],
      orderData: {
        name: '',
        tel: '',
        idNumber: '',
        nameplate: '',
        commercial: '',
        risks: '',
        stage: ''
      }
    }
  },
  mounted () {
    // POST /fd/insure/car
    // console.log(this.$route.query.orderId)
    sessionStorage.setItem('orderId', this.$route.query.orderId)
    // http://192.168.1.131:8080/fd/insure/select?orderId=178204bd2db640a3bf40bbd88e1428b1
    this.$fetch('/fd/insure/select', {
      orderId: this.$route.query.orderId
    }).then(res => {
      console.log(res)
      this.orderData = res.data
    })
  },
  methods: {
    next () {
      // POST /fd/insure/carInsure
      var data = {
        orderId: this.$route.query.orderId,
        name: this.orderData.name,
        tel: this.orderData.tel,
        idNumber: this.orderData.idNumber,
        nameplate: this.orderData.nameplate,
        type: this.radio,
        stage: this.orderData.stage
      }
      // console.log(data)
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner'
      })
      this.$post('/fd/insure/carInsure', data).then(res => {
        // console.log(res)
        if (res.code === 0) {
          Toast.clear()
          this.$router.push({name: 'Driving'})
        }
      })
    },
    onSelect (item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.show = false
      Toast(item.name)
    },
    onConfirm (value, index) {
      this.orderData.stage = value.split('期')[0]
      this.show = false
      // Toast(`当前值：${value}, 当前索引：${index}`)
    },
    onCancel () {
      this.show = false
      Toast('取消')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.cell {
  // display: block;
  .mo {
    // float: right;
    margin-right: 0.2rem;
  }
  .van-radio {
    display: inline-block;
    float: right;
  }
}
.van-cell--required::before {
  left: 0.13rem;
}
.van-cell-group {
  .van-cell {
    padding: 0.12rem 0.23rem;
  }
}
.hello {
  background: #f2f2f2;
  height: 100%;
  // height: calc(100% - 0.2rem);
  // padding-top: 0.2rem;
  p {
    font-size: 0.18rem;
    font-family:PingFang-SC-Bold;
    height: 0.50rem;
    line-height: 0.55rem;
    text-indent: 0.11rem;
    font-weight:bold;
    color:rgba(51,51,51,1);
  }
  .btn {
    text-align: center;
    position: fixed;
    width: 100%;
    bottom: 0.1rem;
  }
}
</style>
