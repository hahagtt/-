// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
import Goods from '@/components/goods/goods'
import Ratings from '@/components/ratings/ratings'
import Seller from '@/components/seller/seller'
Vue.config.productionTip = false
Vue.use(Router)
const routes=[
		{
			path:"/",
			redirect:"/goods"
		},
		{
			path:"/goods",
			component:Goods
		},
		{
			path:"/ratings",
			component:Ratings
		},
		{
			path:"/seller",
			component:Seller
		},
		
]
const router =new Router({
	mode:'history',
	routes,
	linkActiveClass:"active"
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
