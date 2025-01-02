<template>
  <wd-navbar :title="title" safeAreaInsetTop fixed left-arrow  @click-left="handleClickLeft"></wd-navbar>
  <wd-navbar :title="title" safeAreaInsetTop left-arrow  @click-left="handleClickLeft"></wd-navbar>
  <div class="pb-40rpx w-full box-border">
    <div v-for="item in list" :key="item.id" v-if="list?.length" class="bg-fff mb-24rpx p-24rpx w-full box-border">
      <div class="mb-24rpx text-[#4D4D4D]" v-if="bizType !== 'pointRecord'">创建时间：<span class="text-[#bbb]">{{ item.createTime }}</span></div>

      <div class="relative flex" v-if="bizType === 'pointRecord'">
        <div class=" absolute center-left bottom-80rpx text-fff font-600  z-999  flex w-300px box-border px-12rpx">
          <span class="i-material-symbols-location-on h-44rpx w-44rpx pt-4rpx"></span>
          <span class="flex-1 ml-12rpx">{{ item.pointAddressReal }}</span>
        </div>
        <div class=" absolute center-left bottom-24rpx text-fff font-600  z-999  flex items-center  w-300px box-border px-12rpx">
          <span class="i-material-symbols-alarm-outline h-40rpx w-40rpx"></span>
          <span class="ml-12rpx flex-1">{{ item.pointTime }}</span>
        </div>
        <div class="w-full flex justify-center">
          <img :mode="'widthFix'" class="w-300px" :src="item.url" />
        </div>
      </div>
      <div v-else class="flex justify-center">
        <img v-if="getFileType(item.url) === 'image'" :mode="'widthFix'" class="w-300px" :src="item.url" />
        <div v-else class="w-300px h-300px bg-[#ddd] flex justify-center items-center">
          <wd-icon name="play-circle" @click="handleItem(item)" size="140px" color="#fff"></wd-icon>
        </div>
      </div>

    </div>

    <div v-else class="text-[#bbb] text-20px text-center"><wd-status-tip image="content" tip="暂无内容" /></div>
  </div>
</template>

<script lang="ts" setup>
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';
import { getByBiz, pointRecord } from '@/api/index'
const list = ref([])
let pageNum = 1
let query;
let total = 0
let pageSize = 10
const bizType = ref('')
const title = ref('')
onLoad((opts) => {
  query = opts
  bizType.value = opts.bizType
  title.value = opts.title
  listRecord()
})
function handleClickLeft() {
  uni.navigateBack({})
}
function listRecord() {
  uni.showLoading({mask: true})
  const { bizType, bizId, phonenumber } = query
  if (bizType === 'pointRecord') {
    pointRecord({ userId: bizId, pageSize, pageNum }).then(res => {
      uni.stopPullDownRefresh()
      list.value = [...list.value, ...res.rows]
      total = res.total
    }).finally(()=>{
      uni.hideLoading()
    })
    return
  }
  getByBiz({
    pageSize,
    pageNum,
    bizType,
    bizId
  }).then(res => {
    uni.stopPullDownRefresh()
    list.value = [...list.value, ...res.rows]
    total = res.total
  }).finally(()=>{
    uni.hideLoading()
  })
}
const getFileType = (url) => {
  if (!url) return 'image';

  const extension = url.split('.').pop().toLowerCase();

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];

  if (imageExtensions.includes(extension)) {
    return 'image';
  } else if (videoExtensions.includes(extension)) {
    return 'video';
  }
}
function handleItem(item) {
  const type = getFileType(item.url)
  uni.previewMedia({
    sources: [{ url: item.url, type }]
  })
}
onPullDownRefresh(() => {
  pageNum = 1
  listRecord()
})
onReachBottom(() => {
  if (total <= pageNum * pageSize) return
  pageNum += 1
  listRecord()
})
</script>
<style>
page {
  background-color: #f5f5f5;
}

.center-left {
  left: 50%;
  transform: translate3d(-50%, 0%, 0);
}

.my-shadow {
  box-shadow: 0px 3px 8px #ddd !important;
}
</style>
