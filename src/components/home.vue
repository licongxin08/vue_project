<template>
  <el-container class="container">
    <el-header>
      <div>
        <div class="left">
          <img src="../assets/heima.png" alt="">
          电商后台管理系统
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle_btn" @click="isCollapse=!isCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="skyblue" unique-opened :default-active="activePath" :collapse="isCollapse" :collapse-transition="false" router>
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="icon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + sItem.path" v-for="sItem in item.children" :key="sItem.id" @click="savePath('/' + sItem.path)"><i class="el-icon-menu"></i>{{sItem.authName}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      icon: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // activePath: ''
      isCollapse: false
    }
  },
  created () {
    this.getMenulist()
    this.activePath = sessionStorage.getItem('path')
  },
  methods: {
    // 退出
    logout () {
      // 跳出到登录页面
      this.$router.push('/login')
      // 清除token
      sessionStorage.clear()
      // 退出成功提示
      this.$message.success('退出成功')
    },
    async getMenulist () {
      const { data: res } = await this.$http('menus')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败，请稍后重试')
      // console.log(res)
      this.menulist = res.data
    },
    savePath (path) {
      this.activePath = path
      sessionStorage.setItem('path', path)
    }
  }
}
</script>

<style lang='less' scope>
.container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    padding-left: 0;
    >div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .left {
      font-size: 25px;
      color: #fff;
      img {
        vertical-align: middle;
        margin-right: 20px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .iconfont {
      margin-right: 8px;
    }
    .toggle_btn {
      color: #fff;
      background-color: #373d41;
      text-align: center;
      cursor: pointer;
      letter-spacing: 4px;
    }
    .el-menu {
      border-right: 0;
    }
  }
}
</style>
