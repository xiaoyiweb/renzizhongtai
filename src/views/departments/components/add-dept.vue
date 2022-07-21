<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择部门负责人"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in people"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: true
    },

    treeNode: {
      type: Object,
      default: null
    }
  },

  data () {
    const checkDeptName = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.formData.pid).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }

    const checkDeptCode = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }

    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur' },
          { validator: checkDeptName, trigger: 'blur' }
        ],
        code:
          [
            { required: true, message: '请输入部门编码', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur' },
            { validator: checkDeptCode, trigger: 'blur' }
          ],

        manager: { required: true, message: '请选择部门负责人', trigger: 'blur' },
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 300个字符', trigger: 'blur' }
        ]
      },
      people: null
    }
  },
  computed: {
    showTitle () {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },

  methods: {
    async getEmployeeSimple () {
      const res = await getEmployeeSimple()
      this.people = res
    },

    async btnOk () {
      try {
        await this.$refs.deptForm.validate()
        if (this.formData.id) {
          await updateDepartments(this.formData)
          this.$message.success('修改部门信息成功')
        } else {
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
          this.$message.success('添加部门成功')
        }

        this.$emit('addDepts') // 告诉父组件 新增数据成功 重新拉取数据
        this.$emit('update:showDialog', false)
      } catch (error) {
        this.$message.error('添加部门失败')
      }
    },

    btnCancel () {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false) // 关闭
      this.$refs.deptForm.resetFields() // 重置校验字段
    },

    // 获取部门详情
    async getDepartDetail (id) {
      this.formData = await getDepartDetail(id)
    }
  }

}
</script>

<style>
</style>
