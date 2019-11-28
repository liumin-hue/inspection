<template>
    <div id="big-box" style="height: 100%;">
        <mt-header fixed title="稽查记录详情">
            <span slot="left" @click="goback()">
                <mt-button icon="back"></mt-button>
            </span>
            <span slot="right" @click="tel()" v-if="ContactPhone == ''?false:true">
                <mt-button class="tel_btn" ></mt-button>
            </span>
        </mt-header>
        <div class="workOrder_box">
            <!-- 工单内容 -->
            <div class="workOrder">
                <div class="mui-table-view-cell">
                    <div>稽查计划：</div>
                    <span>{{InspectionPlan}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>地址：</div>
                    <span>{{CusAddress}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>姓名：</div>
                    <span>{{CusName}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>稽查时间：</div>
                    <span>{{OperationTime}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>是否有问题：</div>
                    <span>{{IsProblemMeaning}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>处理状态：</div>
                    <span v-if="ProStatus==0">{{strProStatus}}</span><!-- 无问题 -->
                    <span v-if="ProStatus==1" style="color:green">{{strProStatus}}</span><!-- 已处理 -->
                    <span v-if="ProStatus==2" style="color:red">{{strProStatus}}</span><!-- 未处理 -->
                    <span v-if="ProStatus==3" style="color:blue">{{strProStatus}}</span><!-- 待处理 -->
                </div>
                <div class="mui-table-view-cell">
                    <div>详情：</div>
                    <span>{{ProblemDes}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>图片：</div>
                    <span>
                        <!-- {{$data.ImgList}} -->
                        <div >
                            <viewer v-for="item in ImagList" style="margin: 0;padding: 0;">
                                <img style="width: 15vw;height: 15vw;" :src="item">
                            </viewer>
                        </div>
                    </span>
                </div>
                <div class="mui-table-view-cell">
                    <div>处理意见：</div>
                    <span>{{SuggestDes}}</span>
                </div>
            </div>
        </div>
        
        <my-spinner :showSpinner="isLoading"></my-spinner>
    </div>
</template>
<script>
    //引入mint-ui插件
    import {MessageBox, Popup, Toast, Picker} from "mint-ui";
    export default {
        data() {
            return {
                InspectionPlan:"",//稽查计划
                CusName:"",//姓名
                CusAddress:"",//地址
                ContactPhone:"",//电话
                OperationTime:"",//稽查时间
                IsProblemMeaning:"",//是否有问题
                ProStatus:"",//处理状态
                ProblemDes:"",//详情
                ImagList:[],//图片
                SuggestDes:"",//处理意见
                strProStatus:'',
            };
        },
        mounted() {
            //从上页获取
            var _this = this
            console.log(_this.$store.state.reLiDetail)
            this.CusAddress = _this.$store.state.reLiDetail.Address;//地址
            this.InspectionPlan = _this.$store.state.reLiDetail.PlanName;//稽查计划
            this.ContactPhone = _this.$store.state.reLiDetail.Mobile;//电话  从上一页传过来的
            _this.CusName = _this.$store.state.reLiDetail.CusName;//姓名 从上一页传过来的
            this.OperationTime = _this.$store.state.reLiDetail.OperationTime;//稽查时间  从上一页传过来的
            this.IsProblemMeaning = _this.$store.state.reLiDetail.IsProblem;//是否有问题  从上一页传过来的
            this.strProStatus = _this.$store.state.reLiDetail.strProStatus;//处理状态  从上一页传过来的
            this.ProStatus = _this.$store.state.reLiDetail.ProStatus;//处理状态  从上一页传过来的  判断处理状态值 来 添加class颜色
            this.ProblemDes = _this.$store.state.reLiDetail.ProStatus;//详情  从上一页传过来的
            this.ImgList = _this.$store.state.reLiDetail.ProStatus;//详情  从上一页传过来的
            this.SuggestDes = _this.$store.state.reLiDetail.ProStatus;//处理意见  从上一页传过来的

            //获取稽查记录详情
            this.$http
                .get(this.$myConfig.host + "/Api/InspectionApp/GetInspectionRecDetail", {
                    params: {
                        ID: this.$store.state.reLiDetail.InspectionRecID
                    }
                })
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        //判断登录信息
                        if (resInfo.IsSuccess) {
                            // _this.CusName = resInfo.Data.CusName//姓名
                            _this.OperationTime = resInfo.Data.OperationTime.replace("T"," ").substring(0,19)//稽查时间
                            _this.IsProblemMeaning = resInfo.Data.IsProblemMeaning//是否有问题
                            _this.ProStatusMeaning = resInfo.Data.ProStatusMeaning//处理状态
                            _this.ProblemDes = resInfo.Data.ProblemDes//详情
                            _this.SuggestDes = resInfo.Data.SuggestDes//处理意见
                            var ImgList = []
                            var ImgList = resInfo.Data.ImgList//图片
                            console.log(ImgList)
                             ImgList.forEach(function (item) {
                                var imgItem = [_this.$myConfig.host +"/image/" + item]
                                 console.log('imgitm长度')
                                 console.log(imgItem.length)
                                 console.log(imgItem)
                                 if(imgItem.length<1){
                                     _this.ImagList=''
                                 }else if(imgItem.length==1){
                                     _this.ImagList=imgItem
                                 }
                                return imgItem
                            })
                            console.log(_this.ImagList)
                        } else {
                            Toast(resInfo.Message);
                        }
                        this.isLoading = false;
                        console.log(res)
                    },
                    function (err) {
                        Toast("请检查您的网络");
                        this.isLoading = false;
                    }
                );
        },
        methods: {
            //回退
            goback() {
                this.$store.wordOrderReplyResult = "";
                this.$router.go(-1);
            },
            //拨打电话
            tel() {
                plus.device.dial(this.ContactPhone, true);
            },
        }
    };
</script>
<style scoped>
    #big-box {
        padding-top: 0;
    }
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.1rem 0.15rem;
    }

    .mainShowAnnex {
        margin: 0.05rem 0 0.5rem 0;
        background-color: #fff;
    }

    .showAnnex {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .showAnnex div {
        margin-left: 1.5vw;
        margin-bottom: 0.1rem;
    }

    .btn_box {
        padding: 0.1rem 0 0.1rem 0.1rem;
        position: fixed;
        bottom: 0;
        width: 100%;
        background-color: #fff;
    }

    /* popup样式 */
    .moreHandle.mint-popup {
        position: fixed;
        background: #fff;
        left: auto;
        top: 0.5rem;
        right: 0.1rem;
        transform: translate3d(0%, 0%, 0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        transition: 0.2s ease-out;
        width: 0.86rem;
        background-color: #49a9ea;
        color: #fff;
        font-size: 0.12rem;
        border-radius: 0.04rem;
    }

    .moreHandle.mint-popup .mui-table-view-cell {
        padding: 0.05rem 0.15rem;
    }

    /* 工单详情-标题 */
    .workOrderTitle {
        height: 0.45rem;
        padding: 0.1rem 0.15rem;
        position: fixed;
        width: 100%;
        z-index: 9;
        background-color: #efeff4;
    }

    .workOrderTitle > span {
        float: left;
        margin-right: 0.2rem;
        display: block;
        height: 0.2rem;
        line-height: 0.3rem;
    }

    .workOrderTitle > .mint-button {
        float: right;
        height: 0.24rem;
        font-size: 0.14rem;
        padding: 0.04rem 0.12rem;
        border-radius: 0.15rem;
    }

    /* 工单内容 */
    .workOrder_box {
        height: 100%;
        padding-top: 0.45rem;
    }

    .workOrder {
        background-color: #fff;
        /*padding-bottom: 0.5rem;*/
    }

    .workOrder > div {
        line-height: 0.25rem;
        padding: 0.1rem 0.15rem;
        margin: 0;
    }

    .workOrder > div > div {
        text-align: left;
        width: 25%;
        float: left;
        font-size: 0.14rem;
        color: #232323;
    }

    .workOrder > div > span {
        max-width: 70%;
        float: left;
        font-size: 0.14rem;
        color: #595959;
    }

    /* 工单处理按钮 */
    .mint-tabbar {
        position: fixed;
        padding: 0.05rem 0;
        background-color: #26a2ff;
    }

    .mint-button {
        height: 0.4rem;
        border-radius: 0;
    }

    .workOrder_grap {
        border-right: 0.015rem solid #fefefe;
    }

    .workOrder_assign {
        border-left: 0.015rem solid #fefefe;
    }

    /* 媒体查询 */
    /* 图标样式 */
    @media only screen and (max-device-width: 413px) {
        /*iPhone 6 Portrait*/
        /* 图片删除按钮 */
        .tel_btn {
            background: url("../../static/images/audit/record/tel.png") no-repeat center right;
        }
    }

    @media only screen and (min-device-width: 414px) {
        /*iPhone 6+ Portrait*/
        /* 电话按钮 */
        .tel_btn {
            background: url("../../static/images/audit/record/tel@1.5x.png") no-repeat center right;
        }
    }

    /* 电话按钮图标 */
    .tel_btn {
        display: block;
        float: right;
        width: 0.2rem;
        height: 0.2rem;
        background-size: 0.2rem;
        margin-left: 0.1rem;
    }

    /* 处理意见按钮 */
    .workOrder_save {
        border-left: 0.01rem solid #fefefe;
    }

    .workOrder_cancel {
        border-right: 0.01rem solid #fefefe;
    }

    /* 字数展示 */
    .valueLength {
        text-align: right;
    }

</style>
