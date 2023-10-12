// 左侧距离
var leftmenu = $('#left-wrapper').width(),
  // 顶部距离
  headmenu = 60,
  // 两侧菜单宽度
  attributeWidth = 350,
  // 选中节点
  selectNode = null,
  // 选中连线
  selectPath = null,
  // 当前缩放精度
  scale = 1,
  // 最大缩放精度
  scaleMax = 2,
  // 最小缩放精度
  scaleMin = 0.5,
  // 缩放配置
  zoomSetting = [scaleMin, scaleMax],
  // 当前平移
  transformX = 0,
  transformY = 0,
  // 缩放动画时间
  duration = 600,
  // 半径
  radius = 5,
  // d3对象svg
  // 选择与指定选择器字符串匹配的第一个元素
  svg = d3.select('svg'),
  // d3对象rootG
  // 选择具有"name"属性值为"rootG"的<g>元素
  svgRoot = d3.select('g[name=rootG]'),
  // 节点的属性table
  table = d3.select('.properties'),
  // 获取缩放对象
  zoom = d3
    .zoom()
    .scaleExtent(zoomSetting)
    .on('zoom', () => {
      scale = d3.event.transform.k
      transformX = d3.event.transform.x
      transformY = d3.event.transform.y
      svgRoot.attr('transform', d3.event.transform)
      // 隐藏菜单
      controlMenu()
    }),
  // 所有节点数据
  allNodesData = [],
  // 流程图中所有节点数据
  nodesData = [],
  // 选中的节点数据
  selectNodeData = null,
  // 绘制路径相关
  activeLine = null,
  points = [],
  translate = null,
  drawLine = false,
  // 拖拽相关
  dx = 0,
  dy = 0,
  // 当前拖拽的 g 元素
  dragElem = null,
  // 添加属性相关
  attributeName = '',
  attributeValue = '',
  // 保存时是否允许存在未连线节点
  allowAlone = JSON.parse(localStorage.getItem('allowAlone')) ?? true,
  // 默认节点形状
  nodeType = localStorage.getItem('nodeType') ?? 'round-rect',
  // 添加的节点的形状样式
  addNodeByType = {
    'rect': function (fatherNode) {
      return fatherNode.insert('rect', ':first-child')
    },
    'round-rect': function (fatherNode) {
      return fatherNode.insert('rect', ':first-child').attr('class', 'round-rect')
    },
    'ellipse': function (fatherNode) {
      return fatherNode.insert('ellipse', ':first-child')
    },
    'parallelogram': function (fatherNode) {
      return fatherNode.insert('polygon', ':first-child').attr('points', '10,0 140,0 130,40 0,40')
    },
    'hexagon': function (fatherNode) {
      return fatherNode.insert('polygon', ':first-child').attr('points', '10,0 130,0 140,20 130,40 10,40 0,20')
    },
    'diamond': function (fatherNode) {
      return fatherNode.insert('polygon', ':first-child').attr('points', '70,0 140,20 70,40 0,20')
    }
  },
  // 节点右键菜单
  nodeMenu = $('#nodeMenu'),
  // 路径右键菜单
  pathMenu = $('#pathMenu'),
  // 判断路径右键菜单
  judgeMenu = $('#judgeMenu'),
  // 保存菜单
  saveMenu = $('#saveMenu'),
  // 框选右键菜单
  selectMenu = $('#selectMenu'),
  // 用户不可查看的属性
  userNoSee = ['apiInfoList', 'businessId', 'sideId', 'diagnosticId'],
  // 查看全部属性信息
  seeAll = JSON.parse(getUrlParam('seeAll')) ?? false,
  // 匹配1开头的数字
  beginWithOneRegex = /^1\d*$/,
  beginWithTwoRegex = /^2\d*$/,
  beginWithThreeRegex = /^3\d*$/,
  // 中文映射
  chineseMap = {
    id: '节点ID',
    name: '描述',
    flowProp: '诊断配置',
    diagnosticId: '诊断项ID',
    businessId: '所在业务场景',
    sideId: '所在诊断侧',
    apiInfoList: '调用接口'
  },
  // 左侧菜单
  menuData = {},
  // 系统id
  groupId = '',
  // 流程名称
  totalFlowName = '',
  // 编辑页面带来的流程id
  id = JSON.parse(getUrlParam('id')),
  // 该流程id的data
  editFlowData = null,
  // 系统名称对应的id
  systemIdMap = {},
  // 框选中的node
  nodeSelected = [],
  // 框选中的path
  pathSelected = [],
  // 框选中的text
  textSelected = [],
  // 存放拖动前的node的位置
  nodeBeforeDragPosition = {},
  // 旧的节点和复制的节点的映射关系
  oldNodeMap = {}
