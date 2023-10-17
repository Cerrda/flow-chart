// 页面初始化
$(function () {
  // 处理左侧菜单,editFlow需要getMenuList中处理好的数据，所以需要在这里处理
  getMenuList().then(() => {
    // 编辑流程
    editFlow()
  })

  // 获取允许存在未连线节点的配置
  allowAlone = JSON.parse(getUrlParam('allowAlone')) ?? allowAlone
  $('.cmn-toggle').prop('checked', allowAlone)

  // 画布事件绑定
  svgCanvasEvent()

  // 全局事件绑定
  globalEvent()

  //给svg添加缩放事件
  svg.call(zoom)

  // 功能移除
  removeFunction()
})

// 功能移除
function removeFunction() {
  // 前台控制是否允许节点单独存在功能移除,需要时直接取消remove()即可
  d3.select('.switch').remove()
  // 前台加载保存数据功能移除,需要时直接取消remove()即可
  // d3.select('.upload').remove()
  // 前台控制切换默认样式功能移除,需要时直接取消remove()即可
  d3.select('.default-node-style').remove()
  // 前台修改节点样式功能移除,需要时直接取消remove()并解开下面三行得注释即可
  d3.select('.edit-style').remove()
  // 根据选择的默认样式动态展示示例
  // d3.select('.choose-style svg').remove()
  // $('.choose-style').append(d3.select(`.edit-style .box svg[class=${nodeType}]`).node().cloneNode(true))
  // 添加属性功能移除
  d3.select('.add').remove()
}

// 画布事件绑定
function svgCanvasEvent() {
  var svgCanvas = document.getElementById('svg-canvas')

  // 画布点击事件和事件代理
  svgCanvas.addEventListener('click', function (e) {
    // 点击画布和连线上的文字时不触发，按住ctrl时不触发
    if (e.target.id === 'svgrect' || e.target.tagName === 'text' || e.ctrlKey) return
    // 点击连线时
    if (e.target.tagName === 'path') {
      selectPath = e.target
      controlMenu(e, 'judgeMenu')
      return
    }
    if (e.target.tagName === 'DIV') {
      selectNode = e.target.parentNode.parentNode
    } else {
      selectNode = e.target.parentNode
    }

    d3.selectAll('g').classed('active', false)
    d3.select(selectNode).classed('active', true)
    showInfo()
  })

  // 监听鼠标右键
  svgCanvas.addEventListener('contextmenu', function (e) {
    e.preventDefault()
    if (e.target.id === 'svgrect') return

    if (e.target.tagName === 'path') {
      // 更新当前选中节点为选中的 path
      selectPath = e.target
      controlMenu(e, 'pathMenu')
    } else {
      // 如果是非框选中的节点
      const clickNode = e.target.tagName === 'DIV' ? e.target.parentNode.parentNode : e.target.parentNode
      if (!d3.select(clickNode).classed('selected')) {
        // 更新当前选中节点为选中的 g
        selectNode = clickNode
        d3.selectAll('g').classed('active', false)
        d3.select(selectNode).classed('active', true)
        controlMenu(e, 'nodeMenu')
      } else {
        controlMenu(e, 'selectMenu')
      }
    }
  })

  // ctrl + 鼠标按下
  svgCanvas.addEventListener('mousedown', function (e) {
    if (e.ctrlKey) {
      // 数据初始化
      let startX = 0,
        startY = 0,
        endX = 0,
        endY = 0,
        maskWidth = 0,
        maskHeight = 0,
        maskLeft = 0,
        maskTop = 0
      // 取消框选中的节点
      nodeSelected = []
      pathSelected = []
      textSelected = []
      setSelectedStyle(nodeSelected, 'node')
      setSelectedStyle(pathSelected, 'path')
      setSelectedStyle(textSelected, 'text')

      // 取消画布的移动和缩放事件
      svg.on('.zoom', null)

      startX = e.clientX
      startY = e.clientY

      svgCanvas.addEventListener('mousemove', ctrlMousemove)

      svgCanvas.addEventListener('mouseup', ctrlMouseup)
      // ctrl + 鼠标移动
      function ctrlMousemove(e) {
        endX = e.clientX
        endY = e.clientY

        maskWidth = Math.abs(endX - startX)
        maskHeight = Math.abs(endY - startY)
        maskLeft = Math.min(startX, endX)
        maskTop = Math.min(startY, endY)

        $('.mask').css({
          display: 'block',
          width: `${maskWidth}px`,
          height: `${maskHeight}px`,
          left: `${maskLeft}px`,
          top: `${maskTop}px`
        })
      }
      // ctrl + 鼠标松开
      function ctrlMouseup() {
        svgCanvas.removeEventListener('mousemove', ctrlMousemove)
        svgCanvas.removeEventListener('mouseup', ctrlMouseup)

        // 计算框选到的元素
        svgSelected()

        setSelectedStyle(nodeSelected, 'node')
        setSelectedStyle(pathSelected, 'path')
        setSelectedStyle(textSelected, 'text')

        // 隐藏框选框
        $('.mask').css({
          display: 'none'
        })

        // 绑定画布的移动和缩放事件
        svg.call(zoom)
      }
    }
  })
}

// 框选到的元素
function svgSelected() {
  const mask = document.querySelector('.mask')
  const node = document.querySelectorAll('g.node')
  const path = document.querySelectorAll('path.cable')
  const text = document.querySelectorAll('text.judge')

  // 框住的node节点id
  node.forEach((item) => {
    if (includes(mask, item)) {
      nodeSelected.push(item.getAttribute('id'))
    }
  })
  // 框住的path节点id以及上面的text节点id
  path.forEach((item) => {
    const pathRoute = [item.getAttribute('from'), item.getAttribute('to')]
    if (includes(mask, item) && isArraySubset(pathRoute, nodeSelected)) {
      pathSelected.push(pathRoute)
    }
  })
  // 框住的text节点id
  let texts = []
  text.forEach((item) => {
    texts.push([item.getAttribute('from'), item.getAttribute('to')])
  })
  textSelected = findIntersection(pathSelected, texts)
}

// 判断是否框到
function includes(rect, rect2) {
  rect = rect.getBoundingClientRect()
  rect2 = rect2.getBoundingClientRect()

  return !(rect.left > rect2.right || rect.right < rect2.left || rect.top > rect2.bottom || rect.bottom < rect2.top)
}

// 设置框选到的元素的样式
function setSelectedStyle(elSelectedArr, type) {
  switch (type) {
    // 设置node的样式
    case 'node':
      d3.selectAll('g.node').classed('selected', false)
      if (elSelectedArr.length === 0) return
      for (const item of elSelectedArr) {
        d3.select(`g.node[id="${item}"]`).classed('selected', true)
      }
      break
    // 设置path的样式
    case 'path':
      d3.selectAll('path.cable')
        .classed('selected', false)
        // 避免将没有箭头的变成箭头了
        .attr('marker-end', function () {
          return d3.select(this).attr('marker-end') === 'url(#selectedArrow)'
            ? 'url(#arrow)'
            : d3.select(this).attr('marker-end')
        })
      if (elSelectedArr.length === 0) return
      for (const item of elSelectedArr) {
        d3.select(`path.cable[from="${item[0]}"][to="${item[1]}"]`)
          .classed('selected', true)
          .attr('marker-end', function () {
            return d3.select(this).attr('marker-end') === 'url(#arrow)'
              ? 'url(#selectedArrow)'
              : d3.select(this).attr('marker-end')
          })
      }
      break
    // 设置text的样式
    case 'text':
      d3.selectAll('text.judge').classed('selected', false)
      if (elSelectedArr.length === 0) return
      for (const item of elSelectedArr) {
        d3.select(`text.judge[from="${item[0]}"][to="${item[1]}"]`).classed('selected', true)
      }
      break
    default:
      break
  }
}

// 全局事件绑定
function globalEvent() {
  document.addEventListener('click', (e) => {
    // 隐藏右键菜单
    pathMenu.css('display', 'none')
    nodeMenu.css('display', 'none')
    selectMenu.css('display', 'none')
    if (e.target.tagName !== 'path') {
      judgeMenu.css('display', 'none')
    }
    if (e.target.className !== 'btn btn-link' && e.target.className !== 'flow-name') {
      saveMenu.css('display', 'none')
    }
    // 隐藏选择节点默认样式列表
    var className = e.target.className
    if (className != 'choose-style' && className.baseVal != '' && !addNodeByType[className.baseVal]) {
      d3.select('.default-node-style .box').style('display', 'none')
    }
    if (e.ctrlKey) return
    // 点击画布时，取消选中节点
    var id = e.target.id
    if (id == 'svgrect') {
      d3.selectAll('g').classed('active', false)
      selectNode = null
      controlAttrubuteMenu('hide')

      // 取消框选中的节点
      nodeSelected = []
      pathSelected = []
      textSelected = []
      setSelectedStyle(nodeSelected, 'node')
      setSelectedStyle(pathSelected, 'path')
      setSelectedStyle(textSelected, 'text')
    }
  })

  let ctrlCPressed = false
  // 复制
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'v' && !ctrlCPressed) {
      ctrlCPressed = true
      if (nodeSelected.length > 0) {
        let timestamp = Date.now()
        let newNodeSelected = []
        let newPathSelected = []
        let newTextSelected = []
        // 复制节点
        for (const node of nodeSelected) {
          newNodeSelected.push(timestamp + '')
          copyNode(node, timestamp)
          timestamp += 1
        }
        // 复制路径
        for (const path of pathSelected) {
          newPathSelected.push(copyPath(path))
        }
        // 复制文字
        for (const text of textSelected) {
          newTextSelected.push(copyText(text))
        }

        nodeSelected = newNodeSelected
        pathSelected = newPathSelected
        textSelected = newTextSelected

        setSelectedStyle(nodeSelected, 'node')
        setSelectedStyle(pathSelected, 'path')
        setSelectedStyle(textSelected, 'text')
      }
    }
  })
  document.addEventListener('keyup', function (event) {
    if (event.key === 'v') {
      ctrlCPressed = false
    }
  })
}

// 编辑流程
async function editFlow() {
  if (id) {
    var res = await getFlowDataAPI(id)
    editFlowData = res.data
    if (editFlowData) {
      var flowData = JSON.parse(editFlowData.dataJson)
      svg_loadSave(flowData)
      totalFlowName = editFlowData.totalFlowName
    }
  }
}

// 处理左侧菜单
async function getMenuList() {
  var res = await getMenuListAPI()
  // var res = {}
  // res.data = menuDatas

  var { businessItem, diagnosticItem, diagnosticSideItem, systemItem } = res.data
  menuData[systemItem.sideItemName] = systemItem.sideItemList.map((item) => item.nodeName)
  menuData[businessItem.sideItemName] = businessItem.sideItemList.map((item) => item.nodeName)
  menuData[diagnosticSideItem.sideItemName] = diagnosticSideItem.sideItemList.map((item) => item.nodeName)

  // 初始化系统名称对应的id对象
  for (const item of systemItem.sideItemList) {
    systemIdMap[item.nodeName] = item.id + ''
  }

  const processedData = {}

  for (const item of diagnosticItem.flowListVoList) {
    const itemData = {}
    for (const flowSide of item.flowSideVoList) {
      const flowSideData = []
      for (const flowApi of flowSide.flowApiVoList) {
        if (flowApi.isShow === 0) continue
        allNodesData.push(flowApi)
        flowSideData.push(flowApi.flowName)
      }
      itemData[flowSide.sideName] = flowSideData
    }
    processedData[item.nodeDescription] = itemData
  }
  // 数组去重
  const uniqueObjects = {}
  const uniqueArray = []

  allNodesData.forEach((obj) => {
    if (!uniqueObjects[obj.id]) {
      uniqueObjects[obj.id] = true
      uniqueArray.push(obj)
    }
  })
  allNodesData = uniqueArray

  menuData[diagnosticItem.diagnosticItemName] = processedData
  // 创建左侧菜单
  createMenu(menuData, d3.select('#left-wrapper'))
  // 左侧菜单绑定拖拽
  bindDrag()
  // 取消加载中动画
  $('#menu-loading').css('display', 'none')
}

// 左侧菜单绑定拖拽
function bindDrag() {
  $('#left-wrapper .node').draggable({
    helper: 'clone',
    addClass: true,
    start: function (e, ui) {
      // ui.helper代表正在拖动的 jQuery 对象
      var dragNode = ui.helper
      // 拖拽第一组时
      if (beginWithOneRegex.test(dragNode.attr('data-id'))) {
        dragNode.addClass(`begin`)
      }
      // 拖拽第二组时
      if (beginWithTwoRegex.test(dragNode.attr('data-id'))) {
        dragNode.addClass(`scene`)
      }
      // 拖拽第三组时
      if (beginWithThreeRegex.test(dragNode.attr('data-id'))) {
        dragNode.addClass(`diagnostic-type`)
      }
      dragNode.addClass(`draggable-${nodeType}`)
      // 根据当前scale缩放拖动的节点
      dragNode.css({
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      })
    },
    drag: function (e, ui) {
      // 限制拖拽范围，使其只能在svg范围拖动
      var left = ui.position.left
      var top = ui.position.top
      var svgRect = svg.node().getBoundingClientRect()
      var dragNodeWidth = ui.helper.width()
      var dragNodeHeight = ui.helper.height()
      ui.position.left = Math.min(left, svgRect.width + leftmenu - dragNodeWidth)
      if (top < headmenu) {
        ui.position.top = headmenu
      }
      if (top > svgRect.height + headmenu - dragNodeHeight) {
        ui.position.top = svgRect.height + headmenu - dragNodeHeight
      }
    },
    stop: function (e, ui) {
      var dragNode = ui.helper

      // 如果拖拽到画布外面，不创建节点
      if (ui.position.left < leftmenu - dragNode.width()) {
        dragNode.remove()
        return
      }

      var x = ui.position.left - leftmenu
      var y = ui.position.top - headmenu
      var transform = svgRoot.attr('transform')
      translate = getTranslate(transform)

      x = (x - translate[0]) / scale
      y = (y - translate[1]) / scale

      //初始化节点
      var node = {
        id: new Date().getTime(),
        dataId: dragNode.attr('data-id'),
        x: x,
        y: y,
        text: dragNode.text().trim(),
        inputs: 1,
        outputs: 1
      }
      // 是否拖拽诊断项
      var isDragDiagnostic =
        beginWithOneRegex.test(dragNode.attr('data-id')) ||
        beginWithTwoRegex.test(dragNode.attr('data-id')) ||
        beginWithThreeRegex.test(dragNode.attr('data-id'))
      if (!isDragDiagnostic) {
        node.diagnosticId = allNodesData.find((item) => item.flowName === dragNode.text()).id
      }

      //将节点增加到 rootg
      addNode(node)
    }
  })
}

// 新增节点
function addNode(node, fromSave, type = nodeType) {
  var g = svgRoot
    .append('g')
    .attr('class', 'node')
    .attr('data-id', node.dataId)
    .attr('data-text', node.text)
    .attr('id', node.id)
    .attr('transform', 'translate(' + node.x + ', ' + node.y + ')')
    .attr('type', type)

  //更新当前选中节点为新增节点
  selectNode = $('#' + node.id)[0]
  d3.selectAll('g').classed('active', false)
  d3.select(selectNode).classed('active', true)
  // 如果是第一组的节点
  if (beginWithOneRegex.test(d3.select(selectNode).attr('data-id'))) {
    d3.select(selectNode).classed('begin', true)
  }
  // 如果是第二组的节点
  if (beginWithTwoRegex.test(d3.select(selectNode).attr('data-id'))) {
    d3.select(selectNode).classed('scene', true)
  }
  // 如果是第三组的节点
  if (beginWithThreeRegex.test(d3.select(selectNode).attr('data-id'))) {
    d3.select(selectNode).classed('diagnostic-type', true)
  }
  //添加样式 (形状)
  var nodeStyle = addNodeByType[type](g)

  // rect.node() 当前的rect元素
  var bound = nodeStyle.node().getBoundingClientRect()

  //兼容缩放 bound.width为css中设置的rect的宽度
  var width = bound.width / scale
  var height = bound.height / scale

  // text
  g.append('foreignObject').attr('width', width).attr('height', height).append('xhtml:div').text(node.text)

  // input circle
  var inputs = node.inputs || 0
  g.attr('inputs', inputs)
  for (var i = 0; i < inputs; i++) {
    g.append('circle')
      .attr('class', 'input')
      .attr('input', i + 1)
      .attr('cx', (width * (i + 1)) / (inputs + 1))
      .attr('cy', 0)
      .attr('r', radius)
  }

  // output circle
  var outputs = node.outputs || 0
  g.attr('outputs', outputs)
  for (i = 0; i < outputs; i++) {
    g.append('circle')
      .attr('output', i + 1)
      .attr('class', 'output')
      .attr('cx', (width * (i + 1)) / (outputs + 1))
      .attr('cy', height)
      .attr('r', radius)
  }

  //节点移动
  g.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))

  //输出环
  g.selectAll('circle.output').call(d3.drag().on('start', linestarted).on('drag', linedragged).on('end', lineended))

  $(`[id='${node.id}']`).on('mouseenter', function (e) {
    if (drawLine) {
      if (this.id === activeLine.attr('from')) {
        return
      }
      d3.selectAll('circle.end').classed('end', false)
      // 获取class为input的circle子元素
      d3.select(this).select('circle.input').classed('end', true)
    }
  })

  // 如果添加节点时不是从保存加载的，需要添加节点数据
  if (!fromSave) {
    var nodeData = {
      id: node.id,
      name: node.text
    }
    var isDragDiagnostic =
      beginWithOneRegex.test(node.dataId) ||
      beginWithTwoRegex.test(node.dataId) ||
      beginWithThreeRegex.test(node.dataId)
    if (!isDragDiagnostic) {
      var data = allNodesData.find((item) => item.id === node.diagnosticId)
      nodeData.diagnosticId = node.diagnosticId
      nodeData.businessId = data.businessId
      nodeData.sideId = data.sideId
      nodeData.apiInfoList = data.apiInfoList
    }
    nodesData.push(nodeData)
  }

  showInfo()

  return g
}

// 复制节点
function copyNode(nodeId, timestamp, type = nodeType) {
  // 设置新旧节点的映射，以便path和text复制的时候使用
  oldNodeMap[nodeId] = timestamp

  const copyNode = d3.select(`g.node[id="${nodeId}"]`)
  const node = {
    id: timestamp,
    dataId: copyNode.attr('data-id'),
    x: getTranslate(copyNode.attr('transform'))[0] + 20,
    y: getTranslate(copyNode.attr('transform'))[1] + 20,
    text: copyNode.text().trim(),
    inputs: 1,
    outputs: 1
  }

  var g = svgRoot
    .append('g')
    .attr('class', 'node')
    .attr('data-id', node.dataId)
    .attr('data-text', node.text)
    .attr('id', node.id)
    .attr('transform', 'translate(' + node.x + ', ' + node.y + ')')
    .attr('type', type)

  //更新当前选中节点为新增节点
  selectNode = $('#' + node.id)[0]
  d3.selectAll('g').classed('active', false)
  d3.select(selectNode).classed('active', true)
  // 如果是第一组的节点
  if (beginWithOneRegex.test(d3.select(selectNode).attr('data-id'))) {
    d3.select(selectNode).classed('begin', true)
  }
  // 如果是第二组的节点
  if (beginWithTwoRegex.test(d3.select(selectNode).attr('data-id'))) {
    d3.select(selectNode).classed('scene', true)
  }
  // 如果是第三组的节点
  if (beginWithThreeRegex.test(d3.select(selectNode).attr('data-id'))) {
    d3.select(selectNode).classed('diagnostic-type', true)
  }
  //添加样式 (形状)
  var nodeStyle = addNodeByType[type](g)

  // rect.node() 当前的rect元素
  var bound = nodeStyle.node().getBoundingClientRect()

  //兼容缩放 bound.width为css中设置的rect的宽度
  var width = bound.width / scale
  var height = bound.height / scale

  // text
  g.append('foreignObject').attr('width', width).attr('height', height).append('xhtml:div').text(node.text)

  // input circle
  var inputs = node.inputs || 0
  g.attr('inputs', inputs)
  for (var i = 0; i < inputs; i++) {
    g.append('circle')
      .attr('class', 'input')
      .attr('input', i + 1)
      .attr('cx', (width * (i + 1)) / (inputs + 1))
      .attr('cy', 0)
      .attr('r', radius)
  }

  // output circle
  var outputs = node.outputs || 0
  g.attr('outputs', outputs)
  for (i = 0; i < outputs; i++) {
    g.append('circle')
      .attr('output', i + 1)
      .attr('class', 'output')
      .attr('cx', (width * (i + 1)) / (outputs + 1))
      .attr('cy', height)
      .attr('r', radius)
  }

  //节点移动
  g.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))

  //输出环
  g.selectAll('circle.output').call(d3.drag().on('start', linestarted).on('drag', linedragged).on('end', lineended))

  $(`[id='${node.id}']`).on('mouseenter', function (e) {
    if (drawLine) {
      if (this.id === activeLine.attr('from')) {
        return
      }
      d3.selectAll('circle.end').classed('end', false)
      // 获取class为input的circle子元素
      d3.select(this).select('circle.input').classed('end', true)
    }
  })

  let nodeData = JSON.parse(JSON.stringify(nodesData.find((item) => item.id === +nodeId)))
  nodeData.id = node.id
  nodesData.push(nodeData)

  showInfo()
}

// 复制path
function copyPath(path) {
  // 当前选中的circle
  var anchor = d3.select(`g.node[id="${oldNodeMap[path[0]]}"] .output`)
  // 当前选中的节点
  var node = d3.select(`g.node[id="${oldNodeMap[path[0]]}"]`)

  var rect = node.node().getBoundingClientRect()
  var dx = rect.width / (+anchor.attr('output') + 1)
  var dy = rect.height

  //高度包括2个连接点的高度
  dy = dy - 2 * radius + radius

  //兼容缩放
  dx = dx / scale
  dy = dy / scale

  var specialLine = ''
  var specialMarker = 'url(#arrow)'
  if (beginWithOneRegex.test(node.attr('data-id'))) {
    specialMarker = specialLine = 'begin'
  }
  if (beginWithTwoRegex.test(node.attr('data-id'))) {
    specialMarker = specialLine = 'scene'
  }
  if (beginWithThreeRegex.test(node.attr('data-id'))) {
    specialMarker = specialLine = 'diagnostic-type'
  }
  activeLine = d3
    .select('g[name=rootG]')
    .append('path')
    .attr('class', `cable ${specialLine}`)
    .attr('from', node.attr('id'))
    .attr('start', dx + ', ' + dy)
    .attr('output', anchor.attr('output'))
    .attr('marker-mid', specialMarker)
    .attr('marker-end', specialMarker)
    .attr('d', add20ToNumbers(d3.select(`path[from="${path[0]}"][to="${path[1]}"]`).attr('d')))
    .attr('to', oldNodeMap[path[1]])
    .attr('input', anchor.attr('input'))
    .attr('end', dx + ', 0')

  lineMouseEvent(activeLine)

  activeLine = null

  return [oldNodeMap[path[0]], oldNodeMap[path[1]]]
}

// 复制文字
function copyText(text) {
  const oldText = d3.select(`text[from="${text[0]}"][to="${text[1]}"]`)
  svgRoot
    .append('text')
    .attr('x', +oldText.attr('x') + 20)
    .attr('y', +oldText.attr('y') + 20)
    .text(oldText.text())
    .attr('from', oldNodeMap[text[0]])
    .attr('to', oldNodeMap[text[1]])
    .attr('class', 'judge')

  d3.select(`path[from="${oldNodeMap[text[0]]}"][to="${oldNodeMap[text[1]]}"]`).attr('data-text', oldText.text())

  return [oldNodeMap[text[0]], oldNodeMap[text[1]]]
}

// 删除选中连线
function delPath() {
  // 删除选择连线上的文字
  var selectedPath = d3.select(selectPath)
  var pathFrom = selectedPath.attr('from')
  var pathTo = selectedPath.attr('to')
  var pathText = svgRoot.select(`text[from="${pathFrom}"][to="${pathTo}"]`)
  if (!pathText.empty()) {
    pathText.remove()
  }
  // 删除选中连线
  selectPath.remove()
  selectPath = null
}

// 删除选中节点
function delNode() {
  var id = d3.select(selectNode).attr('id')
  // 删除从该node开始的路径上面的文本
  d3.selectAll(`text[from="${id}"]`).remove()
  // 删除到该node结束的路径上面的文本
  d3.selectAll(`text[to="${id}"]`).remove()

  selectNode.remove()

  //删除输出线的位置
  d3.selectAll('path[from="' + $(selectNode).attr('id') + '"]').remove()
  //删除输入线的位置
  d3.selectAll('path[to="' + $(selectNode).attr('id') + '"]').remove()

  // 删除指定id的数据
  nodesData = nodesData.filter((item) => item.id != $(selectNode).attr('id'))

  selectNode = null

  // 隐藏节点属性菜单
  controlAttrubuteMenu('hide')
}

// 删除框选中节点
function delSelectedNode() {
  for (const item of nodeSelected) {
    d3.selectAll(`text[from="${item}"]`).remove()
    d3.selectAll(`text[to="${item}"]`).remove()
    d3.selectAll(`path[from="${item}"]`).remove()
    d3.selectAll(`path[to="${item}"]`).remove()
    d3.select(`g.node[id="${item}"]`).remove()
  }

  nodesData = nodesData.filter((item) => {
    return !nodeSelected.includes(String(item.id))
  })

  // 如果删除的节点中有被选中的节点，隐藏节点属性菜单
  if (nodeSelected.includes($(selectNode).attr('id'))) {
    selectNode = null
    controlAttrubuteMenu('hide')
  }

  pathSelected = []
  nodeSelected = []
  textSelected = []
}

// 显示选中节点信息
function showInfo() {
  // 清空table除表头外的内容
  table
    .selectAll('tr')
    .filter((d, i) => i !== 0)
    .remove()

  // 获取选中节点的数据,如果保存的数据需要全部属性显示，就进行深拷贝，或者直接赋值
  selectNodeData = JSON.parse(JSON.stringify(nodesData.find((item) => item.id == selectNode.id)))
  // 去掉用户不可查看的属性
  if (!seeAll) {
    userNoSee.forEach((item) => {
      delete selectNodeData[item]
    })
  }

  var keys = Object.keys(selectNodeData)

  // 让id始终在第一行
  itemSort('id', keys, 0)
  // 让name始终在第二行
  itemSort('name', keys, 1)

  var rows = table.selectAll('tr:not(:first-child)').data(keys).enter().append('tr')

  rows
    .append('td')
    .text(function (key) {
      return chineseMap[key]
    })
    .attr('title', function (key) {
      return chineseMap[key]
    })
  rows.each(function (key) {
    if (key === 'id') {
      d3.select(this).append('td').attr('id', selectNodeData[key]).text(selectNodeData[key])
    } else {
      // 添加属性值的input和input事件
      d3.select(this)
        .append('td')
        .append('textarea')
        .property('value', selectNodeData[key])
        .on('input', function (key) {
          nodesData.find((item) => item.id == selectNode.id)[key] = selectNodeData[key] =
            key === 'apiInfoList' ? this.value.split(',').map((item) => +item) : this.value
          key === 'name' && d3.select(selectNode).attr('data-text', this.value).select('div').text(this.value)
        })
        .attr('disabled', true)
      // 光标自动聚焦在末尾
      // if (key === 'name') {
      //   var length = selectNodeData[key].length
      //   var input = d3.select(this).select('textarea').node()
      //   input.focus()
      //   input.setSelectionRange(length, length)
      // }
      // 取消添加删除功能，需要时解开注释即可
      // 添加删除
      // d3.select(this)
      //   .append('td')
      //   .append('i')
      //   .attr('class', 'fa fa-trash-can')
      //   .on('click', function (d) {
      //     delete selectNodeData[d]
      //     d3.select(this.parentNode.parentNode).remove()
      //     d === 'name' && d3.select(selectNode).attr('data-text', '').select('text').text('')
      //   })
    }
  })

  // 显示节点属性菜单
  controlAttrubuteMenu('show')
}

// 开始创建路径
function linestarted() {
  drawLine = false
  // 当前选中的circle
  var anchor = d3.select(this)
  // 当前选中的节点
  var node = d3.select(this.parentNode)
  var rect = node.node().getBoundingClientRect()
  var dx = rect.width / (+anchor.attr('output') + 1)
  var dy = rect.height

  //高度包括2个连接点的高度
  dy = dy - 2 * radius + radius

  //兼容缩放
  dx = dx / scale
  dy = dy / scale

  var transform = node.attr('transform')
  translate = getTranslate(transform)
  points.push([dx + translate[0], dy + translate[1]])

  var specialLine = ''
  var specialMarker = 'url(#arrow)'
  if (beginWithOneRegex.test(d3.select(this.parentNode).attr('data-id'))) {
    specialMarker = specialLine = 'begin'
  }
  if (beginWithTwoRegex.test(d3.select(this.parentNode).attr('data-id'))) {
    specialMarker = specialLine = 'scene'
  }
  if (beginWithThreeRegex.test(d3.select(this.parentNode).attr('data-id'))) {
    specialMarker = specialLine = 'diagnostic-type'
  }
  activeLine = d3
    .select('g[name=rootG]')
    .append('path')
    .attr('class', `cable ${specialLine}`)
    .attr('from', node.attr('id'))
    .attr('start', dx + ', ' + dy)
    .attr('output', d3.select(this).attr('output'))
    .attr('marker-mid', specialMarker)
    .attr('marker-end', specialMarker)
}

// 路径位置更新
function linedragged() {
  drawLine = true
  points[1] = [d3.event.x + translate[0], d3.event.y + translate[1]]
  activeLine.attr('d', function () {
    return (
      'M' +
      points[0][0] +
      ',' +
      points[0][1] +
      'C' +
      points[0][0] +
      ',' +
      (points[0][1] + points[1][1]) / 2 +
      ' ' +
      points[1][0] +
      ',' +
      (points[0][1] + points[1][1]) / 2 +
      ' ' +
      points[1][0] +
      ',' +
      points[1][1]
    )
  })

  var anchor = d3.selectAll('circle.end')
  if (!anchor.empty()) {
    var pNode = d3.select(anchor.node().parentNode)
    // 获取anchor父元素的x和y
    var [x, y] = getTranslate(pNode.attr('transform'))
    // 如果线的结束点不在节点内部，清空待连接点
    if (
      points[1][0] < x ||
      points[1][0] > x + pNode.node().getBoundingClientRect().width ||
      points[1][1] < y ||
      points[1][1] > y + pNode.node().getBoundingClientRect().height
    ) {
      d3.selectAll('circle.end').classed('end', false)
    }
  }
}

// 路径创建结束
function lineended() {
  drawLine = false
  var anchor = d3.selectAll('circle.end')
  if (anchor.empty()) {
    activeLine.remove()
  } else {
    var pNode = d3.select(anchor.node().parentNode)
    var input = pNode.node().getBoundingClientRect().width / (+anchor.attr('input') + 1)
    var toNodeId = pNode.attr('id')
    var fromNodeId = activeLine.attr('from')

    //兼容缩放
    input = input / scale

    anchor.classed('end', false)
    activeLine.attr('to', toNodeId)
    activeLine.attr('input', anchor.attr('input'))
    activeLine.attr('end', input + ', 0')
    // 设置鼠标事件
    lineMouseEvent(activeLine)

    // 取消节点未连线的红色提示
    var toNode = d3.select(`[id="${toNodeId}"]`)
    d3.select(`[id="${fromNodeId}"]`).classed('alone', false)
    toNode.classed('alone', false)

    updateCable(toNode)
  }
  activeLine = null
  points.length = 0
  translate = null
}

// 线增加鼠标事件
function lineMouseEvent(activeLine) {
  activeLine.on('mouseover', function () {
    d3.select(this).classed('cablefocus', true)
  })
  activeLine.on('mouseleave', function () {
    d3.select(this).classed('cablefocus', false)
  })
}

// 拖拽开始
function dragstarted() {
  // 隐藏菜单
  controlMenu()
  // 如果拖动的是非选中node
  if (!d3.select(this).classed('selected')) {
    // this指向当前拖拽的 g 元素
    var transform = d3.select(this).attr('transform')
    var translate = getTranslate(transform)
    dx = d3.event.x - translate[0]
    dy = d3.event.y - translate[1]
    dragElem = d3.select(this)
  } else {
    d3.selectAll('g.selected').each(function () {
      var transform = d3.select(this).attr('transform')
      var translate = getTranslate(transform)
      const id = d3.select(this).attr('id')
      nodeBeforeDragPosition[id] = {
        dx: d3.event.x - translate[0],
        dy: d3.event.y - translate[1]
      }
    })
  }
}

// 拖拽中更新路径和是否文字
function dragged() {
  if (!d3.select(this).classed('selected')) {
    dragElem.attr('transform', 'translate(' + (d3.event.x - dx) + ', ' + (d3.event.y - dy) + ')')
    updateCable(dragElem)
    updatePathText(dragElem)
  } else {
    for (const key in nodeBeforeDragPosition) {
      d3.select(`g[id="${key}"]`).attr(
        'transform',
        'translate(' +
          (d3.event.x - nodeBeforeDragPosition[key]['dx']) +
          ', ' +
          (d3.event.y - nodeBeforeDragPosition[key]['dy']) +
          ')'
      )
    }
    d3.selectAll('g.selected').each(function () {
      updateCable(d3.select(this))
      updatePathText(d3.select(this))
    })
  }
}

// 更新路径
function updateCable(elem) {
  var id = elem.attr('id')
  var transform = elem.attr('transform')
  var t1 = getTranslate(transform)

  // 更新输出线的位置
  d3.selectAll('path[from="' + id + '"]').each(function () {
    var start = d3.select(this).attr('start').split(',')
    start[0] = +start[0] + t1[0]
    start[1] = +start[1] + t1[1]

    var path = d3.select(this).attr('d')
    var end = path.substring(path.lastIndexOf(' ') + 1).split(',')

    end[0] = +end[0]
    end[1] = +end[1]

    d3.select(this).attr('d', function () {
      return (
        'M' +
        start[0] +
        ',' +
        start[1] +
        ' C' +
        // 防止path垂直时渐变失效
        (start[0] + 0.0001) +
        ',' +
        (start[1] + end[1]) / 2 +
        ' ' +
        end[0] +
        ',' +
        (start[1] + end[1]) / 2 +
        ' ' +
        end[0] +
        ',' +
        end[1]
      )
    })
  })

  // 更新输入线的位置
  d3.selectAll('path[to="' + id + '"]').each(function () {
    var path = d3.select(this).attr('d')
    var start = path.substring(1, path.indexOf('C')).split(',')
    start[0] = +start[0]
    start[1] = +start[1]

    var end = d3.select(this).attr('end').split(',')

    end[0] = +end[0] + t1[0]
    end[1] = +end[1] + t1[1]

    d3.select(this).attr('d', function () {
      return (
        'M' +
        start[0] +
        ',' +
        start[1] +
        ' C' +
        // 防止path垂直时渐变失效
        (start[0] + 0.0001) +
        ',' +
        (start[1] + end[1]) / 2 +
        ' ' +
        end[0] +
        ',' +
        (start[1] + end[1]) / 2 +
        ' ' +
        end[0] +
        ',' +
        end[1]
      )
    })
  })
}

// 更新路径上面的文本
function updatePathText(elem) {
  var id = elem.attr('id')
  // 更新从该node开始的路径上面的文本
  d3.selectAll(`text[from="${id}"]`).each(function () {
    var to = d3.select(this).attr('to')
    var pathD = d3.select(`path[from="${id}"][to="${to}"]`).attr('d')
    var [pathTextX, pathTextY] = getPathTextPosition(pathD)

    d3.select(this).attr('x', pathTextX).attr('y', pathTextY)
  })
  // 更新到该node结束的路径上面的文本
  d3.selectAll(`text[to="${id}"]`).each(function () {
    var from = d3.select(this).attr('from')
    var pathD = d3.select(`path[from="${from}"][to="${id}"]`).attr('d')
    var [pathTextX, pathTextY] = getPathTextPosition(pathD)

    d3.select(this).attr('x', pathTextX).attr('y', pathTextY)
  })
}

// 拖拽结束
function dragended() {
  dx = dy = 0
  dragElem = null
  nodeBeforeDragPosition = {}
}

// 输入属性名
function inputAttribute(input) {
  if (input.value != '') {
    d3.select('.add button').attr('disabled', null)
    attributeName = input.value
  } else {
    d3.select('.add button').attr('disabled', true)
  }
}

// 输入属性值
function inputValue(input) {
  attributeValue = input.value
}

// 确认添加属性
function addAttribute() {
  var id = table.select('td[id]').attr('id')
  nodesData.find((item) => item.id == id)[attributeName] = attributeValue
  var newTr = table.append('tr')
  // 添加属性
  newTr.append('td').text(attributeName)
  // 添加值
  newTr
    .append('td')
    .append('input')
    .attr('type', 'text')
    .attr('value', attributeValue)
    .on('input', function () {
      var editAttribute = d3.select(this.parentNode).node().previousElementSibling.innerHTML
      selectNodeData[editAttribute] = this.value
      editAttribute === 'name' && d3.select(selectNode).attr('data-text', this.value).select('text').text(this.value)
    })
    .each(function () {
      var editAttribute = d3.select(this.parentNode).node().previousElementSibling.innerHTML
      editAttribute === 'name' && d3.select(selectNode).attr('data-text', this.value).select('text').text(this.value)
    })
  // 添加删除
  newTr
    .append('td')
    .append('i')
    .attr('class', 'fa fa-trash-can')
    .on('click', function () {
      var editAttribute = d3.select(this.parentNode).node().previousElementSibling.previousElementSibling.innerHTML
      delete selectNodeData[editAttribute]
      d3.select(this.parentNode.parentNode).remove()
      editAttribute === 'name' && d3.select(selectNode).attr('data-text', '').select('text').text('')
    })
  // 清空输入框
  d3.selectAll('.add input').property('value', '')
  attributeName = ''
  attributeValue = ''
  d3.select('.add button').attr('disabled', true)
}

// 生成左侧菜单
function createMenu(menuData, parent) {
  var ul = parent.append('ul').attr('class', 'sidebar-nav')

  Object.entries(menuData).forEach(([key, value], index) => {
    var li = ul.append('li')
    var folderDiv = li.append('div').attr('class', 'folder').html(`<i class="fa-regular fa-folder-open"></i>${key}`)

    // 文件夹展开收起
    folderDiv.on('click', function () {
      $(this).parent().toggleClass('hide')
      if ($(this).parent().hasClass('hide')) {
        // 隐藏子菜单
        $(this).parent().css('grid-template-rows', '0fr 0fr')
        // $(this)的子元素i的class属性值fa-folder-open替换为fa-folder-closed
        $(this).children('i').attr('class', 'fa-solid fa-folder-closed')
      } else {
        $(this).parent().css('grid-template-rows', '0fr 1fr')
        $(this).children('i').attr('class', 'fa-regular fa-folder-open')
      }
    })

    if (Array.isArray(value)) {
      var subUl = li.append('ul')
      value.forEach((item, i) => {
        var nodeId = parent.node().tagName === 'LI' ? `${index + 1}-${i + 1}` : `${index + 1}${i + 1}`
        var subLi = subUl.append('li').attr('data-id', nodeId).attr('class', 'node')
        subLi.html(`<i class="fa-regular fa-circle"></i>${item}`)
      })
    } else if (typeof value === 'object') {
      createMenu(value, li)
    }
  })
}

// 修改样式事件委托
d3.select('.edit-style .box').on('click', function () {
  var target = d3.event.target
  if (target.tagName != 'svg') {
    target = target.parentNode
  }
  var type = target.getAttribute('class')

  updateSelectNode(type)
})

// 修改默认节点样式
function changeDefaultNodeStyle(el) {
  var styleBox = d3.select('.default-node-style .box')

  styleBox.style('display', 'flex')

  styleBox.on('click', function () {
    var target = d3.event.target
    if (target.tagName != 'svg') {
      target = target.parentNode
    }
    nodeType = target.getAttribute('class')
    localStorage.setItem('nodeType', nodeType)
    styleBox.style('display', 'none')
    // 替换svg
    d3.select('.choose-style svg').remove()
    $('.choose-style').append(d3.select(`.edit-style .box svg[class=${nodeType}]`).node().cloneNode(true))
  })
}

// 编辑路径的是否
function editPath(flag) {
  var value = flag ? '是' : '否'
  d3.select(selectPath).attr('data-text', value)
  judgeMenu.css('display', 'none')

  var pathD = d3.select(selectPath).attr('d')
  var [pathTextX, pathTextY] = getPathTextPosition(pathD)

  var pathFrom = d3.select(selectPath).attr('from')
  var pathTo = d3.select(selectPath).attr('to')
  var pathText = svgRoot.select(`text[from="${pathFrom}"][to="${pathTo}"]`)
  if (!pathText.empty()) {
    if (pathText.text() !== value) {
      pathText.text(value)
    }
  } else {
    svgRoot
      .append('text')
      .attr('x', pathTextX)
      .attr('y', pathTextY)
      .text(flag ? '是' : '否')
      .attr('from', pathFrom)
      .attr('to', pathTo)
      .attr('class', 'judge')
  }
}

// 搜索
function search() {
  $('.no-data').css('display', 'none')
  var searchValue = $('.search-input').val().trim()
  var menu = d3.select('#left-wrapper')
  if (searchValue === '') {
    menu.select('.sidebar-nav').remove()
    createMenu(menuData, menu)
    bindDrag()
    return
  }
  var nowMenuData = findValues(menuData['诊断项'], searchValue)
  if (JSON.stringify(nowMenuData) === '{}') {
    $('.no-data').css('display', 'flex')
    return
  }
  menu.select('.sidebar-nav').remove()
  createMenu(nowMenuData, menu)
  bindDrag()
}

// 搜索输入框按下回车
function searchKeyUp(e) {
  e.keyCode === 13 && search()
}

// 清空搜索框
function clearSearchInput() {
  $('.search-input').val('').focus()
}

// 收起和展开左侧菜单
function toggleLeftMenu() {
  var menuWidth = d3.select('.left-wrapper').style('width')
  if (menuWidth !== '0px') {
    d3.select(':root')
      .transition()
      .duration(duration)
      .style('--left-menu-width', `0px`)
      .on('end', function () {
        d3.select('.left-control')
          .classed('tada-control', true)
          .select('.fa-solid')
          .classed('fa-caret-left', false)
          .classed('fa-caret-right', true)
      })
    d3.select('.left-wrapper .header').style('opacity', '0')
  } else {
    d3.select(':root').transition().duration(duration).style('--left-menu-width', `${attributeWidth}px`)
    d3.select('.left-control')
      .classed('tada-control', false)
      .select('.fa-solid')
      .classed('fa-caret-left', true)
      .classed('fa-caret-right', false)
    d3.select('.left-wrapper .header').style('opacity', '1')
  }
}

// 对齐
function align(direction) {
  var selectedGElements = d3.selectAll('.node.selected')

  var axisValues = {
    x: [],
    y: []
  }

  selectedGElements.each(function () {
    var values = getTransformValues(this)
    axisValues.x.push(values.x)
    axisValues.y.push(values.y)
  })

  var minX = d3.min(axisValues.x)
  var maxX = d3.max(axisValues.x)
  var minY = d3.min(axisValues.y)
  var maxY = d3.max(axisValues.y)

  selectedGElements
    .transition()
    .duration(duration)
    .attr('transform', function () {
      var values = getTransformValues(this)
      var newX, newY

      switch (direction) {
        case 'left':
          newX = minX
          newY = values.y
          break
        case 'right':
          newX = maxX
          newY = values.y
          break
        case 'up':
          newX = values.x
          newY = minY
          break
        case 'down':
          newX = values.x
          newY = maxY
          break
        default:
          newX = values.x
          newY = values.y
      }

      return 'translate(' + newX + ', ' + newY + ')'
    })
    .tween('custom', function () {
      return () => {
        updateCable(d3.select(this))
        updatePathText(d3.select(this))
      }
    })
}

// 均匀分布
function uniformDistribute(direction) {
  var selectedElements = d3.selectAll('.node.selected')

  // 选中节点的相关信息
  var selectedElInfo = []

  selectedElements.each(function () {
    var position = getTransformValues(this)
    selectedElInfo.push({
      el: this,
      x: position.x,
      y: position.y
    })
  })

  selectedElInfo.sort(function (a, b) {
    return direction === 'horizontal' ? a.x - b.x : a.y - b.y
  })

  // 每一个平均点的坐标值
  var minCoord = selectedElInfo[0][direction === 'horizontal' ? 'x' : 'y']
  var spacing =
    (selectedElInfo[selectedElInfo.length - 1][direction === 'horizontal' ? 'x' : 'y'] - minCoord) /
    (selectedElInfo.length - 1)

  selectedElements.each(function (d, i) {
    var el = selectedElInfo[i].el
    var currentPosition = getTransformValues(el)

    var newCoord = minCoord + spacing * i

    if (currentPosition[direction === 'horizontal' ? 'x' : 'y'] !== newCoord) {
      d3.select(el)
        .transition()
        .duration(duration)
        .attr(
          'transform',
          'translate(' +
            (direction === 'horizontal' ? newCoord : currentPosition.x) +
            ', ' +
            (direction === 'vertical' ? newCoord : currentPosition.y) +
            ')'
        )
        .tween('custom', function () {
          return () => {
            updateCable(d3.select(el))
            updatePathText(d3.select(el))
          }
        })
    }
  })
}
