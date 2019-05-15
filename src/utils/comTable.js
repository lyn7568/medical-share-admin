/**
 * Created by luyanan on 18/11/23.
 * gapFilling
 * 补全空行
 */

/* eslint-disable one-var */
var defaultPageSize = 10,
  gapFilling = function(tData, pageS) {
    let pageSize = defaultPageSize
    if (pageS) {
      pageSize = pageS
    }
    const needNum = pageSize - tData.length % pageSize
    for (let i = 0; i < needNum; ++i) {
      tData.push(i)
    }
  },
  ret = {
    gapFilling: gapFilling
  }

export default ret
