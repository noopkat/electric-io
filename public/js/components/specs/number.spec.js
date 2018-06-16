import { shallowMount } from '@vue/test-utils'
import NumberComponent from '../number'

describe('Number card', () => {

  test('component can mount', () => {
    const wrapper = shallowMount(NumberComponent)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders with color and number value', () => {
    const wrapper = shallowMount(NumberComponent, {
      propsData: {
        tile: {
          textColor: 'blue',
        }
      },
      data: () => ({
        number: 1
      })
    })
    
    expect(wrapper.html()).toMatchSnapshot()
  })

})