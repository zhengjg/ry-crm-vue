import request from '@/utils/request'

// 查询销售报价列表
export function listStockOuter() {
  return request({
    url: '/customer/contract/getOrderByCustomerId',
    method: 'get',
    params: {}
  })
}