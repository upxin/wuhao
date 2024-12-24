<template>
  <div class="pt-40rpx"></div>
  <wd-card :title="item.createTime" v-for="item in list" :key="item.id" v-if="list?.length">
    <wd-button  type="text" size="large" @tap="handleItem(item)">查看文件</wd-button>
  </wd-card>
  <div v-else class="text-[#bbb] text-20px text-center">暂无数据</div>
</template>

<script lang="ts" setup>
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';
import { getByBiz, pointRecord } from '@/api/index'
const list = ref([])
let pageNum = 1
let query;
onLoad((opts) => {
  query = opts
  listRecord()
})

function listRecord() {
  const { bizType, bizId, phonenumber } = query
  if (bizType === 'pointRecord') {
    pointRecord({ phonenumber, pageSize: 30, pageNum }).then(res => {
      uni.stopPullDownRefresh()
      list.value = [...list.value, ...res.rows]
    })
    return
  }
  getByBiz({
    pageSize: 30, 
    pageNum,
    bizType,
    bizId
  }).then(res => {
    uni.stopPullDownRefresh()
    list.value = [...list.value, ...res.data]
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
  if(query.bizType === 'pointRecord') {
    // 拉接口
    uni.showLoading({
      title:'图片加载中...', mask:true
    })
    getByBiz({
      pageSize: 30, 
      pageNum:1,
      bizType: 'pointRecord',
      bizId:item.id
    }).then(res => {
      uni.hideLoading()
      uni.previewMedia({
        sources: res.data
      })
    })
  } else {
    uni.previewMedia({
      sources:[{ url:item.url, type }]
    })
  }
}
onPullDownRefresh(()=>{
  pageNum = 1
  listRecord()
})
onReachBottom(()=>{
  pageNum += 1
  listRecord()
})
</script>
