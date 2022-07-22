import request from '@/utils/request'

// 获取角色列表
export function getRoleList (params) {
	return request({
		url: '/sys/role',
		params
	})
}

// 查询企业信息
export function getCompanyDetail (id) {
	return request({
		url: `/company/${id}`
	})
}

// 删除角色
export function delRole (id) {
	return request({
		url: `/sys/role/${id}`,
		method: 'DELETE'
	})
}

// 获取角色详情
export function getRoleDetail (id) {
	return request({
		url: `/sys/role/${id}`,
		method: 'GET'
	})
}

// 修改角色详情
export function editRoleDetail (data) {
	return request({
		url: `/sys/role/${data.id}`,
		method: 'PUT',
		data
	})
}

// 添加角色
export function addRole (data) {
	return request({
		url: `/sys/role`,
		method: 'POST',
		data
	})
}
