<template>
  <wd-navbar :title="''" safeAreaInsetTop custom-style="background-color:#f5f5f5" :bordered="false"></wd-navbar>

  <section class="flex flex-wrap py-32rpx w-full box-border px-24rpx">
    <div class="p-12rpx w-1_2 box-border item">
      <section class=" flex flex-col">
        <div class="text-40rpx">工作任务</div>
        <div class="i-material-symbols-light-work-history-rounded h-160rpx w-160rpx  mx-auto"></div>
      </section>
      <div class="flex flex-col justify-around">
        <wd-button custom-style="font-weight:800;padding:20rpx 32rpx;border-radius: 16rpx;min-width: 160rpx"
          @tap="upload('task')">上&nbsp;&nbsp;传</wd-button>
        <wd-button custom-style="font-weight:800;padding:20rpx 32rpx;border-radius: 16rpx;min-width: 160rpx"
          type="success" @tap="viewHistory('task', '工作详情')">查&nbsp;&nbsp;看</wd-button>
      </div>
    </div>

    <div class="p-12rpx w-1_2  box-border item">
      <section class="">
        <p class="text-40rpx">合同签署</p>
        <div class="h-180rpx w-180rpx  mx-auto flex justify-center items-center">
          <div class="i-mdi-file-sign h-160rpx w-160rpx"></div>
        </div>
      </section>
      <section class="flex flex-col justify-around">
        <wd-button custom-style="font-weight:800;padding:20rpx 32rpx;border-radius: 16rpx;min-width: 160rpx"
          @tap="upload('contract')">上&nbsp;&nbsp;传</wd-button>
        <wd-button custom-style="font-weight:800;padding:20rpx 32rpx;border-radius: 16rpx;min-width: 160rpx"
          type="success" @tap="viewHistory('contract', '合同详情')">查&nbsp;&nbsp;看</wd-button>
      </section>
    </div>

    <div class="p-12rpx w-1_2  box-border item">
      <section class="">
        <p class="text-40rpx">工资确认</p>
        <div class="h-180rpx w-180rpx  mx-auto flex justify-center items-center">
          <div class="i-icon-park-solid-paper-money h-160rpx w-160rpx  mx-auto"></div>
        </div>
      </section>
      <section class="flex flex-col justify-around">
        <wd-button custom-style="font-weight:800;padding:20rpx 32rpx;border-radius: 16rpx;min-width: 160rpx"
          @tap="upload('pay')">上&nbsp;&nbsp;传</wd-button>
        <wd-button custom-style="font-weight:800;padding:20rpx 32rpx;border-radius: 16rpx;min-width: 160rpx"
          type="success" @tap="viewHistory('pay', '工资详情')">查&nbsp;&nbsp;看</wd-button>
      </section>
    </div>

    <div class="p-12rpx w-1_2  box-border item">
      <section class="">
        <p class="text-40rpx">年审资料</p>
        <div class="h-180rpx w-180rpx  mx-auto flex justify-center items-center">
          <div class="i-material-symbols-library-add-check h-160rpx w-160rpx  mx-auto"></div>
        </div>
      </section>
      <section class="flex flex-col justify-around">
        <wd-button custom-style="font-weight:800;padding:20rpx 32rpx;border-radius: 16rpx;min-width: 160rpx"
          @tap="upload('check')">上&nbsp;&nbsp;传</wd-button>
        <wd-button custom-style="font-weight:800;padding:20rpx 32rpx;border-radius: 16rpx;min-width: 160rpx"
          type="success" @tap="viewHistory('check', '资料审核')">查&nbsp;&nbsp;看</wd-button>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { uploadFile } from '@/api/index'
import { host, TOKEN } from "@/utils";
import { onLoad } from '@dcloudio/uni-app'
import { AMapWX } from '../../amap-wx.130'

let id = ''
let token = ''
let phonenumber = ''

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
        id = res.rows[0]?.id
        phonenumber = res.rows[0]?.phonenumber
      })
    }
  })
  uni.getStorage({
    key: 'TOKEN',
    success(res) {
      token = res.data
    }
  })
})
let myAmapFun
onLoad(() => {
  myAmapFun = new AMapWX({
    key: '12eb12da01685bd7f18c119afc730035'
  });
})
function upload(type) {
  uploadFile({
    bizId: id,
    bizType: type,
  }, token)
}

function viewHistory(type, title) {
  uni.navigateTo({
    url: `/pages/history/index?bizId=${id}&bizType=${type}&phonenumber=${phonenumber}&title=${title}`
  })
}
</script>

<style lang="scss">
page {
  background-color: #f5f5f5;
}

.item {
  display: flex;
  border: 6rpx solid var(--wot-color-theme);
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 28rpx;
  padding: 24rpx;
  border-radius: 26rpx;
  justify-content: space-around;
}
</style>
