import { navbar } from "vuepress-theme-hope";

export default navbar([
    "/",
    {
      text: "Java",
      icon: "creative",
      prefix: "/java/",
      children: [
        
        {
          text: "Java基础",
          link: "base/Java-basis-oop"
        },
        {
          text: "Java IO",
          link: "io/java-io-overview"
        },
        {
          text: "Java集合",
          link: "collection/java-collection-overview"
        },
        {
          text: "Java并发",
          link: "thread/java-thread-x-theorty"
        },
       
        {
          text: "Java8",
          link: "java8/java8-lambda"
        },
        {
          text: "JVM",
          link: "jvm/jvm-overview"
        },
      ]
    },
    {
        text: "前端",
        icon: "creative",
        prefix: "/frontend/",
        children:[
          {
            text: "状态管理",
            icon: "creative",
            prefix: "state/",
            children: [
              {
                text: "pinia",
                icon: "creative",
                link: "pinia/01.pinia"
              },
              {
                text: "vuex",
                icon: "creative",
                link: "vuex/vuex-overview"
              }
            ]
          },
          {
            text: "构建工具",
            icon: "creative",
            children:[
              {
                text: "构建工具-vite",
                icon: "creative",
                link: "vite/01.vite"
              }
            ]
            
          }, 
          {
            text: "vue",
            icon: "creative",
            children: [
              {
                text: "vue2",
                icon: "creative",
                link: "frontend-vue2/vue-axios"
              },
              {
                text: "vue3",
                icon: "creative",
                link: "frontend-vue3/01.vue-echarts"
              }
            ]
            
          }         
        ]
      },
])