<template>
  <wd-img-cropper
    v-model="show"
    :img-src="src"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
  </wd-img-cropper>
    <div class="py-28rpx">
      <div class="p-40rpx">
        <div class="flex items-center">
          <wd-img :width="100" :height="100" :src="joy" :enable-preview="true" radius="10" v-if="joy"/>
          <div class="w-100px h-100px rounded-10px bg-[#ddd] text-[#bbb] flex justify-center items-center" @tap="upload" v-else>暂无头像</div>
          <div class="ml-40rpx">{{ model.userName  }}</div>
          <wd-button type="text" @tap="upload" custom-class="ml-auto">修改头像</wd-button>
        </div>
        <template v-if="!show">
          <wd-form ref="form" :model="model">
            <wd-cell-group>
              <wd-input label="身份证号" label-width="140rpx" disabled v-model="model.idCard" placeholder="" />
              <wd-input label="残疾证号" label-width="140rpx" disabled v-model="model.disabledCard" placeholder="" />
              <wd-input label="公司" label-width="140rpx" disabled v-model="model.company" placeholder="" />
              <wd-input label="入职时间" label-width="140rpx" disabled v-model="model.employmentDate" placeholder=""></wd-input>
            </wd-cell-group>
          </wd-form>
        </template>
      </div>
    </div>

    <view class="p-40px">
        <wd-button type="info" size="large" @click="logout" block>退出登录</wd-button>
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
let token =''
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
    fail(){
      uni.redirectTo({
        url:'/pages/login/index'
      })
    }
  })

  uni.getStorage({
    key: 'avatarfile', 
    success(res) {
      if(res.data) {
        joy.value = res.data
      }
    }
  })
})
function logout(){
  uni.removeStorage({key:TOKEN,success(){
    uni.redirectTo({url:'/pages/login/index'})
  }})
}
function init() {
  getInfo().then((res) => {
    if( res?.user?.avatar){
      joy.value = res.user.avatar
      uni.setStorage({
        key:'avatarfile',
        data:res.user.avatar
      })
    }
   
  }).catch(() => {
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
  uploadAvatar1({token, id, filePath: tempFilePath},init)
}
function handleCancel(event) {
}
</script>
