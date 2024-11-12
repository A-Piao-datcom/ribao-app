<template>
	<view class="my">
		<view class="userpicture">
			<image class="userimg" :src="imgUrl" mode=""></image>
		</view>
		<view class="username">
			{{ username || '未登录' }} <!-- 显示用户名，若未登录则显示“未登录” -->
		</view>
		<view class="Collection">
			<view class="" @click="goToFavorite">
				我的收藏
			</view>
			<view class="">
				＞
			</view>
		</view>
		<view class="Collection">
			<view class="" @click="goToSettings">
				设置中心
			</view>
			<view class="">
				＞
			</view>
		</view>
	</view>
</template>

<script>
	import { host } from "../../api/index";

	export default {
		data() {
			return {
				imgUrl: `${host}/imgs/user.jpg`, // 用户头像
				username: '' // 用户名
			};
		},
		onShow() {
					// 每次页面显示时，从缓存中获取用户名
					const cachedUsername = uni.getStorageSync('username');
					this.username = cachedUsername || '未登录'; // 若缓存中无用户名，显示“未登录”
				},
		methods: {
			goToFavorite() {
				uni.navigateTo({
					url: '/pages/FavoriteList/FavoriteList'
				});
			},
			goToSettings() {
				// 检查登录状态
				const isLoggedIn = uni.getStorageSync('isLoggedIn');
				if (isLoggedIn) {
					uni.navigateTo({
						url: '/pages/settings/settings'
					});
				} else {
					uni.navigateTo({
						url: '/pages/Login/Login'
					});
				}
			}
		}
	}
</script>

<style lang="less">
.my {
	.userpicture {
		width: 100%;
		height: 100rpx;
		text-align: center;
		margin: 20rpx 0;
		.userimg {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}
	}
	.username {
		width: 80%;
		height: 100rpx;
		text-align: center;
		margin: 0 auto;
		line-height: 100rpx;
		border-bottom: 2rpx solid #ccc;
	}
	.Collection {
		width: 80%;
		height: 100rpx;
		margin: 0 auto;
		line-height: 100rpx;
		border-bottom: 2rpx solid #ccc;
		display: flex;
		justify-content: space-between;
		color: #ccc;
	}
}
</style>
