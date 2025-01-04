<template>
  <div v-if="loading" class="w-screen h-screen flex flex-col justify-center items-center fixed z-1000 top-0 left-0">
    <div class="i-line-md-loading-twotone-loop w-180rpx h-180rpx"></div>
  </div>
  <div v-show="!loading" class="card-swiper flex flex-col h-screen overflow-hidden relative">
    <!-- <wd-swiper :list="swiperList" :autoplay="true" v-model:current="current" height="240" :imageMode="'widthFix'"
      :indicator="{ type: 'dots-bar' }"></wd-swiper> -->

    <map class="h-full w-screen" :longitude="lon" :latitude="lat" :markers="markers" scale="16" controls>
      <template slot="callout">
        <cover-view marker-id="123" class="pop">
          {{ addrDetail }}
        </cover-view>
      </template>
    </map>


    <div class=" absolute flex justify-around bottom-60rpx w-screen">
      <wd-button :size="'large'" @click="showCameraFunc"
        custom-style="font-weight:800;padding:20rpx 112rpx;border-radius: 16rpx;min-width: 160rpx;font-size-40rpx">打&nbsp;&nbsp;卡</wd-button>
      <wd-button :size="'large'" @click="viewHistory('pointRecord', '考勤记录')"
        custom-style="font-weight:800;padding:20rpx 112rpx;border-radius: 16rpx;min-width: 160rpx"
        :type="'success'">查&nbsp;&nbsp;看</wd-button>
    </div>
  </div>

  <div v-show="showCamera"
    class="p-60rpx  bg-[#f5f5f5] w-full h-full fixed top-0 left-0 box-border overflow-hidden flex flex-col justify-center items-center">
    <wd-navbar :title="''" safeAreaInsetTop custom-style="background-color:#f5f5f5" :bordered="false"></wd-navbar>

    <camera class="flex-1 border-16rpx rounded-md border-fff border-solid box-border w-full overflow-hidden"
      device-position="front" flash="off"></camera>
    <div class="py-60rpx flex justify-around z-1000 w-full">
      <wd-button custom-style="font-weight:600" size="large" @tap="takePhoto">拍照</wd-button>
      <wd-button custom-style="font-weight:600" size="large" type="success" @tap="hideCamera">取消</wd-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onReady, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { getBanner, uploadFile } from '@/api';
import { AMapWX } from '../../amap-wx.130'
import LocationIcon from '@/static/icon/location.png'
import { host, TOKEN } from "@/utils";

const loading = ref(true)
const current = ref<number>(2)
const swiperList = ref([])
const lon = ref(0)
const lat = ref(0)
const markers = ref([])
const addrDetail = ref('')
let myAmapFun
let id = ref()
let token = ref()
let phonenumber = ref()

const showCamera = ref(false)

const showCameraFunc = () => {
  showCamera.value = true;
};

const hideCamera = () => {
  showCamera.value = false;
};
onShareAppMessage(() => {
  return {
    title: '大美',                //分享的标题
    path: 'pages/login/index',      //点击分享链接之后进入的页面路径
  };
})

onShareTimeline(() => {
  return {
    title: '大美',
  };
});

function init() {
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
        id.value = res.rows[0]?.id
        phonenumber.value = res.rows[0]?.phonenumber
      })
    }
  })
  uni.getStorage({
    key: 'TOKEN',
    success(res) {
      token.value = res.data
    }
  })

  // getBanner({
  //   pageSize: 6,
  //   pageNum: 1,
  //   bizType: 'banner',
  //   bizId: 'banner'
  // }).then(res => {
  //   swiperList.value = res.data.map(item => item.url)
  // })
}

const getAddr = (location) => {
  return new Promise((rv, rj) => {
    myAmapFun.getRegeo({
      location, // 经度, 纬度
      success(data) {
        rv(data)
      },
      fail(err) {
        uni.hideLoading()
        console.error('逆地理编码失败:', err);
      }
    });
  })
}

async function takePhoto() {

  uni.showLoading({
    title: '正在打卡...',
    mask: true,
    icon: 'none'
  })
  try {
    const addr = await getAddr(`${lon.value},${lat.value}`)
    const pointAddressReal = addr[0].regeocodeData.formatted_address
    const filePath = await getPhoto()
    const uuid = ('' + Math.random()).split('.')[1] + ('' + Math.random() * 100).split('.')[0]
    await uploadPhoto(filePath, uuid)
    await point(pointAddressReal, uuid)
    uni.hideLoading()
  } catch (error) {

    uni.hideLoading()
    uni.showToast({
      title: '打卡异常',
      icon: 'fail'
    })
  }
}

function uploadPhoto(filePath, uuid) {
  return new Promise((rv, rj) => {
    uni.uploadFile({
      url: host + '/file/file/upload',
      filePath,
      name: 'file',
      formData: {
        bizId: uuid,
        bizType: 'pointRecord'
      },
      header: {
        'Authorization': token.value
      },
      success() {
        rv(true)
      },
    });
  })
}

function point(pointAddressReal, uuid) {
  return new Promise((rv, rj) => {
    uni.u.post('/system/pointRecord/disabledUserPoint', { data: { pointAddressReal, id: uuid } }).then(r4 => {
      if (r4.code == 200) {
        rv(true)
        uni.hideLoading()
        uni.showToast({
          icon: 'none',
          title: "打卡成功"
        })
        hideCamera()
      }
    }).catch((err) => {
      rj(err)
    })
  })

}
function getPhoto() {
  const ctx = uni.createCameraContext()
  return new Promise((rv, rj) => {
    ctx.takePhoto({
      quality: 'low',
      success(res) {
        const filePath = res.tempImagePath
        rv(filePath)
      },
      fail(err) {
        rj(err)
      }
    })
  })
}

function viewHistory(type, title) {
  const url = `/pages/history/index?bizId=${id.value}&bizType=${type}&phonenumber=${phonenumber.value}&title=${title}`
  uni.navigateTo({
    url
  })
}



onReady(async () => {
  init()
  try {
    myAmapFun = new AMapWX({
      key: '12eb12da01685bd7f18c119afc730035'
    });
    const res = await uni.getLocation({
      type: 'wgs84'
    })
    const { latitude, longitude } = res
    const addrInfo = await getAddr(`${longitude},${latitude}`)
    addrDetail.value = addrInfo[0].regeocodeData.formatted_address
    lon.value = longitude
    lat.value = latitude
    markers.value = [{
      id: 123,
      latitude,
      longitude,
      iconPath: LocationIcon,
      width: 50,
      height: 50,
      customCallout: {
        anchorY: 2,
        anchorX: 0,
        display: 'ALWAYS'
      },
    }]
    loading.value = false
  } catch (error) {
    loading.value = false
  }
})
</script>

<style lang="scss">
.card-swiper {
  --wot-swiper-radius: 0;
  --wot-swiper-nav-dot-color: #e7e7e7;
  --wot-swiper-nav-dot-active-color: #4d80f0;

  :deep(.custom-indicator-class) {
    bottom: -16px;
  }

  // :deep(.wd-swiper__track) {
  //   border-radius: 0;
  // }

  :deep(.wd-swiper-nav__item--dots-bar.is-active) {
    border-radius: 14rpx;
  }
}

.pop {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 16rpx 12rpx;
  width: 520rpx;
  height: auto;
  white-space: pre-wrap;
  word-break: break-all;
  text-align: center;
  overflow: auto;
}
</style>
