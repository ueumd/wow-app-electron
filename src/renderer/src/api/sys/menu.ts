import service from '@renderer/utils/request'

export const useMenuNavApi = () => {
  return service.get('api/sys/menu/nav')
}
