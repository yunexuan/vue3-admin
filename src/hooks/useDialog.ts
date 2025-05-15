import type { AppContext, Component, ComponentPublicInstance, VNode } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createVNode, getCurrentInstance, h, render } from 'vue'

export interface Options {
  visible?: boolean
  onClose?: () => void
  appendTo?: HTMLElement | string
  [key: string]: unknown
}

export interface CommandComponent {
  (options: Options): VNode
  close: () => void
}

function getAppendToElement(props: Options): HTMLElement {
  let appendTo: HTMLElement | null = document.body
  if (props.appendTo) {
    if (typeof props.appendTo === 'string') {
      appendTo = document.querySelector<HTMLElement>(props.appendTo)
    }
    if (props.appendTo instanceof HTMLElement) {
      appendTo = props.appendTo
    }
    if (!(appendTo instanceof HTMLElement)) {
      appendTo = document.body
    }
  }
  return appendTo
}

function initInstance<T extends Component>(Component: T, props: Options, container: HTMLElement, appContext: AppContext | null = null) {
  const dialogVNode = createVNode(Component, props)

  const configProviderVNode = h(ElConfigProvider, { locale: zhCn }, [dialogVNode])

  configProviderVNode.appContext = appContext

  render(configProviderVNode, container)

  getAppendToElement(props).appendChild(container)
  return configProviderVNode
}

export function useCommandComponent<T extends Component>(Component: T): CommandComponent {
  const appContext = getCurrentInstance()?.appContext
  if (appContext) {
    const currentProvides = (getCurrentInstance() as any)?.provides
    Reflect.set(appContext, 'provides', { ...appContext.provides, ...currentProvides })
  }

  const container = document.createElement('div')

  const close = () => {
    render(null, container)
    container.parentNode?.removeChild(container)
  }

  const CommandComponent = (options: Options): VNode => {
    if (!Reflect.has(options, 'visible')) {
      options.visible = true
    }
    if (typeof options.onClose !== 'function') {
      options.onClose = close
    }
    else {
      const originOnClose = options.onClose
      options.onClose = () => {
        originOnClose()
        close()
      }
    }
    const vNode = initInstance<T>(Component, options, container, appContext)
    const vm = vNode.component?.proxy as ComponentPublicInstance<Options>
    for (const prop in options) {
      if (!Reflect.has(vm.$props, prop)) {
        vm[prop as keyof ComponentPublicInstance] = options[prop]
      }
    }
    return vNode
  }

  CommandComponent.close = close

  return CommandComponent
}

export default useCommandComponent
