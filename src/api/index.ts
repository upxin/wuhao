interface UploadParams {
  bizId: string // 用uuid生成
  bizType: string
}
import { host } from "@/utils";
export function uploadFile(formData:UploadParams,token) {
  uni.chooseMedia({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 获取选择的文件信息
      var tempFilePaths = res.tempFiles;
      // 上传文件到服务器
      uni.uploadFile({
        url: host + '/file/file/upload', // 你的接口地址
        filePath: tempFilePaths[0]?.tempFilePath, // 文件路径，如：tempFilePath[0] 图片, tempFilePath[1] 音乐, tempFilePath[2] 视频 tempFilePath[3] 其他文件, tempFilePath[4] 语音读, tempFilePath[5] 压缩文件, tempFilePath[6] 其他文件(压缩包), tempFilePath[7] 其他文件(音频), tempFilePath[8] 其他文件(视频), tempFilePath[9] 其他文件(未知), tempFilePath[10] 其他文件(其它)等等类型，请根据类型来决定你的逻辑，比如图片转码，或者上传到云存储等。
        name: 'file', // 文件字段名，默认为file
        formData,
        header: {
          'Authorization': token
        },
        success: function (res) {
          // 上传成功，处理服务器返回的响应信息
          var data = res.data;
          uni.hideLoading()
        },
        fail: function (res) {
          // 上传失败，处理上传错误
        }
      });
    }
  });
}

export function uploadAvatar(formData:UploadParams,token, cb) {
  uni.chooseMedia({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 获取选择的文件信息
      var tempFilePaths = res.tempFiles;
      // 上传文件到服务器
      uni.uploadFile({
        url: host + '/system/saas/user/profile/avatar', // 你的接口地址
        filePath: tempFilePaths[0]?.tempFilePath, // 文件路径，如：tempFilePath[0] 图片, tempFilePath[1] 音乐, tempFilePath[2] 视频 tempFilePath[3] 其他文件, tempFilePath[4] 语音读, tempFilePath[5] 压缩文件, tempFilePath[6] 其他文件(压缩包), tempFilePath[7] 其他文件(音频), tempFilePath[8] 其他文件(视频), tempFilePath[9] 其他文件(未知), tempFilePath[10] 其他文件(其它)等等类型，请根据类型来决定你的逻辑，比如图片转码，或者上传到云存储等。
        name: 'avatarfile', // 文件字段名，默认为file
        formData,
        header: {
          'Authorization': token
        },
        success: function (res) {
          // 上传成功，处理服务器返回的响应信息
          var data = res.data;
          cb?.()
        },
        fail: function (res) {
          // 上传失败，处理上传错误
        }
      });
    }
  });
}
export function uploadAvatar1({token, id, filePath}, cb) {
  uni.uploadFile({
    url: host + '/system/saas/user/profile/avatar', // 你的接口地址
    filePath, // 文件路径，如：tempFilePath[0] 图片, tempFilePath[1] 音乐, tempFilePath[2] 视频 tempFilePath[3] 其他文件, tempFilePath[4] 语音读, tempFilePath[5] 压缩文件, tempFilePath[6] 其他文件(压缩包), tempFilePath[7] 其他文件(音频), tempFilePath[8] 其他文件(视频), tempFilePath[9] 其他文件(未知), tempFilePath[10] 其他文件(其它)等等类型，请根据类型来决定你的逻辑，比如图片转码，或者上传到云存储等。
    name: 'avatarfile', // 文件字段名，默认为file
    formData: {
      bizId: id,
      bizType: 'avatarfile',
    },
    header: {
      'Authorization': token
    },
    success: function (res) {
      // 上传成功，处理服务器返回的响应信息
      var data = res.data;
      cb?.()
    },
    fail: function (res) {
      // 上传失败，处理上传错误
    }
  });
}

export function getInfo() {
  return new Promise((rv, rj) => {
    uni.u
      .get("system/saas/user/getInfo")
      .then((res) => {
        uni.setStorage({
          key: 'name',
          data: res.user.userName
        })
        uni.setStorage({
          key: 'loginName',
          data: res.user.loginName
        })
        uni.setStorage({
          key:'avatarfile',
          data:res.user.avatar
        })
        rv(res);
      })
      .catch((err) => { rj(err)});
  });
}


export function loginApi(data) {
  return new Promise((rv, rj) => {
    uni.u.post("auth/saas/login", {
      data
    }).then((res) => {
        rv(res);
      })
      .catch(() => { });
  });
}



export function getByBiz(data) {
  return new Promise((rv, rj) => {
    uni.u
      .get("/file/file/getByBiz", { data })
      .then((res) => {
        rv(res);
      })
      .catch(() => { });
  });
}

export function test(data) {

  return new Promise((rv, rj) => {
    uni.u.post("http://47.100.214.251:9201/disabledUser/getById", {
      data
    })
  });
}


export function pointRecord(data) {
  return new Promise((rv, rj) => {
    uni.u.get("/system/pointRecord/selectPage", {
      data
    }).then((res) => {
      rv(res);
    })
  });
}


