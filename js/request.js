// 新建一个新的axios实例
const myAxios = axios.create({
  // baseURL: '/bdv/api-docx/api/',
  baseURL: 'http://192.168.5.213:8668/api/',
  timeout: 5000
})

// 导出自定义函数, 参数对象解构赋值
function request({ url, method = 'GET', params, data, headers }) {
  return new Promise((resolve, reject) => {
    myAxios({
      url,
      method,
      params,
      data,
      headers
    })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
