import ImageView from './ImageView/index.vue'
import SkuView from './XtxSku/index.vue'

export const componentPlugins = {
  install(app) {
    app.component('XtxImageView', ImageView)
    app.component('XtxSkuView', SkuView)
  }
}