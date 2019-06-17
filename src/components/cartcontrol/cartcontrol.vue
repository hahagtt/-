<template>
  <div class="cartcontrol">
  	<span class="fa fa-minus-circle" style="color: #b4b4b4 ;"
			@click.stop.prevent="decreaseCart"
			v-show="food.count"
			></span>			
		<span class="cart-count" style="font-size: 12px;"
			v-show="food.count">
			{{food.count}}
		</span>		
		<span class="fa fa-plus-circle" style="color: #ffd161;"
			@click.stop.prevent="increaseCart"
			></span>
  </div>
</template>

<script>
import Vue from 'vue'
	export default {
		props:{
			food:{
				type:Object
			}
		},
		methods:{
			decreaseCart(){
				this.food.count--;
			},
			increaseCart(){
				//如果当前将要选择的食物没有count属性，在此就设置一个count属性
				if(!this.food.count){
					Vue.set(this.food,"count",1);
				}else{
					//如果存在count属性直接根据自己的选择进行数量加或减
					this.food.count++;
				}
//				console.log(this.food.count);
			}
		}
		
	}
</script>
<style scoped src="../../common/css/font-awesome.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
