<template>
  <view class="list" v-for="(item, index) in articles" :key="item.id">
    <view class="tit" @click="navigateToDetails(item.id)">
      <view class="list-box-left">
        <view class="title">{{ item.title }}</view>
        <view class="author-time">
          <!-- 提取并显示作者 -->
          <text class="author">作者: {{ getAuthor(item.hint) }}</text>
         
        </view>
      </view>
      <view class="list-box-right">
        <image class="image-list" :src="item.image" mode="aspectFill" />
      </view>
    </view>
  </view>
  <button @click="fetchMoreStories" class="load-more-btn">查看更多</button>
</template>



<script>
import { fetchLatestStories, fetchSectionStories } from '../../api/index';

export default {
  name: "WangList",
  emits: ['update-images'],
  data() {
    return {
      articles: [],
      page: 1
    };
  },
  created() {
    this.loadLatestStories();
  },
  methods: {
    async loadLatestStories() {
      try {
        const response = await fetchLatestStories();
        console.log("最新文章列表返回数据:", response);
        const stories = response.stories.map(story => ({
          id: story.id,
          title: story.title,
          image: story.images ? story.images[0] : '',
          hint: story.hint || '未知',
        
        }));
        this.articles = stories;
        this.$emit('update-images', stories);
      } catch (error) {
        console.error("数据获取失败:", error);
      }
    },

    async fetchMoreStories() {
      try {
        this.page += 1;
        const response = await fetchSectionStories(this.page);
        console.log("加载更多文章列表返回数据:", response);
        const newArticles = response.stories.map(story => ({
          id: story.id,
          title: story.title,
          image: story.images ? story.images[0] : '',
          hint: story.hint || '未知',
         
        }));
        this.articles = [...this.articles, ...newArticles];
      } catch (error) {
        console.error("加载更多数据失败:", error);
      }
    },

    navigateToDetails(id) {
      uni.navigateTo({
        url: `/pages/details/details?id=${id}`
      });
    },

    getAuthor(hint) {
      // 如果 hint 存在并且包含 "·"，则返回 "·" 前面的部分作为作者
      return hint && hint.split(' · ')[0] || '未知作者';
    },

    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>


<style lang="scss">
  .list {
    width: 100%;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1rpx solid #ccc;
    
    .tit {
      display: flex;
      width: 100%;
      padding: 15rpx;
      align-items: center;
      justify-content: space-between;
    }

    .list-box-left {
      flex: 1;
      padding-right: 10rpx;
      
      .title {
        font-size: 28rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
      }

      .author-time {
      
        font-size: 24rpx;
        color: #666;
       
      }

      .author {
        font-size: 24rpx;
      }

      .time {
        font-size: 22rpx;
        color: #999;
      }
    }

    .list-box-right {
      width: 120rpx;
      height: 120rpx;
      overflow: hidden;
      
      .image-list {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .load-more-btn {
    width: 100%;
    padding: 10rpx;
    background-color: #f0f0f0;
    text-align: center;
    border: none;
    color: #007aff;
    font-size: 26rpx;
    border-radius: 5rpx;
  }

  .load-more-btn:hover {
    background-color: #e0e0e0;
  }

  ::-webkit-scrollbar {
    display: none;
  }
</style>
