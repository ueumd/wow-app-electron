import service from '@/utils/request'

export const useUserInfoApi = () => {
	return service.get('api/sys/user/info')
}
