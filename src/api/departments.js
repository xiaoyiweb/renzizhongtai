import request from '@/utils/request'

export function getDepartments () {
	return request({
		url: '/company/department'
	})
}

export function delDepartments (id) {
	return request({
		url: `/company/department/${id}`,
		method: 'DELETE'
	})
}

export function addDepartments (data) {
	return request({
		url: '/company/department',
		method: 'POST',
		data
	})
}
/** *
 * 获取部门详情
 * ***/
export function getDepartDetail (id) {
	return request({
		url: `/company/department/${id}`
	})
}

/**
 * 编辑部门
 *
 * ***/
export function updateDepartments (data) {
	return request({
		url: `/company/department/${data.id}`,
		method: 'PUT',
		data
	})
}
