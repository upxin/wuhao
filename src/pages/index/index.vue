<template>
  <view>
    <wd-button @click="upload"></wd-button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { test } from '@/api';
const title = ref('Hello')
const tab = ref<number>(0)
function upload() {
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function(res) {
      // 获取选择的文件信息
      var tempFilePaths = res.tempFilePaths;
      console.log('tempFilePaths', tempFilePaths)
      // 上传文件到服务器
      wx.uploadFile({
        url: 'http://47.100.214.251:9300/file/upload', // 你的接口地址
        filePath: tempFilePaths[0], // 文件路径，如：tempFilePath[0] 图片, tempFilePath[1] 音乐, tempFilePath[2] 视频 tempFilePath[3] 其他文件, tempFilePath[4] 语音读, tempFilePath[5] 压缩文件, tempFilePath[6] 其他文件(压缩包), tempFilePath[7] 其他文件(音频), tempFilePath[8] 其他文件(视频), tempFilePath[9] 其他文件(未知), tempFilePath[10] 其他文件(其它)等等类型，请根据类型来决定你的逻辑，比如图片转码，或者上传到云存储等。
        name: 'file', // 文件字段名，默认为file
        formData:{
          bizId: '123', // 用uuid生成
          bizType:'77' 
        },
        success: function(res) {
          // 上传成功，处理服务器返回的响应信息
          var data = res.data;
          console.log(data);
        },
        fail: function(res) {
          // 上传失败，处理上传错误
          console.error(res);
        }
      });
    }
  });
}
</script>
