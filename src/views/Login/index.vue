<template>
  <div class="login">
    <mu-container>
      <h1>400业务系统</h1>
      <mu-form ref="form" :model="loginForm" class="mu-demo-form">
        <mu-form-item prop="userName" :rules="usernameRules">
          <mu-text-field v-model="loginForm.userName" prop="userName" placeholder="输入账号"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="passWord" :rules="passwordRules">
          <mu-text-field type="password" v-model="loginForm.passWord" prop="passWord" placeholder="输入密码"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="code" class="code">
          <mu-text-field v-model="loginForm.code" prop="code" placeholder="输入验证码"></mu-text-field>
          <img :src="codeImg" @click="reDownLoadImg" alt="图片加载失败" title="点击切换验证码"/>
        </mu-form-item>
        <mu-form-item>
          <mu-button color="primary" @click="submit">提交</mu-button>
          <mu-button @click="clear">重置</mu-button>
        </mu-form-item>
      </mu-form>
    </mu-container>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'Login',
  data () {
    return {
      codeImg: '/api/login/admin/code?',
      usernameRules: [
        {validate: (val) => !!val, message: '必须填写用户名'}
      ],
      passwordRules: [
        {validate: (val) => !!val, message: '必须填写密码'}
      ],
      loginForm: {
        userName: '',
        passWord: '',
        code: ''
      }
    }
  },
  methods: {
    reDownLoadImg () {
      var num = Date.parse(new Date())
      num = (this.codeImg.split('?')[1] - 0 + num) >>> 1
      this.codeImg = this.codeImg.split('?')[0] + '?' + num
    },
    submit () {
      this.$refs.form.validate().then((result) => {
        if (result) {
          let data = qs.stringify(this.loginForm)
          this.$http.post('/api/login/admin/login', data)
            .then(response => {
              let backData = response.data
              this.isLoad = !this.isLoad
              if (backData.code === 0) {
                this.$toast.success('登陆成功！')
                this.$cookie.set('userName', backData.data['loginUserInfo']['operInfo']['login_id'], {expires: '1D'})
                this.$cookie.set('token', backData.data['token'], {expires: '1D'})
                this.$cookie.set('cust_id', backData.data['loginUserInfo']['operInfo']['cust_id'], {expires: '1D'})
                this.$router.replace({path: '/Sys'})
                // 跳转
              } else {
                // 滞留 报错
                this.reDownLoadImg()
                this.$toast.error(backData.message)
                console.error(backData.message)
              }
            })
        }
      })
    },
    clear () {
      this.$refs.form.clear()
      this.loginForm = {
        userName: '',
        passWord: '',
        code: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~css/default';
.login{
  height: 100vh;
  background: url(~img/login_bg.jpg) no-repeat #324157 center;
  background-size: auto 100%;
  position: relative;
  .container{
    position: absolute;
    width: rem(280);
    height: rem(220);
    padding: rem(8);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255,255,255,.8);
    border-radius: 6%;
  }
  h1{
    font-size: rem(18);
    text-align: center;
  }
  .code{
    .mu-input{
      width: rem(130);
    }
    img{
      margin-left: rem(20);
      width: rem(100);
    }
  }
  @media screen and (min-width: 540px) {
    background-size: 100% 100%;
    .container{
      width: rem(120);
      height: rem(88);
    }
    h1{
      font-size: rem(10);
    }
    .code{
      .mu-input{
        width: rem(50);
      }
      img{
        margin-left: rem(10);
        width: rem(30);
      }
    }
  }
}
</style>
