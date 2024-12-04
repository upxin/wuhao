<template>
  <wd-form ref="form" :model="model">
    <wd-cell-group border>
      <wd-input label="用户名" label-width="100px" prop="value1" disabled v-model="model.value1" placeholder="" />
      <wd-input label="身份证号" label-width="100px" prop="value2" disabled v-model="model.value1" placeholder="" />
      <wd-input label="残疾证号" label-width="100px" prop="value2" disabled v-model="model.value1" placeholder="" />
      <wd-input label="公司" label-width="100px" prop="value2" disabled v-model="model.value1" placeholder="" "/>
    </wd-cell-group>
  </wd-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
const model = reactive<{
  value1: string
  value2: string
}>({
  value1: '',
  value2: ''
})

const form = ref()

function handleSubmit() {
}
</script>
