import { createStore } from 'vuex';
import app from './modules/app';

export interface IGlobalState{
  app: any;
}
const store = createStore<IGlobalState>({
  actions: {
  },
  modules: {
    app
  }
});
export default store;