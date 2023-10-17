var app = new Vue({
  el: '#app',
  data() {
    const parseJSONWithValidation = (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      try {
        JSON.parse(value)
        callback()
      } catch (e) {
        callback(new Error('请输入正确的JSON格式'))
      }
    }
    return {
      menuData: {},
      nowMenuData: {},
      searchValue: '',
      loading: false,
      // 所有诊断项数据
      diagnosticData: [],
      // 当前激活诊断项
      activeDiagnosis: '',
      // 当前激活选项的信息
      activeInfo: '',
      // 选中诊断项的配置信息
      activeDiagnosisForm: {
        id: '',
        name: '',
        apiInfoList: '',
        root: '',
        assertExpression: '',
        assertResult: '',
        mapping: '',
        tableHeaderOrder: '',
        translate: '',
        multiline: 'false',
        fieldClass: ''
      },
      formItemLayout: [
        {
          label: '诊断项名称',
          prop: 'name',
          showAlert: false
        },
        {
          label: '诊断项访问的接口ID',
          prop: 'apiInfoList',
          showAlert: false
        },
        {
          label: '数据位置',
          prop: 'root',
          title: '例如：{"1":"data","2":"data.flowInfo"}',
          description: '对象的key为接口ID，value为数据根节点位置，可输入多组',
          showAlert: true
        },
        {
          label: '断言表达式',
          prop: 'assertExpression',
          title: '例如：[age]>18',
          description: "作为判断的字段外层用[]包裹，例如：[4G数据功能]==='开通'",
          showAlert: true
        },
        {
          label: '断言结果',
          prop: 'assertResult',
          title: '例如：成年|未成年',
          description:
            '符号 | 前的为断言表达式成立时的断言结果且需要保证状态为正常，符号 | 后的为断言表达式不成立时的断言结果且需要保证状态为异常',
          showAlert: true
        },
        {
          label: '数据中文映射',
          prop: 'mapping',
          title: '例如：{"name":"姓名","age":"年龄"}',
          description:
            '对象的key为需要映射的内容，对象的value为映射后的内容，可输入多组。如果需要映射的字段的字段名相同，则在字段名后加下划线和作为数据分类字段的值用于区分，例如：{"udmDnn_ctnet":"数据网名称（ctnet）","udmDnn_ctwap":"数据网名称（ctwap）"}',
          showAlert: true
        },
        {
          label: '表格列表顺序',
          prop: 'tableHeaderOrder',
          title: '例如：["name","age"]',
          description:
            '按顺序输入。如果需要映射的字段的字段名相同，则在字段名后加下划线和作为数据分类字段的值用于区分，例如：["udmDnn_ctnet","udmDnn_ctwap"]',
          showAlert: true
        },
        {
          label: '翻译列表',
          prop: 'translate',
          title: '例如：{"isShow":{"0":"否","1":"是"}}',
          description:
            '外层对象的key为需要翻译的字段，外层对象的value是一个对象，内层对象的key为需要翻译的内容，对象的value为翻译后的内容。如果需要映射的字段的字段名相同，则在字段名后加下划线和作为数据分类字段的值用于区分，例如：{"udmIsDefaultDnn_ctnet":{"true":"是","false":"否"},"udmIsDefaultDnn_ctwap":{"true":"是","false":"否"}}',
          showAlert: true
        },
        {
          label: '是否多行显示',
          prop: 'multiline',
          title: '查询到的数据是否多行显示',
          description: '如果查询到的数据是多行显示，请选择是，否则选择否',
          showAlert: true,
          type: 'radio'
        },
        {
          label: '字段分类',
          prop: 'fieldClass',
          title: '例如：udmDnnDataList|udmDnn',
          description:
            '当存在相同字段名时，需要对数据进行分类时使用。符号 | 前的为需要分类的数据所在的位置，符号 | 后的为数据分类字段的字段名，该字段名对应的值为具体类别',
          showAlert: true
        }
      ],
      noMenuData: false,
      rules: {
        root: [{ validator: parseJSONWithValidation, trigger: 'submit' }],
        mapping: [{ validator: parseJSONWithValidation, trigger: 'submit' }],
        tableHeaderOrder: [{ validator: parseJSONWithValidation, trigger: 'submit' }],
        translate: [{ validator: parseJSONWithValidation, trigger: 'submit' }]
      },
      defaultOpeneds: []
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    selectMenu(index) {
      this.activeInfo = index
    },
    // 提交对API的修改
    async submitEdit() {
      this.$refs.activeDiagnosisForm.validate(async (valid) => {
        if (valid) {
          const {
            id,
            name,
            root,
            assertExpression,
            assertResult,
            mapping,
            tableHeaderOrder,
            translate,
            multiline,
            fieldClass
          } = this.activeDiagnosisForm

          const params = {
            id,
            flowProp: JSON.stringify(
              {
                id,
                name,
                root: root && JSON.parse(root),
                assertExpression,
                assertResult,
                mapping: mapping && JSON.parse(mapping),
                tableHeaderOrder: tableHeaderOrder && JSON.parse(tableHeaderOrder),
                translate: translate && JSON.parse(translate),
                multiline: multiline && JSON.parse(multiline),
                fieldClass
              },
              null,
              2
            )
          }

          const res = await editFlowAPI(params)
          if (res.code === '200') {
            this.$message.success('修改成功')
            // 修改成功后更新所有诊断项数据
            const index = this.diagnosticData.findIndex((item) => item.id === id)
            this.diagnosticData[index].flowProp = params.flowProp
          } else {
            this.$message.error('修改失败')
          }
        } else {
          this.$message.error('修改失败')
          return false
        }
      })
    },
    async init() {
      this.loading = true

      // 获取菜单
      const res = await getMenuListAPI()
      // 没有后端时用这个
      // const res = {
      //   data: menuData
      // }

      const { diagnosticItem } = res.data

      let listData = {}
      for (const item of diagnosticItem.flowListVoList) {
        const itemData = {}
        for (const flowSide of item.flowSideVoList) {
          const flowSideData = flowSide.flowApiVoList.map((flowApi) => {
            this.diagnosticData.push(flowApi)
            return flowApi.flowName
          })
          itemData[flowSide.sideName] = flowSideData
        }
        listData[item.nodeDescription] = itemData
      }

      // 数组去重
      const uniqueObjects = {}
      const uniqueArray = []

      this.diagnosticData.forEach((obj) => {
        if (!uniqueObjects[obj.id]) {
          uniqueObjects[obj.id] = true
          uniqueArray.push(obj)
        }
      })
      this.diagnosticData = uniqueArray

      this.nowMenuData = listData
      this.menuData = Object.freeze(listData)
      this.defaultOpeneds = Object.keys(listData).flatMap((item) => [item, item + '用户侧诊断', item + '网络侧诊断'])

      this.loading = false

      // 设置默认激活项
      const firstKey = Object.keys(this.menuData)[0]
      const secondKey = Object.keys(this.menuData[firstKey])[0]
      const thirdKey = this.menuData[firstKey][secondKey][0]
      this.activeInfo = `${firstKey}--${secondKey}--${thirdKey}`

      // 筛选诊断项信息
      console.log(this.diagnosticData.filter((item) => item.apiInfoList.find((id) => id === 2)))
    },
    toggleAlert(prop) {
      const index = this.formItemLayout.findIndex((item) => item.prop === prop)
      this.formItemLayout[index].showAlert = !this.formItemLayout[index].showAlert
    },
    search() {
      this.nowMenuData = this.searchValue === '' ? this.menuData : this.findValues(this.menuData, this.searchValue)
      this.noMenuData = Object.keys(this.nowMenuData).length === 0 ? true : false
    },
    findValues(obj, searchValue) {
      const results = {}

      function searchForObject(currentObj, category = '') {
        if (typeof currentObj === 'object' && currentObj !== null) {
          for (const key in currentObj) {
            const newPath = category ? `${category}.${key}` : key
            searchForObject(currentObj[key], newPath)
          }
        } else if (
          typeof currentObj === 'string' &&
          currentObj.toUpperCase().includes(searchValue.toUpperCase().trim())
        ) {
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
  },
  watch: {
    activeInfo(newV) {
      const diagnosticName = newV.split('--')[2]
      const diagnostic = JSON.parse(
        JSON.stringify(this.diagnosticData.find((item) => item.flowName === diagnosticName))
      )

      if (diagnostic.flowProp) {
        const flowProp = JSON.parse(diagnostic.flowProp)
        this.activeDiagnosisForm = {
          id: diagnostic.id,
          name: diagnosticName,
          apiInfoList: diagnostic.apiInfoList,
          root: flowProp.root && JSON.stringify(flowProp.root),
          assertExpression: flowProp.assertExpression,
          assertResult: flowProp.assertResult,
          mapping: flowProp.mapping && JSON.stringify(flowProp.mapping),
          tableHeaderOrder: flowProp.tableHeaderOrder && JSON.stringify(flowProp.tableHeaderOrder),
          translate: flowProp.translate && JSON.stringify(flowProp.translate),
          multiline: !flowProp.multiline ? 'false' : JSON.stringify(flowProp.multiline),
          fieldClass: flowProp.fieldClass
        }
      } else {
        this.activeDiagnosisForm = {
          id: diagnostic.id,
          name: diagnosticName,
          apiInfoList: diagnostic.apiInfoList,
          root: '',
          assertExpression: '',
          assertResult: '',
          mapping: '',
          tableHeaderOrder: '',
          translate: '',
          multiline: 'false',
          fieldClass: ''
        }
      }
      this.$refs.activeDiagnosisForm.clearValidate()

      // 滚动到顶部
      const scrollMain = document.querySelector('.scroll-main')
      scrollMain.scrollTop !== 0 &&
        scrollMain.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
    }
  }
})
