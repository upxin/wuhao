<template>
  <div v-if="loading" class="w-screen h-screen flex justify-center items-center">
    <wd-loading size="50px" color="#fe9739" />
  </div>

  <section v-if="!loading"
    class="h-screen w-screen flex flex-col justify-center p-30rpx box-border items-center relative bg-cover bg-no-repeat"
    :style="{ 'background-image': `url(${BG})` }">
    <div class="text-center text3d">大美</div>
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
        <wd-button custom-class="custom-shadow" type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
      </view>
    </wd-form>
  </section>

  <wd-popup v-model="show" custom-style="background-color: unset;">
    <view class="h-70vh w-80vw flex flex-col justify-center items-center p-24rpx">
      <div class="flex-1 overflow-auto bg-fff rounded-md p-34rpx">
        <view v-for="item in privacy" :key="item" class="mb-10px">{{ item }}</view>
      </div>
      <view class="flex justify-center py-20px">
        <wd-button @click="show = false">已知悉</wd-button>
      </view>
    </view>
  </wd-popup>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { loginApi, getInfo } from '@/api';
import { TOKEN } from '@/utils/constants'
import { onLoad } from '@dcloudio/uni-app';
import { privacy } from './privacy';
import BG from '@/static/style/bg.png'
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
<style>
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

.title {
  font-size: 30px;
  color: #fefefe;
  text-shadow: 0px 1px 0px #c0c0c0,
    0px 2px 0px #b0b0b0,
    0px 3px 0px #a0a0a0,
    0px 4px 0px #909090,
    0px 5px 10px rgba(0, 0, 0, .9);
  padding: 40rpx;
  letter-spacing: 20px;

}

.text3d {
  color: #70869d;
  letter-spacing: 20px;
  font-size: 40px;
  padding: 40rpx;
  text-shadow:
    -1px -1px 1px #efede3,
    0px 1px 0 #2e2e2e,
    0px 2px 0 #2c2c2c,
    0px 3px 0 #2a2a2a,
    0px 4px 0 #282828,
    0px 5px 0 #262626,
    0px 6px 0 #242424,
    0px 7px 0 #222,
    0px 8px 0 #202020,
    0px 9px 0 #1e1e1e,
    0px 10px 0 #1c1c1c,
    0px 11px 0 #1a1a1a,
    0px 12px 0 #181818,
    0px 13px 0 #161616,
    0px 14px 0 #141414,
    0px 15px 0 #121212,
    2px 20px 5px rgba(0, 0, 0, 0.9),
    5px 23px 5px rgba(0, 0, 0, 0.3),
    8px 27px 8px rgba(0, 0, 0, 0.5),
    8px 28px 35px rgba(0, 0, 0, 0.9);
}
</style>
