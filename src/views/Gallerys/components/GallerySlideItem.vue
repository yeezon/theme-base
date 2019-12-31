<template>
  <div class="gallery-slide-item">
    <div class="gallery-pc" style="height: 510px">
      <swiper :options="swiperOptionTop" class="gallery-top" ref="swiperTop" @someSwiperEvent="callback">
        <swiper-slide
          v-for="(item, index) in newImages"
          :key="index"
          :style="{backgroundImage:`url(${item.src}`}"
          @click.native="fnLink"
        ></swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-next swiper-button-white" slot="button-next">
          <svg-icon name="imagesposts-next"></svg-icon>
        </div>
        <div class="swiper-button-prev swiper-button-white" slot="button-prev">
          <svg-icon name="imagesposts-prev"></svg-icon>
        </div>
      </swiper>
      <swiper :options="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs">
        <swiper-slide
          v-for="(item, index) in newImages"
          :key="index"
          :style="{backgroundImage:`url(${item.src}`}"
        ></swiper-slide>
      </swiper>
    </div>
    <div class="gallery-mob">
      <swiper :options="swiperOptionMOb">
        <swiper-slide
          class="swiper-mob-slide"
          v-for="(item, index) in newImages"
          :key="index"
          :style="{backgroundImage:`url(${item.src})`}"
          >
          <!-- <img :src="item.src" :alt="item.alt" class="swiper-circle-mob"> -->
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  props: {
    images: {
      type: Array,
      default: () => []
    },
    cover: {
      type: Object,
      default: () => {}
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    const self = this
    return {
      swiperOptionTop: {
        spaceBetween: 10,
        loop: true,
        loopedSlides: 2, // looped slides should be the same
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        on: {
          slideChange () {
            self.activeIndex = (self.swiper || {}).activeIndex
            self.$emit('active-index', self.activeIndex)
          }
        }
      },
      swiperOptionThumbs: {
        spaceBetween: 10,
        slidesPerView: 4,
        centeredSlides: true,
        touchRatio: 0.2,
        loop: true,
        loopedSlides: 2, // looped slides should be the same
        slideToClickedSlide: true
      },
      swiperOptionMOb: {
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        }
      },
      newImages: [],
      activeIndex: 0
    }
  },
  created () {
    this.initImages()
  },
  mounted () {
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.swiper
      const swiperThumbs = this.$refs.swiperThumbs.swiper
      swiperTop.controller.control = swiperThumbs
      swiperThumbs.controller.control = swiperTop
    })
  },
  computed: {
    swiper () {
      return this.$refs.swiperTop.swiper
    }
  },
  methods: {
    initImages () {
      this.images.forEach(item => {
        if (item.id === this.cover.id) {
          this.newImages.unshift(item)
        } else {
          this.newImages.push(item)
        }
      })
    },
    fnLink () {
      this.$router.push(`/gallery/${this.id}`)
    },
    callback () {
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style scoped>
.gallery-slide-item{
  cursor: pointer;
}
.gallery-mob{
  display: none;
}
.swiper-slide {
  background-size: cover;
  background-position: center;
  border-radius: 4px;
}
.gallery-top {
  height: 72.5%!important;
  width: 100%;
  background: #fff;
}
.gallery-thumbs {
  height: 27.5%!important;
  box-sizing: border-box;
  padding: 14px 0 22px;
}
.gallery-thumbs .swiper-slide {
  width: 25%;
  height: 100%;
  opacity: 0.4;
}
.gallery-thumbs .swiper-slide-active {
  opacity: 1;
}
.swiper-button-next.swiper-button-white,
.swiper-button-prev.swiper-button-white
{
  background-image: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, .8);
  text-align: center;
  line-height: 40px;
  transition: all .5s ease;
}
.swiper-button-next.swiper-button-white{
  transform: translateX(50px)
}
.swiper-button-prev.swiper-button-white{
  transform: translateX(-50px)
}
.swiper-container:hover .swiper-button-next.swiper-button-white{
  transform: translateX(0)
}
.swiper-container:hover .swiper-button-prev.swiper-button-white{
  transform: translateX(0)
}
.swiper-mob-slide{
  height: 0;
  padding-bottom: 51.9%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
@media screen and (max-width:768px){
  .gallery-pc{
    display: none;
  }
  .gallery-mob{
    display: block;
  }
  .swiper-circle-mob{
    display: block;
    width: 100%;
  }
  .gallery-mob /deep/ .swiper-pagination-fraction{
    width: auto;
    right: 20px;
    left: auto;
    color: #fff;
    border-radius: 10px;
    padding: 0 10px;
    font-size: 11px;
    line-height: 20px;
    background:  rgba(0, 0, 0, .5);
  }
}
</style>
