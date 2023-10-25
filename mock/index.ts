import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

import userModule from './user'
import tableModule from './table'

export function setupProdMockServer() {
	createProdMockServer([...userModule, ...tableModule])
}
