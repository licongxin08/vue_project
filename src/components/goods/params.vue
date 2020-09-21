<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为三级分类设置相关参数！" type="warning" show-icon>
      </el-alert>
      <div class="cascader">
        选择商品分类:
      <el-cascader v-model="cascaderValue" :options="cateList" :props="cascaderProps" @change="handleChange" clearable>
      </el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" type="primary" :disabled="isDisable" @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="manyData" style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="deleteTag(i,scope.row)">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="180">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="showDeleteDialog(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button size="mini" type="primary" :disabled="isDisable" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyData" style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="deleteTag(i,scope.row)">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作" width="180">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="showDeleteDialog(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog :title="'添加' + Text" :visible.sync="addDialogVisible" width="50%" @close="addFormClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item :label="Text" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改属性对话框 -->
    <el-dialog :title="'修改' + Text" :visible.sync="editDialogVisible" width="50%" @close="editFormClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px">
        <el-form-item :label="Text" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 级联选择器选中的数据存放的数组
      cascaderValue: [],
      // 级联选择器的数据源
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        children: 'children',
        value: 'cat_id',
        label: 'cat_name'
      },
      // tabs 选项卡激活的面板
      activeName: 'many',
      manyData: [],
      onlyData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      editForm: {},
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败!')
      this.cateList = res.data
    },
    // 级联选择器改变触发的事件
    handleChange () {
      if (this.cascaderValue.length === 0) {
        this.manyData = this.onlyData = []
      }
      this.getParamsList()
    },
    // 获取参数列表
    async getParamsList () {
      if (this.cascaderValue.length !== 3) {
        return (this.cascaderValue = [])
      }
      const { data: res } = await this.$http.get(`categories/${this.cascaderValue[2]}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败！')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      this.activeName === 'many' ? this.manyData = res.data : this.onlyData = res.data
    },
    // tabs 切换触发的事件
    handleClick () {
      this.getParamsList()
    },
    addFormClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editFormClosed () {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    // 添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入必填参数！')
        const { data: res } = await this.$http.post(`categories/${this.cascaderValue[2]}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) return this.$message.error('添加失败！')
        this.$message.success('添加成功！')
        this.getParamsList()
        this.addDialogVisible = false
      })
    },
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm = row
    },
    // 修改参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入需要修改的信息！')
        const { data: res } = await this.$http.put(`categories/${this.cascaderValue[2]}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error('更新失败！')
        this.$message.success('更新成功！')
        this.getParamsList()
        this.editDialogVisible = false
      })
    },
    // 删除参数
    async showDeleteDialog (id) {
      const result = await this.$confirm('此操作将永久删除该参数/属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('已取消删除！')
      const { data: res } = await this.$http.delete(`categories/${this.cascaderValue[2]}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getParamsList()
    },
    // 添加标签
    async editTag (row) {
      const { data: res } = await this.$http.put(`categories/${this.cascaderValue[2]}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) return this.$message.error('添加失败！')
      this.$message.success('添加成功！')
    },
    // 删除标签
    deleteTag (i, row) {
      row.attr_vals.splice(i, 1)
      this.editTag(row)
    },
    handleInputConfirm (row) {
      if (!row.inputValue.trim().length) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.editTag(row)
      row.inputVisible = false
      row.inputValue = ''
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  // 计算属性
  computed: {
    isDisable () {
      return this.cascaderValue.length !== 3
    },
    Text () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scope>
.el-cascader {
  width: 300px;
}
.cascader {
  margin: 15px 0;
}
.input-new-tag {
  width: 100px !important;
}
</style>
