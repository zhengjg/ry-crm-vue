<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属部门" prop="sysOrgCode">
        <el-input
          v-model="queryParams.sysOrgCode"
          placeholder="请输入所属部门"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="报价日期" prop="quotationDate">
        <el-input
          v-model="queryParams.quotationDate"
          placeholder="请输入报价日期"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否可用" prop="isEnable">
        <el-input
          v-model="queryParams.isEnable"
          placeholder="请输入是否可用"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户Id" prop="customerId">
        <el-input
          v-model="queryParams.customerId"
          placeholder="请输入客户Id"
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
          v-hasPermi="['sales:quotation:add']"
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
          v-hasPermi="['sales:quotation:edit']"
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
          v-hasPermi="['sales:quotation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['sales:quotation:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="quotationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="销售ID" align="center" prop="quotationId" />
      <el-table-column label="所属部门" align="center" prop="sysOrgCode" />
      <el-table-column label="报价单号" align="center" prop="quotationNo" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="报价日期" align="center" prop="quotationDate" />
      <el-table-column label="有效日期" align="center" prop="validDate" />
      <el-table-column label="是否可用" align="center" prop="isEnable" />
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="客户Id" align="center" prop="customerId" />
      <el-table-column label="销售代表" align="center" prop="saleMan" />
      <el-table-column label="报价方案" align="center" prop="quotationSolution" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sales:quotation:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sales:quotation:remove']"
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

    <!-- 添加或修改销售报价对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属部门" prop="sysOrgCode">
          <el-input v-model="form.sysOrgCode" placeholder="请输入所属部门" />
        </el-form-item>
        <el-form-item label="报价单号" prop="quotationNo">
          <el-input v-model="form.quotationNo" placeholder="请输入报价单号" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="报价日期" prop="quotationDate">
          <el-input v-model="form.quotationDate" placeholder="请输入报价日期" />
        </el-form-item>
        <el-form-item label="有效日期" prop="validDate">
          <el-input v-model="form.validDate" placeholder="请输入有效日期" />
        </el-form-item>
        <el-form-item label="是否可用" prop="isEnable">
          <el-input v-model="form.isEnable" placeholder="请输入是否可用" />
        </el-form-item>
        <el-form-item label="税率" prop="taxRate">
          <el-input v-model="form.taxRate" placeholder="请输入税率" />
        </el-form-item>
        <el-form-item label="客户Id" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户Id" />
        </el-form-item>
        <el-form-item label="销售代表" prop="saleMan">
          <el-input v-model="form.saleMan" placeholder="请输入销售代表" />
        </el-form-item>
        <el-form-item label="报价方案" prop="quotationSolution">
          <el-input v-model="form.quotationSolution" placeholder="请输入报价方案" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-divider content-position="center">销售报价产品信息</el-divider>
        <!--<el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddHipSalesQuotationDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteHipSalesQuotationDetail">删除</el-button>
          </el-col>
        </el-row>-->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleSelectProduct">选择产品</el-button>
          </el-col>
          <el-col :span="1.5" v-show="hipSalesQuotationDetailList.length >0">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteHipContractOrder">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="hipSalesQuotationDetailList" show-summary :summary-method="getSummaries" :row-class-name="rowHipSalesQuotationDetailIndex" @selection-change="handleHipSalesQuotationDetailSelectionChange" ref="hipSalesQuotationDetail">
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
          <!--<el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="所属部门" prop="sysOrgCode" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sysOrgCode" placeholder="请输入所属部门" />
            </template>
          </el-table-column>
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
          <el-table-column label="封装形式" prop="packageType" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.packageType" placeholder="请选择封装形式">
                <el-option label="请选择字典生成" value="" />
              </el-select>
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
          <el-table-column label="单价" prop="unitPrice" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unitPrice" placeholder="请输入单价" />
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="quantity" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity" placeholder="请输入数量" />
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="amountMoney" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.amountMoney" placeholder="请输入金额" />
            </template>
          </el-table-column>-->
        </el-table>
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
            <el-input-number style="width: 120px;" v-model="scope.row.num" controls-position="right" :min="0" :max="scope.row.quantity" :precision="2"></el-input-number>
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
import { listQuotation, getQuotation, delQuotation, addQuotation, updateQuotation } from "@/api/sales/quotation";
import { listProduct } from "@/api/product/product";

export default {
  name: "Quotation",
  data() {
    return {
      // 遮罩层
      loading: true,
      productLoading: false,
      // 选中数组
      ids: [],
      selectProducts: [],
      // 子表选中数据
      checkedHipSalesQuotationDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 销售报价表格数据
      quotationList: [],
      // 销售报价产品表格数据
      hipSalesQuotationDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openProduct: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sysOrgCode: null,
        quotationDate: null,
        isEnable: null,
        customerId: null,
        customerName: null
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
        quotationNo: [
          { required: true, message: "报价单号不能为空", trigger: "blur" }
        ],
        quotationDate: [
          { required: true, message: "报价日期不能为空", trigger: "blur" }
        ],
        saleMan: [
          { required: true, message: "销售代表不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询销售报价列表 */
    getList() {
      this.loading = true;
      listQuotation(this.queryParams).then(response => {
        this.quotationList = response.rows;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        quotationId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        sysOrgCode: null,
        quotationNo: null,
        projectName: null,
        quotationDate: null,
        validDate: null,
        isEnable: null,
        taxRate: null,
        customerId: null,
        saleMan: null,
        quotationSolution: null,
        remarks: null,
        customerName: null
      };
      this.hipSalesQuotationDetailList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.quotationId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加销售报价";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const quotationId = row.quotationId || this.ids
      getQuotation(quotationId).then(response => {
        this.form = response.data;
        this.hipSalesQuotationDetailList = response.data.hipSalesQuotationDetailList;
        this.open = true;
        this.title = "修改销售报价";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.hipSalesQuotationDetailList = this.hipSalesQuotationDetailList;
          if (this.form.quotationId != null) {
            updateQuotation(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addQuotation(this.form).then(response => {
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
      const quotationIds = row.quotationId || this.ids;
      this.$modal.confirm('是否确认删除销售报价编号为"' + quotationIds + '"的数据项？').then(function() {
        return delQuotation(quotationIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 销售报价产品序号 */
    rowHipSalesQuotationDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 销售报价产品添加按钮操作 */
    handleAddHipSalesQuotationDetail() {
      let obj = {};
      obj.sysOrgCode = "";
      obj.prodctName = "";
      obj.model = "";
      obj.packageType = "";
      obj.category = "";
      obj.brand = "";
      obj.unitPrice = "";
      obj.quantity = "";
      obj.amountMoney = "";
      obj.introduction = "";
      this.hipSalesQuotationDetailList.push(obj);
    },
    /** 销售报价产品删除按钮操作 */
    handleDeleteHipSalesQuotationDetail() {
      if (this.checkedHipSalesQuotationDetail.length == 0) {
        this.$modal.msgError("请先选择要删除的销售报价产品数据");
      } else {
        const hipSalesQuotationDetailList = this.hipSalesQuotationDetailList;
        const checkedHipSalesQuotationDetail = this.checkedHipSalesQuotationDetail;
        this.hipSalesQuotationDetailList = hipSalesQuotationDetailList.filter(function(item) {
          return checkedHipSalesQuotationDetail.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleHipSalesQuotationDetailSelectionChange(selection) {
      this.checkedHipSalesQuotationDetail = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('sales/quotation/export', {
        ...this.queryParams
      }, `quotation_${new Date().getTime()}.xlsx`)
    },
    // 产品多选框选中数据
    handleProductSelectionChange(selection) {
      console.log("products",selection)
      this.selectProducts = selection;
    },
    /** 选择产品*/
    handleSelectProduct() {
      this.openProduct = true;
      this.getProductList();
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
    /** 产品确认选择按钮操作 */
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
            this.hipSalesQuotationDetailList.push(obj);
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
    /*计算总价*/
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
  }
};
</script>
