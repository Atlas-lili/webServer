<template>
    <div class="enter-password-change">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Sys/enterpasswordchange' }"><i class="el-icon-upload"></i>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>修改登录密码</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 校验表单 -->
        <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px"  size="medium">
            <el-form-item label="请输入旧密码" prop="old_pwd">
                <el-input v-model="ruleForm.old_pwd" placeholder="请输入旧密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="请输入新密码" prop="new_pwd">
                <el-input v-model="ruleForm.new_pwd" placeholder="请输入新密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="请再次输入新密码" prop="re_pwd">
                <el-input v-model="ruleForm.re_pwd" placeholder="请再次输入新密码" type="password"></el-input>
            </el-form-item>
            <el-button
                    type="primary"
                    @click="subForm(callback)"
                    ref="button"
                    v-text="isChange?'提交中':'修改'"
                    :disabled="isChange">
            </el-button>
        </el-form>
    </div>
</template>

<script>
// import qs from 'qs'
export default {
  name: "EnterPasswordChange",
  data () {
    var checkPw = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.new_pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isChange: false,
      ruleForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      rules: {
        old_pwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        re_pwd: [
          { validator: checkPw, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    subForm (callback) {
      if(this.isold_pwd && this.isnew_pwd && this.isre_pwd) {
        this.isChange = !this.isChange
        let {old_pwd, new_pwd} = this.ruleForm
        callback({old_pwd, new_pwd})
      }
    },
    callback (data) {
      this.$http.post('/api/operator/changPwdByOperator?token=' + this.$store.state.user.token, data)
        .then(response => {
          let backData =  response.data
          this.isChange = !this.isChange
          console.log(backData)
        })
    }
  },
  computed: {
    isold_pwd(){
      // old_pwd value
      if(this.ruleForm.old_pwd){
        return true
      }
      return false
    },
    isnew_pwd(){
      // new_pwd value
      if(this.ruleForm.new_pwd){
        return true
      }
      return false
    },
    isre_pwd(){
      // re_pwd value
      if (this.ruleForm.re_pwd === '') {
        return false
      } else if (this.ruleForm.re_pwd !== this.ruleForm.new_pwd) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
form{
    margin: 10% auto 0;
    padding: 20px 20px;
    border-radius: 10px;
    width: 400px;
    background-color: white;
    text-align: center;
    button{
        width: 80%;
    }
}
</style>