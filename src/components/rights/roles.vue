<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bb', i1 == 0 ? 'bt' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="deleteRight(scope.row, item1.id)">{{item1.authName}}</el-tag><span class="el-icon-caret-right"></span>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i2 == 0 ? '' : 'bt']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="deleteRight(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <span class="el-icon-caret-right"></span>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable type="warning" v-for="item3 in item2.children" :key="item3.id" @close="deleteRight(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{scope.row.id}} -->
            <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showDialog(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="rightsDialogVisible" width="50%" @close="dialogClosed">
      <el-tree :data="rightsList" show-checkbox :props="treeProps" default-expand-all ref="treeRef" :default-checked-keys="keys" node-key="id"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色列表数据
      rolesList: [],
      // 控制对话框显示隐藏
      rightsDialogVisible: false,
      // 权限列表数据
      rightsList: [],
      // 树状图配置项
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中节点的数组
      keys: [],
      // 一级节点的id
      id: ''
    }
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
    },
    // 删除权限
    async deleteRight (role, rightId) {
      const result = await this.$confirm('确定删除该权限吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除用户指定权限失败！')
      this.$message.success('删除用户指定权限成功！')
      role.children = res.data
    },
    // 点击分配权限 弹出对话框
    async showDialog (role) {
      this.rightsDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
      this.rightsList = res.data
      // 将角色权限数据 渲染到节点上
      this.getRightsKeys(role, this.keys)
      // 将一级节点id保存下来
      this.id = role.id
    },
    // 获取角色列表三级权限的id
    getRightsKeys (ele, arr) {
      if (!ele.children) return arr.push(ele.id)
      ele.children.forEach(item => {
        // console.log(item)
        return this.getRightsKeys(item, arr)
      })
    },
    // 点击确定 分配权限
    async setRights () {
      const str = this.$refs.treeRef.getCheckedKeys().concat(this.$refs.treeRef.getHalfCheckedKeys()).join(',')
      const { data: res } = await this.$http.post(`roles/${this.id}/rights`, { rids: str })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.rightsDialogVisible = false
      this.getRolesList()
    },
    // 关闭弹窗 keys 清空
    dialogClosed () {
      this.keys = []
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>

<style lang="less" scope>
.el-tag {
  margin: 10px
}
.bb {
  border-bottom: 1px solid #ccc;
}
.bt {
  border-top: 1px solid #ccc;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
