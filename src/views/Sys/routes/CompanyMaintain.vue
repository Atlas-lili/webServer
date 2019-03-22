<template>
    <div class="company-maintain">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Sys/companymaintain' }"><i class="el-icon-upload"></i>系统维护</el-breadcrumb-item>
            <el-breadcrumb-item>公司部门设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 新增 -->
        <el-button type="success" @click="handleClick(null)">新增</el-button>
        <!-- 弹出表单 -->
        <el-dialog :title="(form1.dept_id_id === 0)? '新增成员信息' : '修改成员信息'" :visible.sync="dialogFormVisible">
            <el-form :model="form1">
                <el-form-item label="部门名称" label-width="120px">
                    <el-input v-model="form1.dept_name" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="部门电话" label-width="120px">
                    <el-input v-model="form1.dept_tel" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="部门传真" label-width="120px">
                    <el-input v-model="form1.dept_fax" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="部门经理" label-width="120px">
                    <el-input v-model="form1.dept_manager" placeholder="请输入内容"></el-input>
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
                    <el-button v-if="item.menu" @click="handleClick2(scope.row)" type="text" size="small">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import qs from 'qs'
export default {
  name: "CompanyMaintain",
  data() {
    return {
      //表头
      tableList: [{ fixed: false, prop: 'dept_name', label: '部门名称', width: '150', menu: false },
        { fixed: false, prop: 'dept_tel', label: '部门电话', width: '150', menu: false },
        { fixed: false, prop: 'dept_fax', label: '部门传真', width: '150', menu: false },
        { fixed: false, prop: 'dept_manager', label: '部门经理', width: '150', menu: false },
        { fixed: false, prop: 'remark', label: '备注', width: '180', menu: false },
        { fixed: 'right', prop: '', label: '操作', width: '100', menu: true }],
      //新增修改表
      form1Title: '新增部门',
      form1: {
        dept_id: '',
        dept_name: '',
        dept_tel: '',
        dept_fax: '',
        dept_manager: '',
        remark: ''
      },
      dialogFormVisible: false,
      //查询表
      form: {
        token: ''
      },
      //返回数据及总数
      tableData: []
    }
  },
  methods: {
    formatRole(scope, item){
      return scope.row[item.prop]
    },
    handleClick(itemObj) {
      if(!itemObj){
        this.form1Title = '新增部门'
        this.form1 = { dept_id: '', dept_name: '', dept_tel: '', dept_fax: '', dept_manager: '', remark: '' }
        this.dialogFormVisible = true
        return false
      }
      this.form1.dept_id = itemObj.dept_id.toString()
      this.form1.dept_name = itemObj.dept_name
      this.form1.dept_tel = itemObj.dept_tel
      this.form1.dept_fax = itemObj.dept_fax
      this.form1.dept_manager = itemObj.dept_manager
      this.form1.remark = itemObj.remark
      this.form1Title = '修改部门'
      this.dialogFormVisible = true
      return true
    },
    handleClick2(itemObj) {
      this.$confirm('确认删除？')
        .then(() => {
          this.$http.post('/api/dept/delDept?token=' + this.$store.state.user.token, itemObj)
            .then(response => {
              if(response.data.code === 0) {
                this.$message({ message: '删除成功', center: true, type: 'success' })
                this.findData(true)
                return true
              }else{
                this.$message({ message: '删除失败', center: true, type: 'error' })
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
      this.$http.post('/api/dept/saveDept?token=' + this.$store.state.user.token, this.form1)
        .then(response => {
          if(response.data.code === 0) {
            this.$message({ message: (this.form1Title === '修改部门')? '修改成功' : '添加成功', center: true, type: 'success' })
            this.dialogFormVisible = false
            this.findData(true)
            return true
          }else{
            this.$message({ message: (this.form1Title === '修改部门')? '修改失败' : '添加失败', center: true, type: 'error' })
            return false
          }
        })
    },
    findData(e) {
      if(e){
        // 需要的页码初始化操作
      }
      let data = qs.stringify(this.form)
      this.$http.post('/api/dept/listDept', data)
        .then(response => {
          if(response.data.code === 0) {
            if(!response.data.data.length){
              this.$message({ message: '未查询到对应数据！', center: true, type: 'error' })
              this.tableData =[]
            }
            this.tableData = response.data.data
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