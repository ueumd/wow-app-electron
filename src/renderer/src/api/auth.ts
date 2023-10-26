import service from '@/utils/request'

export const useAccountLoginApi = (data: any) => {
	return service.post('api/sys/auth/login', data)
}

export const useMobileLoginApi = (data: any) => {
	return service.post('api/sys/auth/mobile', data)
}

export const useLogoutApi = () => {
	return service.post('api/sys/auth/logout')
}
