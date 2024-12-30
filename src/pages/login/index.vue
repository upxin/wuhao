<template>
  <section
    class="h-screen w-screen flex flex-col justify-center p-30rpx box-border items-center relative bg-cover bg-no-repeat"
    style="background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);">

    <wd-loading size="50px" v-if="loading" />
    <div v-if="!loading" class="text-center title">大美</div>
    <wd-form ref="form" :model="model" v-if="!loading">
      <wd-card custom-class="st-sha">
        <wd-cell-group border>
          <wd-input label="手机号" label-width="120rpx" prop="username" clearable v-model="model.username"
            placeholder="请输入手机号" :rules="[{ required: true, message: '请填写手机号' }]" />
          <wd-input label="密码" show-password label-width="120rpx" prop="password" v-model="model.password" disabled
            placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
        </wd-cell-group>
      </wd-card>

      <div class="flex justify-center items-center">
        <wd-checkbox v-model="agree" shape="square">已经阅读并同意</wd-checkbox>
        <div class="text-blue text-14px" @click="show = true">《用户隐私协议》</div>
      </div>
      
      <view class="p-40px">
        <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
      </view>
    </wd-form>
  </section>

  <wd-overlay :show="show">
    <view class="px-40px py-100px h-full box-border overflow-hidden">
      <view class="bg-fff overflow-y-auto p-30rpx rounded-md h-full box-border"> 
        <view v-for="item in privacy" :key="item" class="my-10px">{{ item }}</view>
      </view>
      <view class="flex justify-center pt-20px">
        <wd-button  @click="show = false">已知悉</wd-button>
      </view>
    </view>
  </wd-overlay>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { loginApi, getInfo } from '@/api';
import { TOKEN } from '@/utils/constants'
import { onLoad } from '@dcloudio/uni-app';
import { privacy } from './privacy';
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
  if(!agree.value) {
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
</style>
