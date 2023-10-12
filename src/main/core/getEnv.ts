import path from 'path'
import dotEnv from 'dotenv'
import fs from 'fs'
// 先构造出.env*文件的绝对路径
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const pathsDotenv = resolveApp('.env')

dotEnv.config({ path: `${pathsDotenv}.development` }) // 加载.env.development

// console.log(process.env.VITE_APP_TITLE) // local
