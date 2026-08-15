import { mount } from '@vue/test-utils'
import ProductosPage from '@/views/ProductosPage.vue'
import { describe, expect, test } from 'vitest'

describe('ProductosPage.vue', () => {
  test('renders Productos ProductosPage', () => {
    const wrapper = mount(ProductosPage)
    expect(wrapper.text()).toMatch('Productos page')
  })
})
