/**
 * By default, it writes logs to the following locations:
 * on Linux: ~/.config/[appName]/logs/main.log
 * on macOS: ~/Library/Logs/[appName]/main.log
 * on Windows: %USERPROFILE%\AppData\Roaming\[appName]\logs\main.log
 * @see https://www.npmjs.com/package/electron-log
 */

import log from 'electron-log'

// 关闭控制台打印
log.transports.console.level = false
log.transports.file.level = 'info'
log.transports.file.maxSize = 10024300 // 文件最大不超过 10M
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}' // 输出格式

// 文件位置及命名方式
// 默认位置为：C:\Users\[user]\AppData\Roaming\[appName]\electron_log\
// 文件名为：年-月-日.log
// 自定义文件保存位置为安装目录下 \log\年-月-日.log
const date = new Date()
const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
log.transports.file.resolvePath = () => 'logs\\' + dateStr + '.log'

//  六个日志级别error, warn, info, verbose, debug, silly。默认是silly
export default {
  info(...param: any) {
    log.info(param)
  },
  warn(...param: any) {
    log.warn(param)
  },
  error(...param: any) {
    log.error(param)
  },
  debug(...param: any) {
    log.debug(param)
  },
  verbose(...param: any) {
    log.verbose(param)
  },
  silly(...param: any) {
    log.silly(param)
  }
}

// log.info(`[logger] logger initialized`)
