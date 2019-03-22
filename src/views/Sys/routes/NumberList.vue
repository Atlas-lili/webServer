<template>
    <div class="number-list">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Sys/numberlist' }"><i class="el-icon-service"></i>号码管理</el-breadcrumb-item>
            <el-breadcrumb-item>400号码中心</el-breadcrumb-item>
        </el-breadcrumb>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="筛选" name="1">
                <el-form :inline="true" ref="form" :model="form1" label-position="left" size="mini">
                    <el-form-item label="400号段：不勾默认全选">
                        <el-checkbox v-model="form1.start4000" true-label="4000" false-label="">4000</el-checkbox>
                        <el-checkbox v-model="form1.start4006" true-label="4006" false-label="">4006</el-checkbox>
                        <el-checkbox v-model="form1.start4001" true-label="4001" false-label="">4001</el-checkbox>
                        <el-checkbox v-model="form1.start4007" true-label="4007" false-label="">4007</el-checkbox>
                        <el-checkbox v-model="form1.start4008" true-label="4008" false-label="">4008</el-checkbox>
                        <el-checkbox v-model="form1.start4009" true-label="4009" false-label="">4009</el-checkbox>
                    </el-form-item>
                    <el-form-item label="号码种类：">
                        <el-select v-model="form1.openType" clearable placeholder="无限制">
                            <el-option label="可选号" value="0"></el-option>
                            <el-option label="快速开通号" value="1"></el-option>
                            <el-option label="隐藏号" value="2"></el-option>
                            <el-option label="推荐号" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="号码类型：">
                        <el-select v-model="form1.type" clearable placeholder="无限制">
                            <el-option label="A类号码" value="0"></el-option>
                            <el-option label="B类号码" value="1"></el-option>
                            <el-option label="C类号码" value="2"></el-option>
                            <el-option label="D类号码" value="3"></el-option>
                            <el-option label="E类号码" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="号码模式：">
                        <el-select v-model="form1.pattern" filterable clearable placeholder="请输入关键字查询">
                            <el-option
                                    v-for="(item, index) in options"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="预占代理商：">
                        <el-select v-model="form1.order_cust" filterable clearable placeholder="请输入关键字查询">
                            <el-option
                                    v-for="(item, index) in companyList"
                                    :key="index"
                                    :label="item.cust_name"
                                    :value="item.cust_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="400号码：" label-width="80px">
                        <el-input placeholder="*代表一到多位的任意数" v-model="form1.msisdn"></el-input>
                    </el-form-item>
                    <el-form-item label="不包含：" label-width="80px">
                        <el-input placeholder="*输入不包含" v-model="form1.notExists"></el-input>
                    </el-form-item>
                    <el-form-item label="协商状态：">
                        <el-select v-model="form1.consultSts" clearable placeholder="选择协商状态">
                            <el-option label="协商中" value="1"></el-option>
                            <el-option label="未协商" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="号码状态：">
                        <el-select v-model="form1.sts" clearable placeholder="选择号码状态">
                            <el-option label="未预占" value="0"></el-option>
                            <el-option label="已预占" value="1"></el-option>
                            <el-option label="申请开通" value="2"></el-option>
                            <el-option label="已开通" value="3"></el-option>
                            <el-option label="冻结" value="4"></el-option>
                            <el-option label="分配" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="号码星级：">
                        <el-select v-model="form1.numberstart" clearable placeholder="选择号码星级">
                            <el-option label="一星" value="1"></el-option>
                            <el-option label="二星" value="2"></el-option>
                            <el-option label="三星" value="3"></el-option>
                            <el-option label="四星" value="4"></el-option>
                            <el-option label="五星" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="findData" icon="el-icon-search">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <!-- 按钮 -->
            <el-button type="success" :disabled='buttonState.campOn' @click="camponClick" size="mini" round>预占号码</el-button>
            <el-dialog title="预占号码" :visible.sync="camponActive">
                <el-form >
                    <el-form-item label="请输入预占备注内容：[必填]" >
                        <el-input v-model="camponRemark"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sendCampon({isSend: false})">取 消</el-button>
                    <el-button type="primary" @click="sendCampon({isSend: true})">确 定</el-button>
                </div>
            </el-dialog>
            <el-button type="success" :disabled='buttonState.renew' @click="goonClick" size="mini" round>续占号码</el-button>
            <el-dialog title="续占号码" :visible.sync="goonActive">
                <el-form >
                    <el-form-item label="请输入预占备注内容：[必填]" >
                        <el-input v-model="goonRemark"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sendGoon({isSend: false})">取 消</el-button>
                    <el-button type="primary" @click="sendGoon({isSend: true})">确 定</el-button>
                </div>
            </el-dialog>
            <el-button type="success" :disabled='buttonState.consult' @click="negoClick" size="mini" round>协商号码</el-button>
            <!-- 弹出表单 -->
            <el-dialog title="协商号码" :visible.sync="negoActive">
                <p>
                    <span>协商号码：{{this.negoForm.msisdn}}</span>
                    <span>&nbsp;&nbsp;&nbsp;号码类型：<span v-if="negoForm.type===0">A类号码</span>
                        <span v-if="negoForm.type===1">B类号码</span>
                        <span v-if="negoForm.type===2">C类号码</span>
                        <span v-if="negoForm.type===3">D类号码</span>
                        <span v-if="negoForm.type===4">E类号码</span>
                    </span>
                    <span>&nbsp;&nbsp;&nbsp;受理人：{{this.negoForm.opName}}</span>
                    <span>&nbsp;&nbsp;&nbsp;原预占代理商：{{this.negoForm.old_custname}}</span>
                </p>
                <el-form :model="remarkform" label-width="150px" >
                    <el-form-item label="申请协商的代理商">
                        <el-select v-model="negoForm.order_cust" @change="negoFindList" clearable filterable placeholder="请输入查询">
                            <el-option
                                    v-for="(item, index) in negoForm.custList"
                                    :key="index"
                                    :label="item.cust_name"
                                    :value="item.cust_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属操作员">
                        <el-select v-model="negoForm.order_op" clearable filterable placeholder="请输入查询">
                            <el-option
                                    v-for="(item, index) in negoForm.opList"
                                    :key="index"
                                    :label="item.op_name"
                                    :value="item.op_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="协商结果">
                        <el-radio v-model="negoForm.consult_result" label="0">协商成功</el-radio>
                        <el-radio v-model="negoForm.consult_result" label="1">协商失败</el-radio>
                    </el-form-item>
                </el-form>
                <h4><b>协商规则如下：</b></h4>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>协商成功： </b>A代理向B代理协商号码，B代理同意协商后，则该号码放入A代理平台， 时间为1个工作日，如果A代理1个工作日内仍未开通该号码，则该号码会释放到选号平台可供所有渠道代理预占。
                </p>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>协商失败： </b>A代理向B代理协商号码，若B代理不同意协商后，则B代理预占该号码的时间变为1个工作日，1个工作日B代理未开通该号码， 则该号码放入A代理平台，且时间同样为1个工作日，如果A代理1个工作日内仍未开通该号码则该号码会释放到选号平台可供所有渠道代理预占。
                </p>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sendNego({isSend: false})">取 消</el-button>
                    <el-button type="primary" @click="sendNego({isSend: true})">确 定</el-button>
                </div>
            </el-dialog>
            <el-button type="success" :disabled='buttonState.release' @click="sendFree" size="mini" round>释放号码</el-button>
            <el-button type="success" :disabled='buttonState.revamp' @click="remarkClick()" size="mini" round>修改备注</el-button>
            <!-- 弹出表单 -->
            <el-dialog title="修改备注" :visible.sync="remarkActive">
                <p>原备注：{{this.remarkform.oldremark}}</p>
                <el-form :model="remarkform">
                    <el-form-item >
                        <el-input v-model="remarkform.newremark" placeholder="新备注"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sendRemark({isSend: false})">取 消</el-button>
                    <el-button type="primary" @click="sendRemark({isSend: true})">确 定</el-button>
                </div>
            </el-dialog>
            <el-button type="success" :disabled='buttonState.dredge' @click="openClick" size="mini" round>申请开通</el-button>
            <!-- 弹出表单 -->
            <el-dialog title="开通申请" :visible.sync="openActive">
                <el-form label-width="180px" >
                    <el-form-item label="申请开通的号码：">
                        <p>{{this.openForm.msisdn}}</p>
                    </el-form-item>
                    <el-form-item label="使用客户：">
                        <el-select v-model="openForm.index" clearable filterable placeholder="请输入查询" @change="openList">
                            <el-option
                                    v-for="(item, index) in openForm.custList"
                                    :key="index"
                                    :label="item.cust_name"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否及时审核并开通：">
                        <el-radio v-model="openForm.so_sts" label="1">是：一旦工作人员审核通过，将立即开通此号码</el-radio>
                        <el-radio v-model="openForm.so_sts" label="-1">否：工作人员不审核</el-radio>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sendOpen({isSend: false})">取 消</el-button>
                    <el-button type="primary" @click="sendOpen({isSend: true})">确 定</el-button>
                </div>
            </el-dialog>
            <el-button type="success" :disabled='buttonState.repeal' @click="sendDisopen" size="mini" round>撤销开通申请</el-button>
            <el-button type="success" @click="" size="mini" round>批量预占</el-button>
            <el-button type="success" @click="" size="mini" round>批量释放</el-button>
            <el-button type="success" @click="" size="mini" round>导出400号码</el-button>
            <el-button type="success" @click="" size="mini" round>精准查询</el-button>
            <!-- 表格 -->
            <el-table
                    :data="tableData"
                    max-height="400"
                    highlight-current-row
                    @current-change="handleCurrentChange2"
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
                    </template>
                </el-table-column>
            </el-table>
            <!-- 页码 -->
            <el-pagination
                    @current-change="handleCurrentChange1"
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
  name: "NumberList",
  data() {
    return {
      activeNumber: null,
      goonRemark: '',
      camponRemark: '',
      remarkform: {
        oldremark: '',
        newremark: ''
      },
      negoForm: {
        msisdn: "",     // 400号码
        old_cust: 0,   //原预占代理商
        old_op: "", //原预占操作员ID
        old_custname: "",//原预占代理ID
        order_op: "", //新预占操作员ID
        order_cust: "",//新预占代理ID
        consult_result: "0",//协商结果 0：协商成功   1：协商失败
        sts: "0",// 号码的状态,枚举值:0:未预占 1:预占 2:申请开通 3:已开通 4:冻结 5:分配
        type: "0",//号码类型枚举值：0:A类号码 1:B类号码 2:C类号码 3:D类号码
        order_custname: "", //新预占代理名称
        opName: '',
        custList: [],
        opList:[]
      },
      openForm: {
        msisdn:  "",     // 400号码
        // use_cust: "",  //号码使用客户编号
        // use_custname: "",
        so_sts:  "", //开通进度，枚举值：-1:不需要审核1:提交申请 2:审核通过 3:审核拒绝 4:开通成功'
        index: "",
        custList: null
      },
      buttonState: {
        campOn: true,
        renew: true,
        consult: true,
        release: true,
        revamp: true,
        dredge: true,
        repeal: true
      },
      //表头
      tableList: [{ fixed: false, prop: 'msisdn', label: '400号码', width: '100', menu: false },
        { fixed: false, prop: 'consultSts', label: '协商状态', width: '70', menu: false },
        { fixed: false, prop: 'sts', label: '号码状态', width: '70', menu: false },
        { fixed: false, prop: 'so_sts', label: '开通进度', width: '70', menu: false },
        { fixed: false, prop: 'open_type', label: '号码种类', width: '70', menu: false },
        { fixed: false, prop: 'type', label: '号码类型', width: '70', menu: false },
        { fixed: false, prop: 'patternText', label: '号码模式', width: '70', menu: false },
        { fixed: false, prop: 'cust_name', label: '号码星级', width: '70', menu: false },
        { fixed: false, prop: 'opName', label: '预占人', width: '60', menu: false },
        { fixed: false, prop: 'order_custname', label: '预占代理商', width: '90', menu: false },
        { fixed: false, prop: 'ex_OrderTime', label: '预占时间', width: '150', menu: false },
        { fixed: false, prop: 'ex_ReleaseTime', label: '释放时间', width: '150', menu: false },
        { fixed: false, prop: 'use_custname', label: '号码使用客户', width: '100', menu: false },
        { fixed: false, prop: 'ex_reasonTxt', label: '回收原因', width: '70', menu: false },
        { fixed: false, prop: 'remark', label: '备注', width: '70', menu: false }],
      //新增修改表
      form1Title: '新增成员信息',
      form1: {
        start4000: '',
        start4006: '',
        start4001: '',
        start4007: '',
        start4008: '',
        start4009: '',
        openType: '',
        type: '',
        pattern: '',
        order_cust: '',
        msisdn: '',
        notExists: '',
        consultSts: '',
        sts: ''
      },
      goonActive: false,
      camponActive: false,
      dialogFormVisible: false,
      remarkActive: false,
      negoActive: false,
      openActive: false,
      options: [{value: '选项1', label: 'AAAAAA'},
        {value: '选项2', label: '*AAAAA'},
        {value: '选项1', label: '*ABCDE'},
        {value: '选项1', label: 'ABCDE*'},
        {value: '选项1', label: 'AAABBB'},
        {value: '选项1', label: '**AAAA'},
        {value: '选项1', label: '4008A4008A'},
        {value: '选项1', label: '**ABCD'},
        {value: '选项1', label: 'AAAA**'},
        {value: '选项1', label: 'AAACDE'},
        {value: '选项1', label: 'DEFAAA'},
        {value: '选项1', label: 'AABBCC'},
        {value: '选项1', label: 'ABCABC'},
        {value: '选项1', label: 'ABABAB'}],
      companyList: [],
      //筛选框显示
      activeNames: ['1'],
      //页码
      currentPage: 1,
      //关联客户表
      //查询表
      form: {
        token: '',
        page: 1,
        rows: 30
      },
      //返回数据及总数
      tableData: [],
      tableDataTotal: 0
    }
  },
  methods: {
    findCustList() {
      this.$http.post('/api/customer/listByPdCustomer?token=' + this.$store.state.user.token, {
        "cust_id":"",
        "cust_name":""
      })
        .then(response => {
          if(response.data.code === 0) {
            this.companyList = response.data.data.rows
            this.negoForm.custList = response.data.data.rows
            // return response.data.data.rows
            return true
          }else{
            return null
          }
        })
    },
    negoFindList() {
      this.$http.post('/api/operator/listOperators?token=' + this.$store.state.user.token, {
        "cust_id": "",
        "cust_name": ""
      })
        .then(response => {
          console.log(1)
          if(response.data.code === 0) {
            this.negoForm.opList = response.data.data.rows
            console.log(this.negoForm.opList)
            return true
          }else{
            return false
          }
        })
    },
    openList() {
      this.openForm.use_cust = this.openForm.index
      this.openForm.use_custname = ''
    },
    openClick() {
      this.openForm.msisdn = this.activeNumber.msisdn
      this.openForm.use_cust = this.activeNumber.use_cust
      this.openForm.use_custname = this.activeNumber.use_custname
      this.openForm.so_sts = this.activeNumber.so_sts
      this.openActive = true
      this.$http.post('/api/customer/listByPdMsisdnCustomer?token=' + this.$store.state.user.token + '&rows=100', {
        "cust_id": this.$store.state.user.cust_id,
        "msisdn": '',
        "cust_name": '',
        "status": '',
        "audit_status": '',
        "contract_status": ''
      })
        .then(response => {
          console.log(response.data)
          if(response.data.code === 0) {
            this.openForm.custList = response.data.data.rows
            return true
          }else{
            return false
          }
        })
    },
    negoClick() {
      this.negoForm.msisdn = this.activeNumber.msisdn
      this.negoForm.old_cust = this.activeNumber.order_cust
      this.negoForm.old_op = this.activeNumber.order_op
      this.negoForm.old_custname = this.activeNumber.order_custname
      this.negoForm.type = this.activeNumber.type
      this.negoForm.sts = this.activeNumber.sts
      this.negoForm.opName = this.activeNumber.opName
      this.negoActive = true
      this.findCustList()
    },
    goonClick() {
      this.goonRemark = this.activeNumber.remark
      this.goonActive = true
    },
    camponClick() {
      this.camponRemark = this.activeNumber.remark
      this.camponActive = true
    },
    remarkClick() {
      this.remarkform.oldremark = this.activeNumber.remark
      this.remarkActive = true
    },
    formatRole(scope, item){
      let map = {
        type() {
          let arr = ['A类号码', 'B类号码', 'C类号码', 'D类号码', 'E类号码']
          return arr[scope.row[item.prop]]
        },
        so_sts() {
          let arr = ['', '已经申请', '审核通过','审核拒绝', '开通成功']
          return arr[scope.row[item.prop]]
        },
        sts() {
          let arr = ['未预占', '预占', '申请开通', '已开通', '冻结', '分配']
          return arr[scope.row[item.prop]]
        },
        open_type() {
          let arr = ['可选号', '快速开通号', '隐藏号', '推荐号码种类']
          return arr[scope.row[item.prop]]
        }
      }
      return (map[item.prop]) ? map[item.prop]() : scope.row[item.prop]
    },
    handleCurrentChange1(val) {
      this.form.page = val
      this.findData()
    },
    handleCurrentChange2(val) {
      if(!val) {
        return false
      }
      let data = [{ campOn: false, renew: true, consult: true, release: true, revamp: true, dredge: true, repeal: true },
        { campOn: true, renew: false, consult: false, release: false, revamp: false, dredge: false, repeal: true },
        { campOn: true, renew: true, consult: false, release: true, revamp: true, dredge: true, repeal: false}]
      this.buttonState = data[val.sts]
      this.activeNumber = val
    },
    sendRemark(senObj) {
      if(senObj.isSend === false) {
        this.remarkActive = false
        return false
      }
      this.$http.post('/api/msisdnMgnt/saveMsisdn?token=' + this.$store.state.user.token, {
        msisdn:  this.activeNumber.msisdn,     // 400号码
        type: this.activeNumber.type,  //号码类型枚举值：0:A类号码 1:B类号码 2:C类号码 3:D类号码
        open_type: this.activeNumber.open_type, //号码开通速度枚举类型: 0(可选号) 1(快速开通号) 2(隐藏号)3(推荐号码种类)
        remark: this.remarkform.newremark    //备注
      })
        .then(response => {
          if(response.data.code === 0) {
            this.$message({ message: '修改成功', center: true, type: 'success' })
            this.remarkActive = false
            this.findData(true)
            return true
          }else{
            this.$message({ message: '修改失败', center: true, type: 'error' })
            return false
          }
        })
    },
    sendCampon(senObj) {
      if(senObj.isSend === false) {
        this.camponActive = false
        return false
      }
      this.$http.post('/api/msisdnMgnt/reservedMsisdn?token=' + this.$store.state.user.token, {
        msisdn:  this.activeNumber.msisdn,     // 400号码
        type: this.activeNumber.type,  //号码类型枚举值：0:A类号码 1:B类号码 2:C类号码 3:D类号码
        open_type: this.activeNumber.open_type, //号码开通速度枚举类型: 0(可选号) 1(快速开通号) 2(隐藏号)3(推荐号码种类)
        remark: this.camponRemark    //备注
      })
        .then(response => {
          console.log(response)
          if(response.data.code === 0) {
            this.$message({ message: '预占成功', center: true, type: 'success' })
            this.camponActive = false
            this.findData(true)
            return true
          }else{
            this.$message({ message: '预占失败', center: true, type: 'error' })
            return false
          }
        })
    },
    sendGoon(senObj) {
      if(senObj.isSend === false) {
        this.goonActive = false
        return false
      }
      this.$http.post('/api/msisdnMgnt/prolongReservedMsisdn?token=' + this.$store.state.user.token, {
        msisdn:  this.activeNumber.msisdn,     // 400号码
        type: this.activeNumber.type,  //号码类型枚举值：0:A类号码 1:B类号码 2:C类号码 3:D类号码
        open_type: this.activeNumber.open_type, //号码开通速度枚举类型: 0(可选号) 1(快速开通号) 2(隐藏号)3(推荐号码种类)
        remark: this.goonRemark    //备注
      })
        .then(response => {
          console.log(response)
          if(response.data.code === 0) {
            this.$message({ message: '续占成功', center: true, type: 'success' })
            this.goonActive = false
            this.findData(true)
            return true
          }else{
            this.$message({ message: '续占失败', center: true, type: 'error' })
            return false
          }
        })
    },
    sendNego(senObj) {
      if(senObj.isSend === false) {
        this.negoActive = false
        return false
      }
      this.$http.post('/api/msisdnMgnt/consultMsisdn?token=' + this.$store.state.user.token, {
        "msisdn":  this.negoForm.msisdn,     // 400号码
        "old_cust": this.negoForm.old_cust,   //原预占代理商
        "old_op": this.negoForm.old_op,  //原预占操作员ID
        "old_custname": this.negoForm.old_custname, //原预占代理ID
        "order_op": this.negoForm.order_op,  //新预占操作员ID
        "order_cust": this.negoForm.order_cust, //新预占代理ID
        "consult_result": this.negoForm.consult_result, //协商结果 0：协商成功   1：协商失败
        "sts": this.negoForm.sts, // 号码的状态,枚举值:0:未预占 1:预占 2:申请开通 3:已开通 4:冻结 5:分配
        "type": this.negoForm.type, //号码类型枚举值：0:A类号码 1:B类号码 2:C类号码 3:D类号码
        "order_custname": this.negoForm.order_custname //新预占代理名称
      })
        .then(response => {
          if(response.data.code === 0) {
            console.log(response.data)
            this.$message({ message: '协商成功', center: true, type: 'success' })
            this.negoActive = false
            this.findData(true)
            return true
          }else{
            this.$message({ message: '协商失败', center: true, type: 'error' })
            return false
          }
        })
    },
    sendFree() {
      this.$confirm('确认释放？')
        .then(() => {
          this.$http.post('/api/msisdnMgnt/releaseMsisdn?token=' + this.$store.state.user.token, {
            "msisdn": this.activeNumber.msisdn,     // 400号码
            "type": this.activeNumber.type,  //号码类型枚举值：0:A类号码 1:B类号码 2:C类号码 3:D类号码
            "open_type": this.activeNumber.open_type, //号码开通速度枚举类型: 0(可选号) 1(快速开通号) 2(隐藏号)3(推荐号码种类)
            "order_cust": this.activeNumber.order_cust, //预占代理商编号
            "remark": this.activeNumber.remark    //备注
          })
            .then(response => {
              if(response.data.code === 0) {
                this.$message({ message: '释放成功', center: true, type: 'success' })
                this.findData(true)
                return true
              }else{
                this.$message({ message: '释放失败', center: true, type: 'error' })
                return false
              }
            })
        })
        .catch(a => {
          this.$message({ message: '释放已取消！', center: true, type: 'warning' })
          console.log(a)
        })
    },
    sendOpen(senObj) {
      if(senObj.isSend === false) {
        this.negoActive = false
        return false
      }
      this.$http.post('/api/msisdnMgnt/applyOpen?token=' + this.$store.state.user.token, {
        "msisdn":  this.openForm.msisdn,
        "use_cust": this.openForm.custList[this.openForm.index].cust_id,
        "use_custname": this.openForm.custList[this.openForm.index].cust_name,
        "so_sts":  this.openForm.so_sts
      })
        .then(response => {
          if(response.data.code === 0) {
            this.$message({ message: '申请成功', center: true, type: 'success' })
            this.openActive = false
            this.findData(true)
            return true
          }else{
            this.$message({ message: '申请失败', center: true, type: 'error' })
            return false
          }
        })
    },
    sendDisopen() {
      this.$confirm('撤销后号码变成【已预占】状态，确定要撤销开通申请吗？')
        .then(() => {
          this.$http.post('/api/msisdnMgnt/rollbackApply?token=' + this.$store.state.user.token, {
            "msisdn": this.activeNumber.msisdn,     // 400号码
            "type": this.activeNumber.type,  //号码类型枚举值：0:A类号码 1:B类号码 2:C类号码 3:D类号码
            "open_type": this.activeNumber.open_type, //号码开通速度枚举类型: 0(可选号) 1(快速开通号) 2(隐藏号)3(推荐号码种类)
            "order_cust": this.activeNumber.order_cust, //预占代理商编号
            "remark": this.activeNumber.remark    //备注
          })
            .then(response => {
              if(response.data.code === 0) {
                this.$message({ message: '撤销成功', center: true, type: 'success' })
                this.findData(true)
                return true
              }else{
                this.$message({ message: '撤销失败', center: true, type: 'error' })
                return false
              }
            })
        })
        .catch(a => {
          this.$message({ message: '撤销已取消！', center: true, type: 'warning' })
          console.log(a)
        })
    },
    findData(e) {
      if(e){
        this.currentPage = 1
        this.form.page = 1
      }
      let data = qs.stringify(this.form)
      this.$http.post('/api/msisdnMgnt/queryMsisdnList?' + data, this.form1)
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
          this.buttonState = { campOn: true, renew: true, consult: true, release: true, revamp: true, dredge: true, repeal: true }
        })
    },
    initData() {
      this.form.token = this.$store.state.user.token
      this.findCustList()
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
