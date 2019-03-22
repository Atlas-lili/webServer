<template>
    <div class="sys-list">
        <el-menu :default-active="onRouter"
                class="el-menu-vertical-demo"
                background-color="#324157"
                text-color="#bfcbd9"
                active-text-color="#20A0FF"
                unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs===undefined">
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{item.title}}</span>
                    </el-menu-item>
                </template>
                <template v-else>
                    <el-submenu :index="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{item.title}}</span>
                        </template>
                        <el-menu-item v-for="child in item.subs" :index="child.index">{{child.title}}</el-menu-item>
                    </el-submenu>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
  name: "SysList",
  data () {
    return {
      items: [
        {
          icon: 'el-icon-menu',
          index: 'readme',
          title: '首页'
        },
        {
          icon: 'el-icon-service',
          index: '2',
          title: '号码管理',
          subs: [
            {
              index: 'numberlist',
              title: '400号码中心'
            },
            {
              index: 'numberpush',
              title: '400号码导入'
            },
            {
              index: 'numberoperation',
              title: '号码操作日志'
            },
            {
              index: 'numbernegotiate',
              title: '号码协商记录'
            },
            {
              index: 'numbernew',
              title: '最新靓号'
            }
          ]
        },
        {
          icon: 'el-icon-setting',
          index: '3',
          title: '系统管理',
          subs: [
            {
              index: 'rolemanage',
              title: '操作权限管理'
            },
            {
              index: 'IDmanage',
              title: '登录账号管理'
            },
            {
              index: 'clientdistribution',
              title: '客户负责人分配'
            },
            {
              index: 'noticemanage',
              title: '系统公告管理'
            },
            {
              index: 'enterpasswordchange',
              title: '修改登录密码'
            },
            {
              index: 'sfpasswordchange',
              title: '安全密码修改'
            },
            {
              index: 'IPmanage',
              title: '登录IP管理'
            }
          ]
        },
        {
          icon: 'el-icon-upload',
          index: '4',
          title: '系统维护',
          subs: [
            {
              index: 'companymaintain',
              title: '公司部门设置'
            }
          ]
        }
      ]
    }
  },
  computed: {
    onRouter() {
      return this.$route.path.split('/')[2]
    }
  }
}
</script>

<style lang="scss" scoped>
.sys-list{
    position: absolute;
    top: 70px;
    left: 0px;
    bottom: 0px;
    width: 250px;
    overflow: hidden;
    background-color: #2E363F;
    ul{
        height: 100%;
    }
}
</style>
