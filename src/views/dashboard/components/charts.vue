<template>
  <div id="myRadar" ref="myRadar" class="myRadar"></div>
</template>

<script>
export default {
  mounted () {
    this.radar()
  },

  methods: {
    radar () {
      const myChart = this.echarts.init(this.$refs.myRadar)
      myChart.setOption({
        radar: {
          // shape: 'circle',
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [90, 60, 100, 50, 100, 70],
                name: '张三'
              },
              {
                value: [80, 60, 70, 50, 40, 60],
                name: '李四'
              }
            ]
          }
        ]
      })
    }
  }
}
</script>

<style>
.myRadar {
  width: 100%;
  height: 300px;
}
</style>
