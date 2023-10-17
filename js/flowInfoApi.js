const getAllFlowInfoAPI = () =>
  request({
    url: 'apiFlowList'
  })

const delFlowInfoAPI = (id) =>
  request({
    url: `deleteFlowById/${id}`
  })

const getFlowDataAPI = (id) =>
  request({
    url: `getFlowById/${id}`
  })

const getMenuListAPI = () =>
  request({
    url: 'menuList'
  })

const postFlowDataAPI = (data) =>
  request({
    url: 'saveOrUpdateFlow',
    method: 'post',
    data
  })
