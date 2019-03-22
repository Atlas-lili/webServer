<template>
    <div class="login">
        <el-form  :model="ruleForm" :rules="rules" ref="ruleForm"  size="mini">
            <el-form-item>
                <h1>后台管理系统</h1>
            </el-form-item>
            <el-form-item prop="userName">
                <el-input v-model="ruleForm.userName" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item prop="passWord">
                <el-input v-model="ruleForm.passWord" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-col :span="11">
                    <el-input v-model="ruleForm.code" placeholder="验证码"></el-input>
                </el-col>
                <el-col :span="11">
                    <img :src="codeImg" @click="reDownLoadImg" alt="图片加载失败">
                </el-col>
            </el-form-item>
            <el-button
                    type="primary"
                    @click="subForm(callback)"
                    ref="button"
                    v-text="isLoad?'登录中':'登录'"
                    :disabled="isLoad">
            </el-button>
            <p>Tips：账号密码随便填！</p>
        </el-form>

    </div>
</template>

<script>
import qs from 'qs'
export default {
  name: "Login",
  data () {
    return {
      isLoad: false,
      codeImg: '/api/login/admin/code',
      ruleForm: {
        userName: '',
        passWord: '',
        code: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    subForm (callback) {
      if(this.isUsername && this.isPassword && this.isCode) {
        this.isLoad = !this.isLoad
        let data = qs.stringify(this.ruleForm)
        callback(data)
      }
    },
    callback (data) {
      this.$http.post('/api/login/admin/login', data)
        .then(response => {
          let backData =  response.data
          this.isLoad = !this.isLoad
          if(backData.code === 0){
            this.$message.success('登陆成功！')
            sessionStorage.setItem('ms_user',JSON.stringify({name: this.ruleForm.userName, token: backData.data.token, cust_id: backData.data['loginUserInfo']['operInfo'].cust_id}))
            // 跳转
            this.$router.replace('Sys/readme')
          } else {
            //滞留 报错
            this.reDownLoadImg()
            this.$message.error(backData.message)
            console.error(backData.message)
          }
        })
    },
    reDownLoadImg () {
      var num = Date.parse(new Date())
      this.codeImg += '?'+ num
    }
  },
  computed: {
    isUsername(){
      // username value
      if(this.ruleForm.userName){
        return true
      }
      return false
    },
    isPassword(){
      // password value
      if(this.ruleForm.passWord){
        return true
      }
      return false
    },
    isCode() {
      // code value
      if(this.ruleForm.code){
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
    form{
        h1{
            color: black;
            font-size: 30px;
            text-align: center;
        }
        margin: 20% auto 0;
        padding: 20px 20px;
        border-radius: 10px;
        width: 400px;
        background-color: white;
        button{
            width: 100%;
        }
        p{
            height: 40px;
            line-height: 40px;
            font-size: 15px;
            color: #999;
        }
        img{
            margin-left: 20px;
        }
    }
}

</style>
