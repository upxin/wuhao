export function uploadFile(data: any) {
  return uni.u.post("system/file/uploadOne", {
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getInfo() {
  return new Promise((rv, rj) => {
    uni.u
      .get("getInfo")
      .then((res) => {
        rv(res);
      })
      .catch(() => { });
  });
}


export function loginApi(data) {
  return new Promise((rv, rj) => {
    uni.u.post("auth/saas/login", {
      data
    })
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
