<template>
  <view class="top-tab">
    <view class="return">
      <!-- 返回按钮 -->
      <image :src="fhimgUrl" mode="widthFix" class="fhimg" @click="goBack"></image>
    </view>
    <view class="Article-Collection">
      <h3>收藏的文章</h3>
    </view>
  </view>

  <!-- 收藏的文章列表 -->
  <view class="Article-List" v-for="item in favoriteArticles" :key="item.id" @click="viewArticle(item.id)">
    <view class="article-item">
      <image :src="item.image" mode="widthFix" class="article-image" />
      <view class="article-info">
        <text class="article-title">{{ item.title }}</text>
        <text class="article-summary">{{ item.summary }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { host } from "../../api/index";
import { fetchArticleDetails } from '../../api/index';

export default {
  name: "FavoriteList",
  data() {
    return {
      fhimgUrl: `${host}/imgs/fh.png`,
      favoriteArticles: []
    };
  },
  created() {
    this.loadFavoriteArticles();
	  // 监听收藏变化，实时更新收藏列表
	  window.addEventListener('storage', this.handleFavoriteChange);
	
  },
  beforeDestroy() {
      window.removeEventListener('storage', this.handleFavoriteChange);
  },
  methods: {
     handleFavoriteChange() {
            this.loadFavoriteArticles();
        },
        async loadFavoriteArticles() {
            const favoriteIds = JSON.parse(localStorage.getItem('favoriteArticles') || '[]');
            // 加载每个收藏的文章详情
            for (const id of favoriteIds) {
                const article = await fetchArticleDetails(id);
                this.favoriteArticles.push({
                    id: id,
                    title: article.story.title,
                    image: article.story.images ? article.story.images[0] : '',
                });
            }
        },
    goBack() {
      uni.navigateBack();  // 使用 uni.navigateBack() 返回
    },
    viewArticle(id) {
       uni.navigateTo({
          url: `/pages/details/details?id=${id}&key=${Date.now()}`
        });
    },
  }
};
</script>

<style lang="scss">
.top-tab {
  display: flex;
}

.return {
  width: 20%;
  height: 80rpx;
  line-height: 80rpx;
  padding-left: 10rpx;
  margin: 20rpx 0;

  .fhimg {
    width: 50rpx;
    height: 50rpx;
  }
}

.Article-Collection {
  width: 80%;
  height: 80rpx;
  line-height: 100rpx;
  text-align: center;
  margin-right: 100rpx;
}

.Article-List {
  margin: 10rpx auto;
  width: 90%;
  border: 2rpx solid #ccc;
  border-radius: 20rpx;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #ffffff;
  margin-bottom: 15rpx;
}

.article-item {
  display: flex;
  padding: 20rpx;
  align-items: center;
}

.article-image {
  width: 100rpx;
  height: 100rpx;
  object-fit: cover;
  margin-right: 20rpx;
}

.article-info {
  flex: 1;
}

.article-title {
  font-size: 28rpx;
  font-weight: bold;
}

.article-summary {
  font-size: 24rpx;
  color: #888;
  margin-top: 10rpx;
  line-height: 1.5;
}
</style>
