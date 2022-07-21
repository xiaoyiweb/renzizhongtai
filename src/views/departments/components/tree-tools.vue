<template>
  <el-row
    type="flex"
    justify="center"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>{{ treeNode.name }}</el-col>

    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addDept">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="editDept">
                编辑部门
              </el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="delDept">
                删除部门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleCommand (command) {
      if (command === 'addDept') {
        this.$emit('addDepts', this.treeNode)
      } else if (command === 'editDept') {
        this.$emit('editDepts', this.treeNode)
      } else {
        this.$confirm('确认删除该部门吗？').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          this.$emit('delDept')
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style>
</style>
