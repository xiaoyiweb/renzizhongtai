<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-row type="flex" justify="end">
          <el-button type="text" @click="$router.back()">返回</el-button>
        </el-row>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-row
              type="flex"
              justify="center"
              align="center"
              style="margin-top: 60px"
            >
              <el-form
                ref="saveUser"
                label-width="60px"
                :model="userInfo"
                :rules="rules"
              >
                <el-form-item label="姓名" prop="username">
                  <el-input
                    v-model="userInfo.username"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password2">
                  <el-input
                    v-model="userInfo.password2"
                    type="password"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updateUserInfo">
                    更新
                  </el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="userComponent" />
          </el-tab-pane>

          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import userInfoDetail from '@/views/employees/components/user-info.vue'
import jobInfo from '@/views/employees/components/job-info.vue'
import { getUserDeail } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  components: {
    userInfoDetail,
    jobInfo
  },
  data () {
    return {
      userComponent: 'userInfoDetail',
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },

  created () {
    this.getUserDeail()
  },

  methods: {
    async updateUserInfo () {
      try {
        await this.$refs.saveUser.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    },

    async getUserDeail () {
      this.userInfo = await getUserDeail(this.userId)
    }
  }
}
</script>

<style>
</style>
