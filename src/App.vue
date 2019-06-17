<template>
  <div id="app">
    <app-header :poiInfo="poiInfo"></app-header>
    <app-nav :commentnum="commentnum"></app-nav>
    <router-view></router-view>
  </div>
</template>

<script>
	//引入组件
	import Header from'./components/header/header'
	import Nav from'./components/nav/nav'
	import axios from 'axios'
	export default {
	  name: 'App',
	  //注册组件
	  components:{
	  	"app-header":Header,
	  	'app-nav':Nav
	 },
	 data(){
	 	return{
	 		poiInfo:{},
	 		commentnum:0
	 	}
	 },
	 created(){
	 	axios.get('/api/goods').then((res)=>{
	 		this.poiInfo=res.data.data.poi_info;
	 	}),
	 	axios.get('/api/ratings').then((res)=>{
	 		console.log(res.data.data);
	 		this.commentnum=res.data.data.comment_num;
	 	})
	 }
	}
</script>

<style>
#app{
	font-family: "微软雅黑";
}
</style>
<style src="./common/css/font-awesome.css"></style>