import Dictionary from '@/components/Dictionary/index.vue'
import DropdownMenu from '@/components/DropdownMenu/index.vue'
import { Icon } from '@iconify/vue'

export default function install(app: any) {
  app.component('Icon', Icon)
  app.component('DropdownMenu', DropdownMenu)
  app.component('Dictionary', Dictionary)
}
