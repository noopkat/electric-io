import { shallowMount } from '@vue/test-utils'
import NumberComponent from '../number'

describe('Number card', () => {

  test('is a Vue instance', () => {
    const wrapper = shallowMount(NumberComponent)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

})