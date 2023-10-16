function createList() {
  const list = []
  for (let i = 1; i < 20; i++) {
    list.push({
      id: i,
      name: 'test-' + i,
      url: '/src/assets/video/test_video.mp4',
      createTime: Date.now(),
      duration: '3:15',
      seconds: '',
    })
  }
  return list
}
export default [
  {
    url: '/api/liveRoom/getVideoList',
    method: 'get',
    response: ({ body }: { body: any }) => {
      return { code: 0, data: createList }
    },
  },
]
