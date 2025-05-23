import type { FieldNamesProps } from '@/components/ProTable/interface'
import { isArray } from '@/utils/is'

const mode = import.meta.env.VITE_ROUTER_MODE

/**
 * @description 获取localStorage
 * @param {string} key Storage名称
 * @return {string}
 */
export function localGet(key: string) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key) as string)
  }
  catch (error) {
    console.log(error)
    return value
  }
}

/**
 * @description 存储localStorage
 * @param {string} key Storage名称
 * @param {*} value Storage值
 * @returns {void}
 */
export function localSet(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * @description 清除localStorage
 * @param {string} key Storage名称
 * @returns {void}
 */
export function localRemove(key: string) {
  window.localStorage.removeItem(key)
}

/**
 * @description 清除所有localStorage
 * @returns {void}
 */
export function localClear() {
  window.localStorage.clear()
}

/**
 * @description 判断数据类型
 * @param {*} val 需要判断类型的数据
 * @return {string}
 */
export function isType(val: any) {
  if (val === null)
    return 'null'
  if (typeof val !== 'object')
    return typeof val
  else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase()
}

/**
 * @description 生成唯一 uuid
 * @return {string}
 */
export function generateUUID() {
  let uuid = ''
  for (let i = 0; i < 32; i++) {
    const random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20)
      uuid += '-'
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }
  return uuid
}

/**
 * 判断两个对象是否相同
 * @param {object} a 要比较的对象一
 * @param {object} b 要比较的对象二
 * @return {boolean} 相同返回 true，反之 false
 */
export function isObjectValueEqual(a: { [key: string]: any }, b: { [key: string]: any }) {
  if (!a || !b)
    return false
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length)
    return false
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]
    const propA = a[propName]
    const propB = b[propName]
    if (!Object.prototype.hasOwnProperty.call(b, propName))
      return false
    if (propA instanceof Object) {
      if (!isObjectValueEqual(propA, propB))
        return false
    }
    else if (propA !== propB) {
      return false
    }
  }
  return true
}

/**
 * @description 生成随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @return {number}
 */
export function randomNum(min: number, max: number): number {
  const num = Math.floor(Math.random() * (min - max) + max)
  return num
}

/**
 * 获取当前时间对应的提示语
 * @return {string}
 */
export function getTimeState() {
  const timeNow = new Date()
  const hours = timeNow.getHours()
  if (hours >= 6 && hours <= 10)
    return `早上好 ⛅`
  if (hours >= 10 && hours <= 14)
    return `中午好 🌞`
  if (hours >= 14 && hours <= 18)
    return `下午好 🌞`
  if (hours >= 18 && hours <= 24)
    return `晚上好 🌛`
  if (hours >= 0 && hours <= 6)
    return `凌晨好 🌛`
}

/**
 * @description 获取浏览器默认语言
 * @return {string}
 */
export function getBrowserLang() {
  const browserLang = navigator.language ? navigator.language : navigator.browserLanguage
  let defaultBrowserLang = ''
  if (['cn', 'zh', 'zh-cn'].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = 'zh'
  }
  else {
    defaultBrowserLang = 'en'
  }
  return defaultBrowserLang
}

/**
 * @description 获取不同路由模式所对应的 url + params
 * @return {string}
 */
export function getUrlWithParams() {
  const url = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search,
  }
  return url[mode]
}

/**
 * 组装前端路由以及菜单
 * @param {Array} menus 后端返回的菜单
 * @returns {Array}  处理后的值
 */
export function assembleMenu(menus: Array<any>, parent?: any): Array<Menu.MenuOptions> {
  const menuList: Array<Menu.MenuOptions> = []
  menus.forEach((menu) => {
    const item: Menu.MenuOptions = {
      path: menu.menuPath,
      name: menu.menuPath,
      component: menu.pagePath,
      meta: {
        icon: menu.menuIcon,
        title: menu.menuName,
        isHide: menu.hideFlag === 1,
        isFull: menu.fullFlag === 1,
        isAffix: menu.fixedFlag === 1,
        isKeepAlive: menu.cacheFlag === 1,
        isLink: menu.linkFlag === 1 ? menu.linkUrl : '',
        activeMenu: parent && parent.pagePath ? parent.menuPath : null,
      },
      children: [],
    }
    if (Array.isArray(menu.children) && menu.children.length > 0) {
      item.children = assembleMenu(menu.children, menu)
    }
    menuList.push(item)
  })
  return menuList
}

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @return {Array}
 */
export function getFlatMenuList(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
  const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))
  return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])])
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}  处理后的值
 */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
  const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))
  return newMenuList.filter((item) => {
    item.children?.length && (item.children = getShowMenuList(item.children))
    return !item.meta?.isHide
  })
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {object} result 处理后的结果
 * @return {object}
 */
export function getAllBreadcrumbList(menuList: Menu.MenuOptions[], parent = [], result: { [key: string]: any } = {}) {
  for (const item of menuList) {
    result[item.path] = [...parent, item]
    if (item.children)
      getAllBreadcrumbList(item.children, result[item.path], result)
  }
  return result
}

/**
 * @description 使用递归处理路由菜单 path，生成一维数组 (第一版本地路由鉴权会用到，该函数暂未使用)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} menuPathArr 菜单地址的一维数组 ['**','**']
 * @return {Array}
 */
export function getMenuListPath(menuList: Menu.MenuOptions[], menuPathArr: string[] = []): string[] {
  for (const item of menuList) {
    if (typeof item === 'object' && item.path)
      menuPathArr.push(item.path)
    if (item.children?.length)
      getMenuListPath(item.children, menuPathArr)
  }
  return menuPathArr
}

/**
 * @description 递归查询当前 path 所对应的菜单对象 (该函数暂未使用)
 * @param {Array} menuList 菜单列表
 * @param {string} path 当前访问地址
 * @return {object | null}
 */
export function findMenuByPath(menuList: Menu.MenuOptions[], path: string): Menu.MenuOptions | null {
  for (const item of menuList) {
    if (item.path === path)
      return item
    if (item.children) {
      const res = findMenuByPath(item.children, path)
      if (res)
        return res
    }
  }
  return null
}

/**
 * @description 使用递归过滤需要缓存的菜单 name (该函数暂未使用)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} keepAliveNameArr 缓存的菜单 name ['**','**']
 * @returns {Array}  处理后的值
 */
export function getKeepAliveRouterName(menuList: Menu.MenuOptions[], keepAliveNameArr: string[] = []) {
  menuList.forEach((item) => {
    item.meta.isKeepAlive && item.name && keepAliveNameArr.push(item.name)
    item.children?.length && getKeepAliveRouterName(item.children, keepAliveNameArr)
  })
  return keepAliveNameArr
}

/**
 * @description 格式化表格单元格默认值 (el-table-column)
 * @param {number} _row 行
 * @param {number} _col 列
 * @param {*} callValue 当前单元格值
 * @returns {string}  处理后的值
 */
export function formatTableColumn(_row: number, _col: number, callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue))
    return callValue.length ? callValue.join(' / ') : '--'
  return callValue ?? '--'
}

/**
 * @description 处理 ProTable 值为数组 || 无数据
 * @param {*} callValue 需要处理的值
 * @returns {string}  处理后的值
 */
export function formatValue(callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue))
    return callValue.length ? callValue.join(' / ') : '--'
  return callValue ?? '--'
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {object} row 当前行数据
 * @param {string} prop 当前 prop
 * @returns {*}  处理后的值
 */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
  if (!prop.includes('.'))
    return row[prop] ?? '--'
  prop.split('.').forEach(item => (row = row[item] ?? '--'))
  return row
}

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {string} prop 当前 prop
 * @returns {string}  处理后的值
 */
export function handleProp(prop: string) {
  const propArr = prop.split('.')
  if (propArr.length === 1)
    return prop
  return propArr[propArr.length - 1]
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {string} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {string} type 过滤类型（目前只有 tag）
 * @returns {string} 处理后的值
 */
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps, type?: 'tag') {
  const value = fieldNames?.value ?? 'value'
  const label = fieldNames?.label ?? 'label'
  const children = fieldNames?.children ?? 'children'
  let filterData: { [key: string]: any } = {}
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData))
    filterData = findItemNested(enumData, callValue, value, children)
  // 判断是否输出的结果为 tag 类型
  if (type === 'tag') {
    return filterData?.tagType ? filterData.tagType : ''
  }
  else {
    return filterData ? filterData[label] : '--'
  }
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
  return enumData.reduce((accumulator: any, current: any) => {
    if (accumulator)
      return accumulator
    if (current[value] === callValue)
      return current
    if (current[children])
      return findItemNested(current[children], callValue, value, children)
    return null // 明确返回 null，避免 undefined
  }, null)
}
