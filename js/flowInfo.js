var app = new Vue({
  el: '#app',
  data() {
    return {
      tableData: [],
      // 本地的ip地址
      host: ['127.0.0.1', '192.168.4.85'],
      // 选中的行的信息
      multipleSelection: [],
      // 是否有诊断项数据
      hasNodesData: false,
      // 所有诊断项数据
      nodesData: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const res = await getAllFlowInfoAPI()
      this.tableData = res.data
    },
    async delFlow(id) {
      const res = await delFlowInfoAPI(id)

      if (res.code === '200') {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      } else {
        this.$message({
          type: 'error',
          message: '删除失败!'
        })
      }

      this.init()
    },
    goPage(tabid, url, name, method) {
      var app

      try {
        app = window.top.app
      } catch (e) {}

      if (app && typeof window.top.app.addTab === 'function') {
        app.addTab(tabid, name, url)
      } else if (this.isSupportOpenSQE()) {
        //钻取SQE
        var fn = null
        try {
          fn = window.top.appendIframeDiv
        } catch (e) {}
        //参数在地址里面
        if (fn) {
          //不存在跨域问题时
          fn(tabid, url.replace('{origin}', 'origin=' + location.origin), name, method)
        } else {
          window.top.postMessage(
            JSON.stringify({
              method: 'appendIframeDiv',
              params: [tabid, url.replace('{origin}', 'origin=' + location.origin), name]
            }),
            '*'
          )
        }
      } else {
        url = url.replace(/\{[^\}]*\}/g, '')
        window.open(url, '_blank')
      }
    },
    isSupportOpenSQE() {
      var hash = location.hash,
        search = location.search,
        hasCreateMeasureDrillDiv = false,
        isSub = false
      if (!search && hash.indexOf('?') != -1) search = hash.substring(hash.indexOf('?'))
      try {
        hasCreateMeasureDrillDiv = !!window.top.CreateMeasureDrillDiv
      } catch (e) {}
      try {
        isSub = window.top != window
      } catch (e) {}
      //子页面，且需要钻取SQE
      return (/(\?|\&)support=sqe(|\&)/.test(search) || hasCreateMeasureDrillDiv) && isSub
    },
    editFlow(id) {
      url = this.host.includes(window.location.hostname) ? `/index.html?id=${id}` : `/flowchart/index.html?id=${id}`
      this.goPage('md_' + new Date().getTime(), url, '编辑流程')
    },
    addFlow() {
      url = this.host.includes(window.location.hostname) ? `/index.html` : `/flowchart/index.html`
      this.goPage('md_' + new Date().getTime(), url, '添加流程')
    },
    // 选择复选框时触发
    selectionChange(val) {
      this.multipleSelection = val
    },
    async getNodesData() {
      // 第一次刷新流程的时候才获取所有诊断项数据
      if (!this.hasNodesData) {
        const res = await getMenuListAPI()
        const { diagnosticItem } = res.data
        let allNodesData = []
        for (const item of diagnosticItem.flowListVoList) {
          for (const flowSide of item.flowSideVoList) {
            for (const flowApi of flowSide.flowApiVoList) {
              if (flowApi.isShow === 0) continue
              allNodesData.push(flowApi)
            }
          }
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
        this.nodesData = Object.freeze(uniqueArray)

        this.hasNodesData = true
      }
    },
    // 刷新单个流程
    async refreshOneFlow(flowId) {
      const res = await getFlowDataAPI(flowId)
      const { groupId, totalFlowName, id, dataJson } = res.data
      // 用于对比是否改变
      const originFlowData = JSON.parse(dataJson)
      const flowData = JSON.parse(dataJson)
      const nodesDataMap = new Map(this.nodesData.map((obj) => [obj.id, obj]))

      flowData[2].forEach((obj) => {
        if (obj.diagnosticId) {
          const arr1Obj = nodesDataMap.get(obj.diagnosticId)
          const { flowName: name, businessId, sideId, apiInfoList } = arr1Obj
          Object.assign(obj, { name, businessId, sideId, apiInfoList })
          flowData[1].forEach((obj1) => {
            const edit = +obj1.id === obj.id && obj1.dataText !== obj.name
            edit && (obj1.dataText = obj.name)
          })
        }
      })

      const flowInfo = {
        dataJson: JSON.stringify(flowData, null, 2),
        groupId,
        totalFlowName,
        id
      }
      // 如果数据发生了改变
      if (JSON.stringify(originFlowData) !== JSON.stringify(flowData)) {
        postFlowDataAPI(flowInfo)
      }
    },
    // 刷新流程
    async refreshFlow(flowId) {
      // 刷新中提示
      const start = this.$notify.info({
        title: '提示',
        message: '正在刷新流程,请稍等...',
        duration: 0
      })
      const startTime = new Date().getTime()

      await this.getNodesData()

      // 单个流程刷新
      if (typeof flowId === 'number') {
        await this.refreshOneFlow(flowId)
      }
      // 批量刷新
      else {
        await Promise.all(this.multipleSelection.map((obj) => this.refreshOneFlow(obj.id)))
      }

      // 保证刷新中提示框至少显示500ms
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < 500) {
        const remainingTime = 500 - elapsedTime
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }

      // 关闭刷新中提示
      start.close()
      // 显示成功提示
      this.$notify({
        title: '成功',
        message: '刷新流程成功!',
        type: 'success'
      })
    }
  }
})
