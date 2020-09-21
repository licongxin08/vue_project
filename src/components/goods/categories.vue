<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddForm">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table :data="cataList" :columns="columns" :selection-type="false" show-index index-text="#" border :expand-type="false" :show-row-hover="false" class="treeTable">
        <template slot="level" scope="scoped">
          <el-tag v-if='scoped.row.cat_level == 0'>一级</el-tag>
          <el-tag type="success" v-else-if='scoped.row.cat_level == 1'>二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="deleted" scope="scoped">
          <i class="el-icon-success" v-if="scoped.row.cat_deleted==false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="pid" scope="scoped">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scoped.row.id)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
      <el-form :model="addForm" :rules="addRules" ref="addRuleForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item label="父级分类" prop="cat_name">
          <el-cascader v-model="cascaderValue" :options="cascaderList" :props="cascaderProps" @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数
      total: 0,
      // 分类列表
      cataList: [],
      // 树形图 列的数据
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        prop: 'cat_deleted',
        type: 'template',
        template: 'deleted'
      }, {
        label: '排序',
        prop: 'cat_level',
        type: 'template',
        template: 'level'
      }, {
        label: '操作',
        type: 'template',
        template: 'pid'
      }],
      // 控制添加分类对话框关闭显示
      addDialogVisible: false,
      // 校验数据
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 校验规则
      addRules: {
        cat_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      },
      // 级联选择器选中的数据 从props里面的value传入的 是一个数组
      cascaderValue: [],
      // 级联选择器的数据源
      cascaderList: [],
      // 级联选择器的配置项
      cascaderProps: {
        expandTrigger: 'hover',
        children: 'children',
        value: 'cat_id',
        label: 'cat_name',
        checkStrictly: 'true'
      }
    }
  },
  methods: {
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败！')
      this.cataList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加分类 在级联选择器里面渲染数据
    async showAddForm () {
      this.addDialogVisible = true
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败！')
      this.cascaderList = res.data
    },
    handleChange () {
      if (this.cascaderValue.length === 0) {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        this.addForm.cat_pid = this.cascaderValue[this.cascaderValue.length - 1]
        this.addForm.cat_level = this.cascaderValue.length
      }
    },
    addCate () {
      this.$refs.addRuleForm.validate(async valid => {
        if (!valid) return this.$message.error('请输入要添加的分类名称')
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加商品分类失败！')
        this.$message.success('添加商品分类成功！')
        this.addDialogVisible = false
        this.getCateList()
      })
    },
    // 添加分类对话框关闭
    addFormClose () {
      // 重置表单
      this.$refs.addRuleForm.resetFields()
      // 清空选择的数据
      this.cascaderValue = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    async editCate (id) {
      const { data: res } = await this.$http.put('categories' + id)
      console.log(res)
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style>
.el-icon-success {
  color: #90ee90
}
.el-icon-error {
  color:#e92322
}
.treeTable {
  margin: 20px 0;
}
.el-cascader {
  width: 100%;
}
</style>
