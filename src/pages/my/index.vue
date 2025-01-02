<template>
  <wd-navbar :title="''" safeAreaInsetTop :bordered="false" custom-style="background:transparent"></wd-navbar>

  <wd-img-cropper v-model="show" :img-src="src" @confirm="handleConfirm" @cancel="handleCancel">
  </wd-img-cropper>
  <div class="py-28rpx">
    <div class="p-40rpx">
      <div class="flex items-center pb-40rpx">
        <wd-img :width="100" :height="100" :src="joy" :enable-preview="false" round v-if="joy" />
        <div class="w-100px h-100px rounded-10px bg-[#ddd] text-[#bbb] flex justify-center items-center" @tap="upload"
          v-else>暂无头像</div>
        <div class="ml-40rpx text-40rpx">{{ model.userName }}</div>
        <div class="i-material-symbols-edit-square-outline w-60rpx h-60rpx ml-60rpx bg-[#bbb]" @tap="upload"></div>
      </div>
      <template v-if="!show">
        <section class="my-shadow">
          <wd-input label="身份证号" label-width="140rpx" disabled v-model="model.idCard" placeholder="" />
          <wd-input label="残疾证号" label-width="140rpx" disabled v-model="model.disabledCard" placeholder="" />
          <wd-input label="所属公司" label-width="140rpx" disabled v-model="model.company" placeholder="" />
          <wd-input label="入职时间" label-width="140rpx" disabled v-model="model.employmentDate" placeholder=""></wd-input>
        </section>
      </template>
    </div>
  </div>

  <view class="p-40px">
    <wd-button type="error" size="large" @click="logout" block>退出登录</wd-button>
  </view>
</template>

<script lang="ts" setup>
import { TOKEN } from '@/utils';
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';
import { uploadAvatar1, getInfo } from '@/api/index'
const show = ref(false)
const model = ref({
  userName: '',
  idCard: '',
  disabledCard: '',
  company: '',
  employmentDate: ''
})
const joy = ref('')
let token = ''
let id = ''
onLoad(() => {
  uni.getStorage({
    key: 'loginName',
    success(res) {
      uni.u.get('/system/disabledUser/selectPage', {
        data: {
          phonenumber: res.data,
          pageNum: 1,
          pageSize: 1
        }
      }).then((res) => {
        model.value = res.rows?.[0]
        id = res.rows[0]?.id
      })
    },
  })
  uni.getStorage({
    key: 'TOKEN',
    success(res) {
      token = res.data
    },
    fail() {
      uni.redirectTo({
        url: '/pages/login/index'
      })
    }
  })

  uni.getStorage({
    key: 'avatarfile',
    success(res) {
      if (res.data) {
        joy.value = res.data
      }
    }
  })
})
function logout() {
  uni.removeStorage({
    key: TOKEN, success() {
      uni.redirectTo({ url: '/pages/login/index' })
    }
  })
}
function init() {
  getInfo(token).then((res) => {
    if (res?.user?.avatar) {
      uni.hideLoading()
      uni.showToast({
        title: '上传成功', icon: 'success'
      })
      joy.value = res.user.avatar
      uni.setStorage({
        key: 'avatarfile',
        data: res.user.avatar
      })
    }

  }).catch(() => {
    uni.hideLoading()
  })
}

const src = ref<string>('')

function upload() {
  uni.chooseMedia({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      var path = res.tempFiles[0]?.tempFilePath
      src.value = path
      show.value = true
    }
  });
}
function handleConfirm(event) {
  const { tempFilePath } = event
  uni.showLoading({
    title: '正在上传...'
  })
  uploadAvatar1({ token, id, filePath: tempFilePath }, init)
}
function handleCancel(event) {
}
</script>
<style>
page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, rgba(254, 151, 57, 0.2), rgba(52, 209, 157, 0.1))
}
.my-shadow {
  box-shadow: 0 0px 10rpx rgba(0, 0, 0, 0.2) ;
  border-radius: 20rpx;
  overflow: hidden;
}
</style>
