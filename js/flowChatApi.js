var getMenuListAPI = () =>
  request({
    url: 'menuList'
  })

var postFlowDataAPI = (data) =>
  request({
    url: 'saveOrUpdateFlow',
    method: 'post',
    data
  })

var getFlowDataAPI = (id) =>
  request({
    url: `getFlowById/${id}`
  })
