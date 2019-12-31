
import _404 from '@/views/404'

const routes = [
  {
    path: '/votes',
    name: 'votes',
    component: () => import('@/views/Votes'),
    meta: {
      title: '所有投票',
      isAuth: false
    }
  },
  {
    path: '/votes/:id',
    name: 'vote',
    component: () => import('@/views/Vote'),
    meta: {
      title: '投票',
      isAuth: false
    }
  },
  {
    path: '/topics',
    name: 'topics',
    component: () => import('@/views/Topics'),
    meta: {
      title: '所有专题',
      isAuth: false
    }
  },
  {
    path: '/topics/:id',
    name: 'topic',
    component: () => import('@/views/Topic'),
    meta: {
      title: '专题',
      isAuth: false
    }
  },
  {
    path: '/gallery',
    name: 'gallerys',
    component: () => import('@/views/Gallerys'),
    meta: {
      title: '所有图集',
      isAuth: false
    }
  },
  {
    path: '/gallery/:id',
    name: 'gallery',
    component: () => import('@/views/Gallery'),
    meta: {
      title: '图集',
      isAuth: false
    }
  },
  {
    path: '/gallery/:id/comment',
    name: 'gallerycomment',
    component: () => import('@/views/GalleryComment'),
    meta: {
      title: '图集',
      isAuth: false
    }
  },
  {
    path: '*',
    name: '404',
    component: _404
  }
]

export default routes
