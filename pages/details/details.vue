<template>
	<view :class="['details', { 'night-mode': isNightMode }]" v-bind="$attrs">
		<!-- 加载提示 -->
		<view v-if="isLoading" class="loading-indicator">
			<image :src="jzimgUrl" mode="widthFix"></image>
		</view>

		<!-- 正文内容 -->
		<image class="details-image" v-if="article.image" :src="article.image" mode="widthFix" alt="Article Image" />
		<view class="details-title">{{ article.title }}</view>
		<view class="details-content" v-html="cleanedContent"></view>
			<!-- 收藏提示 -->
		<view v-if="message" class="favorite-message">{{ message }}</view>
	</view>
	<!-- 底部栏添加动态类 -->
	<view :class="['bottom-tab', { 'night-mode-tab': isNightMode }]">
		<!-- 返回按钮 -->
		<image :src="fhimgUrl" mode="widthFix" class="fhimg" @click="goBack"></image>

		<!-- 收藏按钮 -->
		<image v-if="!isFavorite" src="../../static/assets/shouc.png" mode="widthFix" class="scimg"
			@click="toggleFavorite"></image>
		<image v-if="isFavorite" src="../../static/assets/shouc-on.png" mode="widthFix" class="scimg-on"
			@click="toggleFavorite"></image>

		<!-- 夜间模式按钮 -->
		<image v-if="!isNightMode" src="../../static/assets/taiyang.png" mode="widthFix" class="tyimg"
			@click="toggleNightMode"></image>
		<image v-if="isNightMode" src="../../static/assets/yueliang.png" mode="widthFix" class="ylimg"
			@click="toggleNightMode"></image>
	</view>
</template>

<script>
	import {
		fetchArticleDetails
	} from '../../api/index'; //获取文章详情的API
	import {
		host
	} from "../../api/index";

	export default {
		inheritAttrs: false, // 禁用自动继承
		props: {
			id: String // 明确声明 id 作为 prop
		},
		data() {
			return {
				article: null,
				jzimgUrl: `${host}/imgs/jz.gif`,
				fhimgUrl: `${host}/imgs/fh.png`,
				isNightMode: false, // 初始状态
				article: {
					title: '',
					image: '',
					content: ''
				},
				cleanedContent: '',
				isLoading: true,
				isFavorite: false,
				message: '' // 添加用于显示提示消息的数据属性
			};
		},
		
		 mounted() {
		    // 在页面加载完成后读取夜间模式状态
		    const nightMode = JSON.parse(localStorage.getItem('isNightMode'));
		    if (nightMode !== null) {
		      this.isNightMode = nightMode;
		    }
		  },
		
		created() {
			const {
				id
			} = this.$route.query;
			this.loadArticleDetails(id);
			this.checkIfFavorite(id); // 加载文章后检查收藏状态

		},
		methods: {
			onLoad(options) {
				const {
					id
				} = options; // 获取路由参数 id
				this.loadArticleDetails(id);
			},
			// 检查该文章是否被收藏
			checkIfFavorite(id) {
				const favoriteArticles = JSON.parse(localStorage.getItem('favoriteArticles') || '[]');
				this.isFavorite = favoriteArticles.includes(id); // 判断是否已收藏
			},
		

			// 加载文章详情
			async loadArticleDetails(id) {
				
				try {
					this.isLoading = true;
					const response = await fetchArticleDetails(id);
					const article = response.story;
					this.article = {
						title: article.title,
						image: article.images ? article.images[0] : '',
						content: article.body
					};
					 // 打印未清理的文章内容
					// console.log("未清理的文章内容:", this.article.content);
					this.cleanArticleContent();
					
				} catch (error) {
					console.error("获取文章详情失败:", error);
				} finally {
					this.isLoading = false;
				}
			},
			
			// 清理文章内容
			cleanArticleContent() {
				let content = this.article.content;
				content = content.replace(/查看知乎原文/g, "")
					.replace(/知乎日报/g, "")
					.replace(/查看知乎讨论/g, "")
					.replace(/<img[^>]+src="([^">]+)"[^>]*>/g, (match, url) => `<img src="${url}" />`)
					.replace(/<\/?[^>]+(>|$)/g, "")
					.replace(/<script.*?>.*?<\/script>/gi, "");
				const paragraphs = content.split(/\n+/).map(para => `<p>${para.trim()}</p>`).join("");
				this.cleanedContent = paragraphs;
			},
			// 返回上一页
			goBack() {
				this.$router.back();
			},
			
			toggleFavorite() {
				this.isFavorite = !this.isFavorite;
				// 将收藏状态存储到本地
				const favoriteArticles = JSON.parse(localStorage.getItem('favoriteArticles') || '[]');
				const articleId = this.$route.query.id;

				if (this.isFavorite) {
					favoriteArticles.push(articleId); // 添加到收藏列表
					this.message = '收藏成功！'; // 设置成功提示
				} else {
					const index = favoriteArticles.indexOf(articleId);
					if (index > -1) {
						favoriteArticles.splice(index, 1); // 移除收藏
							this.message = '已取消文章收藏！'; // 设置取消提示
					}
				}
				localStorage.setItem('favoriteArticles', JSON.stringify(favoriteArticles));
				
				
				// 显示提示并在3秒后清除
				setTimeout(() => {
					this.message = ''; // 3秒后清除提示信息
				}, 3000);
				
			},

			checkIfFavorite(id) {
				const favoriteArticles = JSON.parse(localStorage.getItem('favoriteArticles') || '[]');
				this.isFavorite = favoriteArticles.includes(id); // 判断是否已收藏
			},
			// 切换夜间模式并持久化状态
			toggleNightMode() {
				this.isNightMode = !this.isNightMode;
				// 将夜间模式状态存储到 localStorage
				localStorage.setItem('isNightMode', JSON.stringify(this.isNightMode));
			}
		}
	};
</script>

<style lang="scss">
	.details {
		padding: 20rpx;
		max-height: 1250rpx;
		overflow-y: auto;
		padding-bottom: 120rpx;
		background-color: #ffffff;
		/* 默认背景色 */
		color: #333333;
		/* 默认文字颜色 */
		transition: background-color 0.3s, color 0.3s;
	}

	.details-title {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.details-image {
		width: 100%;
		height: auto;
		max-width: 100%;
		margin-bottom: 20rpx;
	}

	.details-content {
		margin-top: 20rpx;
		font-size: 26rpx;
		line-height: 1.8;
		text-indent: 2em;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.details::-webkit-scrollbar {
		display: none;
	}

	/* 夜间模式样式 */
	.night-mode {
		background-color: #1a1a1a;
		/* 夜间模式背景色 */
		color: #ffffff;
		/* 夜间模式文字颜色 */
	}

	.bottom-tab {
		width: 100%;
		height: 100rpx;

		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #ffffff;
	}

	.night-mode .bottom-tab {
		background-color: #333333;
		/* 夜间模式底部栏背景色 */
	}

	.fhimg,
	.scimg,
	.scimg-on,
	.tyimg,
	.ylimg {
		width: 50rpx;
		height: 50rpx;
	}
	
	/* 收藏提示样式 */
		.favorite-message {
			position: fixed;
			top: 20rpx;
			left: 50%;
			transform: translateX(-50%);
			background-color: #333333;
			color: white;
			padding: 10rpx 20rpx;
			border-radius: 8rpx;
			font-size: 24rpx;
			opacity: 0.9;
			z-index: 1000;
		}
	
</style>