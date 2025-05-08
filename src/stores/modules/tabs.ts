import type { TabsMenuProps, TabsState } from '@/stores/interface'
import router from '@/routers'
import piniaPersistConfig from '@/stores/helper/persist'
import { getUrlWithParams } from '@/utils'
import { defineStore } from 'pinia'
import { useKeepAliveStore } from './keepAlive'

const keepAliveStore = useKeepAliveStore()

export const useTabsStore = defineStore('geeker-tabs', {
  state: (): TabsState => ({
    tabsMenuList: [],
  }),
  actions: {
    // Add Tabs
    async addTabs(tabItem: TabsMenuProps) {
      if (this.tabsMenuList.every((item: { path: string }) => item.path !== tabItem.path)) {
        this.tabsMenuList.push(tabItem)
      }
      // add keepalive
      if (!keepAliveStore.keepAliveName.includes(tabItem.name) && tabItem.isKeepAlive) {
        keepAliveStore.addKeepAliveName(tabItem.path)
      }
    },
    // Remove Tabs
    async removeTabs(tabPath: string, isCurrent: boolean = true) {
      if (isCurrent) {
        this.tabsMenuList.forEach((item: { path: string }, index: number) => {
          if (item.path !== tabPath)
            return
          const nextTab = this.tabsMenuList[index + 1] || this.tabsMenuList[index - 1]
          if (!nextTab)
            return
          router.push(nextTab.path)
        })
      }
      // remove keepalive
      const tabItem = this.tabsMenuList.find((item: { path: string }) => item.path === tabPath)
      tabItem?.isKeepAlive && keepAliveStore.removeKeepAliveName(tabItem.path)
      // set tabs
      this.tabsMenuList = this.tabsMenuList.filter((item: { path: string }) => item.path !== tabPath)
    },
    // Close Tabs On Side
    async closeTabsOnSide(path: string, type: 'left' | 'right') {
      const currentIndex = this.tabsMenuList.findIndex((item: { path: string }) => item.path === path)
      if (currentIndex !== -1) {
        const range = type === 'left' ? [0, currentIndex] : [currentIndex + 1, this.tabsMenuList.length]
        this.tabsMenuList = this.tabsMenuList.filter((item: { close: any }, index: number) => {
          return index < range[0] || index >= range[1] || !item.close
        })
      }
      // set keepalive
      const KeepAliveList = this.tabsMenuList.filter((item: { isKeepAlive: any }) => item.isKeepAlive)
      keepAliveStore.setKeepAliveName(KeepAliveList.map((item: { path: any }) => item.path))
    },
    // Close MultipleTab
    async closeMultipleTab(tabsMenuValue?: string) {
      this.tabsMenuList = this.tabsMenuList.filter((item: { path: string | undefined, close: any }) => {
        return item.path === tabsMenuValue || !item.close
      })
      // set keepalive
      const KeepAliveList = this.tabsMenuList.filter((item: { isKeepAlive: any }) => item.isKeepAlive)
      keepAliveStore.setKeepAliveName(KeepAliveList.map((item: { path: any }) => item.path))
    },
    // Set Tabs
    async setTabs(tabsMenuList: TabsMenuProps[]) {
      this.tabsMenuList = tabsMenuList
    },
    // Set Tabs Title
    async setTabsTitle(title: string) {
      this.tabsMenuList.forEach((item: { path: string, title: string }) => {
        if (item.path === getUrlWithParams())
          item.title = title
      })
    },
  },
  persist: piniaPersistConfig('geeker-tabs'),
})
