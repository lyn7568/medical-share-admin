/**
 * Created by luyanan on 18/9/12.
 */
export const comUrl = process.env.BASE_API
/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || ['', ''])[1].replace(/\+/g, '%20')) || null
}

/**
 * 格式化日期
 * @param  {[String]} startTime [date]
 * @return {[String]}           [return date(YYYY/MM/dd)]
 */
export function parseTime(startTime) {
  return startTime.substring(0, 4) + '/' + startTime.substring(4, 6) + '/' + startTime.substring(6, 8)
}

/**
 * 去除str前后空格
 * @param str
 */
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
/**
 * String与Array之间的转换
 */
export function strToArr(str) {
  var subs = []
  if (str) {
    if (str.indexOf(',')) {
      subs = str.split(',')
    } else {
      subs[0] = str
    }
    return subs
  } else {
    return subs
  }
}
export function arrToStr(arr, fh = ',') {
  var strs = ''
  if (arr) {
    strs = arr.join(fh)
    return strs
  } else {
    return strs
  }
}

export function requiredTip(str) {
  return `请填写${str}`
}

export function trimStr(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
