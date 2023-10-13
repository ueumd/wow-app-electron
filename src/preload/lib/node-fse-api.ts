/**
 * fs-extra 文件操作API
 */
import superagent from 'superagent'
import fse from 'fs-extra'
import path from 'path'

export class NodeFseApi {
  private static instance: NodeFseApi

  public static getInstance() {
    if (this.instance) return this.instance
    return (this.instance = new NodeFseApi())
  }

  /**
   *
   * 异步创建目录
   * @param fullPath
   */
  ensureDir(fullPath: string) {
    return fse.ensureDir(fullPath, 0o2775)
  }

  /**
   * 异步拷贝文件
   * @param fromPath
   * @param toFullPath
   * @Return Promise
   */
  copyFile(fromPath: string, toFullPath: string) {
    console.error('fromPath, toPath', fromPath, toFullPath)
    return fse.copyFile(fromPath, toFullPath)
  }

  /**
   * 检测文件是否存在
   * @param filePath 文件全路径 /xxx/xxx.jpg
   * @Return Boolean
   */
  pathExistsSync(filePath: string): boolean {
    return fse.pathExistsSync(filePath)
  }

  /**
   * 删除文件
   * @param filePath 文件路径名
   */
  remove(filePath: string): void {
    setTimeout(() => {
      fse.remove(filePath)
    }, 100)
  }

  removeSync(filePath: string): void {
    fse.removeSync(filePath)
  }

  /**
   * 下载网络文件
   * @param url 网络文件url
   * @param filePath 文件路径 C:\\Users\\xxx\xxx\\
   * @Returen Promise
   */
  downloadFile(url: string, filePath: string) {
    return new Promise((resolve, reject) => {
      if (!url.startsWith('http')) {
        return reject(url)
      }

      const filename = url.split('/').pop()

      const fullPath = filePath + filename

      if (this.pathExistsSync(fullPath)) {
        return resolve(fullPath)
      }

      if (!url || !url.startsWith('http')) {
        reject('url 错误')
      }

      const writer = fse.createWriteStream(path.join(fullPath))

      writer.on('error', (err) => {
        console.error(err)
        reject(err)
      })

      writer.on('finish', () => {
        // console.log('总共写入了%d个字节', writer.bytesWritten)
        // console.log('写入的文件路径是' + writer.path)
        resolve(writer.path)
      })

      const req = superagent.get(url)
      req.pipe(writer)
      req.on('error', (error) => {
        reject(error)
      })
    })
  }

  /**
   * 根据 buffer 生成文件
   * @param buf
   * @param filePath /xxx/img.jpg
   */
  createFile(buf, filePath: string) {
    return new Promise((resolve, reject) => {
      fse.writeFile(filePath, buf, 'binary', (err) => {
        if (err) {
          console.log('There was an error writing the image')
          reject(err)
        } else {
          resolve(filePath)
        }
      })
    })
  }

  /**
   * 读取本地文件
   * @param filePath
   */
  readFile(filePath: string) {
    return new Promise((resolve, reject) => {
      fse.readFile(filePath, (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })
  }
}
