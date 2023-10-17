var getMenuListAPI = () =>
  request({
    url: 'menuList'
  })

var editFlowAPI = (data) =>
  request({
    url: 'addFlowProp',
    method: 'post',
    data
  })
