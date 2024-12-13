<template>
  <section class="h-screen w-screen flex flex-col justify-center p-30rpx box-border items-center relative">
    <div class="absolute -z-1 size-full overflow-hidden">
      <div class="absolute">
        <svg height="1337" width="1337">
          <defs>
            <path id="path-1" opacity="1" fill-rule="evenodd"
              d="M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z">
            </path>
            <linearGradient id="linearGradient-2" x1="0.79" y1="0.62" x2="0.21" y2="0.86">
              <stop offset="0" stop-color="#dee3ff" stop-opacity="1"></stop>
              <stop offset="1" stop-color="#646cff" stop-opacity="1"></stop>
            </linearGradient>
          </defs>
          <g opacity="1">
            <use xlink:href="#path-1" fill="url(#linearGradient-2)" fill-opacity="1"></use>
          </g>
        </svg>
      </div>
      <div class="absolute">
        <svg height="896" width="967.8852157128662">
          <defs>
            <path id="path-2" opacity="1" fill-rule="evenodd"
              d="M896,448 C1142.6325445712241,465.5747656464056 695.2579309733121,896 448,896 C200.74206902668806,896 5.684341886080802e-14,695.2579309733121 0,448.0000000000001 C0,200.74206902668806 200.74206902668791,5.684341886080802e-14 447.99999999999994,0 C695.2579309733121,0 475,418 896,448Z">
            </path>
            <linearGradient id="linearGradient-3" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stop-color="#646cff" stop-opacity="1"></stop>
              <stop offset="1" stop-color="#dee3ff" stop-opacity="1"></stop>
            </linearGradient>
          </defs>
          <g opacity="1">
            <use xlink:href="#path-2" fill="url(#linearGradient-3)" fill-opacity="1"></use>
          </g>
        </svg>
      </div>
    </div>
    <wd-loading size="50px" v-if="!hasLogin"/>
    <wd-form ref="form" :model="model" v-else="hasLogin">
      <wd-card custom-class="st-sha">
        <wd-cell-group border>
          <wd-input label="手机号" label-width="120rpx" prop="userName" clearable v-model="model.userName" placeholder="请输入手机号"
            :rules="[{ required: true, message: '请填写手机号' }]" />
          <wd-input label="密码" show-password label-width="120rpx" prop="password" v-model="model.password" disabled placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
        </wd-cell-group>
      </wd-card>
      <view class="p-40px">
        <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
      </view>
    </wd-form>
  </section>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { loginApi } from '@/api';

const model = reactive<{
  userName: string
  password: string
}>({
  userName: '',
  password: '123456'
})
const hasLogin = ref(true)
const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        loginApi(model)
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
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
</style>
