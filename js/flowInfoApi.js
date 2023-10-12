const getAllFlowInfoAPI = () =>
  request({
    url: 'apiFlowList'
  })

const delFlowInfoAPI = id =>
  request({
    url: `deleteFlowById/${id}`
  })
