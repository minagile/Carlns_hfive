<template>
  <div class="aging">
    <div class="headertop" @click="$router.push({name: 'Card'})"><van-icon name="arrow-left" /> 车险分期</div>
    <div class="title">确认分期信息</div>
    <div class="msg">
      <van-cell-group>
        <van-cell title="姓名：" :value="data.name" />
        <van-cell title="车牌号：" :value="data.nameplate" />
        <van-cell title="分期总金额：" :value="data.money + ' 元'" />
        <van-cell title="月付期数：" :value="data.stage + '期'" />
        <button @click="show = true">分期详情</button>
      </van-cell-group>
    </div>
    <van-checkbox v-model="checked">我已阅读并同意<a :href="url" target="_blank">《车险服务协议》</a></van-checkbox>
    <div class="btn">
      <van-button size="large" round @click="next" >下一步</van-button>
    </div>
    <!-- 分期详情 -->
    <van-dialog
      v-model="show"
      :showConfirmButton="false"
      :before-close="beforeClose"
      :closeOnClickOverlay="true"
    >
      <header>
        <div class="tit">
          <img src="../assets/img/fenqi.png" alt="">
          <span>分期详情</span>
        </div>
        <div class="qishu">分期期数:12</div>
        <div class="qishu">分期金额:￥5,000.00</div>
      </header>
      <div class="con">
        <table>
          <tr>
            <th>期数</th>
            <th>还款时间</th>
            <th>还款金额</th>
            <th>还款状态</th>
          </tr>
          <tr v-for="(o, i) in datalist" :key="i">
            <td>第{{ o.stagesSequential }}期</td>
            <td>{{ o.stagesCutoff | timeChange }}</td>
            <td>{{ o.stagesPrice }}</td>
            <td>未还款</td>
          </tr>
        </table>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name: 'Aging',
  data () {
    return {
      checked: true,
      data: {
        money: 11,
        name: '',
        nameplate: '',
        stage: 12
      },
      show: false,
      datalist: ['1'],
      url: ''
    }
  },
  mounted () {
    // GET /fd/insure/confirmInsure
    this.$fetch('/fd/insure/confirmInsure', {orderId: sessionStorage.getItem('orderId')}).then(res => {
      // console.log(res)
      this.data = res.data
    })
    // GET /fd/insure/selectStage
    this.$fetch('/fd/insure/selectStage', {orderId: sessionStorage.getItem('orderId')}).then(res => {
      // console.log(res)
      this.datalist = res.data
    })
    this.$fetch('/fd/insure/resource', {type: 1}).then(res => {
      console.log(res)
      this.url = res.data.url
    })
  },
  methods: {
    beforeClose (action, done) {
      if (action === 'confirm') {
        setTimeout(done, 1000)
      } else {
        done()
      }
    },
    next () {
      if (this.checked === false) {
        Toast('请阅读并同意')
      } else {
        // POST /fd/insure/confirmInsure
        Toast.loading({
          duration: 0,
          forbidClick: true,
          loadingType: 'spinner'
        })
        this.$post('/fd/insure/confirmInsure', {orderId: sessionStorage.getItem('orderId')}).then(res => {
          // console.log(res)
          if (res.code === 0) {
            Toast.clear()
            this.$router.push({name: 'Pay'})
          }
        })
      }
    }
  },
  filters: {
    timeChange (data) {
      let date = new Date(data)
      return date.getFullYear() + '.' + zero(date.getMonth() + 1) + '.' + zero(date.getDate())
    }
  }
}
function zero (data) {
  if (data < 10) return '0' + data
  return data
}
</script>

<style lang="less" scoped>
.van-dialog {
  header {
    display: flex;
    height: 0.34rem;
    background: #DFEBFF;
    line-height: 0.34rem;
    font-size: 0.08rem;
    color: #447BED;
    .tit {
      font-size: 0.14rem;
      margin-left: 0.10rem;
    }
    .qishu {
      margin-left: 0.15rem;
    }
    img {
      width: 0.18rem;
      vertical-align: middle;
    }
  }
  .con {
    max-height: 150vw;
    overflow-y: scroll;
    table {
      width: 100%;
      text-align: center;
      font-size: 0.08rem;
      tr {
        line-height: 0.26rem;
      }
      td {
        color: #333;
        font-family:PingFang-SC-Medium;
      }
    }
  }
}
.van-checkbox {
  font-size: 0.16rem;
  color: #666666;
  padding-left: 0.25rem;
  margin-top: 0.2rem;
}
.van-cell {
  padding: 0.13rem 0.15rem;
  color: #666;
}
.aging {
  background: #f2f2f2;
  height: 100%;
  // height: calc(100% - 0.2rem);
  // padding-top: 0.2rem;
  .title {
    font-size: 0.17rem;
    text-indent: 0.26rem;
    margin-bottom: 0.09rem;
  }
  .msg {
    width: 3.22rem;
    // height: 1.97rem;
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 6px 1px rgba(206, 206, 206, 0.35);
    border-radius:10px;
    overflow: hidden;
    margin: 0 auto;
    position: relative;
    button {
      width: 0.84rem;
      height: 0.28rem;
      line-height: 0.28rem;
      background:rgba(75,134,254,1);
      border-radius:14px;
      border: 0;
      color: #fff;
      margin: 0.12rem 0.06rem;
      font-size: 0.14rem;
      float: right;
    }
  }
}
.btn {
  text-align: center;
  position: fixed;
  width: 100%;
  bottom: 0.1rem;
}
</style>
