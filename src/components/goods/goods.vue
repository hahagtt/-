<template>
  <div class="goods">
    <!--分类列表-->
    <div class="menu-wrapper" ref="menuScroll">
      <ul>
        <!--专场,专场特殊,需单独做-->
        <li class="menu-item" :class="{'current':currentIndex === 0}" @click="selectMenu(0)">
          <p class="text">
            <img class="icon" :src="container.tag_icon" v-if="container.tag_icon">
            {{container.tag_name}}
          </p>
        </li>
        <li
          class="menu-item"
          :class="{'current':currentIndex === index + 1}"
          v-for="(item,index) in goods"
          :key="index"
          @click="selectMenu(index+1)"
        >
          <p class="text">
            <!--如果所在行有图标就执行,如果没有就不执行-->
            <img class="icon" :src="item.icon" v-if="item.icon">
            {{item.name}}
          </p>
          <!--数字-->
          <i class="num" v-show="caculatenum(item.spus)">{{caculatenum(item.spus)}}</i>
        </li>
      </ul>
    </div>

    <!--商品列表-->
    <div class="foods-wrapper" ref="foodScroll">
      <ul>
        <!--专场菜单,对应的只有两张图片-->
        <li class="container-list food-list-hook">
          <div v-for="item in container.operation_source_list">
            <img :src="item.pic_url">
          </div>
        </li>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h3 class="title">{{item.name}}</h3>
          <ul>
            <li
              v-for="(food,index) in item.spus"
              :key="index"
              @click="showDetail(food)"
              class="food-item"
            >
              <div class="icon" :style="head_bg(food.picture)"></div>
              <div class="content">
                <h3 class="name">{{food.name}}</h3>
                <p class="desc" v-if="food.description">{{food.description}}</p>
                <div class="extra">
                  <span class="saled">{{food.month_saled_content}}</span>
                  <span class="saled">{{food.praise_content}}</span>
                </div>
                <img
                  class="product"
                  :src="food.product_label_picture"
                  v-if="food.product_label_picture"
                >
                <p class="price">
                  <span class="text">￥{{food.min_price}}</span>
                  <span class="unit">/{{food.unit}}</span>
                </p>
              </div>
              <!--这里的food就是上面的food-->
              <app-cart-control :food="food"></app-cart-control>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--购物车-->
    <app-shopcart :selectFoods="selectFoods" :poiInfo="poiInfo"></app-shopcart>
    <!--商品详情-->
    <app-product-detail :food="selectFood" ref="foodview"></app-product-detail>
  </div>
</template>

<script>
//引入ajax模块
import axios from "axios";
//滚动组件
import BScroll from "better-scroll";
//购物车组件
import Shopcart from "../shopcart/shopcart";
//数量加减图标
import CartControl from "../cartcontrol/cartcontrol";
//商品详情
import ProductDetail from "../productdetail/productdetail";
export default {
  name: "goods",
  components: {
    "app-shopcart": Shopcart,
    "app-cart-control": CartControl,
    "app-product-detail": ProductDetail
  },
  data() {
    return {
      container: {},
      goods: [],
      poiInfo: {},
      listheight: [],
      menuScroll: {},
      foodScroll: {},
      selectFood: {},
      scrollY: 0
    };
  },
  //作为生命周期函数中最先执行的一个函数
  created() {
    axios.get("/api/goods").then(res => {
      this.container = res.data.data.container_operation_source;
      this.goods = res.data.data.food_spu_tags;
      this.poiInfo = res.data.data.poi_info;
      //dom加载完就执行
      this.$nextTick(() => {
        //执行滚动事件
        this.initScroll();
        //计算分类的区间高度
        this.calculateheight();
      });
    });
  },
  computed: {
    currentIndex() {
      //如果返回0.就是热销
      for (let i = 0; i < this.listheight.length; i++) {
        let height1 = this.listheight[i];
        let height2 = this.listheight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          //如果得到的滚轮的位置属于某一个区间或者height2不存在就是到底了没有长度12
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      //先循环出食物的分类
      this.goods.forEach(myfoods => {
        //再循环出食物的具体分类，如果当前的食物有数量的选中，就把选中的食物整体追加到数组中
        myfoods.spus.forEach(food => {
          if (food.count > 0) {
            foods.push(food);
          }
        });
      });
      //追加完之后将这个新数组返回给函数,函数会把这个数组传递给购物车组件
      return foods;
    }
  },
  //定义页面中的各种函数方法
  methods: {
    head_bg(imgName) {
      return "background-image: url(" + imgName + ");";
    },
    initScroll() {
      //实例化对象
      this.menuScroll = new BScroll(this.$refs.menuScroll, {
        click: true
      });
      this.foodScroll = new BScroll(this.$refs.foodScroll, {
        probeType: 3,
        click: true
      });
      //添加滚动事件监听滚动距离
      this.foodScroll.on("scroll", pos => {
        //将得到的距离正值化
        //console.log(pos.y)
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    //计算每一个li标签的高度
    calculateheight() {
      //	获取右侧食物的元素，得到数组
      let foodlist = this.$refs.foodScroll.getElementsByClassName(
        "food-list-hook"
      );
      let height = 0;
      this.listheight.push(height);
      for (let i = 0; i < foodlist.length; i++) {
        let item = foodlist[i];
        //每次的高度=当前区间的可用高度+上一个距离顶部的高度
        height += item.clientHeight;
        //然后将每次计算的高度值追加进数组末尾
        this.listheight.push(height);
      }
      //				console.log(this.listheight)
    },
    selectMenu(index) {
      //获取右侧食物对象得到的是一个数组
      let foodlist = this.$refs.foodScroll.getElementsByClassName(
        "food-list-hook"
      );
      //获取index下标对应的对象
      let element1 = foodlist[index];
      // 滚动到对应元素的位置
      this.foodScroll.scrollToElement(element1, 250);
    },
    caculatenum(spus) {
      let count = 0;
      spus.forEach(food => {
        if (food.count > 0) {
          count += food.count;
        }
      });
      return count;
    },
    showDetail(food) {
      //将当前点击选中的食物的spus传给详情页
      this.selectFood = food;
      //当点击选中要查看的食物详情时，调用子组件详情页的显示函数
      this.$refs.foodview.showview();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.goods {
  display: flex;
  position: absolute;
  top: 200px;
  bottom: 51px;
  overflow: hidden;
  width: 100%;
}

.goods .menu-wrapper {
  flex: 0 0 85px;
  background: #f4f4f4;
}

.goods .foods-wrapper {
  flex: 1;
  /* background: blue; */
}

/* Menu item */
.goods .menu-wrapper .menu-item {
  padding: 16px 23px 15px 10px;
  border-bottom: 1px solid #e4e4e4;
  position: relative;
}

.goods .menu-wrapper .menu-item .text {
  font-size: 13px;
  color: #333333;
  line-height: 17px;
  vertical-align: middle;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods .menu-wrapper .menu-item .text .icon {
  width: 15px;
  height: 15px;
  vertical-align: middle;
}

/* 专场样式 */
.goods .foods-wrapper .container-list {
  padding: 11px 11px 0 11px;
  border-bottom: 1px solid #e4e4e4;
}

.goods .foods-wrapper .container-list img {
  width: 100%;
  margin-bottom: 11px;
  border-radius: 5px;
}

/* 具体分类商品布局 */
.goods .foods-wrapper .food-list {
  padding: 11px;
}
.goods .foods-wrapper .food-list .title {
  height: 13px;
  font-size: 13px;
  background: url(./img/btn_yellow_highlighted@2x.png) no-repeat left center;
  background-size: 2px 10px;
  padding-left: 7px;
  margin-bottom: 12px;
}
.goods .foods-wrapper .food-list .food-item {
  display: flex;
  margin-bottom: 25px;
  position: relative;
}

.goods .foods-wrapper .food-list .food-item .icon {
  flex: 0 0 63px;
  background-position: center;
  background-size: 120% 100%;
  background-repeat: no-repeat;
  margin-right: 11px;
  height: 75px;
}
.goods .foods-wrapper .food-list .food-item .content {
  flex: 1;
}

/* 具体内容样式 */
.goods .foods-wrapper .food-list .food-item .content .name {
  font-size: 16px;
  line-height: 21px;
  color: #333333;
  margin-bottom: 10px;
  padding-right: 27px;
}

.goods .foods-wrapper .food-list .food-item .content .desc {
  font-size: 10px;
  line-height: 19px;
  color: #bfbfbf;
  margin-bottom: 8px;

  /* 超出部分显示省略号*/
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods .foods-wrapper .food-list .food-item .content .extra {
  font-size: 10px;
  color: #bfbfbf;
  margin-bottom: 7px;
}
.goods .foods-wrapper .food-list .food-item .content .extra .saled {
  margin-right: 14px;
}
.goods .foods-wrapper .food-list .food-item .content .product {
  height: 15px;
  margin-bottom: 6px;
}
.goods .foods-wrapper .food-list .food-item .content .price {
  font-size: 0;
}
.goods .foods-wrapper .food-list .food-item .content .price .text {
  font-size: 14px;
  color: #fb4e44;
}
.goods .foods-wrapper .food-list .food-item .content .price .unit {
  font-size: 12px;
  color: #bfbfbf;
}

/* 当前选中 */
.goods .menu-wrapper .menu-item.current {
  background: white;
  font-weight: bold;
  margin-top: -1px;
}
.goods .menu-wrapper .menu-item:first-child.current {
  margin-top: 1px;
}

.goods .foods-wrapper .food-list .food-item .cartcontrol-wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
}

.goods .menu-wrapper .menu-item .num {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  color: white;
  background: red;
  text-align: center;
  font-size: 7px;
  line-height: 13px;
}
</style>