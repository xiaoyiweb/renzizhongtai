<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
          >
            导入
          </el-button>
          <el-button size="small" type="danger" @click="exportDate">
            导出
          </el-button>
          <el-button
            :disabled="!checkPermission('POINT-USER-ADD')"
            size="small"
            type="primary"
            @click="showDialog = true"
          >
            新增员工
          </el-button>
        </template>
      </page-tools>

      <el-card v-loading="loading">
        <el-table :data="list" style="width: 100%" border="">
          <el-table-column label="序号" sortable type="index">
          </el-table-column>
          <el-table-column prop="username" label="姓名" sortable>
          </el-table-column>
          <el-table-column label="头像" align="center">
            <template slot-scope="{ row }">
              <img
                slot="reference"
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                  cursor: pointer;
                "
                alt=""
                @click="showQrCode(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable>
          </el-table-column>
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
            sortable
            :formatter="formatEmployment"
          >
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" sortable>
          </el-table-column>
          <el-table-column prop="timeOfEntry" label="入职时间" sortable>
            <!-- 作用域插槽 -->
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable>
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            sortable
            width="280"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >
                查看
              </el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="assignRole(row.id)">
                角色
              </el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <!-- 新增员工组件 -->
      <addEmployee :show-dialog.sync="showDialog" />

      <el-dialog title="二维码" :visible.sync="showCodeDialog">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>

      <assign-role
        ref="assignRole"
        :show-role-dialog.sync="showRoleDialog"
        :user-id="userId"
      />
    </div>
  </div>
</template>

 <script>
import assignRole from '@/views/employees/components/assign-role.vue'
import QrCode from 'qrcode'
import { formatDate } from '@/filters'
import addEmployee from './components/add-employee.vue'
import employeesMenu from '@/api/constant/employees'
import { getEmployeeList, delEmployee } from '@/api/employees'
export default {
  components: {
    addEmployee,
    assignRole
  },

  data () {
    return {
      userId: '',
      showRoleDialog: false,
      showCodeDialog: false,
      showDialog: false,
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      }

    }
  },

  created () {
    this.getEmployeeList()
  },

  methods: {
    async assignRole (id) {
      this.userId = id
      await this.$refs.assignRole.getUserDeail(id) // 父组件调用子组件方法
      this.showRoleDialog = true
    },

    showQrCode (url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 导出员工
    exportDate () {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['手机号', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx',
          multiHeader,
          merges
        })
      })
    },

    // 将表头数据和数据进行对应
    formatJson (headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化时间
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = employeesMenu.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },

    // 删除员工
    async delEmployee (id) {
      try {
        await this.$confirm('是否删除该员工')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },

    // 格式化聘用形式
    formatEmployment (row, column, cellValue, index) {
      const obj = employeesMenu.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },

    // 分页更新列表
    changePage (newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },

    // 获取员工列表
    async getEmployeeList () {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    }
  }
}
  </script>

<style>
</style>
