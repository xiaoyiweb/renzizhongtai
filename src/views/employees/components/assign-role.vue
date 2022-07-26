<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { assignRoles } from '@/api/employees'
import { getUserDeail } from '@/api/user'
import { getRoleList } from '@/api/setting'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      list: [],
      roleIds: []
    }
  },

  created () {
    this.getRoleList()
  },

  methods: {
    btnCancel () {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showRoleDialog', false)
    },

    async btnOK () {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      //   关闭窗体
      this.$emit('update:showRoleDialog', false)
    },

    async getUserDeail (id) {
      const { roleIds } = await getUserDeail(id)
      this.roleIds = roleIds
    },

    async getRoleList () {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    }
  }
}
</script>

<style>
</style>
