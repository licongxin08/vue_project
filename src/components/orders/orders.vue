<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="300"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column label="下单时间" width="180">
          <template v-slot="scope">
            {{scope.row.create_time | dataFormate('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialogVisible = true"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showCityDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editRules" ref="ruleForm" label-width="100px">
        <el-form-item label="省市区/县" prop="address">
          <el-cascader v-model="cityArr" :options="citydata" :props="cityProps" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressInfo">
          <el-input v-model="editForm.addressInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看物流信息对话框 -->
    <el-dialog title="查看物流信息" :visible.sync="cityDialogVisible" width="50%">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(item, i) in progress"
          :key="i"
          :timestamp="item.time" icon="el-icon-more"
            color="pink">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cityDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cityDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      editDialogVisible: false,
      editForm: {
        address: '',
        addressInfo: ''
      },
      editRules: {
        address: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        addressInfo: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      citydata,
      cityArr: [],
      cityProps: {
        expandTrigger: 'hover',
        children: 'children',
        label: 'label',
        value: 'value'
      },
      cityDialogVisible: false,
      progress: []
    }
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品订单列表失败')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    editDialogClose () {
      this.$refs.ruleForm.resetFields()
    },
    handleChange () {},
    async showCityDialog () {
      this.cityDialogVisible = true
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败,请稍后重试')
      this.progress = res.data
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
