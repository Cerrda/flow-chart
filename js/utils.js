/**
 * 控制节点属性菜单显示隐藏
 * @param {string} status 'show' || 'hide'
 */
function controlAttrubuteMenu(status) {
  switch (status) {
    case 'show':
      // 显示节点属性菜单
      d3.select(':root').transition().duration(duration).style('--attribute-width', `${attributeWidth}px`)
      d3.select('.right-wrapper').style('overflow', 'auto')
      break
    case 'hide':
      // 隐藏节点属性菜单
      d3.select(':root').transition().duration(duration).style('--attribute-width', '0px')
      d3.select('.right-wrapper').style('overflow', 'hidden')
      break

    default:
      break
  }
}

/**
 * 修改数组元素位置
 * @param {*} field
 * @param {Array} arr
 * @param {Number} position
 */
function itemSort(field, arr, position) {
  var idIndex = arr.indexOf(field)
  if (idIndex !== -1) {
    arr.splice(position, 0, arr.splice(idIndex, 1)[0])
  }
}

/**
 * 获取偏移量
 * @param {*} transform translate(0,0) scale(1)
 * @returns {Array} [x, y]
 */
function getTranslate(transform) {
  var arr = transform.substring(transform.indexOf('(') + 1, transform.indexOf(')')).split(',')
  return [+arr[0], +arr[1]]
}

/**
 * 获取url参数
 * @param {String} parameterName 参数名
 * @returns {*} 参数值
 */
function getUrlParam(parameterName) {
  // 获取当前页面的URL
  var url = window.location.href
  // 使用URL构造函数解析URL
  var urlObj = new URL(url)
  // 获取查询字符串对象
  var params = new URLSearchParams(urlObj.search)
  // 获取指定参数的值
  var parameterValue = params.get(parameterName)

  return parameterValue
}

/**
 * 修改选中节点样式形状
 * @param {String} type 节点样式
 */
function updateSelectNode(type) {
  // 去掉原来的形状
  d3.select(selectNode).attr('type', type).select('*').remove()
  // 添加新的形状
  var nodeStyle = addNodeByType[type](d3.select(selectNode))
  // // 更新文本和input circle和output circle的位置
  // var bound = nodeStyle.node().getBoundingClientRect()
  // var width = bound.width / scale
  // var height = bound.height / scale

  // d3.select(selectNode)
  //   .select('text')
  //   .attr('x', width / 2)
  //   .attr('y', height / 2)
  // d3.select(selectNode)
  //   .select('.input')
  //   .attr('cx', width / 2)
  // d3.select(selectNode)
  //   .select('.output')
  //   .attr('cx', width / 2)
  //   .attr('cy', height)
}

/**
 * 获取路径文本的坐标
 * @param {String} pathD 路径的d属性
 * @returns {Array} [pathTextX, pathTextY] 路径文本的坐标
 */
function getPathTextPosition(pathD) {
  const regex = /M(-?[\d.]+),(-?[\d.]+).*?(-?[\d.]+),(-?[\d.]+)$/
  const matches = pathD.match(regex)

  const startX = parseFloat(matches[1])
  const startY = parseFloat(matches[2])
  const endX = parseFloat(matches[3])
  const endY = parseFloat(matches[4])
  const pathTextX = (startX + endX) / 2
  const pathTextY = (startY + endY) / 2

  return [pathTextX, pathTextY]
}

/**
 * 对象转换为URL参数拼接格式
 * @param obj 对象 {name:Tom,age:22}
 * @returns {string} name=Tom&age=22
 */
const objectToUrlParams = (obj) => {
  const params = []

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(obj[key])
      params.push(`${encodedKey}=${encodedValue}`)
    }
  }

  return params.join('&')
}
/**
 * 查找menuData中的值
 * @param {Object} obj
 * @param {String} searchValue
 * @returns {Object}
 */
function findValues(obj, searchValue) {
  const results = {}

  function searchForObject(currentObj, category = '') {
    if (typeof currentObj === 'object' && currentObj !== null) {
      for (const key in currentObj) {
        const newPath = category ? `${category}.${key}` : key
        searchForObject(currentObj[key], newPath)
      }
    } else if (typeof currentObj === 'string' && currentObj.toUpperCase().includes(searchValue.toUpperCase().trim())) {
      const [topKey, nestedKey] = category.split('.')
      if (!results[topKey]) {
        results[topKey] = { 网络侧诊断: [], 用户侧诊断: [], 用户画像: [], 诊断结论: [] }
      }
      results[topKey][nestedKey].push(currentObj)
    }
  }

  searchForObject(obj)

  for (const category in results) {
    const { 网络侧诊断, 用户侧诊断, 用户画像, 诊断结论 } = results[category]
    if (网络侧诊断.length === 0 && 用户侧诊断.length === 0 && 诊断结论.length === 0 && 用户画像.length === 0) {
      delete results[category]
    } else {
      if (网络侧诊断.length === 0) {
        delete results[category].网络侧诊断
      }
      if (用户侧诊断.length === 0) {
        delete results[category].用户侧诊断
      }
      if (用户画像.length === 0) {
        delete results[category].用户画像
      }
      if (诊断结论.length === 0) {
        delete results[category].诊断结论
      }
    }
  }
  return results
}

/**
 * 找出两个数组的交集
 * @param {Array} arr1 数组1
 * @param {Array} arr2 数组2
 * @returns {Array}
 */
function findIntersection(arr1, arr2) {
  const set1 = new Set(arr1.map(JSON.stringify))
  const set2 = new Set(arr2.map(JSON.stringify))

  const intersection = [...set1].filter((item) => set2.has(item))

  return intersection.map(JSON.parse)
}

/**
 * 将字符串中的数字+20
 * @param {String} inputString 需要修改的字符串
 * @returns {String}
 */
function add20ToNumbers(inputString) {
  const regex = /\d+/g
  return inputString.replace(regex, (match) => {
    const number = parseInt(match, 10)
    return (number + 20).toString()
  })
}

/**
 * 判断一个数组的元素都在另一个数组中
 * @param {Array} subset 子数组
 * @param {Array} superset 夫数组
 * @returns {Boolean}
 */
function isArraySubset(subset, superset) {
  return subset.every((item) => superset.includes(item))
}

/**
 * 控制小菜单的显示和隐藏，不传参数为全部隐藏
 * @param {e} e
 * @param {String} showMenu
 */
function controlMenu(e, showMenu) {
  const menus = {
    nodeMenu,
    pathMenu,
    judgeMenu,
    selectMenu
  }

  for (const menuName in menus) {
    if (menuName === showMenu) {
      menus[showMenu].css({
        top: e.clientY + 'px',
        left: e.clientX + 'px',
        display: 'block'
      })
    } else {
      menus[menuName].css('display') === 'block' && menus[menuName].css('display', 'none')
    }
  }
}

/**
 * 获取元素的transform属性的x和y值
 * @param {Dom} element dom元素
 * @returns {Object}
 */
function getTransformValues(element) {
  var transform = d3.select(element).attr('transform')
  var match = /translate\(([^,]+), ([^,]+)\)/.exec(transform)
  if (match) {
    var x = parseFloat(match[1])
    var y = parseFloat(match[2])
    return { x, y }
  }
  return null
}

/**
 * 找到数组中与目标值最接近的值后删除数组中的该值
 * @param {Array} arr [1,2,3]
 * @param {Number} target 2
 * @returns {Number} 2
 */
function findClosestValue(arr, target) {
  return arr.reduce((prev, curr) => {
    return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  })
}
