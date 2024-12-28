<template>
  <view class="card-swiper py-40rpx">
    <wd-swiper :list="swiperList" :autoplay="false" v-model:current="current"
      custom-indicator-class="custom-indicator-class" custom-image-class="custom-image"
      custom-next-image-class="custom-image-prev" custom-prev-image-class="custom-image-prev"
      :indicator="{ type: 'dots-bar' }" previousMargin="24px" nextMargin="24px">
    </wd-swiper>
  </view>
  <!-- <wd-button @click="up">上传</wd-button> -->

  <view class="py40rpx">
    <wd-card title="公司简介">
      我们公司专注于为残疾人提供就业相关的服务，致力于帮助他们在职场中找到合适的岗位，实现职业梦想。作为一家专业的残疾人就业服务机构，我们的服务涵盖职业评估、技能培训、就业指导、岗位匹配和职场适应等多个方面。
    </wd-card>
    <wd-card title="专业团队">
      我们的团队由资深的职业顾问、培训师和心理咨询师组成，确保每一位客户都能获得个性化的职业发展方案。我们通过科学的职业评估，了解每位残疾人的兴趣、能力和需求，制定量身定制的培训计划，提升他们的职业技能和竞争力。
    </wd-card>
    <wd-card title="企业合作">
      我们与众多企业建立了紧密的合作关系，积极开拓适合残疾人的就业岗位，帮助他们顺利融入职场。通过我们的努力，我们不仅帮助残疾人找到工作，更希望他们在工作中获得成就感和自信心。
    </wd-card>
    <wd-card title="持续支持">
      我们还提供持续的职场适应支持，确保他们在新的工作环境中能够顺利过渡和长期稳定发展。我们的使命是为残疾人创造更多的就业机会，推动社会的包容和多元化发展。
    </wd-card>

    <wd-card title="使命与愿景">
      我们深信，每个人都有独特的价值和潜力。我们将继续努力，为残疾人提供全方位的就业支持，帮助他们实现职业梦想，过上独立、自信和充实的生活。
    </wd-card>
  </view>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { host, TOKEN } from '@/utils/index'
import { onLoad } from '@dcloudio/uni-app';
import { getByBiz, getInfo, uploadFile } from '@/api';

const current = ref<number>(2)

const swiperList = ref([])

function up() {
  const token = uni.getStorageSync(TOKEN)
  console.log(token)
  uploadFile({
    bizId: 'banner',
    bizType: 'banner',
  }, token)
}

function init() {
  getByBiz({
    pageSize: 6,
    pageNum: 1,
    bizType: 'banner',
    bizId: 'banner'
  }).then(res => {
    swiperList.value = res.data.map(item => item.url)
  })
}

onLoad(() => {
  init()
})
</script>
<style lang="scss">
.card-swiper {
  --wot-swiper-radius: 0;
  --wot-swiper-item-padding: 0 24rpx;
  --wot-swiper-nav-dot-color: #e7e7e7;
  --wot-swiper-nav-dot-active-color: #4d80f0;
  padding-bottom: 24rpx;

  :deep(.custom-indicator-class) {
    bottom: -16px;
  }

  :deep(.wd-swiper-nav__item--dots-bar.is-active) {
    border-radius: 14rpx;
  }

  :deep(.custom-image) {
    border-radius: 12rpx;
  }

  :deep(.custom-image-prev) {
    height: 168px !important;
  }
}
</style>
