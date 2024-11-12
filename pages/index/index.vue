<template>
	<view class="home">
		<text class="datetxt">{{ currentDate }} | 你好！</text>
		<image class="img" @click="jumoToMy" :src="imgUrl" mode=""></image>

		<!-- 轮播图 -->
		<view class="swibe">
			<swiper :autoplay="true" :interval="3000" :duration="1000" :circular="true" @change="changeIndex" :change="num">
				<swiper-item v-for="item in arr" :key="item.id" class="swiper">
					<view class="swiper-item">
						<!-- 点击文章前先检查登录状态 -->
						<view @click="checkLoginBeforeNavigate(item.id)">
							<image class="beernatu" :src="item.image" mode="" />
						</view>
					</view>
				</swiper-item>
			</swiper>
			<!-- 导航点 -->
			<view class="banner-point">
				<view :class="['opt', { active: index == num }]" v-for="(item, index) in arr" :key="item.id"></view>
			</view>
		</view>

		<view class="ribao-list">今日新闻:</view>
		<!-- 监听列表组件 -->
		<WangList @update-images="handleUpdateImages"></WangList>
	</view>
</template>

<script>
import WangList from "../../components/WangList/WangList.vue";
import { host } from "../../api/index";

export default {
	components: { WangList },
	data() {
		const currentDate = new Date();
		const month = String(currentDate.getMonth() + 1).padStart(2, '0');
		const day = String(currentDate.getDate()).padStart(2, '0');
		return {
			currentDate: `${month}月${day}`, // 格式化后的当前日期
			num: 0, // 当前轮播图索引
			imgUrl: `${host}/imgs/user.jpg`, // 用户头像
			arr: [] // 用于存放轮播图内容
		};
	},
	methods: {
		changeIndex(event) {
			// 更新轮播图当前索引
			this.num = event.detail.current;
		},
		jumoToMy() {
			// 跳转到我的页面
			uni.switchTab({ url: '/pages/my/my' });
		},
		handleUpdateImages(images) {
			// 更新轮播图图片
			this.arr = [...images];
		},
		checkLoginBeforeNavigate(articleId) {
			// 检查登录状态，若未登录则阻止跳转并提示
			const isLoggedIn = uni.getStorageSync('isLoggedIn');
			  console.log('isLoggedIn:', isLoggedIn);  // 打印登录状态，确保它正确
			if (isLoggedIn) {
				// 已登录，允许跳转到详情页
				uni.navigateTo({
					url: `/pages/details/details?id=${articleId}`
					
					
				});
			} else {
				// 未登录，提示用户登录
				uni.showToast({
					title: '您还未登录，请前往登录',
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style lang="scss">
	/* 页面整体样式 */
	.home {
		width: 100%;
		
		.datetxt {
			position: relative;
			top: -30rpx; 
			padding-left: 10rpx;
		}
		.img {
			right: -390rpx;
			top: 5rpx;
			width: 100rpx;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 50%;
		}
	}

	.banner-point {
		transform: translateY(-50rpx); // 上移 50rpx
		width: 100%;
		height: 40rpx;
		display: flex;
		line-height: 40rpx;
		justify-content: flex-end;
		align-items: center;

		.opt {
			width: 10rpx;
			height: 10rpx;
			background-color: #ccc;
			line-height: 20rpx;
			margin: 0 10rpx;
			border-radius: 5rpx;
			transition: all .5s;
		}

		.active {
			width: 50rpx;
			background-color: #2d97ff;
		}
	}

	.swiper {
		width: 100%;
		height: 370rpx !important;
		.swiper-item {
			.beernatu {
				width: 100%;
			}
		}
	}
	.ribao-list {
		width: 100%;
		height: 40rpx;
		line-height: 10rpx;
		padding-left: 10rpx;
	}
</style>
