<template>
    <header class="sys-header">
        <div class="title">后台管理系统</div>
        <el-button @click="isShow = !isShow" class="user">
            <div class="user-img">
                <img src="@/assets/img/user.jpg" alt="">
            </div>
            <p class="user-name">{{user}}</p>
        </el-button>
        <transition name="el-zoom-in-top">
            <div v-show="isShow" class="transition-box" @click="exit">退出</div>
        </transition>
    </header>
</template>

<script>
  export default {
    name: "SysHeader",
    data () {
      return {
        isShow: false
      }
    },
    methods: {
      exit () {
        sessionStorage.removeItem('ms_user')
        this.$router.replace('Login')
      }
    },
    computed: {
      user () {
        this.$store.dispatch('updateUser')
        return this.$store.state.user.name
      }
    },
    mounted () {
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('updateUser')
      next()
    }
  }
</script>

<style lang="scss" scoped>
.sys-header{
    height: 70px;
    background-color: #242f42;
    .title{
        width: 250px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        color: white;
        font-size: 20px;
        float: left;
    }
    .user{
        margin: 0 30px 0 0;
        padding: 0;
        border: none;
        outline: none;
        height: 70px;
        line-height: 70px;
        float: right;
        background-color: #242f42;
        .user-img{
            float: left;
            margin: 10px 0;
            width: 50px;
            height: 50px;
            border-radius: 50px;
            overflow: hidden;
            img{
                width: 50px;
            }
        }
        .user-name{
            float: left;
            color: white;
            font-size: 15px;
        }
    }
    .transition-box{
        position: absolute;
        top: 80px;
        right: 30px;
        width: 90px;
        height: 40px;
        line-height: 40px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,.12);
        z-index: 9;
        text-align: center;
    }
}
</style>
