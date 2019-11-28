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
                    <mt-tab-item id="首页">s
                        <img slot="icon" src="../../static/images/audit/record/home.png">
                        首页
                    </mt-tab-item>
                </router-link>
            </div>
            <div class="foo">
                <router-link to="/audit/changeInfo">
                    <mt-tab-item id="设置">
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
                versions: false,
                oldVersions: "1.1.0"
            };
        },

        mounted(){
            // 保存手机版本号
            var _this = this
            _this.$store.state.versions = this.oldVersions
            console.log(_this.$store.state.versions)
            // 挂载首页时查看新工单
            // try {
            //     var MyWorkOrderTime = plus.storage.getItem("gdky_myWorkOrderTime");
            //     var WorkOrderPoolTime = plus.storage.getItem("gdky_workOrderPoolTime");
            // } catch (e) {
            //     var MyWorkOrderTime = "";
            //     var WorkOrderPoolTime = "";
            // }
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
                        // }
                    })
                    .catch(() => {
                        console.log("取消");
                    });
            },
        }
    }
</script>
<style scoped>
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
        color: #f44336;
    }
.quit{
    background-color: #F5F5F5;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
}
</style>