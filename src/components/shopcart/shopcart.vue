<template>
	<div class="shopcart">
		<div class="shopcart-wrapper">
			<!--左侧部分-->
			<div class="content-left">
				<!--logo部分-->
				<div class="logo-wrapper" :class="{'highligh':totalcount>0}">
					<span class="fa fa-shopping-cart logo" :class="{'highligh':totalcount>0}" @click="togglelist"></span>
					<i class="num" v-show="totalcount">{{totalcount}}</i>
				</div>
				<div class="desc-wrapper">

					<p class="total-price">{{totalprice}}</p>
					<p class="tip" :class="{'highligh':totalcount>0}">
						另需:{{poiInfo.shipping_fee_tip}}
					</p>
				</div>
			</div>
			<!--右侧部分-->
			<div class="content-right" :class="{'highligh':totalcount>0}">
				{{paystr}}
			</div>
			<!--购物车列表-->
			<div class="shopcart-list" v-show="listShow" :class="{'show':listShow}">
				<div class="list-top" v-if="poiInfo.discounts2">
					{{poiInfo.discounts2[0].info}}
				</div>
				<div class="list-header">
					<h3 class="title">1号口袋</h3>
					<div class="empty" @click="clearAll"  style="cursor:pointer">
						<span class="fa fa-trash-o img"></span>
						<span >清空购物车</span>
					</div>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
					<li class="food-item"
						v-for="(food,index) in selectFoods"
						:key="index"
						>
						<div class="desc-wrapper">
							<div class="desc-left">
								<p class="name">{{food.name}}</p>
								<p class="unit" v-show="!food.description">{{food.unit}}</p>
								<p class="description" v-show="!food.unit">{{food.description}}</p>
							</div>
							<div class="desc-right">
								￥{{food.min_price}}
							</div>
						</div>
						<div class="cartcontrol-wrapper">
							<!--加减号控件-->
							<app-cart-control :food="food"></app-cart-control>
						</div>
					</li>
				</ul>

				</div>
				<div class="list-bottom"></div>
			</div>

		</div>
		<div class="shopcart-mask" v-show="listShow" @click="hideMask"></div>

	</div>
</template>

<script>
	import CartControl from "../cartcontrol/cartcontrol"
	import BScroll from 'better-scroll'
	export default {
		name: 'seller',
		props: {
			poiInfo: {
				type: Object,
				default: {}
			},
			selectFoods: {
				type: Array,
				default() {
					return []
				}

			}
		},

		data() {
			return {
					fold:true
			}
		},
		components: {
			"app-cart-control": CartControl
		},
		computed: {
			totalcount() {
				let num = 0;
				this.selectFoods.forEach((food) => {
					num += food.count;
				})
				return num;
			},
			listShow(){
				if(!this.totalcount){
					//个数为0不显示
					this.fold=true;
					return false
				}
				//个数不为0，如果当前为真就不显示，如果fold为假则就让其显示
				let show=!this.fold;
				if(show){
					//dom渲染完实现滚动
					this.$nextTick(()=>{
						//开始shopScroll不存在实现一个
						if(!this.shopScroll){
							this.shopScroll=new BScroll(this.$refs.listContent,{
								click:true
							})
						}else{
							//已经发生变化刷新
							this.shopScroll.refresh();
						}
					})
				}
				return show;
			},
			totalprice() {
				if(this.totalcount <= 0) {
					return "未选择商品"
				}
				let price = 0;
				this.selectFoods.forEach((food) => {
					price += food.min_price * food.count;

				})

				return "￥" + price;
			},
			paystr() {
				if(this.totalcount > 0) {
					return "去结算"
				} else {
					//返回具体价钱
					return this.poiInfo.min_price_tip
				}

			}
		},
		methods:{
			togglelist(){
				if(!this.totalcount){
					return
				}
				this.fold=!this.fold
			},
			clearAll(){
				this.selectFoods.forEach((food)=>{
					let i=confirm("清空购物车？");
					if(i==true){
						food.count=0;
						return false;
					}else{
						this.fold=!this.fold;
						return false;
					}
					
				})
			},
			hideMask(){
				this.fold=true
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	@import url("../../common/css/font-awesome.css");
	.shopcart-wrapper {
		width: 100%;
		height: 51px;
		background: #514f4f;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		z-index: 99;
	}
	
	.shopcart-wrapper .content-left {
		flex: 1;
	}
	
	.shopcart-wrapper .content-right {
		flex: 0 0 110px;
		font-size: 15px;
		color: #BAB9B9;
		line-height: 51px;
		text-align: center;
		font-weight: bold;
	}
	
	.shopcart-wrapper .content-left .logo-wrapper {
		width: 50px;
		height: 50px;
		background: #666666;
		border-radius: 50%;
		position: relative;
		top: -14px;
		left: 10px;
		text-align: center;
		float: left;
	}
	
	.shopcart-wrapper .content-left .logo-wrapper .logo {
		font-size: 28px;
		color: #c4c4c4;
		line-height: 50px;
	}
	
	.shopcart-wrapper .content-left .desc-wrapper {
		float: left;
		margin-left: 13px;
	}
	
	.shopcart-wrapper .content-left .desc-wrapper .tip {
		font-size: 12px;
		color: #bab9b9;
		line-height: 15px;
	}
	
	.shopcart-wrapper .content-left .logo-wrapper.highligh {
		background: #ffd161;
	}
	
	.shopcart-wrapper .content-left .logo-wrapper .logo.highligh {
		color: #2D2B2A;
	}
	
	.shopcart-wrapper .content-left .logo-wrapper .num {
		width: 15px;
		height: 15px;
		line-height: 15px;
		border-radius: 50%;
		font-size: 9px;
		color: white;
		background: red;
		position: absolute;
		right: 0;
		top: 0;
	}
	
	.shopcart-wrapper .content-left .desc-wrapper .total-price {
		font-size: 16px;
		line-height: 33px;
		color: white;
	}
	
	.shopcart-wrapper .content-right.highligh {
		background: #FFD161;
		color: #2D2B2A;
	}
	/*点击购物车展示购物详情的样式*/
	
	.shopcart-wrapper .shopcart-list {
		position: absolute;
		left: 0;
		top: 0;
		margin-bottom: 51px;
		z-index: -1;
		width: 100%;
	}
	
	.shopcart-wrapper .shopcart-list.show {
		transform: translateY(-100%);
	}
	
	.shopcart-wrapper .shopcart-list .list-top {
		height: 30px;
		text-align: center;
		font-size: 11px;
		background: #f3e6c6;
		line-height: 30px;
		color: #646158;
	}
	
	.shopcart-wrapper .shopcart-list .list-header {
		height: 30px;
		background: #F4F4F4;
	}
	
	.shopcart-wrapper .shopcart-list .list-header .title {
		float: left;
		border-left: 4px solid #53c123;
		padding-left: 6px;
		line-height: 30px;
		font-size: 12px;
	}
	
	.shopcart-wrapper .shopcart-list .list-header .empty {
		float: right;
		line-height: 30px;
		margin-right: 10px;
		font-size: 0;
	}
	
	.shopcart-wrapper .shopcart-list .list-header .empty .img {
		
		font-size: 17px;
		margin-right: 9px;
		vertical-align: middle;
	}
	
	.shopcart-wrapper .shopcart-list .list-header .empty span {
		font-size: 12px;
		vertical-align: middle;
	}
	
	.shopcart-wrapper .shopcart-list .list-content {
		max-height: 300px;
		overflow: hidden;
		background: white;
	}
	
	.shopcart-wrapper .shopcart-list .list-content .food-item {
		height: 38px;
		padding: 12px 12px 10px 12px;
		border-bottom: 1px solid #F4F4F4;
	}
	
	.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper {
		float: left;
		width: 280px;
	}
	
	.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left {
		float: left;
		width: 170px;
	}
	
	.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .name {
		font-size: 16px;
		margin-bottom: 8px;
		/* 超出部分隐藏*/
		-webkit-line-clamp: 1;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		height: 16px;
	}
	
	.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .unit {
		font-size: 12px;
		color: #B4B4B4;
	}
	
	.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .description {
		font-size: 12px;
		color: #B4B4B4;
		/* 超出部分隐藏*/
		overflow: hidden;
		height: 12px;
	}
	
	.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-right {
		float: right;
		width:110px;
		height: 38px;
		text-align: center;
		line-height: 38px;
	}
	
	.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-right .price {
		font-size: 12px;
		
	}
	
	.shopcart-wrapper .shopcart-list .list-content .food-item .cartcontrol-wrapper {
		float: right;
		margin-top: 6px;
	}
	
	.shopcart .shopcart-mask {
		position: fixed;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		z-index: 98;
		background: rgba(7, 17, 27, 0.6);
	}
</style>