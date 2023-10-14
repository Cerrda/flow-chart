var app = new Vue({
  el: '#app',
  data() {
    return {
      tableData: [],
      // 本地的ip地址
      host: ['127.0.0.1', '192.168.4.85']
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
    }
  }
})
