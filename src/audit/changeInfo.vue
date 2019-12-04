<template>
    <div class="kaishuan">
        <mt-header title="设置">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
        <mt-cell title="密码修改" to="/audit/changePassword" is-link>
            <img slot="icon" src="../../static/images/audit/record/password.png" class="img_bolt">
        </mt-cell>


        <mt-cell style="padding-right:0.2rem" v-show="!versions" title="系统升级" >
            <span class="system_text">当前版本{{oldVersions}}</span>
            <img slot="icon" src="../../static/images/audit/record/updata.png" class="img_bolt">
        </mt-cell>
        <mt-cell style="padding-right:0.2rem" v-show="versions" to="/audit/versions" title="系统升级">
            <span class="system_newtext">发现新版本</span>
            <img slot="icon" src="../../static/images/audit/record/updata.png" class="img_bolt">
        </mt-cell>
            <mt-button to="/login" size="large" class="quit" @click="quit">安全退出</mt-button>

        <mt-tabbar v-model="selected" style="position: fixed;bottom:-1px">
            <div class="foo">
                <router-link to="/home">
                    <mt-tab-item id="首页">
                        <img slot="icon" src="../../static/images/audit/record/home.png">
                        首页
                    </mt-tab-item>
                </router-link>
            </div>
            <div class="foo">
                <router-link to="/audit/changeInfo">
                    <mt-tab-item id="设置">
                        <span class="tip" v-show="versions?true:false"></span>
                        <img slot="icon" src="../../static/images/audit/record/set.png">
                        设置
                    </mt-tab-item>
                </router-link>
            </div>
        </mt-tabbar>
    </div>
</template>
<script>
    import {MessageBox, Tabbar, TabItem, Toast, Badge} from "mint-ui";
    // import $ from 'jQuery'
    export default {
        data() {
            return {
                versions:"",//是否需要升级，需要升级则显示红点
                oldVersions: "3.0.1",//旧版本号
                tab_selected: "首页",
            };
        },
        mounted(){
            // 保存手机版本号
            var _this = this
            this.getHomeData()//获取新版本号
        },
        methods:{
            back(){
                this.$router.go(-1)
            },
            quit() {
                MessageBox.confirm("是否退出当前登录")
                    .then(action => {
                        // try {
                        //     // console.log(plus);
                        //     let UserID = this.$store.UserInfo.UserID + "";
                        //     //注销请求ajax
                        //     this.$http
                        //         .post(
                        //             this.$myConfig.host + "/api/UserLogin/RemoveMobileUserLogin",
                        //             {
                        //                 "": UserID
                        //             },
                        //             {emulateJSON: true}
                        //         )
                        //         .then(
                        //             function (res) {
                        //                 var resInfo = $.parseJSON(res.bodyText);
                        //                 //判断登录信息
                        //                 if (resInfo.ReturnResult) {
                        //                     //清空用户数据
                        //                     plus.storage.removeItem("gdky_myWorkOrderTime");
                        //                     plus.storage.removeItem("gdky_workOrderPoolTime");
                        //                     //提示信息
                        //                     Toast("用户注销成功");
                        //                     //跳转登录页面
                        //                     this.$router.push({path: "/auditlogin"});
                        //                 } else {
                        //                     Toast(resInfo.Message);
                        //                 }
                        //             },
                        //             function (err) {
                        //                 Toast("请检查您的网络");
                        //             }
                        //         );
                        // } catch (e) {
                        //     //提示信息
                        //     Toast("用户注销成功");
                        //     //跳转登录页面
                            this.$router.push({path: "/login"});
                        //}
                    })
                    .catch(() => {
                        console.log("取消");
                    });
            },
            getHomeData(){
                var _this = this;

                //获取首页数据统计
                this.$http
                    .get(this.$myConfig.host + "/Api/InspectionApp/GetFirstPageData")
                    .then(
                        function (res) {
                            let resInfo = $.parseJSON(res.bodyText);
                            if (resInfo.IsSuccess) {
                                var Version=resInfo.Data.Version
                                var oldVersions=_this.$store.versions
                                console.log(oldVersions)

                                // 判断版本号，新老版本号比较
                                if (Version.split('.').join('') > oldVersions.split('.').join('')) {
                                    _this.versions = true
                                    _this.$store.newVersions = Version
                                } else {
                                    _this.versions = false
                                }
                            
                            } else {
                                Toast(resInfo.Message);
                            }
                        },
                        function (err) {
                            Toast("请检查您的网络");
                        }
                    );

            }
        }
    }
</script>
<style scoped>
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
.img_bolt{
    border-image:none;
    width:18px;
    height: 18px;
    margin-right: 0.05rem;
}
.system_text {
    color: #49A9EA;
}
.system_newtext {
    background: #f44336;
    color: #fff;
    padding: 0.05rem 0.08rem 0.02rem;
    border-radius: 0.07rem;
}
.quit{
    background-color: #F5F5F5;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
}
</style>