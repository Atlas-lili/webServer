<template>
    <div class="read-me">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Sys/readme' }"><i class="el-icon-setting"></i>首页</el-breadcrumb-item>
        </el-breadcrumb>
        <router-link to="/Sys/numberlist">400号码中心</router-link><br>
        <router-link to="/Sys/rolemanage">操作权限管理</router-link><br>
        <router-link to="/Sys/IDmanage">登录账号管理</router-link>
    </div>
</template>

<script>
export default {
  name: "ReadMe"
}
</script>

<style scoped>

</style>
