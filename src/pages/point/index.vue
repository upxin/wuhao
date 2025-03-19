<template>
  <camera class="h-screen w-screen fixed top-0 left-0" device-position="front" flash="off">
    <cover-view class="flex justify-around z-1000 w-full absolute bottom-160rpx flex justify-around">
      <cover-view class="w-300rpx py-30rpx bg-primary text-fff rounded-md text-center" @tap="takePhoto">拍照</cover-view>
      <cover-view class="w-300rpx py-30rpx text-fff bg-[#34D19D] rounded-md text-center"
        @tap="hideCamera">取消</cover-view>
    </cover-view>
  </camera>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onReady, onShareAppMessage, onShareTimeline, onShow } from '@dcloudio/uni-app';
import { getBanner, uploadFile } from '@/api';
import { AMapWX } from '../../amap-wx.130'
import LocationIcon from '@/static/icon/location.png'
import { host, TOKEN } from "@/utils";

const loading = ref(true)
const lon = ref(0)
const lat = ref(0)
const markers = ref([])
const addrDetail = ref('')
const dimission = ref(true)
let myAmapFun
let id = ref()
let token = ref()
let phonenumber = ref()


const hideCamera = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
};

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
        dimission.value = res.rows[0]?.status == '1'
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

  } catch (error) {
    console.log('error================', error)
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
      console.log('r4===================', r4)
      if (r4.code == 200) {
        rv(true)
        uni.showToast({
          icon: 'none',
          title: "打卡成功",
          complete() {
            hideCamera()
          }
        })
      } else {
        uni.showToast({
          icon: 'none',
          title: r4.data.msg,
          complete() {
            hideCamera()
          }
        })
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




onReady(async () => {
  init()
  // 在小程序启动或页面加载时调用
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
