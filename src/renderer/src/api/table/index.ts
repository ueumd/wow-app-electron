import service from '@/utils/request'

export function getTablePersonList(data: { id?: string; limit: number; page: number; name?: string; asc: boolean }) {
	return service.post('/api/table/person/list', data) as ApiPromise
}
