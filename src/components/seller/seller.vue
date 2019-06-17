<template>
	<div class="seller">
		<div class="seller-wrapper">
			<!--灰色是间隔线-->
			<!--<Split></Split>-->
			<div class="seller-view">
				<!--地址-->
				<div class="address-wrapper">
					<div class="address-left">
						{{seller.address}}
					</div>
					<div class="address-right">
						<div class="content"></div>
					</div>
				</div>

				<!--档案-->
				<div class="safety-wrapper">
					查看食品安全档案
					<span class="fa fa-angle-right"></span>
				</div>

			</div>
			<!--<Split></Split>-->
			<div class="tip-wrapper">
				<div class="delivery-wrapper">
					配送服务:{{seller.app_delivery_tip}}
				</div>
				<div class="shipping-wrapper">
					配送时间{{seller.shipping_time}}
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {

		data() {
			return {
				seller: []
			}
		},
		created() {
			axios.get('/api/seller').then((res) => {
				this.seller = res.data.data;
				console.log(this.seller);
			})
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.seller {
		font-size: 14px;
		line-height: 18px;
		color: #666;
	}
</style>
<style src="../../common/css/font-awesome.css"></style>