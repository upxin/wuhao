<template>
  <wd-navbar :title="title" safeAreaInsetTop fixed left-arrow @click-left="handleClickLeft" :bordered="false"
    :zIndex="10000"></wd-navbar>
  <wd-navbar safeAreaInsetTop></wd-navbar>

  <section v-if="list.length" class="safe">
    <div v-for="item in list" :key="item.id" class="bg-fff mb-24rpx p-24rpx w-full box-border">

      <div class="mb-24rpx text-[#4D4D4D] flex" v-if="bizType !== 'pointRecord'">
        <view>创建时间：</view>
        <view class="text-[#bbb]">{{ item.createTime }}</view>
      </div>

      <section class="relative flex" v-if="bizType === 'pointRecord'">
        <div class=" absolute center-left bottom-80rpx text-fff font-600  z-999  flex w-300px box-border px-12rpx">
          <view class="i-material-symbols-location-on h-44rpx w-44rpx pt-4rpx"></view>
          <view class="flex-1 ml-12rpx">{{ item.pointAddressReal }}</view>
        </div>
        <div
          class=" absolute center-left bottom-24rpx text-fff font-600  z-999  flex items-center  w-300px box-border px-12rpx">
          <view class="i-material-symbols-alarm-outline h-40rpx w-40rpx"></view>
          <view class="ml-12rpx flex-1">{{ item.pointTime }}</view>
        </div>
        <div class="w-full flex justify-center">
          <img :mode="'widthFix'" class="w-300px" :src="item.url" />
        </div>
      </section>
      <section v-else class="flex justify-center">
        <img v-if="getFileType(item.url) === 'image'" :mode="'widthFix'" class="w-300px" :src="item.url" />
        <div v-else class="w-300px h-300px bg-[#ddd] flex justify-center items-center">
          <wd-icon name="play-circle" @click="handleItem(item)" size="140px" color="#fff"></wd-icon>
        </div>
      </section>

    </div>
    <wd-loadmore :state="state" />

  </section>

  <div v-else class="text-[#bbb] text-20px text-center"><wd-status-tip image="content" tip="暂无内容" /></div>
</template>

<script lang="ts" setup>
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { getByBiz, pointRecord } from '@/api/index'
const list = ref([])
const state = ref<'finished' | 'loading'>('loading')

let pageNum = 1
let query;
let total = 0
let pageSize = 5
const bizType = ref('')
const title = ref('')
onLoad((opts) => {
  query = opts
  bizType.value = opts.bizType
  title.value = opts.title
  listRecord(true)
})
function handleClickLeft() {
  uni.navigateBack({})
}
function listRecord(refresh: boolean) {
  uni.showLoading({ mask: true })
  const { bizType, bizId } = query
  const fn = bizType === 'pointRecord' ? pointRecord : getByBiz
  const params = bizType === 'pointRecord' ? { userId: bizId, pageSize, pageNum } : {
    pageSize,
    pageNum,
    bizType,
    bizId
  }

  fn(params).then(res => {
    uni.stopPullDownRefresh()
    console.log('9999999999', params,res.rows)
    if (refresh) {
      list.value = res.rows
    } else {
      list.value = [...list.value, ...res.rows]
    }
    total = res.total
    if (total <= pageNum * pageSize) {
      state.value = 'finished'
    }
  }).finally(() => {
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
  listRecord(true)
})
onReachBottom(() => {
  if (total <= pageNum * pageSize) {
    state.value = 'finished'
    return
  }
  pageNum += 1
  listRecord(false)
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
