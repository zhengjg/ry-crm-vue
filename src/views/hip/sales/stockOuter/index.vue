<template>
  <div class="app-container">
    <el-table
          v-loading="loading"
          :data="customerList"
          :default-expand-all="true"
          tooltip-effect="dark"
          style="width: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table
                ref="multipleTable"
                :data="props.row.hipContractOrderList"
                style="width: 100%;margin-left: 47px;border: 1px solid #dfe6ec;"
                row-key="contractOrderId">
                <el-table-column
                  prop="contractOrderId"
                  label="合同ID"/>
                <el-table-column
                  prop="productId"
                  label="产品ID"/>
                <el-table-column
                  prop="prodctName"
                  label="产品名称"/>
                <el-table-column
                  prop="unitPrice"
                  label="单价"/>
                <el-table-column
                  prop="quantity"
                  label="数量"/>
                
              </el-table>
            </template>
          </el-table-column>
          <el-table-column 
          label="编码" 
          prop="flowId" />
          <el-table-column
            prop="customerName"
            label="客户姓名"/>
          <el-table-column
            prop="deliveryAddress"
            label="联系地址"/>
          <el-table-column
            prop="createTime"
            label="创建时间"/>
        </el-table>
  </div>
</template>

<style scoped lang="scss">
.innterTable {
  width: 100%;
  margin-left: 47px;
  border-left: 1px solid;
}
</style>

<script>
import { listStockOuter } from "@/api/sales/stockOuter"
import { listQuotation, getQuotation, delQuotation, addQuotation, updateQuotation } from "@/api/sales/quotation";

export default {
  name: "StockOuter",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
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
      customerList: [],
      // 销售报价产品表格数据
      hipSalesQuotationDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
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
    //this.getList();
    this.getListStockOuter();
  },
  methods: {
    getListStockOuter() {
      this.loading = true;
      listStockOuter().then(response => {
        this.customerList = response.rows;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 查询销售报价列表 */
    getList() {
      this.loading = true;
      listQuotation(this.queryParams).then(response => {
        this.quotationList = response.rows;
        this.total = response.total;
        this.loading = false;
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
    }
  }
};
</script>
