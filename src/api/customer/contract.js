import request from '@/utils/request'

// 查询合同列表
export function listContract(query) {
  return request({
    url: '/customer/contract/list',
    method: 'get',
    params: query
  })
}

// 查询合同详细
export function getContract(contractId) {
  return request({
    url: '/customer/contract/' + contractId,
    method: 'get'
  })
}

// 新增合同
export function addContract(data) {
  return request({
    url: '/customer/contract',
    method: 'post',
    data: data
  })
}

// 修改合同
export function updateContract(data) {
  return request({
    url: '/customer/contract',
    method: 'put',
    data: data
  })
}

// 删除合同
export function delContract(contractId) {
  return request({
    url: '/customer/contract/' + contractId,
    method: 'delete'
  })
}

// 获得序列号
export function getContractNo() {
  return request({
    url: '/rule/HT',
    method: 'get'
  })
}

// 获取供应方列表
export function getSignAddressList() {
  return request({
    url: '/system/dept/list/all',
    method: 'get'
  })
}



