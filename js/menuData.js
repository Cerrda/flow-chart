const menuDatas = {
  systemItem: {
    sideItemName: '系统场景层',
    sideItemList: [
      {
        id: 7,
        nodeType: 3,
        nodeName: '10000坐席系统',
        nodeDescription: '10000坐席系统',
        isShow: 1
      },
      {
        id: 8,
        nodeType: 3,
        nodeName: 'IVR系统',
        nodeDescription: 'IVR系统',
        isShow: 1
      },
      {
        id: 15,
        nodeType: 3,
        nodeName: '线上报障系统',
        nodeDescription: '线上报障系统',
        isShow: 1
      },
      {
        id: 16,
        nodeType: 3,
        nodeName: '无线中心系统',
        nodeDescription: '无线中心系统',
        isShow: 1
      }
    ]
  },
  businessItem: {
    sideItemName: '业务场景层',
    sideItemList: [
      {
        id: 1,
        nodeType: 1,
        nodeName: '上网功能诊断',
        nodeDescription: '上网功能诊断',
        isShow: 1
      },
      {
        id: 2,
        nodeType: 1,
        nodeName: '语音功能诊断',
        nodeDescription: '语音功能诊断',
        isShow: 1
      },
      {
        id: 3,
        nodeType: 1,
        nodeName: '短信功能诊断',
        nodeDescription: '短信功能诊断',
        isShow: 1
      },
      {
        id: 4,
        nodeType: 1,
        nodeName: '上网功能漫游诊断',
        nodeDescription: '上网功能漫游诊断',
        isShow: 1
      },
      {
        id: 9,
        nodeType: 1,
        nodeName: '用户画像',
        nodeDescription: '用户画像',
        isShow: 1
      },
      {
        id: 11,
        nodeType: 1,
        nodeName: '语音功能漫游诊断',
        nodeDescription: '语音功能漫游诊断',
        isShow: 1
      },
      {
        id: 12,
        nodeType: 1,
        nodeName: '短信功能漫游诊断',
        nodeDescription: '短信功能漫游诊断',
        isShow: 1
      },
      {
        id: 13,
        nodeType: 1,
        nodeName: '诊断工具',
        nodeDescription: '诊断工具',
        isShow: 1
      },
      {
        id: 14,
        nodeType: 1,
        nodeName: '诊断结论',
        nodeDescription: '诊断结论',
        isShow: 1
      }
    ]
  },
  diagnosticSideItem: {
    sideItemName: '诊断侧层',
    sideItemList: [
      {
        id: 5,
        nodeType: 2,
        nodeName: '网络侧诊断',
        nodeDescription: '网络侧诊断',
        isShow: 1
      },
      {
        id: 6,
        nodeType: 2,
        nodeName: '用户侧诊断',
        nodeDescription: '用户侧诊断',
        isShow: 1
      }
    ]
  },
  diagnosticItem: {
    diagnosticItemName: '诊断项',
    flowListVoList: [
      {
        nodeId: 1,
        nodeName: '上网功能诊断',
        nodeDescription: '上网功能诊断',
        flowSideVoList: [
          {
            sideName: '网络侧诊断',
            flowApiVoList: [
              {
                id: 2,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: 'CRM5G功能开通查询',
                flowDescription: 'CRM5G功能开通查询',
                flowProp:
                  '{\n  "id": 2,\n  "name": "CRM5G功能开通查询",\n  "root": "",\n  "assertExpression": "",\n  "assertResult": "",\n  "mapping": "",\n  "tableHeaderOrder": "",\n  "translate": "",\n  "multiline": false\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 11,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: '判断用户是否使用5G终端',
                flowDescription: '判断用户是否使用5G终端',
                flowProp:
                  '{\n  "id": 11,\n  "name": "判断用户是否使用5G终端",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>25",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "张三"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 18,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否有5G覆盖',
                flowDescription: '是否有6G覆盖',
                flowProp:
                  '{\n  "id": 18,\n  "name": "是否有5G覆盖",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>19",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "name",\n    "age"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 20,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否突发故障',
                flowDescription: '是否突发故障',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 21,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否重大活动',
                flowDescription: '是否重大活动',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 22,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否割接升级',
                flowDescription: '是否割接升级',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 23,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否核心网故障（影响全移动业务使用）',
                flowDescription: '是否核心网故障（影响全移动业务使用）',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 24,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否基站告警',
                flowDescription: '是否基站告警',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 25,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否忙小区',
                flowDescription: '是否忙小区',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 26,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否弱信号覆盖',
                flowDescription: '是否弱信号覆盖',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 27,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否基站容量不足',
                flowDescription: '是否基站容量不足',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 28,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否基站干扰',
                flowDescription: '是否基站干扰',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 29,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否高频污染',
                flowDescription: '是否高频污染',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              }
            ]
          },
          {
            sideName: '用户侧诊断',
            flowApiVoList: [
              {
                id: 1,
                businessId: '1,2,3',
                sideId: '6',
                flowName: 'CRM状态查询',
                flowDescription: 'CRM状态查询',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 2,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: 'CRM5G功能开通查询',
                flowDescription: 'CRM5G功能开通查询',
                flowProp:
                  '{\n  "id": 2,\n  "name": "CRM5G功能开通查询",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>24",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "name"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 3,
                businessId: '1',
                sideId: '6',
                flowName: 'CRM判断是否有4G上网功能',
                flowDescription: 'CRM判断是否有4G上网功能',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 4,
                businessId: '1',
                sideId: '6',
                flowName: 'CRM判断用户是否达量降速',
                flowDescription: 'CRM判断用户是否达量降速',
                flowProp: null,
                isShow: 1,
                apiInfoList: [6]
              },
              {
                id: 5,
                businessId: '1',
                sideId: '6',
                flowName: 'CRM判断用户是否达量断网',
                flowDescription: 'CRM判断用户是否达量断网',
                flowProp: null,
                isShow: 1,
                apiInfoList: [7]
              },
              {
                id: 6,
                businessId: '1',
                sideId: '6',
                flowName: 'CRM判断用户是否禁用互联网',
                flowDescription: 'CRM判断用户是否禁用互联网',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 7,
                businessId: '1',
                sideId: '6',
                flowName: 'CRM判断用户是否是4G卡',
                flowDescription: 'CRM判断用户是否是5G卡',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 8,
                businessId: '1',
                sideId: '6',
                flowName: 'UDM判断用户状态是否正常',
                flowDescription: 'UDM判断用户状态是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: [1]
              },
              {
                id: 9,
                businessId: '1',
                sideId: '6',
                flowName: 'EPC判断用户状态是否正常',
                flowDescription: 'EPC判断用户状态是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: [4]
              },
              {
                id: 10,
                businessId: '1',
                sideId: '6',
                flowName: 'AAA判断用户状态是否正常',
                flowDescription: 'AAA判断用户状态是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 11,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: '判断用户是否使用5G终端',
                flowDescription: '判断用户是否使用5G终端',
                flowProp:
                  '{\n  "id": 11,\n  "name": "判断用户是否使用5G终端",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>25",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "张三"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 12,
                businessId: '1',
                sideId: '6',
                flowName: '判断用户是否使用4G终端',
                flowDescription: '判断用户是否使用4G终端',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 13,
                businessId: '1',
                sideId: '6',
                flowName: '近一个月流量使用情况',
                flowDescription: '近一个月流量使用情况',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 14,
                businessId: '1,2,3',
                sideId: '6',
                flowName: '判断用户是否有在途工单',
                flowDescription: '判断用户是否有在途工单',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 15,
                businessId: '1,2,3',
                sideId: '6',
                flowName: '判断用户PF订单业务是否正常',
                flowDescription: '判断用户PF订单业务是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 16,
                businessId: '1,2,3',
                sideId: '6',
                flowName: 'PF订单用户成品卡批开档是否正常',
                flowDescription: 'PF订单用户成品卡批开档是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              }
            ]
          }
        ]
      },
      {
        nodeId: 2,
        nodeName: '语音功能诊断',
        nodeDescription: '语音功能诊断',
        flowSideVoList: [
          {
            sideName: '网络侧诊断',
            flowApiVoList: [
              {
                id: 2,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: 'CRM5G功能开通查询',
                flowDescription: 'CRM5G功能开通查询',
                flowProp:
                  '{\n  "id": 2,\n  "name": "CRM5G功能开通查询",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>24",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "name"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 11,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: '判断用户是否使用5G终端',
                flowDescription: '判断用户是否使用5G终端',
                flowProp:
                  '{\n  "id": 11,\n  "name": "判断用户是否使用5G终端",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>25",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "张三"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 18,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否有5G覆盖',
                flowDescription: '是否有6G覆盖',
                flowProp:
                  '{\n  "id": 18,\n  "name": "是否有5G覆盖",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>19",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "name",\n    "age"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 20,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否突发故障',
                flowDescription: '是否突发故障',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 21,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否重大活动',
                flowDescription: '是否重大活动',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 22,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否割接升级',
                flowDescription: '是否割接升级',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 23,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否核心网故障（影响全移动业务使用）',
                flowDescription: '是否核心网故障（影响全移动业务使用）',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 24,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否基站告警',
                flowDescription: '是否基站告警',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 25,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否忙小区',
                flowDescription: '是否忙小区',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 26,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否弱信号覆盖',
                flowDescription: '是否弱信号覆盖',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 27,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否基站容量不足',
                flowDescription: '是否基站容量不足',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 28,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否基站干扰',
                flowDescription: '是否基站干扰',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 29,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否高频污染',
                flowDescription: '是否高频污染',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              }
            ]
          },
          {
            sideName: '用户侧诊断',
            flowApiVoList: [
              {
                id: 1,
                businessId: '1,2,3',
                sideId: '6',
                flowName: 'CRM状态查询',
                flowDescription: 'CRM状态查询',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 2,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: 'CRM5G功能开通查询',
                flowDescription: 'CRM5G功能开通查询',
                flowProp:
                  '{\n  "id": 2,\n  "name": "CRM5G功能开通查询",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>24",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "name"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 11,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: '判断用户是否使用5G终端',
                flowDescription: '判断用户是否使用5G终端',
                flowProp:
                  '{\n  "id": 11,\n  "name": "判断用户是否使用5G终端",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>25",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "张三"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 14,
                businessId: '1,2,3',
                sideId: '6',
                flowName: '判断用户是否有在途工单',
                flowDescription: '判断用户是否有在途工单',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 15,
                businessId: '1,2,3',
                sideId: '6',
                flowName: '判断用户PF订单业务是否正常',
                flowDescription: '判断用户PF订单业务是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 16,
                businessId: '1,2,3',
                sideId: '6',
                flowName: 'PF订单用户成品卡批开档是否正常',
                flowDescription: 'PF订单用户成品卡批开档是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 61,
                businessId: '2',
                sideId: '6',
                flowName: '判断是否加入电信/联通/移动黑名单',
                flowDescription: '判断是否加入电信/联通/移动黑名单',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 64,
                businessId: '2,3',
                sideId: '6',
                flowName: '判断HLRE用户状态是否正常',
                flowDescription: '判断HLRE用户状态是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 69,
                businessId: '2',
                sideId: '6',
                flowName: 'CRM用户业务是否正常',
                flowDescription: 'CRM用户业务是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 70,
                businessId: '2',
                sideId: '6',
                flowName: 'CRM用户是否设置呼叫转移',
                flowDescription: 'CRM用户是否设置呼叫转移',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 71,
                businessId: '2',
                sideId: '6',
                flowName: 'CRM是否天翼无绳用户',
                flowDescription: 'CRM是否天翼无绳用户',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 72,
                businessId: '2',
                sideId: '6',
                flowName: 'CRM用户超频呼叫诊断（涉骚扰暂停呼出功能）',
                flowDescription: 'CRM用户超频呼叫诊断（涉骚扰暂停呼出功能）',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 73,
                businessId: '2',
                sideId: '6',
                flowName: '网元系统用户状态是否正常',
                flowDescription: '网元系统用户状态是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: [2, 4]
              },
              {
                id: 74,
                businessId: '2',
                sideId: '6',
                flowName: '用户携号转网查询',
                flowDescription: '用户携号转网查询',
                flowProp: null,
                isShow: 1,
                apiInfoList: [5]
              },
              {
                id: 75,
                businessId: '2',
                sideId: '6',
                flowName: '网元系统用户呼叫转移功能是否正常',
                flowDescription: '网元系统用户呼叫转移功能是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: [2]
              },
              {
                id: 76,
                businessId: '2',
                sideId: '6',
                flowName: '网元系统用户辅助信息查询',
                flowDescription: '网元系统用户辅助信息查询',
                flowProp:
                  '{\n  "id": 76,\n  "name": "网元系统用户辅助信息查询",\n  "root": {\n    "2": "Envelope.Body.AS"\n  },\n  "assertExpression": "NSOIP==\'1\'",\n  "assertResult": "有业务权限|无业务权限",\n  "mapping": {\n    "NSOIP": "主叫标识显示",\n    "NSGOIR": "主叫标识显示限制",\n    "NSCW": "呼叫等待",\n    "NSDDS": "免打扰业务",\n    "RINGTYPE": "振铃类型",\n    "MASTERIDENTITY": "副卡：关联主卡标识",\n    "MASTERMULTIDEV": "主卡：一号多终端权限",\n    "ESIMRISTRICT": "互拨限制标识"\n  },\n  "tableHeaderOrder": [\n    "NSOIP",\n    "NSGOIR",\n    "NSCW",\n    "NSDDS",\n    "MASTERMULTIDEV",\n    "RINGTYPE",\n    "MASTERIDENTITY",\n    "ESIMRISTRICT"\n  ],\n  "translate": {\n    "NSOIP": {\n      "0": "无业务权限",\n      "1": "有业务权限"\n    },\n    "NSGOIR": {\n      "0": "无业务权限",\n      "1": "有业务权限"\n    },\n    "NSCW": {\n      "0": "无业务权限",\n      "1": "有业务权限"\n    },\n    "MASTERMULTIDEV": {\n      "0": "无业务权限",\n      "1": "有业务权限"\n    },\n    "RINGTYPE": {\n      "0": "同振",\n      "1": "顺振"\n    },\n    "ESIMRISTRICT": {\n      "0": "不限制",\n      "1": "限制"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: [2]
              },
              {
                id: 77,
                businessId: '2',
                sideId: '6',
                flowName: 'UDM用户状态是否正常',
                flowDescription: 'UDM用户状态是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: [1]
              },
              {
                id: 78,
                businessId: '2',
                sideId: '6',
                flowName: 'HLRE用户是否存在终呼限制',
                flowDescription: 'HLRE用户是否存在终呼限制',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 79,
                businessId: '2',
                sideId: '6',
                flowName: 'HLRE用户鉴权状态是否正常',
                flowDescription: 'HLRE用户鉴权状态是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 80,
                businessId: '2',
                sideId: '6',
                flowName: 'HLRE用户是否设置呼叫转移',
                flowDescription: 'HLRE用户是否设置呼叫转移',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 81,
                businessId: '2',
                sideId: '6',
                flowName: '判断HLRE-IVPN-VOLTE签约诊断-IVPN业务是否签约',
                flowDescription: '判断HLRE-IVPN-VOLTE签约诊断-IVPN业务是否签约',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 82,
                businessId: '2',
                sideId: '6',
                flowName: '用户终端是否支持VOLTE业务',
                flowDescription: '用户终端是否支持VOLTE业务',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 83,
                businessId: '2',
                sideId: '6',
                flowName: '用户呼叫记录查询',
                flowDescription: '用户呼叫记录查询',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              }
            ]
          }
        ]
      },
      {
        nodeId: 3,
        nodeName: '短信功能诊断',
        nodeDescription: '短信功能诊断',
        flowSideVoList: [
          {
            sideName: '网络侧诊断',
            flowApiVoList: [
              {
                id: 2,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: 'CRM5G功能开通查询',
                flowDescription: 'CRM5G功能开通查询',
                flowProp:
                  '{\n  "id": 2,\n  "name": "CRM5G功能开通查询",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>24",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "name"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 11,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: '判断用户是否使用5G终端',
                flowDescription: '判断用户是否使用5G终端',
                flowProp:
                  '{\n  "id": 11,\n  "name": "判断用户是否使用5G终端",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>25",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "张三"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 18,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否有5G覆盖',
                flowDescription: '是否有6G覆盖',
                flowProp:
                  '{\n  "id": 18,\n  "name": "是否有5G覆盖",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>19",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "name",\n    "age"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 20,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否突发故障',
                flowDescription: '是否突发故障',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 21,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否重大活动',
                flowDescription: '是否重大活动',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 22,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否割接升级',
                flowDescription: '是否割接升级',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 23,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否核心网故障（影响全移动业务使用）',
                flowDescription: '是否核心网故障（影响全移动业务使用）',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 24,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否基站告警',
                flowDescription: '是否基站告警',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 25,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否忙小区',
                flowDescription: '是否忙小区',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 26,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否弱信号覆盖',
                flowDescription: '是否弱信号覆盖',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 27,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否基站容量不足',
                flowDescription: '是否基站容量不足',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 28,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否基站干扰',
                flowDescription: '是否基站干扰',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 29,
                businessId: '1,2,3',
                sideId: '5',
                flowName: '是否高频污染',
                flowDescription: '是否高频污染',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              }
            ]
          },
          {
            sideName: '用户侧诊断',
            flowApiVoList: [
              {
                id: 1,
                businessId: '1,2,3',
                sideId: '6',
                flowName: 'CRM状态查询',
                flowDescription: 'CRM状态查询',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 2,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: 'CRM5G功能开通查询',
                flowDescription: 'CRM5G功能开通查询',
                flowProp:
                  '{\n  "id": 2,\n  "name": "CRM5G功能开通查询",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>24",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "name"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 11,
                businessId: '1,2,3',
                sideId: '5,6',
                flowName: '判断用户是否使用5G终端',
                flowDescription: '判断用户是否使用5G终端',
                flowProp:
                  '{\n  "id": 11,\n  "name": "判断用户是否使用5G终端",\n  "root": {\n    "1": "result.data",\n    "2": "result.data.data"\n  },\n  "assertExpression": "age>25",\n  "assertResult": "成年|未成年",\n  "mapping": {\n    "name": "姓名"\n  },\n  "tableHeaderOrder": [\n    "张三"\n  ],\n  "translate": {\n    "isShow": {\n      "0": "否",\n      "1": "是"\n    }\n  }\n}',
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 14,
                businessId: '1,2,3',
                sideId: '6',
                flowName: '判断用户是否有在途工单',
                flowDescription: '判断用户是否有在途工单',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 15,
                businessId: '1,2,3',
                sideId: '6',
                flowName: '判断用户PF订单业务是否正常',
                flowDescription: '判断用户PF订单业务是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 16,
                businessId: '1,2,3',
                sideId: '6',
                flowName: 'PF订单用户成品卡批开档是否正常',
                flowDescription: 'PF订单用户成品卡批开档是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 55,
                businessId: '3',
                sideId: '6',
                flowName: 'CRM用户短信业务是否正常',
                flowDescription: 'CRM用户短信业务是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 56,
                businessId: '3',
                sideId: '6',
                flowName: '判断是否涉骚扰电话被暂停短信功能',
                flowDescription: '判断是否涉骚扰电话被暂停短信功能',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 57,
                businessId: '3',
                sideId: '6',
                flowName: '判断用户是否被列入电信黑名单',
                flowDescription: '判断用户是否被列入电信黑名单',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 58,
                businessId: '3',
                sideId: '6',
                flowName: '判断用户近7天解除黑名单操作次数是否达5次',
                flowDescription: '判断用户近7天解除黑名单操作次数是否达6次',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 59,
                businessId: '3',
                sideId: '6',
                flowName: '判断短信中心用户状态是否正常',
                flowDescription: '判断短信中心用户状态是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 60,
                businessId: '3',
                sideId: '6',
                flowName: '判断用户短信接收记录是否正常',
                flowDescription: '判断用户短信接收记录是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 62,
                businessId: '3',
                sideId: '6',
                flowName: '判断C网短信中心数据短信数据付费属性是否一致',
                flowDescription: '判断C网短信中心数据短信数据付费属性是否一致',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 63,
                businessId: '3',
                sideId: '6',
                flowName: '判断号码是否添加增值屏蔽',
                flowDescription: '判断号码是否添加增值屏蔽',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 64,
                businessId: '2,3',
                sideId: '6',
                flowName: '判断HLRE用户状态是否正常',
                flowDescription: '判断HLRE用户状态是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 65,
                businessId: '3',
                sideId: '6',
                flowName: '判断用户鉴权状态是否正常',
                flowDescription: '判断用户鉴权状态是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 66,
                businessId: '3',
                sideId: '6',
                flowName: '判断用户短信业务位置信息是否正常',
                flowDescription: '判断用户短信业务位置信息是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 67,
                businessId: '3',
                sideId: '6',
                flowName: '判断用户短信功能是否正常',
                flowDescription: '判断用户短信功能是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              },
              {
                id: 68,
                businessId: '3',
                sideId: '6',
                flowName: '判断用户彩信记录是否正常',
                flowDescription: '判断用户彩信记录是否正常',
                flowProp: null,
                isShow: 1,
                apiInfoList: []
              }
            ]
          }
        ]
      },
      {
        nodeId: 4,
        nodeName: '上网功能漫游诊断',
        nodeDescription: '上网功能漫游诊断',
        flowSideVoList: [
          {
            sideName: '网络侧诊断',
            flowApiVoList: []
          },
          {
            sideName: '用户侧诊断',
            flowApiVoList: []
          }
        ]
      },
      {
        nodeId: 9,
        nodeName: '用户画像',
        nodeDescription: '用户画像',
        flowSideVoList: [
          {
            sideName: '网络侧诊断',
            flowApiVoList: []
          },
          {
            sideName: '用户侧诊断',
            flowApiVoList: []
          }
        ]
      },
      {
        nodeId: 11,
        nodeName: '语音功能漫游诊断',
        nodeDescription: '语音功能漫游诊断',
        flowSideVoList: [
          {
            sideName: '网络侧诊断',
            flowApiVoList: []
          },
          {
            sideName: '用户侧诊断',
            flowApiVoList: []
          }
        ]
      },
      {
        nodeId: 12,
        nodeName: '短信功能漫游诊断',
        nodeDescription: '短信功能漫游诊断',
        flowSideVoList: [
          {
            sideName: '网络侧诊断',
            flowApiVoList: []
          },
          {
            sideName: '用户侧诊断',
            flowApiVoList: []
          }
        ]
      },
      {
        nodeId: 13,
        nodeName: '诊断工具',
        nodeDescription: '诊断工具',
        flowSideVoList: [
          {
            sideName: '网络侧诊断',
            flowApiVoList: []
          },
          {
            sideName: '用户侧诊断',
            flowApiVoList: []
          }
        ]
      },
      {
        nodeId: 14,
        nodeName: '诊断结论',
        nodeDescription: '诊断结论',
        flowSideVoList: [
          {
            sideName: '网络侧诊断',
            flowApiVoList: []
          },
          {
            sideName: '用户侧诊断',
            flowApiVoList: []
          }
        ]
      }
    ]
  }
}
