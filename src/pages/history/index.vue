<template>
  <div class="pt-40rpx"></div>
  <wd-card :title="item.createTime" v-for="item in list" :key="item.id" v-if="list?.length">
    <div class="pb-20px">{{ item.pointAddressReal }}</div>
    <wd-img :width="100" :height="100" :src="item.url" :enable-preview="true" v-if="getFileType(item.url) === 'image'"/>
    <wd-button @click="handleItem(item)"  v-else>视频文件请点击查看</wd-button>
    <!-- <wd-button  type="text" size="large" @tap="handleItem(item)">查看文件</wd-button> -->
  </wd-card>
  <div v-else class="text-[#bbb] text-20px text-center"><wd-status-tip image="content" tip="暂无内容" /></div>
</template>

<script lang="ts" setup>
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';
import { getByBiz, pointRecord } from '@/api/index'
const list = ref([])
let pageNum = 1
let query;
let total = 0
let pageSize = 5

onLoad((opts) => {
  query = opts
  listRecord()
})

function listRecord() {
  const { bizType, bizId, phonenumber } = query
  if (bizType === 'pointRecord') {
    pointRecord({ userId:bizId, pageSize, pageNum }).then(res => {
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
function handleItem(item){
  const type = getFileType(item.url) 
  uni.previewMedia({
    sources:[{ url:item.url, type }]
  })
}
onPullDownRefresh(()=>{
  pageNum = 1
  listRecord()
})
onReachBottom(()=>{
  if(total <= pageNum* pageSize) return
  pageNum += 1
  listRecord()
})
</script>
