<template>
    <div class="id-manage">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Sys/IDmanage' }"><i class="el-icon-setting"></i>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>登录账号管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="筛选" name="1">
                <el-form :inline="true" ref="form" :model="form" label-position="left">
                    <el-form-item label="关联客户：">
                        <el-select v-model="form.cust_id" placeholder="输入关联客户搜索" filterable clearable>
                            <el-option v-for="(item, index) in custlist" :key="index" :label="item.cust_name" :value="item.cust_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="登录账号：" label-width="100px">
                        <el-input placeholder="*请输入登录账号" v-model="form.login_id"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="findData">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <!-- 新增 -->
            <el-button type="success" @click="handleClick(null)">新增</el-button>
            <!-- 弹出表单 -->
            <el-dialog :title="(form1.op_id === 0)? '新增成员信息' : '修改成员信息'" :visible.sync="dialogFormVisible">
                <el-form :model="form1">
                    <el-form-item label="操作账号" label-width="120px">
                        <el-input v-model="form1.op_name" placeholder="操作账号"></el-input>
                    </el-form-item>
                    <el-form-item label="登录账户" label-width="120px">
                        <el-input v-model="form1.login_id" placeholder="登录账户"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码" label-width="120px">
                        <el-input v-model="form1.password" placeholder="登录密码"></el-input>
                    </el-form-item>
                    <el-form-item label="权限角色" label-width="120px">
                        <el-select v-model="form1.op_role" placeholder="权限角色">
                            <el-option label="高级管理员" value="0"></el-option>
                            <el-option label="代理商" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属部门" label-width="120px">
                        <el-select v-model="form1.dept_id" placeholder="所属部门">
                            <el-option label="运维部" value='14000'></el-option>
                            <el-option label="技术部" value='13000'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系电话" label-width="120px">
                        <el-input v-model="form1.mobile" placeholder="联系电话"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" label-width="120px">
                        <el-input v-model="form1.remark" placeholder="备注"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sendData({isSend: false})">取 消</el-button>
                    <el-button type="primary" @click="sendData({isSend: true})">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 表格 -->
            <el-table
                    :data="tableData"
                    max-height="400"
                    border
                    style="width: 100%">
                <el-table-column
                        type="index"
                        fixed="left">
                </el-table-column>
                <el-table-column
                        v-for="(item,index) in tableList"
                        :fixed="item.fixed"
                        :label="item.label"
                        :width="item.width"
                        :key="index">
                    <template slot-scope="scope">
                        <p v-if="!item.menu" v-text="formatRole(scope, item)"></p>
                        <el-button v-if="item.menu" @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                        <el-button v-if="item.menu" @click="handleClick2(scope.row)" type="text" size="small" v-text="(scope.row.sts === 0) ? '作废' : '恢复'"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 页码 -->
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="form.rows"
                    layout="total, prev, pager, next, jumper"
                    :total="tableDataTotal">
            </el-pagination>
        </el-collapse>
    </div>
</template>

<script>
import qs from 'qs'
export default {
  name: "IDManage",
  data() {
    return {
      //表头
      tableList: [{ fixed: false, prop: 'op_name', label: '姓名', width: '100', menu: false },
        { fixed: false, prop: 'dept_name', label: '所属部门', width: '70', menu: false },
        { fixed: false, prop: 'login_id', label: '登录账号', width: '120', menu: false },
        { fixed: false, prop: 'op_type', label: '账号类型', width: '100', menu: false },
        { fixed: false, prop: 'role_name', label: '操作角色', width: '100', menu: false },
        { fixed: false, prop: 'mobile', label: '联系电话', width: '100', menu: false },
        { fixed: false, prop: 'create_time', label: '创建时间', width: '180', menu: false },
        { fixed: false, prop: 'so_opname', label: '办理操作员', width: '100', menu: false },
        { fixed: false, prop: 'cust_name', label: '关联客户', width: '100', menu: false },
        { fixed: false, prop: 'remark', label: '备注', width: '300', menu: false },
        { fixed: false, prop: 'sts', label: '状态', width: '70', menu: false },
        { fixed: 'right', prop: '', label: '操作', width: '100', menu: true }],
      //新增修改表
      form1Title: '新增成员信息',
      form1: {
        op_id:  0,    //新增时设置为0，编辑时把值设置进来
        cust_id: undefined,   //关联的客户ID
        op_type: 0,
        op_name: '',
        login_id: '',
        password: '',
        op_role: '',
        dept_id: '',
        mobile: '',
        remark: ''
      },
      dialogFormVisible: false,
      //筛选框显示
      activeNames: ['1'],
      //页码
      currentPage: 1,
      //关联客户表
      custlist: [],
      //查询表
      form: {
        cust_id: '',
        login_id: '',
        token: '',
        page: 1,
        rows: 8
      },
      //返回数据及总数
      tableData: [],
      tableDataTotal: 0
    }
  },
  methods: {
    formatRole(scope, item){
      if(item.prop === 'op_type'){
        return (scope.row[item.prop] > 0) ? '外部' : '内部'
      } else if(item.prop === 'create_time') {
        return (new Date(scope.row[item.prop])).toLocaleString()
      } else if (item.prop === 'sts'){
        return (scope.row[item.prop]) ? '作废' : '正常'
      }
      return scope.row[item.prop]
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.findData()
    },
    handleClick(itemObj) {
      if(!itemObj){
        this.form1Title = '新增成员信息'
        this.form1 = { op_id:  0, cust_id: 0, op_type: 0, op_name: '', login_id: '',
          password: '', op_role: '', dept_id: '', mobile: '', remark: '' }
        this.dialogFormVisible = true
        return false
      }
      this.form1.dept_id = itemObj.dept_id.toString()
      this.form1.op_type = itemObj.op_type
      this.form1.op_id = itemObj.op_id
      this.form1.cust_id = itemObj.cust_id
      this.form1.op_name = itemObj.op_name
      this.form1.login_id = itemObj.login_id
      this.form1.password = ''
      this.form1.op_role = itemObj.op_role
      this.form1.mobile = itemObj.mobile
      this.form1.remark = itemObj.remark
      this.form1Title = '修改成员信息'
      this.dialogFormVisible = true
      return true
    },
    handleClick2(itemObj) {
      let handle = (itemObj.sts === 0) ? '作废' : '恢复'
      this.$confirm('确认'+ handle +'？')
        .then(() => {
          this.$http.post('/api/operator/updateStatusOperator?token=' + this.$store.state.user.token, {
            op_id: itemObj.op_id,
            // sts: (itemObj.sts === '正常') ? 1 : 0
            sts: (itemObj.sts+1) % 2
          })
            .then(response => {
              if(response.data.code === 0) {
                this.$message({ message: '状态修改成功', center: true, type: 'success' })
                this.findData(true)
                return true
              }else{
                this.$message({ message: '状态修改失败', center: true, type: 'error' })
                return false
              }
            })
        })
        .catch(a => {
          console.log(a)
        })
    },
    sendData(senObj) {
      if(senObj.isSend === false) {
        this.dialogFormVisible = false
        return false
      }
      this.$http.post('/api/operator/saveOperator?token=' + this.$store.state.user.token, this.form1)
        .then(response => {
          if(response.data.code === 0) {
            this.$message({ message: (this.form1Title === '修改成员信息')? '修改成功' : '添加成功', center: true, type: 'success' })
            this.dialogFormVisible = false
            this.findData(true)
            return true
          }else{
            this.$message({ message: (this.form1Title === '修改成员信息')? '修改失败' : '添加失败', center: true, type: 'error' })
            return false
          }
        })
    },
    findData(e) {
      if(e){
        this.currentPage = 1
        this.form.page = 1
      }
      let data = qs.stringify(this.form)
      this.$http.post('/api/operator/listOperator', data)
        .then(response => {
          if(response.data.code === 0) {
            this.tableDataTotal = response.data.data.total
            if(!response.data.data.rows.length){
              this.$message({ message: '未查询到对应数据！', center: true, type: 'error' })
              this.tableData =[]
            }
            this.tableData = response.data.data.rows
          }else{
            this.$message({ message: '查询失败！', center: true, type: 'error' })
          }
        })
    },
    getCompanyList(n) {
      let data = qs.stringify({
        token: this.form.token,
        page: n,
        rows: 30
      })
      this.$http.post('/api/operator/listCustByOperator', data)
        .then(response => {
          if(response.data.code === 0) {
            this.custlist = response.data.data.rows
          }
        })
    },
    initData() {
      this.form.token = this.$store.state.user.token
      setTimeout(this.getCompanyList(1), 0)
      this.findData()
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style scoped>

</style>
