export default {
  toPage(url: string, params?: any) {
    const fixUrl = `${url}?params=${encodeURIComponent(
      JSON.stringify(params)
    )}`;
    return new Promise((rv) => {
      uni.navigateTo({
        url: fixUrl,
        success() {
          rv(true);
        },
      });
    });
  },
  switchPage(url: string, params: any = {}) {
    return new Promise((rv) => {
      uni.switchTab({
        url,
        success() {
          rv(true);
        },
      });
    });
  },
  redirect(url: string, params: any = {}) {
    const fixUrl = `${url}?params=${encodeURIComponent(
      JSON.stringify(params)
    )}`;
    return new Promise((rv) => {
      uni.redirectTo({
        url: fixUrl,
        success() {
          rv(true);
        },
      });
    });
  },
  reLaunch(url: string, params: any = {}) {
    const fixUrl = `${url}?params=${encodeURIComponent(
      JSON.stringify(params)
    )}`;
    return new Promise((rv) => {
      uni.reLaunch({
        url: fixUrl,
        success() {
          rv(true);
        },
      });
    });
  },
};
