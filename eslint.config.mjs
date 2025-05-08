// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: 'prettier',
  },
}, {}, {
  rules: {
    'no-console': 'off',
    'unocss/order': 'warn',
    // 控制单文件组件中各区块的顺序
    'vue/order-in-components': ['error', {
      order: [
        'template',
        'script',
        'styles',
      ],
    }],
  },
})
