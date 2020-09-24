<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeName - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs标签页 -->
      <el-form :model="addForm" :rules="addFormRules" ref="ruleForm" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick" :before-leave="beforeLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cascaderProps" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="(item,i) in manyData" :key="i">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item2" border v-for="(item2,i) in item.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload class="upload-demo" action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :headers="headerObj" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器 -->
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type="primary" class="add" @click="addGoods">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="50%">
      <img :src="previewUrl" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: '0',
      addForm: {
        goods_name: '11111',
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyData: [],
      onlyData: [],
      headerObj: {
        Authorization: sessionStorage.getItem('token')
      },
      previewUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    async handleClick () {
      if (this.activeName === '1') {
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取商品参数失败')
        this.manyData = res.data
        this.manyData.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
        })
      } else if (this.activeName === '2') {
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取商品属性失败')
        this.onlyData = res.data
      }
    },
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败！')
      this.cateList = res.data
    },
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeLeave (newTab, oldTab) {
      if (oldTab === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    handlePreview (file) {
      this.previewUrl = file.response.data.url
      this.dialogVisible = true
    },
    handleRemove (file) {
      const index = this.addForm.pics.findIndex(item => item.pic === file.response.data.tmp_path)
      this.addForm.pics.splice(index, 1)
    },
    handleSuccess (response) {
      this.addForm.pics.push({ pic: response.data.tmp_path })
    },
    addGoods () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return this.$message.error('请将信息填写完整')
        console.log(this.manyData)
        this.manyData.forEach(item => {
          const obj = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(obj)
        })
        this.onlyData.forEach(item => {
          const obj = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(obj)
        })
        var newform = JSON.parse(JSON.stringify(this.addForm))
        newform.goods_cat = newform.goods_cat.join(',')
        const { data: res } = await this.$http.post('goods', newform)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        // 编程式导航跳转到商品列表页面
        this.$router.push('/goods')
      })
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.add {
  margin-top: 40px;
}
</style>
