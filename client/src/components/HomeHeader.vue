<template>
  <el-header class="home-header">
    <el-row class="menu-list" type="flex" align="middle" justify="center">
      <el-col
          v-for="(item, index) in meunList"
          :key="index"
          :span="4"
          :class="['menu-item',{active: curPath===item.path}]"
          @click="switchView(item.path)"
      >
        {{ item.name }}
      </el-col>

      <el-button
          type="text"
          class="site-config-btn"
          @click="isShowSiteConfigDialog=true"
      >
        <i class="icon iconfont icon-blog-shezhi"></i>
        站点设置
      </el-button>
    </el-row>
  </el-header>


  <el-dialog title="站点设置" v-model="isShowSiteConfigDialog" width="25%">
    <el-form>
      <el-form-item label="主题色: ">
        <el-color-picker
            v-model="curColor"
            show-alpha
            :predefine="predefineColors"
            @change="switchColor"
        ></el-color-picker>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="cancleConfigSite">取 消</el-button>
      <el-button type="primary" @click="confirmConfigSite">确 定</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, computed} from 'vue'
import {useStore} from "vuex";
import {IGlobalState} from '@/store';
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'home-header',

  setup() {
    const router = useRouter()
    const store = useStore<IGlobalState>();
    const state = reactive({
      // 主题色
      theme: computed({
        get: () => store.state.app.theme,
        set: (value) => {
          store.commit('app/SET_THEME', value)
        }
      }),
      // 主题色临时变量
      curColor: store.state.app.theme,
      // 预定义颜色
      predefineColors: [
        '#fd032f',
        '#14d6dc',
        '#ff921c',
        '#4a94ff',
        '#1abc9c',
        '#945afe',
        '#0caac1'
      ],
      // 菜单
      meunList: [
        {
          name: '首页',
          path: '/home'
        },
        {
          name: '聊天室',
          path: '/chat'
        }
      ],
      // 当前页面path路径
      curPath: computed(() => router.currentRoute.value.path),
      // 是否展示站点设置弹窗
      isShowSiteConfigDialog: false
    })

    /**
     * @name: 颜色切换
     * @param theme 当前颜色,为null时表示清空
     */
    const switchColor = (theme: string | null) => {
      if (theme === null) {
        state.curColor = '#fd032f'
      } else {
        state.curColor = theme
      }
    }
    /**
     * @name: 页面切换
     * @param path 页面path路径
     */
    const switchView = (path: string) => {
      router.replace({
        path
      })
    }
    /**
     * @name: 确认站点设置
     */
    const confirmConfigSite = ()=>{
      state.theme = state.curColor
      state.isShowSiteConfigDialog = false
    }
    /**
     * @name: 取消站点设置
     */
    const cancleConfigSite = ()=>{
      state.curColor = state.theme
      state.isShowSiteConfigDialog = false
    }

    return {
      ...toRefs(state),
      switchColor,
      switchView,
      confirmConfigSite,
      cancleConfigSite
    }
  }
})
</script>

<style lang="scss">
$theme_color: var(--theme);

@mixin theme_background_color() {
  background-color: $theme_color;
}

.home-header {
  @include theme_background_color();

  .menu-list {
    position: relative;
    width: 100%;
    height: 100%;

    .menu-item {
      color: #fff;
      height: 100%;
      line-height: 60px;
      cursor: pointer;
      position: relative;
      &.active {
        font-weight: bold;
        &:after{
          position: absolute;
          display: block;
          content: '';
          width: 60%;
          left: 20%;
          height: 4px;
          border-radius: 15px;
          bottom: 2px;
          background: #fff;
        }
      }
    }
  }

  .site-config-btn {
    position: absolute;
    right: 0;
    color: #fff;
    &:hover,&:focus{
      color: #fff;
    }
  }
}
</style>
