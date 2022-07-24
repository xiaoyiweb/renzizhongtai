<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <page-tools :show-before="true">
      <span slot="before">共111条数据</span>
      <template slot="after">
        <el-button>添加</el-button>
        <el-button>删除</el-button>
      </template>
    </page-tools>
    <upload-excel />

    <imageUpload />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
