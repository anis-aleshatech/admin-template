import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'admin.home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Home',
        authAdminOnly: true,
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/second-page',
      name: 'second-page',
      component: () => import('@/views/SecondPage.vue'),
      meta: {
        pageTitle: 'Second Page',
        authAdminOnly: true,
        breadcrumb: [
          {
            text: 'Second Page',
            active: true,
          },
        ],
      },
    },
    {
      path: '/admin/login',
      name: 'admin.login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
        guestAdminOnly: true
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})



function isLoggedIn() {
  return localStorage.getItem("token");
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authAdminOnly)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (!isLoggedIn()) {
          next({
            name: 'admin.login',
              query: { redirect: to.fullPath }
          });
      } else {
          next();
      }
  } else if (to.matched.some(record => record.meta.guestAdminOnly)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (isLoggedIn()) {
          next({
            name: 'admin.home',
              // query: { redirect: to.fullPath }
          });
      } else {
          next();
      }
  } else {
      next(); // make sure to always call next()!
  }
});

export default router
