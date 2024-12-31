<template>
  <div class="py-80rpx">
    <wd-card :title="item.createTime" v-for="item in list" :key="item.id" v-if="list?.length" custom-class="my-shadow">
      <div class="pb-20px" v-if="item.pointAddressReal">{{ item.pointAddressReal }}</div>
      <div class="relative w-300px" v-if="bizType === 'pointRecord'">
        <div class=" absolute left-10rpx bottom-24rpx text-red font-800  z-999 w-280px"> {{ item.pointTime }} </div>
        <div class=" absolute left-10rpx bottom-70rpx text-red font-800  z-999 w-280px">
          {{ item.pointAddressReal }}
        </div>
        <wd-img :width="300" :height="400" :src="item.url" />
      </div>
      <div v-else>
        <wd-img v-if="getFileType(item.url) === 'image'" :width="300" :height="400" :src="item.url" :enable-preview="false" />
        <wd-button v-else @click="handleItem(item)">视频文件请点击查看</wd-button>
      </div>
    </wd-card>
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
onLoad((opts) => {
  query = opts
  bizType.value = opts.bizType
  listRecord()
})

function listRecord() {
  const { bizType, bizId, phonenumber } = query
  if (bizType === 'pointRecord') {
    pointRecord({ userId: bizId, pageSize, pageNum }).then(res => {
      uni.stopPullDownRefresh()
      list.value = [...list.value, ...res.rows]
      total = res.total
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
    list.value = [...list.value, ...res.data]
    total = res.total
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
.center {
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.my-shadow {
  box-shadow:0px 3px 8px #ddd !important;
}
</style>
