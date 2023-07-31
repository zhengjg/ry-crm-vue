<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>

    <div class="right-menu">
      <el-menu v-show="customerName" :default-active="activeIndex" class="el-menu-customer" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">
          <router-link to="/hip/customer/contacts">
            联系人
          </router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/hip/customer/contract">
            合同订单
          </router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="/hip/sales/quotation">
            报价单
          </router-link>
        </el-menu-item>
        <el-menu-item index="4">
          <router-link to="/hip/sales/quotation">
            销售出货
          </router-link>
        </el-menu-item>
        <el-menu-item index="5">
          <router-link to="/hip/finance/receivable">
            应收账款
          </router-link>
        </el-menu-item>
      </el-menu>
      <el-dropdown class="avatar-container right-menu-item hover-effect" @command="handleUserCommand">
        <div>
          <div v-if="customerName">
            <span>{{customerName}}</span>
          </div>
          <div class="customer-wrapper-select" v-else>
            <span>
              请选择客户
            </span>
          </div>
        </div>
        <!--<div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>-->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(customer,index) in customerList"
            :key="customer.name" :command="index">
            <span>{{customer.name}}</span>
            <span style="margin-left: 5px;">{{customer.recvPhone}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { listCustomer } from "@/api/customer/customer";
import { mapGetters } from 'vuex'
import store from "@/store";
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  data() {
    return {
      activeIndex: '',
      customerList: []
    }

  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    },
    currentCustomer() {
      return store.getters.currentCustomer;
    },
    customerName() {
      return store.getters.currentCustomer.name;
    }
  },
  created() {
    this.getCustomerList();
  },
  methods: {
     /** 查询客户列表 */
    getCustomerList() {
      listCustomer({pageNum: 1,pageSize: 100}).then(response => {
        this.customerList = response.rows;
      });
    },
    handleSelect(index) {
      console.log('index', index);
    },
    handleUserCommand(command) {
      console.log(command);
      const customer = this.customerList[command];
      store.commit('SET_CUSTOMER', customer);

    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    .customer-wrapper-select {
      font-size: 14px;
      color: #ff1a00;
      line-height: 52px;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
