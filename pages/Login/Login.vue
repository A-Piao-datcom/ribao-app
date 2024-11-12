<template>
	<view class="login-page">
		<view class="login-container">
			<view class="close-button" @click="cancelLogin">X</view>
			<view class="input-group">
				<text>用户名</text>
				<input type="text" v-model="username" placeholder="请输入用户名" />
			</view>
			<view class="input-group">
				<text>密码</text>
				<input type="password" v-model="password" placeholder="请输入密码" />
			</view>
			<button class="login-button" @click="login">登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: ''
			};
		},
		methods: {
		login() {
		    if (this.username === 'admin' && this.password === '123456') {
		        uni.showToast({
		            title: '登录成功',
		            icon: 'success'
		        });
		        uni.setStorageSync('username', this.username); // 保存用户名
		        uni.setStorageSync('isLoggedIn', true); // 保存登录状态
		        uni.reLaunch({
		            url: '/pages/my/my' // 跳转到个人页面
		        });
		    } else {
		        uni.showToast({
		            title: '用户名或密码错误',
		            icon: 'none'
		        });
		    }
		},
			
			
			
			
			cancelLogin() {
				// 关闭当前页面
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
.login-page {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #f5f5f5;
}

.login-container {
	position: relative;
	width: 80%;
	background-color: #fff;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.close-button {
	position: absolute;
	top: 10px;
	right: 10px;
	font-size: 18px;
	color: #999;
	cursor: pointer;
}

.input-group {
	margin-bottom: 20px;
	display: flex;
	flex-direction: column;
}

.input-group text {
	margin-bottom: 8px;
	color: #333;
}

.input-group input {
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.login-button {
	width: 100%;
	padding: 12px;
	background-color: #007aff;
	color: #fff;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	text-align: center;
}
</style>
