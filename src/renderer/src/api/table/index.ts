import service from '@/utils/request'

export function getTablePersonList(data: { id?: string; limit: number; page: number; name?: string; asc: boolean }) {
	return service.post('/api/table/person/list', data) as ApiPromise
}

export function getTablePersonListSave(data: any) {
	return service.post('/api/table/person/list/save', data) as ApiPromise
}
