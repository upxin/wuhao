<template>
  <section class="h-screen w-screen flex flex-col justify-center p-30rpx box-border items-center relative">
    <wd-loading size="50px" v-if="!hasLogin" />
    <wd-form ref="form" :model="model" v-else="hasLogin">
      <wd-card custom-class="st-sha">
        <wd-cell-group border>
          <wd-input label="手机号" label-width="120rpx" prop="username" clearable v-model="model.username"
            placeholder="请输入手机号" :rules="[{ required: true, message: '请填写手机号' }]" />
          <wd-input label="密码" show-password label-width="120rpx" prop="password" v-model="model.password" disabled
            placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
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
  username: string
  password: string
  tenantCode: string
}>({
  username: '',
  tenantCode: 'enjoy',
  password: '123456'
})
const hasLogin = ref(true)
const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        loginApi(model).then((res)=>{
          console.log(999)
          uni.switchTab({
            url: '/pages/index/index'
          })
        })
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
