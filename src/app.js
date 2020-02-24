import Vue from 'vue'
import Vuex from 'vuex'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import app from './app.vue'
import $ from 'jquery'
import Viewer from 'v-viewer'

//引入我们自己的插件
import MyPluginAddConfig from './myPlugin';
//引入vue图片预览插件
import VuePreview from 'vue-preview';
//路由插件
import VueRouter from 'vue-router';
//引入vue-resource插件
import VueResource from 'vue-resource';

//==============================================引入mui中的css
import '../static/render/css/mui.css';

//==============================================引入自己的css
import '../static/css/global.css';

import 'viewerjs/dist/viewer.css'
//Audit项目
import Host from './audit/host.vue'
import login from './audit/login.vue'//登录页
import home from './audit/home.vue'//首页
import AuditRecord from './audit/AuditRecord.vue'//稽查记录
import Blacklist from './audit/Blacklist.vue'//黑名单
import PendingAudit from './audit/PendingAudit.vue'//待稽查
import PendingDeal from './audit/PendingDeal.vue'//待处理
import InspectionDetail from './audit/InspectionDetail.vue'//稽查记录详情
import Inspection from './audit/Inspection.vue'//稽查
import dealAudit from './audit/dealAudit.vue'//稽查
import ChangePassword from './audit/changePassword.vue'//修改密码页面
import Versions from './audit/versions.vue'//版本升级页面

//===============================================生命组件
// import ScrollTop from './component/scrollTop.vue'//添加返回顶部组件
// import Spinner from './component/spinner.vue'


//安装插件
//Vue.use(Viewer) 默认配置写法
Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 9999
    }
})
Vue.use(MintUI);
Vue.use(Vuex);
//安装预览插件
Vue.use(VuePreview);
Vue.use(VueRouter)
Vue.use(VueResource); //此时有this.$http
//安装我们自己的插件挂载config属性
Vue.use(MyPluginAddConfig);
//============================================路由====================================>
var router = new VueRouter({
    //默认使用hash模式
    //mode: 'history',
    scrollBehavior(to, from, savePosition) {
        if (savePosition) {
            console.log(savePosition)
            return savePosition
        } else {
            // if (from.meta.keepAlive) {
            //     from.meta.savedPosition = document.body.scrollTop
            // }
            // return { x: 0, y: to.meta.savedPosition || 0 }
            return { x: 1, y: 30 }
        }
    },
    routes: [
        { path: "/host", component: Host, meta: { keepAlive: true } },
        { path: '/', redirect: "/login", meta: { keepAlive: false } },
        { path: "/login", component: login, meta: { keepAlive: false } },
        // { path: "/home", component: home, meta: { keepAlive: false } },
        { path: "/home",name:'home', component: home, meta: { keepAlive: false } },
        { path: "/AuditRecord", component: AuditRecord },
        { path: "/Blacklist", component: Blacklist },
        { path: "/PendingAudit",name:'PendingAudit', component: PendingAudit,meta: { keepAlive: true }},
        { path: "/PendingDeal", name:'PendingDeal', component: PendingDeal, meta: { keepAlive: true } },
        { path: "/InspectionDetail", component: InspectionDetail },
        { path: "/inspection",name:'inspection', component: Inspection },
        { path: "/dealAudit",name:'dealAudit', component: dealAudit, meta: { keepAlive: false } },
        { path: "/audit/changePassword", component: ChangePassword, meta: { keepAlive: false } },
        { path: "/audit/versions", component: Versions, meta: { keepAlive: false } }
    ]
})
// router.addRoutes()

router.afterEach((to, from) => {
    console.log(from);
    if (from.name == 'home' && to.name == 'PendingAudit') {
        let isRefresh = sessionStorage.getItem('isRefresh');
        console.log(isRefresh)
        if (isRefresh === '0') {
            sessionStorage.setItem('isRefresh', null);
            // window.location.reload()
            vm.$router.push('/PendingAudit')
        } else {
            sessionStorage.setItem('isRefresh', 0);
        }
    } else if (to.name == 'home' && from.name == 'PendingAudit') {
        sessionStorage.setItem('isRefresh', 0)
    } else if (from.name == 'home' && to.name == 'PendingDeal') {
        let isRefreshd = sessionStorage.getItem('isRefreshd');
        console.log(isRefreshd)
        if (isRefreshd === '0') {
            sessionStorage.setItem('isRefreshd', null);
            // window.location.replace('/#PendingAudit')
            // vm.$router.go(0)
        } else {
            sessionStorage.setItem('isRefreshd', 0);
        }
    } else if (to.name == 'home' && from.name == 'PendingDeal') {
        sessionStorage.setItem('isRefreshd', 0)
    }
})
// var vm=this
//===================================Vuex管理=====================================>
var store = new Vuex.Store({
    state: {

        UserInfo: {},//登陆用户信息
        Permisions: [],//用户权限
        assign: false,//工单分派权限
        sideBarOpened: false,
        saveWorkBill: "",
        // ========================判断手机平台
        isIOS: false,
        //=========================工单节点操作
        operateType: false,//工单操作状态
        workBillIndex: null,//选中工单号
        AddTime: "",//保存受理时间
        wordOrderReplyResult: null,//工单回复中的处理结果
        valueLength: 0,
        ReplyResultDelete:false,
        //=========================新工单信息
        HouseAddress: "",//客户地址
        toAcceptNew: 0,//待接收
        workOrderPoolNew: 0,//工单池
        //=========================小区位置
        community: false,
        position: false,
        lng: "",
        lat: "",
        // ========================保存版本号
        newVersions: "",
        versions: "",
        versionAddress:"",//安卓下载地址apk
        //=========================放置公用状态
        count: 1,
        isNewWorkOrder: false,
        isChecked: false,
        //判断是否在登录页面跳转
        isLogin: false,
        //判断工单详情页页面跳转来源
        isMyWorkOrder: "community",


//===================================================================Audit
        //---------------------------首页信息home  userName、版本号、、、
        loginInfo:'',
        finishText:'',
        token:'',       //后端判断的值
        //==========================待稽查页面  PendingAudit
        communityID:'',    // PendingAudit 待稽查页面 小区ID
        inspectionID:'',  // PendingAudit 待稽查页面 稽查ID
        familyList:[],    //小区的列表
        houseList:[],     //房室信息
        datas:[],         //每个计划的
        // ChargeYear:'',
        CurrentYear:'',//稽查年限
        //=========================稽查页面 Inspection 表单页面
        btnState:'',   //问题类型/处理状态  值
        question: '无问题',
        blacker:'',
        Address:'',
        questionList:[],

        //======================InspectionDetail
        cusID:'',
        currentYear:'',
        reLiDetail:'',  //稽查记录详情
        // =====================黑名单
        isRemoveID:''//移除权限
    },
    getters: {
        changeState: state => {
            //相当于vue实例中的methods,用于处理公用data
            //自vuex 面向组件的数据处理
        },
        count(state) {
            return state.count += 100
        }
    },
    mutations: {
        //写法与getters相类似
        //组件想要对于vuex 中的数据进行的处理
        //组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
        //内部操作必须在此刻完成(同步)
        add(state) {
            state.count += 1;
            console.log(state.count)
        },
        reduce(state) {
            state.count -= 1;
            console.log(state.count)
        },
        //接收到新工单
        acceptNewWorkOrder(state) {
            state.isNewWorkOrder = true
        },
        //新工单已查看
        checked(state) {
            state.isChecked = true
        }
    },
    actions: {
        //使得mutations能够实现异步调用，实现例如延迟调用
        increment({ commit }, payload) {
            commit('突变方法名')
            //payload应该是一个对象，可通过模板方法调用传入对象的方式将数据从组件传入vuex
        },
        asyncIncrement({ commit }) {
            setTimeout(() => {
                commit('increment')
            }, 1000)
        }
    },
    modules: {
        //引入某一个state的以上集合的模块，会自动分别填充到上面，使得结构更加清晰
    }
});

//用拦截器将token设置headers请求头中
Vue.http.interceptors.push((request, next) => {
    //请求发送前的处理逻辑
    request.headers.set('auth',store.token)
    next((response) => {
        //请求发送后的处理逻辑
        //根据请求的状态，response参数返回给successCallback或errorCallback
        return response
    })
})

//=====================================添加组件=====================================>
// Vue.component("my-scrollTop", ScrollTop)
// Vue.component("my-spinner", Spinner)

new Vue({
    el: "#app",
    router,//使用路由
    store,//使用stroe
    render: c => c(app),
})

// 自定义指令
import { Toast } from "mint-ui";
Vue.directive('lfcous', function (el, pra, a) {
    if ($(".mint-field-core").eq(-1).val()) {
        let valueLength = $(".mint-field-core").eq(-1).val().length
        if (valueLength >= 100) {
            try {
                plus.nativeUI.toast("输入字数不得超过100字");
            } catch (e) {
                Toast("输入字数不得超过100字")
            }
        }
        a.context.$store.ReplyResultDelete = true
        a.context.valueLength = valueLength
    } else {
            a.context.valueLength = 0
    }
    if(a.context.$store.wordOrderReplyResult){
        if(!a.context.$store.ReplyResultDelete){
            $(".mint-field-core").eq(-1).val(a.context.$store.wordOrderReplyResult)
        }
    }

})

