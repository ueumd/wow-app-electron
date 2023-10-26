import service from '@/utils/request'

export const useMenuNavApi = () => {
	return service.get('api/sys/menu/nav')
}
