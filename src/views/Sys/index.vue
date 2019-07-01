<template>
<div class="sys">
  <mu-appbar style="width: 100%;" color="primary">
    <mu-button icon slot="left" @click="open = !open">
      <mu-icon value="menu"></mu-icon>
    </mu-button>
    400云呼叫中心通讯平台
    <mu-menu slot="right">
      <mu-button flat>账号: {{this.userName}}</mu-button>
      <mu-list slot="content">
        <mu-list-item @click="breakOut" button>
          <mu-list-item-content>
            <mu-list-item-title>退出</mu-list-item-title>
          </mu-list-item-content>
        </mu-list-item>
      </mu-list>
    </mu-menu>
  </mu-appbar>
  <!-- 导航 -->
  <mu-drawer :open.sync="open" :docked='false' :right='false'>
    <mu-list>
      <mu-list-item button>
        <mu-list-item-title>首页</mu-list-item-title>
      </mu-list-item>
      <mu-expansion-panel :expand="panel === 'panel1'" @change="toggle('panel1')">
        <div slot="header">号码管理</div>
        <mu-list-item button>
          <mu-list-item-title>400号码中心</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button>
          <mu-list-item-title>400号码导入</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button>
          <mu-list-item-title>号码操作日志</mu-list-item-title>
        </mu-list-item>
      </mu-expansion-panel>
      <mu-expansion-panel :expand="panel === 'panel1'" @change="toggle('panel1')">
        <div slot="header">号码管理</div>
        <mu-list-item button>
          <mu-list-item-title>400号码中心</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button>
          <mu-list-item-title>400号码导入</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button>
          <mu-list-item-title>号码操作日志</mu-list-item-title>
        </mu-list-item>
      </mu-expansion-panel>
    </mu-list>
  </mu-drawer>
</div>
</template>

<script>
export default {
  name: 'Sys',
  data () {
    return {
      open: true,
      userName: '',
      panel: ''
    }
  },
  methods: {
    breakOut () {
      console.log(this.$cookie)
      this.$cookie.delete('userName')
      this.$cookie.delete('token')
      this.$cookie.delete('cust_id')
      this.$router.replace({path: '/Login'})
    },
    toggle (panel) {
      this.panel = panel === this.panel ? '' : panel
    }
  },
  created () {
    this.userName = this.$cookie.get('userName')
  }
}
</script>

<style lang="scss">
  .sys .mu-drawer,.mu-overlay{
    top:.23rem;
  }
  .sys{
    .mu-expansion-panel-content{
      padding: 0;
    }
  }
</style>
