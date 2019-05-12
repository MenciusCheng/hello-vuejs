/**
 * 官方教程：组件基础
 * https://cn.vuejs.org/v2/guide/components.html
 */


// 基本示例

// 定义一个名为 button-counter 的新组件
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})

new Vue({ el: '#components-demo' })


// 组件的组织

Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button v-on:click="$emit('enlarge-text', 0.1)">Enlarge text</button>
      <div v-html="post.content"></div>
    </div>
  `
})

new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: 'My journey with Vue', content: '<p>helow</p>' },
      { id: 2, title: 'Blogging with Vue', content: '<p>helow</p>' },
      { id: 3, title: 'Why Vue is so fun', content: '<p>helow</p>' }
    ],
    postFontSize: 1
  },
  methods: {
    onEnlargeText: function (enlargeAmount) {
      this.postFontSize += enlargeAmount
    }
  }
})

