<template>
  <section class="w-screen h-screen overflow-auto py-40rpx">
    <wd-card title="考勤打卡" custom-class="border border-solid border-primary">
      通过小程序远程进行岗位考勤打卡
      <template #footer>
        <wd-button size="large" custom-class="mr-20rpx" @tap="showCameraFunc">考勤打卡</wd-button>
        <wd-button size="large" type="success" @tap="view('pointRecord')">查看记录</wd-button>
      </template>
    </wd-card>
    <wd-card title="工作任务" custom-class="border border-solid border-primary">
      任务发布和完成
      <template #footer>
        <wd-button size="large" custom-class="mr-20rpx" @tap="upload('task')">上传任务</wd-button>
        <wd-button size="large" type="success" @tap="view('task')">查看任务</wd-button>
      </template>
    </wd-card>
    <wd-card title="合同视频" custom-class="border border-solid border-primary">
      入职人员签署劳动合同过程
      <template #footer>
        <wd-button size="large" custom-class="mr-20rpx" @tap="upload('contract')">上传合同</wd-button>
        <wd-button size="large" type="success" @tap="view('contract')">查看合同</wd-button>
      </template>
    </wd-card>
    <wd-card title="工资视频" custom-class="border border-solid border-primary">
      入职人员工资确认
      <template #footer>
        <wd-button size="large" custom-class="mr-20rpx" @tap="upload('pay')">上传薪酬</wd-button>
        <wd-button size="large" type="success" @tap="view('pay')">查看薪酬</wd-button>
      </template>
    </wd-card>
  </section>

  <div class="w-screen h-screen fixed top-0 left-0" v-show="showCamera">
    <camera class="w-screen h-screen absolute z-999 left-0 top-0" device-position="front" flash="off"></camera>
    <div class="absolute w-screen bottom-60rpx flex justify-around z-1000">
      <wd-button size="large" custom-class="mr-20rpx" @tap="takePhoto">拍照</wd-button>
      <wd-button size="large" type="success" @tap="hideCamera">取消</wd-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { uploadFile } from '@/api/index'
import { host, TOKEN } from "@/utils";
import { onLoad } from '@dcloudio/uni-app'
import { AMapWX } from '../../amap-wx.130'

let id = ''
let addr = ''
let token = ''
let phonenumber = ''
const showCamera = ref(false)

const showCameraFunc = () => {
  showCamera.value = true;
};

const hideCamera = () => {
  showCamera.value = false;
};


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
        addr = res.rows[0]?.pointAddress
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
// 12eb12da01685bd7f18c119afc730035
async function takePhoto() {
  const ctx = uni.createCameraContext()
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

  const res = await uni.getLocation({
    type: 'wgs84',
  })
  const { latitude, longitude } = res
  const addr = await getAddr(`${longitude},${latitude}`)
  const pointAddressReal = addr[0].regeocodeData.formatted_address

  uni.showLoading({
    title: '打卡中...',
    mask: true,
    icon: 'none'
  })
  ctx.takePhoto({
    quality: 'low',
    success: (r1) => {
      const filePath = r1.tempImagePath
      const id = ('' + Math.random()).split('.')[1] + ('' + Math.random() * 100).split('.')[0]
      uni.uploadFile({
        url: host + '/file/file/upload',
        filePath,
        name: 'file',
        formData: {
          bizId: id,
          bizType: 'pointRecord'
        },
        header: {
          'Authorization': token
        },
        success: function () {
          uni.u.post('/system/pointRecord/disabledUserPoint', { data: { pointAddressReal, id } }).then(r4 => {
            if (r4.code == 200) {
              uni.hideLoading()
              uni.showToast({
                icon: 'none',
                title: "打卡成功"
              })
              hideCamera()
            }
          })
        },
      });
    },
  })
}

function view(type) {
  uni.navigateTo({
    url: `/pages/history/index?bizId=${id}&bizType=${type}&phonenumber=${phonenumber}`
  })
}
</script>

<style>
.slide-in {
  transform: translateX(0);
}

.slide-out {
  transform: translateX(100%);
}
</style>
