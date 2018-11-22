import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Card from '@/components/Card'
import Aging from '@/components/Aging'
import Pay from '@/components/Pay'
import Driving from '@/components/Driving'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Card',
      name: 'Card',
      component: Card
    },
    {
      path: '/Aging',
      name: 'Aging',
      component: Aging
    },
    {
      path: '/Pay',
      name: 'Pay',
      component: Pay
    },
    {
      path: '/Driving',
      name: 'Driving',
      component: Driving
    }
  ]
})
