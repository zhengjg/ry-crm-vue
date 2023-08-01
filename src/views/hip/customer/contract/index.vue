<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同编号" prop="contractNo">
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程号" prop="flowId">
        <el-input
          v-model="queryParams.flowId"
          placeholder="请输入流程号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['customer:contract:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['customer:contract:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['customer:contract:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['customer:contract:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="合同Id" align="center" prop="contractId"/>
      <el-table-column label="合同编号" align="center" prop="contractNo" />
      <el-table-column label="签署地点" align="center" prop="signAddress" />
      <el-table-column label="供方" align="center" prop="supplier" />
      <el-table-column label="客户Id" align="center" prop="customerId" />
      <el-table-column label="收货地址" align="center" prop="deliveryAddress" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="合同类型" align="center" prop="contractType" />
      <el-table-column label="付款方式" align="center" prop="settlementType" />
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="合同总价" align="center" prop="totalPrice" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="流程号" align="center" prop="flowId" />
      <el-table-column label="当前节点" align="center" prop="currentNode" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['customer:contract:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['customer:contract:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="form.contractNo" :disabled="!!form.contractNo" placeholder="请输入合同编号" />
        </el-form-item>
        <el-form-item label="供应方" prop="supplier_id">
         <!-- <el-input v-model="form.signAddress" placeholder="请输入签署地点" />-->
          <el-select v-model="form.supplier_id" style="width: 100%;" clearable placeholder="请选择">
            <el-option
              v-for="item in signAddressList"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId">
            </el-option>
          </el-select>
        </el-form-item>

         <!--<el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" :disabled="!!customerName" placeholder="请输入客户名称" />
        </el-form-item>
       <el-form-item label="客户Id" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户Id" />
        </el-form-item>-->
        <el-form-item label="收货地址" prop="deliveryAddress">
          <el-input v-model="form.deliveryAddress" placeholder="请输入收货地址" />
        </el-form-item>
        <el-form-item label="税率" prop="taxRate">
          <el-input v-model="form.taxRate" placeholder="请输入税率" />
        </el-form-item>
        <el-form-item label="合同总价" prop="totalPrice">
          <el-input v-model="form.totalPrice" :disabled="true" placeholder="请输入合同总价" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="流程号" prop="flowId" style="display: none;">
          <el-input v-model="form.flowId" value="2" placeholder="请输入流程号" />
        </el-form-item>
        <el-form-item label="当前节点" prop="currentNode" style="display: none;">
          <el-input v-model="form.currentNode" value="1" placeholder="请输入当前节点" />
        </el-form-item>
        <el-divider content-position="center">产品信息</el-divider>
        <!--<el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddHipContractOrder">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteHipContractOrder">删除</el-button>
          </el-col>
        </el-row>-->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleSelectProduct">选择产品</el-button>
          </el-col>
          <el-col :span="1.5" v-show="hipContractOrderList.length >0">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteHipContractOrder">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="hipContractOrderList" show-summary :summary-method="getSummaries" :row-class-name="rowHipContractOrderIndex" @selection-change="handleHipContractOrderSelectionChange" ref="hipContractOrder">
          <el-table-column type="selection" width="80" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="产品名称" prop="prodctName" width="150" />
          <el-table-column label="型号" prop="model" width="150"/>
          <el-table-column label="容量" prop="capacity" width="150" />
          <el-table-column label="类别" prop="category" width="150" />
          <el-table-column label="品牌" prop="brand" width="150" />
          <el-table-column label="状态" prop="status" width="150" />
          <el-table-column label="单价" sortable prop="unitPrice" fixed="right" width="130" />
          <el-table-column label="数量" sortable prop="quantity" fixed="right" width="130" />
          <el-table-column label="金额" sortable prop="amountMoney" fixed="right" width="130" />
        </el-table>
       <!-- <el-table :data="hipContractOrderList" :row-class-name="rowHipContractOrderIndex" @selection-change="handleHipContractOrderSelectionChange" ref="hipContractOrder">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="产品名称" prop="prodctName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.prodctName" placeholder="请输入产品名称" />
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="model" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.model" placeholder="请输入型号" />
            </template>
          </el-table-column>
          <el-table-column label="容量" prop="capacity" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.capacity" placeholder="请输入容量" />
            </template>
          </el-table-column>
          <el-table-column label="类别" prop="category" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.category" placeholder="请输入类别" />
            </template>
          </el-table-column>
          <el-table-column label="品牌" prop="brand" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.brand" placeholder="请输入品牌" />
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.status" placeholder="请选择状态">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="unitPrice" fixed="right" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unitPrice" placeholder="请输入单价" />
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="quantity" fixed="right" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity" placeholder="请输入数量" />
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="amountMoney" fixed="right" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.amountMoney" placeholder="请输入金额" />
            </template>
          </el-table-column>
        </el-table>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--选择产品-->
    <el-dialog title="选择产品" :visible.sync="openProduct" width="1000px" append-to-body>
      <el-form :model="productParams" ref="queryProductForm" size="big" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="产品编号" prop="productNo">
          <el-input
            v-model="productParams.productNo"
            placeholder="请输入产品编号"
            clearable
            @keyup.enter.native="handlePruductQuery"
          />
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input
            v-model="productParams.name"
            placeholder="请输入产品名称"
            clearable
            @keyup.enter.native="handlePruductQuery"
          />
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input
            v-model="productParams.model"
            placeholder="请输入型号"
            clearable
            @keyup.enter.native="handlePruductQuery"
          />
        </el-form-item>
        <el-form-item label="产品类别" prop="productType">
          <el-input
            v-model="productParams.productType"
            placeholder="请输入产品类别"
            clearable
            @keyup.enter.native="handlePruductQuery"
          />
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input
            v-model="productParams.brand"
            placeholder="请输入品牌"
            clearable
            @keyup.enter.native="handlePruductQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handlePruductQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetProductQuery">重置</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="handleSelectPruducts">确认选择</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="productLoading" :data="productList" @selection-change="handleProductSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="产品ID" align="center" prop="productId" />
        <el-table-column label="所属部门" align="center" prop="sysOrgCode" />
        <el-table-column label="产品编号" align="center" prop="productNo" />
        <el-table-column label="产品名称" align="center" prop="name" />
        <el-table-column label="型号" align="center" prop="model" />
        <el-table-column label="单位组" align="center" prop="unitGroup" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="产品类别" align="center" prop="productType" />
        <el-table-column label="产品属性" align="center" prop="productProperty" />
        <el-table-column label="品牌" align="center" prop="brand" />
        <el-table-column label="产品说明" align="center" prop="specification" />
        <el-table-column label="封装形式" align="center" prop="packageType" />
        <el-table-column label="产品图片" align="center" prop="img" />
        <el-table-column label="产地" align="center" prop="placeOrigin" />
        <el-table-column label="参考价" align="center" prop="referPrice" />
        <el-table-column label="最低价" align="center" prop="lowPrice" />
        <el-table-column label="库存数量" align="center" prop="quantity" fixed="right"/>
        <el-table-column label="添加数量" align="center" prop="num" fixed="right" width="130">
          <template slot-scope="scope">
            <el-input-number style="width: 120px;" v-model="scope.row.num" controls-position="right" @change="validateNum" :min="0" :max="scope.row.quantity" :precision="2"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="价钱" align="center" prop="price" fixed="right" width="130">
          <template slot-scope="scope">
            <el-input-number style="width: 120px;" v-model="scope.row.price" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column label="总金额" align="center" prop="amountMoney" fixed="right" width="110">
          <template slot-scope="scope">
            <el-input disabled :value="scope.row.num*scope.row.price?scope.row.num*scope.row.price:null" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import { listContract, getContract, delContract, addContract, updateContract, getContractNo, getSignAddressList } from "@/api/customer/contract";
import { listProduct } from "@/api/product/product";

export default {
  name: "Contract",
  data() {
    return {
      // 遮罩层
      loading: true,
      productLoading: false,
      // 选中数组
      ids: [],
      selectProducts: [],
      // 子表选中数据
      checkedHipContractOrder: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 合同表格数据
      contractList: [],
      // 合同表格数据
      hipContractOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openProduct: false,
      signAddressList:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractNo: null,
        status: null,
        contractType: null,
        settlementType: null,
        flowId: null,
        customerName: null,
      },
      productList:[],
      productParams:{
        pageNum: 1,
        pageSize: 10,
        productNo: null,
        name: null,
        model: null,
        productType: null,
        brand: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  computed: {
    currentCustomer() {
      return store.getters.currentCustomer;
    },
    customerName() {
      return store.getters.currentCustomer.name;
    },
    getTotalPrice() {
      const total = 0;
      if(this.productList.length > 0) {
        this.productList.forEach((row) => {
          if(row.num &&row.price) {
            total += row.num*row.price
          }
        });
      }
      this.form.totalPrice = total;
      return total
    }
  },
  watch: {
    hipContractOrderList(newValue,oldValue) {
      console.log('hipContractOrderList',newValue)
      let total = 0;
      if(newValue && newValue.length > 0) {
        newValue.forEach((row) => {
          if(row.unitPrice && row.quantity) {
            total += row.unitPrice*row.quantity
          }
        });
      }
      console.log('total',total)
      this.form.totalPrice = total;
    }
  },
  created() {
    if(this.currentCustomer && this.currentCustomer.name) {
      this.queryParams.customerName = this.currentCustomer.name;
    }
    this.getList();
    this.getSignAddressList();
  },
  methods: {
    // 查询供应方 
    getSignAddressList() {
      getSignAddressList().then(response => {
        if(response.code == 200) {
          this.signAddressList = response.data;
        }
      });
    },
    /** 查询合同列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then(response => {
        this.contractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getProductList() {
      this.productLoading = true;
      listProduct(this.productParams).then(response => {
        this.productList = response.rows;
        this.total = response.total;
        this.productLoading = false;
      }).catch(()=>{
        this.productLoading = false;
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if(index > 7) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
            } else {
              sums[index] = ' ';
            }
          } else {
            sums[index] = ' ';
          }
        });
        return sums;
    },
    /** 搜索产品按钮操作 */
    handlePruductQuery() {
      this.productParams.pageNum = 1;
      this.getProductList();
    },
    /** 产品重置按钮操作 */
    resetProductQuery() {
      this.resetForm("queryProductForm");
      this.handlePruductQuery();
    },
    handleSelectPruducts() {
      if(this.selectProducts.length >0) {
        const isFullInput = this.selectProducts.every((row)=>{
          return row.num && row.price
        })
        if(isFullInput) {
          console.log('niu')
          this.selectProducts.forEach((element) => {
            let obj = {};
            obj.prodctName = element.name;
            obj.model = element.model;
            obj.capacity = "";
            obj.category = "";
            obj.brand = element.brand;
            obj.status = "";
            obj.unitPrice = element.price;
            obj.quantity = element.num;
            obj.amountMoney = element.price * element.num;
            obj.remarks = "";
            this.hipContractOrderList.push(obj);
          });
          this.openProduct = false;

        }else {
          this.$message({
            message: '请输入产品的数量和价格',
            type: 'warning'
          });
        }

      } else {
        this.$message({
          message: '请选选择产品',
          type: 'warning'
        });
      }
    },
    validateNum(value) {
      console.log(value)

    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        contractId: null,
        contractNo: null,
        signAddress: null,
        supplier: null,
        customerId: null,
        deliveryAddress: null,
        status: null,
        contractType: null,
        settlementType: null,
        taxRate: null,
        totalPrice: null,
        remark: null,
        flowId: null,
        currentNode: null,
        customerName: null,
        createTime: null,
        createBy: null,
        updateBy: null,
        updateTime: null
      };
      this.hipContractOrderList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryProductForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.contractId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // 产品多选框选中数据
    handleProductSelectionChange(selection) {
      console.log("products",selection)
      this.selectProducts = selection;
    },
    /** 新增按钮操作 */
    async handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加合同";
      this.form.customerName = this.customerName;
      this.form.customerId = this.currentCustomer.customerId;
      const no = await getContractNo();
      if(no) {
        this.form.contractNo = no;
      }      
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const contractId = row.contractId || this.ids
      getContract(contractId).then(response => {
        this.form = response.data;
        this.hipContractOrderList = response.data.hipContractOrderList;
        this.open = true;
        this.title = "修改合同";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.hipContractOrderList = this.hipContractOrderList;
          this.form.customerName = this.customerName;
          this.form.customerId = this.currentCustomer.customerId;
          if (this.form.contractId != null) {
            updateContract(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addContract(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const contractIds = row.contractId || this.ids;
      this.$modal.confirm('是否确认删除合同编号为"' + contractIds + '"的数据项？').then(function() {
        return delContract(contractIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 合同序号 */
    rowHipContractOrderIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 合同添加按钮操作 */
    handleAddHipContractOrder() {
      let obj = {};
      obj.prodctName = "";
      obj.model = "";
      obj.capacity = "";
      obj.category = "";
      obj.brand = "";
      obj.status = "";
      obj.unitPrice = "";
      obj.quantity = "";
      obj.amountMoney = "";
      obj.remarks = "";
      this.hipContractOrderList.push(obj);
    },
    /** 合同删除按钮操作 */
    handleDeleteHipContractOrder() {
      if (this.checkedHipContractOrder.length == 0) {
        this.$modal.msgError("请先选择要删除的合同数据");
      } else {
        const hipContractOrderList = this.hipContractOrderList;
        const checkedHipContractOrder = this.checkedHipContractOrder;
        this.hipContractOrderList = hipContractOrderList.filter(function(item) {
          return checkedHipContractOrder.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleHipContractOrderSelectionChange(selection) {
      this.checkedHipContractOrder = selection.map(item => item.index)
    },
    /** 选择产品*/
    handleSelectProduct() {
      this.openProduct = true;
      this.getProductList();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('customer/contract/export', {
        ...this.queryParams
      }, `contract_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
