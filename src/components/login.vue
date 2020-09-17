<template>
  <div class="login">
    <div class="login_box">
      <div class="logo">
        <img src="../assets/logo.jpg" alt="">
      </div>
      <!-- 表单 -->
      <el-form class="form" :model="formmsg" :rules="loginRules" ref="ruleForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="formmsg.username" ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="formmsg.password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formmsg: {
        username: 'admin',
        password: '123456'
      },
      // 数据的校验规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置
    resetForm () {
      // resetFields()重置表单内容并移除校验规则
      this.$refs.ruleForm.resetFields()
    },
    // 登录
    login () {
      // 发送请求之前先对表单进行预校验
      this.$refs.ruleForm.validate(async valid => {
        // valid 是一个布尔值true表示表单预校验通过,可以发送请求,false表示没有通过表单验证,不允许发送请求
        if (!valid) return
        // 发送请求
        const { data: res } = await this.$http.post('login', this.formmsg)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang='less' scope>
.login {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 2px 3px 3px rgba(255, 255, 255, 0.6);
    .logo {
      position: absolute;
      left: 50%;
      top: -75px;
      width: 130px;
      height: 130px;
      transform: translate(-50%);
      border-radius: 50%;
      border: 1px solid #ccc;
      overflow: hidden;
      padding: 10px;
      box-shadow: 2px 3px 3px rgba(255, 255, 255, 0.6);
      // background-color: darkorange;
      img {
        width: 100%;
        border-radius: 50%;
        background-color: skyblue;
      }
    }
    .form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btn {
        float: right;
      }
    }
  }
}
</style>
