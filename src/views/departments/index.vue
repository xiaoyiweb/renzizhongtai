<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools :tree-node="company" @addDepts="addDepts" />

        <el-tree :data="depart" :props="defaultProps" default-expand-all>
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            :is-root="true"
            @delDept="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>

    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import addDept from './components/add-dept.vue'
import { transListToTreeData } from '@/utils'
import { getDepartments } from '@/api/departments'
import treeTools from './components/tree-tools.vue'
export default {
  components: {
    treeTools,
    addDept
  },

  data () {
    return {
      company: { name: '江西赚它一个亿科技股份有限公司 ', manager: '负责人', id: '' },
      depart: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false,
      node: null,
      loading: false
    }
  },

  created () {
    this.getDepartments()
  },

  methods: {
    async getDepartments () {
      this.loading = true
      const res = await getDepartments()
      this.depart = transListToTreeData(res.depts, '')
      this.loading = false
    },

    addDepts (node) {
      this.node = node
      this.showDialog = true
    },

    // 编辑部门节点
    editDepts (node) {
      // 首先打开弹层
      this.node = node // 赋值操作的节点
      this.showDialog = true

      // 获取部门详情
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }

}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
