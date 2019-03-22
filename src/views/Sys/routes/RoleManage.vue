<template>
    <div class="role-manage">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Sys/rolemanage' }"><i class="el-icon-setting"></i>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>操作权限管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="筛选" name="1">
                <el-form :inline="true" ref="form" :model="form" label-position="left">
                    <el-form-item label="代理商：">
                        <el-select v-model="form.cust_id" placeholder="权限角色">
                            <el-option v-for="item in custlist" :key="item.id" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色名称：" label-width="100px">
                        <el-input placeholder="请输入角色名称" v-model="form.role_name"></el-input>
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
                    <el-form-item label="角色名称" label-width="120px">
                        <el-input v-model="form1.role_name" placeholder="角色名称"></el-input>
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
            <!-- 弹出树形图 -->
            <el-dialog title="权限配置" :visible.sync="dialogFormVisible2">
                <el-tree
                        :data="data2"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[6]"
                        :props="defaultProps">
                </el-tree>
                <div slot="footer" class="dialog-footer">
                    <el-button >取 消</el-button>
                    <el-button type="primary">确 定</el-button>
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
                        <el-button v-if="item.menu" type="text" size="small" @click="handleClick3(scope.row)">查看/配置权限</el-button>
                        <el-button v-if="item.menu && !(scope.row.sys_flag)" @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                        <el-button v-if="item.menu && !(scope.row.sys_flag)" @click="handleClick2(scope.row)" type="text" size="small">移除</el-button>
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
  name: "RoleManage",
  data(){
    return {
      dialogFormVisible2: false,
      data2: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },



      //表头
      tableList: [{ fixed: false, prop: 'role_name', label: '权限角色名称', width: '150', menu: false },
        { fixed: false, prop: 'op_name', label: '操作员', width: '120', menu: false },
        { fixed: false, prop: 'remark', label: '备注', width: '320', menu: false },
        { fixed: false, prop: 'sys_flag', label: '是否系统预设', width: '100', menu: false },
        { fixed: 'right', prop: '', label: '操作', width: '180', menu: true }],

      activeNames: ['1'],
      //页码
      currentPage: 1,
      custlist: [{ id: '1', name: '系统（在此名目下添加内部操作员帐号）', value: '' },
        { id: '2', name: '测试平台', value: '180410100239415' },
        { id: '3', name: '400受理中心', value: '180410095922442' },
        { id: '4', name: '南昌全球呼信息技术有限公司', value: '180423175902694' }],
      form: {
        cust_id: '',
        role_name: '',
        token: '',
        page: 1,
        rows: 16
      },
      form1Title: '新增角色',
      form1: {
        role_id: '',    //新增时设置为0，编辑时把值设置进来
        role_name: '',   //关联的客户ID
        remark: ''
      },
      dialogFormVisible: false,
      //返回数据及总数
      tableData: [],
      tableDataTotal: 0
    }
  },
  methods: {
    formatRole(scope, item) {
      if(item.prop === 'sys_flag'){
        return (scope.row[item.prop])? '系统预设' : '否'
        // return scope.row[item.prop]
      }else{
        return scope.row[item.prop]
      }
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.findData()
    },
    handleClick(itemObj) {
      if(!itemObj){
        this.form1Title = '新增角色'
        this.form1 = { role_id: '', role_name: '', remark: '' }
        this.dialogFormVisible = true
        return false
      }
      this.form1.role_id = itemObj.role_id.toString()
      this.form1.role_name = itemObj.role_name
      this.form1.remark = itemObj.remark
      this.form1Title = '修改角色'
      this.dialogFormVisible = true
      return true
    },
    handleClick2(itemObj) {
      this.form1.role_id = itemObj.role_id.toString()
      this.form1.role_name = itemObj.role_name
      this.form1.remark = itemObj.remark
      this.$confirm('确认移除？')
        .then(() => {
          this.$http.post('/api/role/delRole?token=' + this.$store.state.user.token, this.form1)
            .then(response => {
              if(response.data.code === 0) {
                this.$message({ message: '移除成功', center: true, type: 'success' })
                this.findData(true)
                return true
              }else{
                this.$message({ message: '移除失败', center: true, type: 'error' })
                return false
              }
            })
        })
        .catch(a => {
          console.log(a)
        })
      return true
    },
    handleClick3(itemObj){
      this.dialogFormVisible2 = true
      console.log(itemObj)
    },
    sendData(senObj) {
      if(senObj.isSend === false) {
        this.dialogFormVisible = false
        return false
      }
      this.$http.post('/api/role/saveRole?token=' + this.$store.state.user.token, this.form1)
        .then(response => {
          if(response.data.code === 0) {
            this.$message({ message: (this.form1Title === '修改角色')? '修改成功' : '添加成功', center: true, type: 'success' })
            this.dialogFormVisible = false
            this.findData(true)
            return true
          }else{
            this.$message({ message: (this.form1Title === '修改角色')? '修改失败' : '添加失败', center: true, type: 'error' })
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
      this.$http.post('/api/role/listRole', data)
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
    initData() {
      this.form.token = this.$store.state.user.token
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
