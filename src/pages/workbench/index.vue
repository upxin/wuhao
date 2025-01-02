<template>
  <wd-navbar :title="''" safeAreaInsetTop custom-style="background-color:#f5f5f5" :bordered="false"></wd-navbar>

  <section class="flex flex-wrap py-32rpx w-full box-border px-12rpx">
    <div class="p-12rpx w-1_2 box-border">
      <section class="item">
        <div class="text-40rpx mb-20rpx">工作任务</div>
        <div class="i-material-symbols-light-work-history-rounded h-100rpx w-100rpx my-20rpx mx-auto"></div>
        <div class="flex justify-between">
          <wd-button custom-style="font-weight:800;padding:16rpx 24rpx;border-radius: 16rpx;min-width: 120rpx"
            @tap="upload('task')">上传</wd-button>
          <wd-button custom-style="font-weight:800;padding:16rpx 24rpx;border-radius: 16rpx;min-width: 120rpx"
            type="success" @tap="view('task', '工作详情')">查看</wd-button>
        </div>
      </section>
    </div>

    <div class="p-12rpx w-1_2  box-border">
      <section class="item">
        <p class="text-40rpx mb-20rpx">合同签署</p>
        <div class="h-100rpx w-100rpx my-20rpx mx-auto flex justify-center items-center">
          <div class="i-mdi-file-sign h-80rpx w-80rpx"></div>
        </div>
        <section class="flex justify-between">
          <wd-button custom-style="font-weight:800;padding:16rpx 24rpx;border-radius: 16rpx;min-width: 120rpx"
            @tap="upload('contract')">上传</wd-button>
          <wd-button custom-style="font-weight:800;padding:16rpx 24rpx;border-radius: 16rpx;min-width: 120rpx"
            type="success" @tap="view('contract','合同详情')">查看</wd-button>
        </section>
      </section>
    </div>
    <div class="p-12rpx w-1_2  box-border">
      <section class="item">
        <p class="text-40rpx mb-20rpx">工资确认</p>
        <div class="h-100rpx w-100rpx my-20rpx mx-auto flex justify-center items-center">
          <div class="i-icon-park-solid-paper-money h-90rpx w-90rpx my-20rpx mx-auto"></div>
        </div>
        <section class="flex justify-between">
          <wd-button custom-style="font-weight:800;padding:16rpx 24rpx;border-radius: 16rpx;min-width: 120rpx"
            @tap="upload('pay')">上传</wd-button>
          <wd-button custom-style="font-weight:800;padding:16rpx 24rpx;border-radius: 16rpx;min-width: 120rpx"
            type="success" @tap="view('pay','工资详情')">查看</wd-button>
        </section>
      </section>
    </div>

    <div class="p-12rpx w-1_2  box-border">
      <section class="item">
        <p class="text-40rpx mb-20rpx">资料审核</p>
        <div class="h-100rpx w-100rpx my-20rpx mx-auto flex justify-center items-center">
          <div class="i-material-symbols-library-add-check h-80rpx w-80rpx my-20rpx mx-auto"></div>
        </div>
        <section class="flex justify-between">
          <wd-button custom-style="font-weight:800;padding:16rpx 24rpx;border-radius: 16rpx;min-width: 120rpx"
            @tap="upload('check')">上传</wd-button>
          <wd-button custom-style="font-weight:800;padding:16rpx 24rpx;border-radius: 16rpx;min-width: 120rpx"
            type="success" @tap="view('check', '资料审核')">查看</wd-button>
        </section>
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
  uni.showLoading({
    title: '上传中...', mask: true, icon: 'none'
  })
  uploadFile({
    bizId: id,
    bizType: type,
  }, token)
}

function view(type,title) {
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
  border: 6rpx solid var(--wot-color-theme);
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 28rpx;
  padding: 24rpx;
  border-radius: 26rpx;
}
</style>
