<template>
  <wd-navbar :title="''" safeAreaInsetTop :bordered="false" custom-style="background:transparent"></wd-navbar>

  <wd-img-cropper v-model="show" :img-src="src" @confirm="handleConfirm" @cancel="handleCancel">
  </wd-img-cropper>
  <div class="py-28rpx">
    <div class="p-40rpx">
      <div class="flex items-center pb-40rpx">
        <wd-img :width="100" :height="100" :src="joy" :enable-preview="false" round v-if="joy" />
        <div class="w-100px h-100px rounded-full bg-[#ddd] text-[#bbb] flex justify-center items-center" @tap="upload"
          v-else>暂无头像</div>
        <div class="ml-40rpx text-40rpx flex flex-col items-center">
          <div class="pb-12rpx"> {{ model.userName }} </div>
          <div class="text-28rpx text-[#bbb] flex items-center">
            <span class="leading-none">{{ info.gender }}</span>
            <span>丨</span>
            <span class="leading-none">{{ info.age }}</span>
          </div>
        </div>
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
import { onShow, onReady } from '@dcloudio/uni-app';
import { computed, ref } from 'vue';
import { uploadAvatar1, getInfo } from '@/api/index'
const show = ref(false)
const model = ref({
  userName: '',
  idCard: '',
  disabledCard: '',
  company: '',
  employmentDate: ''
})
const dimission = ref(true)

const joy = ref('')
let token = ''
let id = ''
let phonenumber = ''

onShow(()=>{
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
        id = res.rows[0]?.id
        phonenumber = res.rows[0]?.phonenumber
        model.value = res.rows?.[0]
        dimission.value = res.rows[0]?.status == '1'
      })
    }
  })
})
onReady(() => {
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
        phonenumber = res.rows[0].phonenumber
        dimission.value = res.rows[0]?.status == '1'
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
    key: TOKEN,
    success() {
      uni.redirectTo({ url: '/pages/login/index' })
    }
  })
  uni.removeStorage({
    key: 'loginName',
  })
  uni.removeStorage({
    key: 'avatarfile',
  })
}

const info = computed(() => {
      const idCard = model.value.idCard;
      if (!/^\d{17}(\d|X)$/i.test(idCard)) {
        return {}; // 或者返回一个默认值
      }

      // 提取出生日期
      const birthYear = parseInt(idCard.substr(6, 4), 10);
      const birthMonth = parseInt(idCard.substr(10, 2), 10);
      const birthDay = parseInt(idCard.substr(12, 2), 10);

      // 计算周岁
      const today = new Date();
      let age = today.getFullYear() - birthYear;
      if (
        today.getMonth() + 1 < birthMonth ||
        (today.getMonth() + 1 === birthMonth && today.getDate() < birthDay)
      ) {
        age--;
      }

      // 提取性别
      const genderCode = parseInt(idCard.charAt(16), 10);
      const gender = (genderCode & 1) === 0 ? '女' : '男';

      return {
        age: age,
        gender: gender
      };
    });

const src = ref<string>('')

function upload() {

  if (dimission.value) {
    return uni.showToast({
      title: '该职工已离职',
      icon: 'error'
    })
  }
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
  uploadAvatar1({ token, id, filePath: tempFilePath }).then((res) => {
    joy.value = res.data.url
    uni.hideLoading()
    uni.showToast({
      title: '上传成功',
      icon: 'success'
    })
    uni.setStorage({
      key: 'avatarfile',
      data: res.data.url
    })
  })
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
  box-shadow: 0 0px 10rpx rgba(0, 0, 0, 0.2);
  border-radius: 20rpx;
  overflow: hidden;
}
</style>
