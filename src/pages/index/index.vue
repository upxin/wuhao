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
      <wd-button :size="'large'" @click="showCameraFunc" :disabled="!isWorkingHours()"
        custom-style="font-weight:800;padding:20rpx 112rpx;border-radius: 16rpx;min-width: 160rpx;font-size-40rpx">打&nbsp;&nbsp;卡</wd-button>
      <wd-button :size="'large'" @click="viewHistory('pointRecord', '考勤记录')"
        custom-style="font-weight:800;padding:20rpx 112rpx;border-radius: 16rpx;min-width: 160rpx"
        :type="'success'">查&nbsp;&nbsp;看</wd-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onReady, onShareAppMessage, onShareTimeline, onShow } from '@dcloudio/uni-app';
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
const dimission = ref(true)
let myAmapFun
let id = ref()
let token = ref()
let phonenumber = ref()

function isWorkingHours() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour < 17;
}

function requestCameraPermission() {
  return new Promise((resolve, reject) => {
    // 检查当前的权限设置
    uni.getSetting({
      success(settingRes) {
        if (!settingRes.authSetting['scope.camera']) {
          // 请求相机权限
          uni.authorize({
            scope: 'scope.camera',
            success() {
              // 用户同意授权
              resolve();
            },
            fail() {
              // 用户拒绝授权，提示用户前往设置页面
              uni.showModal({
                title: '相机权限',
                content: '请前往设置页面开启相机权限，以便使用相机功能拍照打卡。',
                success(modalRes) {
                  if (modalRes.confirm) {
                    // 用户同意前往设置
                    uni.openSetting({
                      success(openSettingRes) {
                        if (openSettingRes.authSetting['scope.camera']) {
                          resolve();
                        } else {
                          reject(new Error('用户未授权相机权限'));
                        }
                      },
                      fail() {
                        reject(new Error('打开设置失败'));
                      }
                    });
                  } else {
                    reject(new Error('用户拒绝前往设置'));
                  }
                }
              });
            }
          });
        } else {
          // 已经有权限
          resolve();
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
}


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
onLoad(()=>{
  init()
})
onShow(()=>{
  init()
})
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


function viewHistory(type, title) {
  const url = `/pages/history/index?bizId=${id.value}&bizType=${type}&phonenumber=${phonenumber.value}&title=${title}`
  uni.navigateTo({
    url
  })
}

function checkAndRequestLocationPermission() {
  return new Promise((resolve, reject) => {
    // 检查当前的设置
    uni.getSetting({
      success(settingRes) {
        if (!settingRes.authSetting['scope.userLocation']) {
          // 如果没有定位权限，请求权限
          uni.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户同意授权
              resolve(true);
            },
            fail() {
              // 用户拒绝授权
              uni.showModal({
                title: '定位权限',
                content: '请前往设置开启定位权限，用于获取位置打卡。',
                success(modalRes) {
                  if (modalRes.confirm) {
                    // 用户同意前往设置
                    uni.openSetting({
                      success(openSettingRes) {
                        if (openSettingRes.authSetting['scope.userLocation']) {
                          resolve(true);
                        } else {
                          reject(new Error('用户未授权定位权限'));
                        }
                      },
                      fail() {
                        reject(new Error('打开设置失败'));
                      }
                    });
                  } else {
                    reject(new Error('用户拒绝前往设置'));
                  }
                }
              });
            }
          });
        } else {
          // 已经有权限
          resolve(true);
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
}
const getAddr = (location) => {
  return new Promise((rv, rj) => {
    myAmapFun.getRegeo({
      location, // 经度, 纬度
      success(data) {
        rv(data)
      },
      fail(err) {
        console.error('逆地理编码失败:', err);
      }
    });
  })
}

async function initLoc() {
  try {
    myAmapFun = new AMapWX({
      key: '12eb12da01685bd7f18c119afc730035'
    });
    const res = await checkAndRequestLocationPermission();
    if (!res) return false; // 如果权限请求失败，返回 false

    const loc = await uni.getLocation({
      type: 'wgs84'
    });

    const { latitude, longitude } = loc;
    lon.value = longitude;
    lat.value = latitude;

    const addrInfo = await getAddr(`${longitude},${latitude}`)
    addrDetail.value = addrInfo[0].regeocodeData.formatted_address

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
    }];
    loading.value = false;
    return true; // 初始化成功，返回 true
  } catch (error) {
    loading.value = false;
    return false; // 发生错误，返回 false
  }
}

const showCameraFunc = async () => {
  if (dimission.value) {
    return uni.showToast({
      title: '该职工已离职',
      icon: 'error'
    });
  }

  const locInitialized = await initLoc();
  if (!locInitialized) {
    console.error('定位初始化失败');
    return; // 如果定位初始化失败，停止执行后续逻辑
  }

  requestCameraPermission()
    .then(() => {
      console.log('相机权限已授权');
      // 调用相机功能
      uni.navigateTo({
        url: '/pages/point/index'
      });
    })
    .catch((err) => {
      console.error('相机权限未授权', err);
    });
};

onReady(async () => {
  // 在小程序启动或页面加载时调用
  initLoc()
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
