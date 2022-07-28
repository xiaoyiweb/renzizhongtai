<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon
      class="fullscreen"
      :icon-class="isFull ? 'exit-fullscreen' : 'fullscreen'"
      @click="toggleScreen"
    />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'ScreenFull',

  data () {
    return {
      isFull: false
    }
  },

  created () {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        if (screenfull.isFullscreen) {
          this.isFull = true
        } else {
          this.isFull = false
        }
      })
    }
  },
  beforeDestroy () {
    screenfull.off('change')
  },

  methods: {
    toggleScreen () {
      if (!screenfull.isEnabled) {
        this.$message.warning('此时全屏不可用')
        return
      }

      screenfull.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
