<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="120"
              />
              <el-table-column
                align="center"
                prop="name"
                label="名称"
                width="240"
              />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >
                    分配权限
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRole(row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-dialog
        :title="roleForm.id ? '编辑角色' : '新增角色'"
        :visible="showDialog"
        width="60%"
        @close="btnCancel"
      >
        <el-form
          ref="roleForm"
          :model="roleForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">
              确定
            </el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <el-dialog
        title="分配权限"
        :visible="showRoleDialog"
        @close="btnRoleCancel"
      >
        <el-tree
          ref="permTree"
          :data="permData"
          :props="defaultProps"
          show-checkbox
          :check-strictly="true"
          :default-expand-all="true"
          :default-checked-keys="selectCheck"
          node-key="id"
        />

        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnRoleCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnRoleOK">
              确定
            </el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { transListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permission'
import { assignPrem, getRoleList, getCompanyDetail, delRole, getRoleDetail, editRoleDetail, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'

export default {

  data () {
    return {
      selectCheck: [],
      roleId: null,
      permData: [],
      defaultProps: { label: 'name' },
      showRoleDialog: false,
      list: [],
      page: {
        page: 1,
        pagesize: 2,
        total: 0
      },
      formData: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      },
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },

  computed: {
    ...mapGetters(['companyId'])
  },

  created () {
    this.getRoleList()
    this.getCompanyDetail()
  },

  methods: {
    btnRoleCancel () {
      this.selectCheck = [] // 重置数据
      this.showRoleDialog = false
    },

    async btnRoleOK () {
      await assignPrem({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showRoleDialog = false
    },

    async assignPerm (id) {
      this.permData = transListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值

      this.showRoleDialog = true
    },

    async editRole (id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },

    btnCancel () {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },

    async btnOK () {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await editRoleDetail(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },

    async getRoleList () {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },

    changePage (newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },

    async getCompanyDetail () {
      this.formData = await getCompanyDetail(this.companyId)
    },

    async delRole (id) {
      try {
        await this.$confirm('确认删除？')
        await delRole(id)
        this.getRoleList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    }
  }

}
</script>

<style>
</style>
