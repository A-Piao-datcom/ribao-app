<template>
	<view class="settings-page">
		<button class="option-button" @click="logout">退出账号</button>
	</view>
</template>

<script>
	export default {
		methods: {
			logout() {
				// 清除用户登录信息
				uni.removeStorageSync('isLoggedIn');
				uni.showToast({
					title: '已退出登录',
					icon: 'success'
				});
				// 跳转到登录页面
				uni.reLaunch({
					url: '/pages/Login/Login' // 确保路径正确
				});
			}
		}
	}
</script>

<style>
.settings-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 20px;
}

.option-button {
	width: 80%;
	padding: 15px;
	margin: 10px 0;
	background-color: #007aff;
	color: #fff;
	text-align: center;
	border-radius: 5px;
	font-size: 16px;
}
</style>
