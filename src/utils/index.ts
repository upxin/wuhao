export * from './constants'
export function setStorage(key: string, data: any) {
  if (data === undefined) {
    data = null;
  }
  uni.setStorage({
    key,
    data: JSON.stringify(data),
  });
}

export function removeStorage(key: string) {
  uni.removeStorageSync(key);
}

export function getStorage(key: string) {
  return new Promise((rv) => {
    uni.getStorage({
      key,
      success: function (res) {
        rv(res)
      },
      fail() {
        rv(null);
      },
    });
  });
}

export const customValidatorPhone = (val: string) => {
  return /^[1][3,4,5,7,8][0-9]{9}$/.test(val);
};

export function getLocation(): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: "wgs84",
      success: (res) => {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
}
export const getCityInfo = (
  longitude: number,
  latitude: number,
  ...rest: any[]
): Promise<any> => {
  return new Promise((rv, rj) => {
    uni.request({
      url: "https://restapi.amap.com/v3/geocode/regeo",
      method: "GET",
      data: {
        ...rest,
        key: "22c8d318fca785d59d651775f30edede",
        location: `${longitude},${latitude}`,
        radius: 50,
      },
      success(res) {
        rv(res);
      },
      fail(err) {
        rj(rj);
      },
    });
  });
};
