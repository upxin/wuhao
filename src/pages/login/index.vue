<template>
  <div v-if="loading" class="w-screen h-screen flex flex-col justify-center items-center">
    <div class="i-line-md-loading-twotone-loop w-180rpx h-180rpx"></div>
  </div>

  <section v-if="!loading" class="h-screen w-screen flex flex-col justify-center p-30rpx box-border items-center relative">
    <wd-img :src="LOGO" :width="100" :height="100"></wd-img>
    <wd-form ref="form" :model="model">
      <wd-card custom-class="st-sha">
        <wd-cell-group border>
          <wd-input label="手机号" label-width="120rpx" prop="username" clearable v-model="model.username"
            placeholder="请输入手机号" :rules="[{ required: true, message: '请填写手机号' }]" />
          <wd-input label="密码" show-password label-width="120rpx" prop="password" v-model="model.password" disabled
            placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
        </wd-cell-group>
      </wd-card>

      <div class="flex justify-center items-center">
        <wd-checkbox v-model="agree" shape="square">
          <view class="text-fff">已经阅读并同意</view>
        </wd-checkbox>
        <div class="text-blue text-14px" @click="show = true">《用户隐私协议》</div>
      </div>

      <view class="p-40px">
        <wd-button custom-class="custom-shadow" custom-style="font-weight:600" type="primary" size="large"
          @click="handleSubmit" block>提交</wd-button>
      </view>
    </wd-form>
  </section>

  <wd-popup v-model="show" custom-style="background-color: unset;">
    <view class="h-70vh w-80vw flex flex-col justify-center items-center p-34rpx">
      <div class="flex-1 overflow-auto bg-fff rounded-lg p-34rpx">
        <view v-for="item in privacy" :key="item" class="mb-10px">{{ item }}</view>
      </div>
      <view class="flex justify-center py-20px">
        <wd-button custom-style="font-weight:600" @click="show = false" :size="'large'">已知悉</wd-button>
      </view>
    </view>
  </wd-popup>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { loginApi, getInfo } from '@/api';
import { TOKEN } from '@/utils/constants'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { privacy } from './privacy';
import { useUserStore } from '@/store/index'
import LOGO from './logo.png'
const tokenStore = useUserStore()
const show = ref(false)
const agree = ref(false)
const model = reactive<{
  username: string
  password: string
  tenantCode: string
}>({
  username: '',
  tenantCode: 'enjoy',
  password: '123456'
})
onShareAppMessage(() => {
  return {
    title: '大美',                //分享的标题
    path: 'pages/login/index',      //点击分享链接之后进入的页面路径
  };
})

onShareTimeline(() => {
  return {
    title: '大美',
  };
});
const loading = ref(true)
const form = ref()
function handleSubmit() {
  if (!agree.value) {
    uni.showToast({
      title: '请阅读隐私协议',
      icon: 'error',
      duration: 2500,
      mask: true
    })
    return
  }
  form.value.validate().then(({ valid, errors }) => {
    if (valid) {
      loginApi(model).then((res) => {
        if (res.code === 200) {
          tokenStore.setToken(res.data.access_token)
          tokenStore.setPhone(model.username)
          uni.setStorage({
            key: TOKEN,
            data: res.data.access_token,
            success() {
              getInfo(res.data.access_token)
              init()
            }
          })
        }

      })
    }
  })
    .catch((error) => {
      console.log(error, 'error')
    })
}

function init() {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

onLoad(() => {
  uni.getStorage({
    key: TOKEN,
    success() {
      init()
    },
    fail() {
      loading.value = false
    }
  })
})
</script>
<style lang="scss">
page{
  background: linear-gradient(135deg, rgba(254, 151, 57, 0.3), rgba(52, 209, 157, 0.2));
  width: 100vw;
  height: 100vh;
}
.login {
  width: 670rpx;
  border-radius: 20rpx;
  background-color: #fff;
}

.gra {
  background-image: linear-gradient(to bottom, #c3c7d4, #e7e6ea);
}

.custom-shadow {
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
}

.st-sha {
  box-shadow: 0px 0px 5px #ddd !important;
}


.text3d {
  color: var(--wot-color-theme);
  letter-spacing: 20px;
  font-size: 40px;
  padding: 40rpx;
}

</style>
