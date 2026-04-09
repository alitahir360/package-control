import { mount } from '@vue/test-utils';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';
import { describe, expect, test } from 'vitest';
import ConnectPage from '@/views/ConnectPage.vue';

describe('ConnectPage.vue', () => {
  test('renders connect heading in English', () => {
    const wrapper = mount(ConnectPage, {
      global: {
        plugins: [IonicVue, createPinia()],
      },
    });
    expect(wrapper.text()).toMatch(/Connect/i);
  });
});
