<template>
    <div id="big-box">
        <mt-header fixed :title="tab_selected"></mt-header>
        <!-- 首页主体框架 -->
        <div class="page-wrap">
            <!-- tabcontainer -->
            <mt-tab-container class="page-tabbar-container" v-model="tab_selected">
                <!-- 首页 -->
                <mt-tab-container-item id="首页">
                    <div id="content" class="mui-content">

                        <!-- 内面内容 -->
                        <div id="siderbar">
                            <div class="mui-table-view mui-grid-view welcome_text">
                                <span class="welcome_icon"></span>{{UserName}}，您好：
                                当前年度共有稽查计划 <span class="blue">{{InspectionPlanNum}}</span> 个<br>
                                当前共有稽查单 <span class="red">{{InspectionNum}}</span> 个　　当前已完成稽查单 <span class="green">{{InspectionCompleteNum}}</span> 个
                            </div>
                            
                            <router-link to="/PendingAudit">
                                <div class="home_btn home_btn_bg1">
                                    <span class="home_btn_bg_text">待稽查</span>
                                    <span class="home_btn_bg_num">{{WaitInspectionNum}}</span>
                                    <span class="home_btn_bg_unit">户</span>
                                </div>
                            </router-link>

                            <router-link to="/PendingDeal">
                                <div class="home_btn home_btn_bg2">
                                    <span class="home_btn_bg_text">待处理</span>
                                    <span class="home_btn_bg_num">{{WaitProcessedNum}}</span>
                                    <span class="home_btn_bg_unit">户</span>
                                </div>
                            </router-link>

                            <router-link to="/auditRecord">
                                <div class="home_btn home_btn_bg3">
                                    <span class="home_btn_bg_text2">稽查记录</span>
                                    <span class="home_btn_bg_num">{{InspectionRecNum}}</span>
                                    <span class="home_btn_bg_unit">户</span>
                                </div>
                            </router-link>

                            <router-link to="/Blacklist">
                                <div class="home_btn home_btn_bg4">
                                    <span class="home_btn_bg_text">黑名单</span>
                                    <span class="home_btn_bg_num">{{BlackListNum}}</span>
                                    <span class="home_btn_bg_unit">户</span>
                                </div>
                            </router-link>

                            <!-- <ul class="mui-table-view mui-grid-view mui-grid-9">
                                <li class="mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3">
                                    <router-link to="/myWorkOrder">
                                     
                                        <div class="mui-media-body">我的工单</div>
                                    </router-link>
                                </li>
                                <li class="mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3">
                                    <router-link to="/myWorkOrder/teamOrder">
                                  
                                        <div class="mui-media-body">维修队工单</div>
                                    </router-link>
                                </li>
                                <li class="mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3">
                                    <router-link to="/myWorkOrder/toAccept">
                                        <mt-badge size="small" type="error" v-show="toAccept == 0 ? false : true">
                                            {{toAccept}}
                                        </mt-badge>
                                        <span class="mui-icon accepted_icon"></span>
                                        <div class="mui-media-body">待接收</div>
                                    </router-link>
                                </li>
                                <li class="mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3">
                                    <router-link to="/myWorkOrder/workOrderPond">
                                        <mt-badge size="small" type="error"
                                                  v-show="workOrderPoolNew == 0 ? false : true">{{workOrderPoolNew}}
                                        </mt-badge>
                                        <span class="mui-icon workOrderPond_icon"></span>
                                        <div class="mui-media-body">工单池</div>
                                    </router-link>
                                </li>
                            </ul> -->
                        </div>
                    </div>
                </mt-tab-container-item>
            
                <!-- 设置 -->
                <mt-tab-container-item id="设置">
                    <div id="setting_info">
                        <!-- <mt-cell class="mui-table-view-cell setting_follow setting_icon" to="/myFollow/myFollow"
                                 title="我的关注"><span class="right-icon"></span></mt-cell>
                        <mt-cell class="mui-table-view-cell setting_changeInfo setting_icon" to="/setting/changeInfo"
                                 title="修改信息"><span class="right-icon"></span></mt-cell> -->
                        <mt-cell class="mui-table-view-cell setting_changePassage setting_icon"
                                 to="/audit/changePassword" title="密码修改"><span class="right-icon"></span></mt-cell>
                        <mt-cell style="padding-right:0.2rem" v-show="!versions"
                                 class="mui-table-view-cell setting_vision setting_icon" title="系统升级"
                                 :value="'当前版本：' + oldVersions"></mt-cell>
                        <mt-cell style="padding-right:0.2rem" v-show="versions" to="/audit/versions"
                                 class="mui-table-view-cell setting_vision setting_icon versions" title="系统升级"
                                 value="发现新版本"></mt-cell>
                        <!-- 退出按钮 -->
                        <mt-button class="workOrder_handle" type="default" size="large" @click="quit()">安全退出</mt-button>
                    </div>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <!-- 底部tab切换 -->
        <mt-tabbar style="position: fixed;bottom: 0" v-model="tab_selected">
            <mt-tab-item id="首页" :class="tab_selected == '设置' ? 'choosed' : ''">
                <div :class="tab_selected == '首页' ? 'choosed' : ''">
                    <span class="home_icon icons"></span>
                    <mt-badge size="small" type="error" v-show="toAccept + workOrderPoolNew == 0 ? false : true">
                        {{toAccept + workOrderPoolNew}}
                    </mt-badge>
                </div>
                首页
            </mt-tab-item>
            <mt-tab-item id="设置" :class="tab_selected == '设置' ? 'choosed' : ''">
                <div :class="tab_selected == '设置' ? 'choosed' : ''">
                    <span class="setting_icon icons"></span>
                    <span class="tip" v-show="versions?true:false"></span>
                </div>
                设置
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>
    //引入mint-ui插件
    import {MessageBox, Tabbar, TabItem, Toast, Badge} from "mint-ui";

    //声明图片支持webpack打包
    // const img1 = require("../../static/images/客服移动端切图/GIS/Group 5 Copy 4.png");
    // const img2 = require("../../static/images/客服移动端切图/GIS/人员 copy 3.png");
    // const img_box = [img1, img2];

    var source = "";

    export default {
        data() {
            return {
                UserName:"",//顶部问候语中的用户名
                InspectionPlanNum:"",
                InspectionNum:"",
                InspectionCompleteNum:"",
                WaitInspectionNum:"",
                WaitProcessedNum:"",
                InspectionRecNum:"",
                BlackListNum:"",

                tab_selected: "首页",
                toAccept: 0,
                workOrderPoolNew: 0,
                isLoading: false,
                versions: false,
                oldVersions: "1.0.0"
            };
        },
        props: {},
        watch: {
            tab_selected: function (val, oldVal) {
                // console.log(val);
                // if (val === "GIS") {
                //     this.isLoading = true;
                //     let _this = this;
                //     setTimeout(function () {
                //         _this.isLoading = false;
                //     }, 1000);
                //     this.loadmap(); //加载地图和相关组件
                // }
            }
        },
        mounted() {
            var _this = this;

            //获取首页数据统计
            this.$http
                .get(this.$myConfig.host + "/Api/InspectionApp/GetFirstPageData")
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        this.$store.state.CurrentYear = resInfo.Data.CurrentYear
                        if (resInfo.IsSuccess) {
                            _this.UserName=resInfo.Data.UserName;
                            _this.InspectionPlanNum=resInfo.Data.InspectionPlanNum;
                            _this.InspectionNum=resInfo.Data.InspectionNum;
                            _this.InspectionCompleteNum=resInfo.Data.InspectionCompleteNum;
                            _this.WaitInspectionNum=resInfo.Data.WaitInspectionNum;
                            _this.WaitProcessedNum=resInfo.Data.WaitProcessedNum;
                            _this.InspectionRecNum=resInfo.Data.InspectionRecNum;
                            _this.BlackListNum=resInfo.Data.BlackListNum;
                           
                        } else {
                            Toast(resInfo.Message);
                        }
                        this.$store.state.loginInfo = resInfo.Data
                        console.log('home首页')
                        console.log(resInfo)
                        // console.log(_this.InspectionNum)
                        console.log(this.$store.state.loginInfo)
                    },
                    function (err) {
                        Toast("请检查您的网络");
                    }
                );

        },
        //判断跳转路径
        beforeRouteEnter: (to, from, next) => {
            //获取当前页面
            var thisPage = to.matched[0].instances.default;
            //根据跳转前路径清空新工单
            if (from.name == "ToAccept") {
                // console.log("from.name")
                thisPage.toAccept = 0;
                try {
                    plus.storage.setItem(
                        "gdky_myWorkOrderTime",
                        thisPage.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
                    ); //我的工单退出时间注册
                } catch (e) {
                }
            } else if (from.name == "WorkOrderPond") {
                thisPage.workOrderPoolNew = 0;
                try {
                    plus.storage.setItem(
                        "gdky_workOrderPoolTime",
                        thisPage.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
                    ); //工单池退出时间注册
                } catch (e) {
                }
            }
            source = from.name;
            // console.log(source);
            next();
        },
        activated() {
            var _this = this;

            // 保存手机版本号
            this.$store.versions = this.oldVersions;
            //获取手机cid
            try {
                var info = plus.push.getClientInfo();
                //计时器获取cid
                var timer = setInterval(function () {
                    if (info.clientid == "") {
                        info = plus.push.getClientInfo();
                        // console.log("获取cid失败");
                        return false;
                    } else {
                        plus.storage.setItem("gdkykf_clientid", info.clientid); //注册手机cid
                        //更新cid
                        _this.$http
                            .post(
                                _this.$myConfig.host +
                                "/api/UserLogin/PostUpdateClientIDByUserID",
                                {
                                    UserID: _this.$store.UserInfo.UserID,
                                    ClientID: info.clientid
                                },
                                {emulateJSON: true}
                            )
                            .then(
                                function (res) {
                                    let resInfo = $.parseJSON(res.bodyText);
                                    //判断登录信息
                                    if (resInfo.ReturnResult) {
                                        // Toast("获取cid成功");
                                        // console.log(info.clientid);
                                    } else {
                                        Toast(resInfo.Message);
                                    }
                                },
                                function (err) {
                                    Toast("请检查您的网络");
                                }
                            );
                        clearInterval(timer);
                        // console.log("获取cid成功");
                    }
                }, 50);
            } catch (e) {
            }
            // 挂载首页时查看新工单
            try {
                var MyWorkOrderTime = plus.storage.getItem("gdky_myWorkOrderTime");
                var WorkOrderPoolTime = plus.storage.getItem("gdky_workOrderPoolTime");
            } catch (e) {
                var MyWorkOrderTime = "";
                var WorkOrderPoolTime = "";
            }
            // 获取用户工单信息
            this.$http
                .get(this.$myConfig.host + "/api/UserLogin/GetMountPrepareConditions", {
                    params: {
                        UserID: this.$store.UserInfo.UserID,
                        MyWorkOrderTime: MyWorkOrderTime, // plus.storage.getItem(gdky_myWorkOrderTime)====>获取点击我的工单退出时间
                        WorkOrderPoolTime: WorkOrderPoolTime // plus.storage.getItem(gdky_workOrderPoolTime)====>获取点击我的工单退出时间
                    }
                })
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        // console.log(resInfo);
                        if (resInfo.ReturnResult) {
                            // console.log(resInfo.AppVersionName.split('.').join('') , resInfo.AppVersionName.split('.').join(''))
                            // 判断版本号
                            if (resInfo.AppVersionName.split('.').join('') > this.$store.versions.split('.').join('')) {
                                this.versions = true
                                this.$store.newVersions = resInfo.AppVersionName
                            } else {
                                this.versions = false
                            }
                            _this.$store.toAcceptNew = resInfo.WaitReceptionBillsCounts;
                            _this.$store.workOrderPoolNew = resInfo.WorkOrderPoolPrompCounts;
                            //新工单赋值
                            this.toAccept = this.$store.toAcceptNew;
                            this.workOrderPoolNew = this.$store.workOrderPoolNew;
                        } else {
                            Toast(resInfo.Message);
                        }
                    },
                    function (err) {
                        Toast("请检查您的网络");
                    }
                );
            // 判断路由跳转
            if (this.$store.isLogin) {
                //this.loadmap(); //加载地图和相关组件
                this.tab_selected = "首页";
                this.$store.isLogin = false;
            }
            // console.log(this.$store.state.isNewWorkOrder);

            //获取用户权限
            this.$http
                .get(this.$myConfig.host + "/api/UserLogin/GetPrepareConditions", {
                    params: {
                        UserID: this.$store.UserInfo.UserID
                    }
                })
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        //判断登录信息
                        if (resInfo.ReturnResult) {
                            // console.log(resInfo.Permisions);
                            for (let i = 0; i < resInfo.Permisions.length; i++) {
                                if (resInfo.Permisions[i] == "gdqrfp") {
                                    this.$store.assign = true;
                                    break;
                                } else {
                                    this.$store.assign = false;
                                    continue;
                                }
                            }
                            //保存用户权限
                            _this.$store.Permisions = resInfo.Permisions;
                        } else {
                            Toast(resInfo.Message);
                        }
                    },
                    function (err) {
                        Toast(resInfo.Message);
                    }
                );
        },
        deactivated() {
        },
        methods: {
            //退出按钮------------------------------------------修改不走接口，直接清除UseID，跳转到登录页 hjw
            quit() {
                MessageBox.confirm("是否退出当前登录")
                    .then(action => {
                        try {
                            // console.log(plus);
                            let UserID = this.$store.UserInfo.UserID + "";
                            //注销请求ajax
                            this.$http
                                .post(
                                    this.$myConfig.host + "/api/UserLogin/RemoveMobileUserLogin",
                                    {
                                        "": UserID
                                    },
                                    {emulateJSON: true}
                                )
                                .then(
                                    function (res) {
                                        var resInfo = $.parseJSON(res.bodyText);
                                        //判断登录信息
                                        if (resInfo.ReturnResult) {
                                            //清空用户数据
                                            plus.storage.removeItem("gdky_myWorkOrderTime");
                                            plus.storage.removeItem("gdky_workOrderPoolTime");
                                            //提示信息
                                            Toast("用户注销成功");
                                            //跳转登录页面
                                            this.$router.push({path: '/login'});
                                        } else {
                                            Toast(resInfo.Message);
                                        }
                                    },
                                    function (err) {
                                        Toast("请检查您的网络");
                                    }
                                );
                        } catch (e) {
                            //提示信息
                            Toast("用户注销成功");
                            //跳转登录页面
                            this.$router.push({path: "/"});
                        }
                    })
                    .catch(() => {
                        console.log("取消");
                    });
            },
            //格式化日期
            formatDate(date, format) {
                var paddNum = function (num) {
                    num += "";
                    return num.replace(/^(\d)$/, "0$1");
                };
                //指定格式字符
                var cfg = {
                    yyyy: date.getFullYear(), //年 : 4位
                    yy: date
                        .getFullYear()
                        .toString()
                        .substring(2), //年 : 2位
                    M: date.getMonth() + 1, //月 : 如果1位的时候不补0
                    MM: paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
                    d: date.getDate(), //日 : 如果1位的时候不补0
                    dd: paddNum(date.getDate()), //日 : 如果1位的时候补0
                    hh: date.getHours() < 10 ? "0" + date.getHours() : date.getHours(), //时
                    mm:
                        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(), //分
                    ss: date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds() //秒
                };
                format || (format = "yyyy-MM-dd hh:mm:ss");
                return format.replace(/([a-z])(\1)*/gi, function (m) {
                    return cfg[m];
                });
            }
        }
    };
</script>
<style scoped>
    #siderbar{
        background:#F9F9F9 !important
    }
    .welcome_text{
        margin-top:0.15rem;
        color:#333;
        font-size: 0.14rem;
        padding:0.09rem 0.15rem;
        line-height: 0.3rem;
        text-align: center
    }
    .blue{
        color:#45AFFF
    }
    .green{
        color:#6DD400
    }
    .red{
        color:#FA6400
    }
    .user_info {
        height: 1.5rem;
        background-color: #3562b3;
        padding: 0.2rem 0;
    }

    .user_info > div {
        float: left;
        height: 100%;
        color: #ffffff;
        text-align: center;
    }

    .user_image {
        padding: 0.1rem 0;
    }

    .sever_info {
        padding: 0.3rem 0;
    }

    .user_info > div > div.mui-icon {
        font-size: 0.6rem;
    }

    #content {
        color: #565656;
    }

    /* 媒体查询 */
    /* 图标样式 */
    @media only screen and (max-device-width: 413px) {
        /*iPhone 6 Portrait*/
        .welcome_icon{
            height:0.18rem;
            width:0.18rem;
            background: url("../../static/images/audit/record/cus.png") no-repeat center;
            display: inline-block;
            background-size: 0.18rem;
            margin-bottom:-0.025rem;
            margin-right:0.06rem
        }
        .home_btn{
            height:0.8rem;
            margin:0.1rem 0.2rem;
            line-height:0.8rem;
            color:#fff;
            font-size:0.15rem;
            padding-left:0.8rem
        }
        .home_btn_bg1{
            background: url("../../static/images/audit/record/bg_check.png") no-repeat center;
            background-size: 100% 100%;
        }
        .home_btn_bg2{
            background: url("../../static/images/audit/record/bg_manage.png") no-repeat center;
            background-size: 100% 100%;
        }
        .home_btn_bg3{
            background: url("../../static/images/audit/record/bg_record.png") no-repeat center;
            background-size: 100% 100%;
        }
        .home_btn_bg4{
            background: url("../../static/images/audit/record/bg_black.png") no-repeat center;
            background-size: 100% 100%;
        }
        .home_btn_bg_text{
            margin-right:0.6rem
        }
        .home_btn_bg_text2{
            margin-right:0.45rem
        }
        .home_btn_bg_num,.home_btn_bg_unit{
            font-size:0.19rem;
        }


        .home_icon {
            background: url("../../static/images/客服移动端切图/首页/Fill 1 Copy 3.png") no-repeat center;
        }

        .choosed > .home_icon {
            background: url("../../static/images/客服移动端切图/首页/Group 8 Copy.png") no-repeat center;
        }

        .statistic_icon {
            background: url("../../static/images/客服移动端切图/首页/Page 1.png") no-repeat center;
        }

        .choosed > .statistic_icon {
            background: url("../../static/images/客服移动端切图/首页/Page 1 Copy 3.png") no-repeat center;
        }

        .setting_icon {
            background: url("../../static/images/客服移动端切图/首页/设置 (2) copy.png") no-repeat center;
        }

        .choosed > .setting_icon {
            background: url("../../static/images/客服移动端切图/首页/设置 (3) copy.png") no-repeat center;
        }

        /* 九宫格图标样式 */
        /*.repairTeam_icon {*/
        /*    background: url("../../static/images/客服移动端切图/首页/维修队工单.png") no-repeat center;*/
        /*}*/

        /*.myWorkOrder_icon {*/
        /*    background: url("../../static/images/客服移动端切图/首页/Group 6.png") no-repeat center;*/
        /*}*/

        /*.accepted_icon {*/
        /*    background: url("../../static/images/客服移动端切图/首页/待接收.png") no-repeat center;*/
        /*}*/

        /*.workOrderPond_icon {*/
        /*    background: url("../../static/images/客服移动端切图/首页/工单池.png") no-repeat center;*/
        /*}*/

        /* 设置界面样式 */
        /*.setting_follow {*/
        /*    background: url("../../static/images/客服移动端切图/设置/appIcon_follow.png") no-repeat center;*/
        /*}*/

        .setting_changeInfo {
            background: url("../../static/images/audit/record/Page 1 Copy 2.png") no-repeat center;
        }

        .setting_changePassage {
            background: url("../../static/images/audit/record/password.png") no-repeat center;
        }

        .setting_vision {
            background: url("../../static/images/audit/record/updata.png") no-repeat center;
        }

        .right-icon {
            background: url("../../static/images/audit/record/right.png") no-repeat center;
        }
    }

    @media only screen and (min-device-width: 414px) {
        /*iPhone 6+ Portrait*/
        .welcome_icon{
            height:0.18rem;
            width:0.18rem;
            background: url("../../static/images/audit/record/cus@1.5x.png") no-repeat center;
            display: inline-block;
            background-size: 0.18rem;
            margin-bottom:-0.025rem;
            margin-right:0.06rem
        }

        .home_btn{
            height:0.8rem;
            margin:0.1rem 0.2rem;
            line-height:0.8rem;
            color:#fff;
            font-size:0.15rem;
            padding-left:0.8rem
        }
        .home_btn_bg1{
            background: url("../../static/images/audit/record/bg_check@1.5x.png") no-repeat center;
            background-size: 100% 100%;
        }
        .home_btn_bg2{
            background: url("../../static/images/audit/record/bg_manage@1.5x.png") no-repeat center;
            background-size: 100% 100%;
        }
        .home_btn_bg3{
            background: url("../../static/images/audit/record/bg_record@1.5x.png") no-repeat center;
            background-size: 100% 100%;
        }
        .home_btn_bg4{
            background: url("../../static/images/audit/record/bg_black@1.5x.png") no-repeat center;
            background-size: 100% 100%;
        }
        .home_btn_bg_text{
            margin-right:0.6rem
        }
        .home_btn_bg_text2{
            margin-right:0.45rem
        }
        .home_btn_bg_num,.home_btn_bg_unit{
            font-size:0.19rem;
        }




        .icons {
            margin-bottom: 0.05rem;
        }
        .home_icon {
            background: url("../../static/images/audit/record/Fill 1 Copy 3@1.5x.png") no-repeat center;
        }

        .choosed > .home_icon {
            background: url("../../static/images/客服移动端切图/首页/Group 8 Copy@1.5x.png") no-repeat center;
        }

        .statistic_icon {
            background: url("../../static/images/客服移动端切图/首页/Page 1@1.5x.png") no-repeat center;
        }

        .choosed > .statistic_icon {
            background: url("../../static/images/客服移动端切图/首页/Page 1 Copy 3@1.5x.png") no-repeat center;
        }
        .setting_icon {
            background: url("../../static/images/客服移动端切图/首页/设置 (2) copy@1.5x.png") no-repeat center;
        }

        .choosed > .setting_icon {
            background: url("../../static/images/客服移动端切图/首页/设置 (3) copy@1.5x.png") no-repeat center;
        }

        /* 九宫格图标样式 */
        .repairTeam_icon {
            background: url("../../static/images/客服移动端切图/首页/维修队工单@1.5x.png") no-repeat center;
        }

        .myWorkOrder_icon {
            background: url("../../static/images/客服移动端切图/首页/Group 6@1.5x.png") no-repeat center;
        }

        .accepted_icon {
            background: url("../../static/images/客服移动端切图/首页/待接收@1.5x.png") no-repeat center;
        }

        .workOrderPond_icon {
            background: url("../../static/images/客服移动端切图/首页/工单池@1.5x.png") no-repeat center;
        }

        /* 设置界面样式 */
        .setting_changeInfo {
            background: url("../../static/images/客服移动端切图/设置/Page 1 Copy 2@1.5x.png") no-repeat center;
        }

        .setting_changePassage {
            background: url("../../static/images/客服移动端切图/设置/密码 (4) copy@1.5x.png") no-repeat center;
        }

        .setting_vision {
            background: url("../../static/images/客服移动端切图/设置/升级 copy@1.5x.png") no-repeat center;
        }
        .right-icon {
            background: url("../../static/images/客服移动端切图/首页/right@1.5x.png") no-repeat center;
        }
    }

    /* 图标图片样式 */
    span.mui-icon {
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        background-size: 0.38rem;
    }

    .mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-body {
        font-size: 0.14rem;
    }

    .mui-grid-view.mui-grid-9 .mui-table-view-cell {
        padding: 0.05rem;
    }

    .choosed > .icons,
    .icons {
        display: inline-block;
        width: 0.2rem;
        height: 0.2rem;
        background-size: 0.18rem;
    }

    .mint-tab-item .is-selected {
        color: #49a9ea;
    }

    .mint-tab-item {
        color: #666;
    }

    /* 设置界面图标样式 */
    #statistics_info .mui-table-view-cell,
    #setting_info .mui-table-view-cell.setting_icon {
        background-size: 0.18rem;
        background-color: #fff;
        background-position: 0.15rem;
        padding-left: 0.45rem;
    }
    .right-icon {
        display: inline-block;
        width: 0.45rem;
        height: 0.16rem;
        background-size: 0.1rem;
    }

    /* 修改cell样式 */
    .mint-cell {
        height: 0.5rem;
    }

    /* 设置cell样式 */
    #statistics_info .mui-table-view-cell,
    #setting_info .mui-table-view-cell {
        padding: 0rem 0;
    }

    /* 退出按钮 */
    .mint-button--default {
        margin-top: 0.1rem;
        box-shadow: none;
        font-size: 0.14rem;
    }

    /* 新工单提示图标 */
    .mint-badge {
        position: absolute;
    }

    .mui-media {
        position: relative;
    }

    .mui-media .mint-badge {
        top: 0.5rem;
        right: 0rem;
        line-height: 0.14rem;
    }

    /* 版本提示图标 */
    .tip {
        background-color: #f44336;
        display: block;
        position: absolute;
        width: 0.1rem;
        height: 0.1rem;
        border-radius: 50%;
        top: 0.05rem;
        right: 0.2rem;
    }
    .page-wrap{
        height: 100%;
        background-color: #F9F9F9;
    }
    .mint-tabbar > .mint-tab-item.is-selected{
        background-color: #f9f9f9;
    }
    .home_btn_bg1{
        margin-top: 30px;
    }
    .mui-table-view{
        background-color: #f5f5f5!important;
        border:none!important;
    }

</style>
