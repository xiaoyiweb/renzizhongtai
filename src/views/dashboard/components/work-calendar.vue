<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select
        v-model="currentYear"
        placeholder="请选择年份"
        style="width: 120px"
        @change="dateChange"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        >
          {{ item }}
        </el-option>
      </el-select>
      <el-select
        v-model="currentMonth"
        placeholder="请选择月份"
        style="width: 120px"
        @change="dateChange"
      >
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">
          {{ item }}
        </el-option>
      </el-select>
    </el-row>

    <el-calendar :key="$i18n.locale" v-model="currentDate">
      <template slot="dateCell" slot-scope="{ date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay (value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  data () {
    return {
      currentYear: '',
      currentMonth: '',
      yearList: [],
      startDate: new Date(),
      currentDate: new Date()
    }
  },

  created () {
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1
    this.yearList = Array.from(Array(11), (value, index) => this.currentYear + index - 5)
  },

  methods: {
    // 是否是休息日
    isWeek (value) {
      return value.getDay() === 6 || value.getDay() === 0
    },
    dateChange () {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`)
    }
  }

}
</script>

<style lang="scss" scoped>
::v-deep .el-calendar-day {
  height: 50px;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
// 休息时间
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
// 当前日期
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
</style>
