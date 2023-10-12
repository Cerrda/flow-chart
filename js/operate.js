// 恢复1:1比例
function svg_rate(action, a) {
  scale = 1
  transformX = 0
  transformY = 0
  svg.transition().duration(duration).call(zoom.transform, d3.zoomIdentity)
}

// 缩小
function svg_small(action, a) {
  scale = scale - 0.1
  if (scale < scaleMin) {
    scale = scaleMin
  }
  d3.zoomIdentity.k = scale
  d3.zoomIdentity.x = transformX
  d3.zoomIdentity.y = transformY
  svg.transition().duration(duration).call(zoom.transform, d3.zoomIdentity)
}

// 放大
function svg_large(action, a) {
  scale = scale + 0.1
  if (scale > scaleMax) {
    scale = scaleMax
  }
  d3.zoomIdentity.k = scale
  d3.zoomIdentity.x = transformX
  d3.zoomIdentity.y = transformY
  svg.transition().duration(duration).call(zoom.transform, d3.zoomIdentity)
}

// 清空
function svg_clear(action, a) {
  //删除所有节点g
  d3.selectAll('g[data-id]').remove()
  //删除所有path
  d3.selectAll('path.cable').remove()
  //删除所有text
  d3.selectAll('text').remove()
  // 删除所有节点数据
  nodesData = []
  // 隐藏节点属性菜单
  controlAttrubuteMenu('hide')
  // 更新groupId
  groupId = ''
}

// 填写流程名后点击确定
async function downloadJSON() {
  // 所有节点的路径
  var paths = []
  // 不重复的已连线节点id
  var linedNodesId = []
  d3.selectAll('path.cable').each(function () {
    var path = $(this)
    var fromId = path.attr('from')
    var toId = path.attr('to')

    linedNodesId.push(fromId, toId)
    paths[paths.length] = {
      from: fromId,
      to: toId,
      start: path.attr('start'),
      end: path.attr('end'),
      d: path.attr('d'),
      class: path.attr('class'),
      markerMid: path.attr('marker-mid'),
      markerEnd: path.attr('marker-end'),
      dataText: path.attr('data-text')
    }
  })
  linedNodesId = [...new Set(linedNodesId)]

  // 所有路径上面的文字
  var pathText = []
  d3.selectAll('text').each(function () {
    var text = $(this)
    pathText[pathText.length] = {
      x: text.attr('x'),
      y: text.attr('y'),
      from: text.attr('from'),
      to: text.attr('to'),
      text: text.text()
    }
  })

  // 所有节点
  var nodes = []
  // 所有节点id
  var allNodesId = []
  d3.selectAll('g[data-id]').each(function () {
    var node = $(this)
    var nodeId = node.attr('id')

    allNodesId.push(nodeId)
    nodes[nodes.length] = {
      id: nodeId,
      dataId: node.attr('data-id'),
      dataText: node.attr('data-text'),
      transform: node.attr('transform'),
      type: node.attr('type')
    }
  })

  if (nodes.length === 0) {
    createToast('warning', '没有节点，保存失败！')
    return
  }

  var dataId1 = nodes.filter((item) => beginWithOneRegex.test(item.dataId))
  if (dataId1.length > 1) {
    createToast('warning', '存在多个系统节点，保存失败！')
    return
  }
  if (dataId1.length === 0) {
    createToast('warning', '没有系统节点，保存失败！')
    return
  }

  // 未连线的节点id
  var unlinedNodesId = allNodesId.filter((item) => !linedNodesId.includes(item))

  // 保存时不允许存在未连线节点，并且存在未连线节点
  if (!allowAlone && unlinedNodesId.length > 0) {
    unlinedNodesId.forEach((id) => {
      d3.select(`[id="${id}"]`).classed('alone', true)
    })

    createToast('warning', '存在未连线节点，保存失败！')
    return
  }

  // 设置groupId
  loop: for (const item of nodes) {
    for (const key in systemIdMap) {
      if (key === item.dataText) {
        groupId = systemIdMap[key]
        break loop
      }
    }
  }

  // 下载保存数据
  var data = [paths, nodes, nodesData, pathText]

  var jsonData = JSON.stringify(data, null, 2) // 将 JSON 转换为字符串并添加缩进，使其更易读

  var blob = new Blob([jsonData], { type: 'application/json' })
  var url = URL.createObjectURL(blob)

  var link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'data.json') // 下载的文件名

  document.body.appendChild(link)
  link.click()

  // 清除 Blob URL，防止内存泄漏
  URL.revokeObjectURL(url)

  createToast('success', '保存成功！已开始下载！')

  // 如果是编辑流程且该流程有数据
  if (editFlowData) {
    var flowData = {
      dataJson: jsonData,
      groupId,
      totalFlowName,
      id
    }
  } else {
    var flowData = {
      dataJson: jsonData,
      groupId,
      totalFlowName
    }
  }
  // 发送保存数据
  postFlowDataAPI(flowData)

  totalFlowName = ''
  saveMenu.css('display', 'none')
  $('.flow-name').val('')
  d3.select('.save-confirm').attr('disabled', true)
}

// 上传保存数据
function handleFileChange(event, a) {
  const file = event.target.files[0]

  if (!file) {
    alert('No file selected.')
    return
  }

  const reader = new FileReader()

  reader.onload = function (event) {
    const fileContent = event.target.result
    try {
      const jsonData = JSON.parse(fileContent)
      svg_loadSave(jsonData, a)
    } catch (error) {
      alert('Error parsing JSON file: ' + error.message)
    }
  }

  reader.readAsText(file)

  // 清空文件，防止重复上传同一个文件时不触发change事件
  event.target.value = ''
}

// 加载保存数据
function svg_loadSave(data, a) {
  svg_clear()

  var paths = data[0]
  var nodes = data[1]
  nodesData = data[2]
  var pathText = data[3]

  $.each(nodes, function () {
    var transform = getTranslate(this.transform)
    //初始化节点
    var node = {
      id: this.id,
      dataId: this.dataId,
      x: transform[0],
      y: transform[1],
      text: this.dataText,
      inputs: 1,
      outputs: 1
    }
    addNode(node, true, this.type)
  })

  $.each(paths, function () {
    var line = d3
      .select('g[name=rootG]')
      .append('path')
      .attr('class', this.class)
      .attr('from', this.from)
      .attr('start', this.start)
      .attr('output', 1) //默认值1
      .attr('input', 1) //默认值1
      .attr('d', this.d)
      .attr('to', this.to)
      .attr('end', this.end)
      .attr('marker-mid', this.markerMid)
      .attr('marker-end', this.markerEnd)
      .attr('data-text', this.dataText)

    //设置鼠标鼠标事件
    lineMouseEvent(line)
  })

  $.each(pathText, function () {
    d3.select('g[name=rootG]')
      .append('text')
      .attr('x', this.x)
      .attr('y', this.y)
      .attr('from', this.from)
      .attr('to', this.to)
      .text(this.text)
      .attr('class', 'judge')
  })
}

// 开关切换
function switchChange(el) {
  allowAlone = el.checked
  localStorage.setItem('allowAlone', allowAlone)
  if (allowAlone) {
    d3.selectAll('.alone').classed('alone', false)
  }
}

// 输入流程名称
function inputFlowName(input) {
  if (input.value != '') {
    d3.select('.save-confirm').attr('disabled', null)
    totalFlowName = input.value
  } else {
    d3.select('.save-confirm').attr('disabled', true)
  }
}

// 点击保存按钮
function saveClick(e) {
  var menuWidth = d3.select('#saveMenu').style('width')
  saveMenu.css({
    top: e.clientY + 20 + 'px',
    left: e.clientX - parseInt(menuWidth) / 2 + 'px',
    display: 'block'
  })
  // 如果是编辑流程
  if (id) {
    $('.flow-name').val(totalFlowName)
    d3.select('.save-confirm').attr('disabled', null)
  }
  d3.select('#saveMenu input').node().focus()
}
