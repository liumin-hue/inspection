
<template>
    <div class="pending">
        <div class="titlehead">
            <mt-header title="待处理"></mt-header>
            <div>
                <!--            第一个点击   点击计划-->
                <ul class="pending_plan">
                    <li v-for="(item,index) in planlist">
                        <button @click="changecolor(index)" :class="{liBackground:planButton == index}">
                            <div>{{item.PlanName }}</div>
                        </button>
                    </li>
                </ul>
            </div>

            <div class="pending_auditnews">
                <ul>
                    <li class="audit_argument">
                        <div class="model_bottom">
                            <div class="name"><span><span class="status">开始日期：</span>{{this.datas.InspectionStartDate}}</span>
                            </div>
                            <div class="phone"><span class="status">结束日期：</span>{{this.datas.InspectionEndDate}}</div>
                        </div>
                        <div class="model_bottom">
                            <div class="phone"><span class="status">稽查进度：</span>{{this.datas.InspectionNum}}</div>
                            <div class="phone"><span class="status">未稽查：</span>{{this.datas.UnInspectionNum}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div style="height: 183px;width: 100%;"></div>
        <div class="plan_content">
            <div class="plan_list">
                <ul>
                    <!--                    第二次点击   点击小区 出现户-->
                    <li v-for="(item,index) in communityList" class="pendinglist">
                        <div @click="CommunityList(index)" :class="{planlistBackground:planlistButton == index}">
                            <div class="pending_listname">
                                {{item.CommunityName }}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="eachplan_content">
                <ul>
                    <li v-for="(item,index) in familyList" class="content_list" @click="House(index)">
                        <router-link to="/inspection">
                            <div class="address">
                                <div class="status">地址：</div>
                                <div>{{item.Address}}</div>
                            </div>
                            <div class="name_icon">
                                <div class="cusname"><span class="status">姓名：</span>{{item.CusName}}</div>

                                <div class="icon_status">
                                    <div v-if="item.HeatStatus==0" class="status_icon status_zc">{{item.HeatStatusMeaning}}</div>
                                    <div v-if="item.HeatStatus==1" class="status_icon status_bt">{{item.HeatStatusMeaning}}</div>
                                    <div v-if="item.HeatStatus==2" class="status_icon status_qt">{{item.HeatStatusMeaning}}</div>
                                    <div v-if="item.HeatStatus==3" class="status_icon status_wg">{{item.HeatStatusMeaning}}</div>
                                    <div v-if="item.IsArrears ==1" class="status_icon status_q1">欠</div>
                                    <div v-if="item.IsArrears ==0" class="status_icon status_q2">欠</div>
                                    <div v-if="item.IsCheckBlack==1" class="status_icon status_h">{{item.IsCheckBlackMeaning}}</div>
                                    <!--                            <div v-if="item.IsCheckBlack==0" class="status_icon status_h">{{item.IsCheckBlackMeaning}}</div>-->
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <!--        底部tab-->
        <mt-tabbar v-model="selected" style="position: fixed;bottom: 0">
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
                        <img slot="icon" src="../../static/images/audit/record/set.png">
                        设置
                    </mt-tab-item>
                </router-link>
            </div>
        </mt-tabbar>
    </div>
</template>
<script>
    import {Toast} from 'mint-ui'
    export default {
        data() {
            return {
                datas: [],           //每个计划的详细信息
                planButton: 0,      //初始选中index=0的稽查计划 被选择计划的index，来改变被选计划的背景颜色
                planlistButton: 0, //小区列表index 被选择小区的index，来改变被选小区的背景颜色
                planlist: [],    //稽查计划列表
                communityList: [], //稽查计划里面的每个小区列表
                familyList: [],    //稽查计划里面的小区里面对应的每户列表
                houseList: [],  //每个室信息
                // 正常 强停  报停 未供
            }
        },
        activated() {
            // this.communityList[this.planlistButton].CommunityID
        },
        mounted() {
            //稽查计划列表，小区列表
            this.$http
                .get(this.$myConfig.host + '/Api/InspectionApp/GetInpectionPlans', {
                    params: {
                        status: 1,
                        chargeYear: this.$store.state.CurrentYear,
                    }
                })
                .then(res => {
                    res.body.Data.forEach(function (item) {
                        item.InspectionStartDate = item.InspectionStartDate.substr(0, 10)
                        item.InspectionEndDate = item.InspectionEndDate.substr(0, 10)
                    })
                    this.planlist = res.body.Data
                    //稽查计划  小区列表
                    this.changecolor(0)
                    this.datas = this.planlist[0]   //初始话  计划名 和开始日期
                    // return this.planlist
                })
            console.log(this.planlist)
            // if (this.planlist==''){
            //     Toast('没有待处理工单')
            // }
            this.$store.state.datas = this.datas
        },
        methods: {
            //第一个点击 计划
            changecolor(index) {
                this.planButton = index;
                this.datas = this.planlist[index]
                // console.log(this.datas)          //稽查计划的信息 点击第几个的
                this.communityList = this.planlist[index].InspectionCommunitys //小区列表
                this.$store.state.communityID = this.communityList[0].CommunityID
                this.$store.state.inspectionID = this.communityList[0].InspectionID
                this.CommunityList(0)
                this.Familyform(index)
                // console.log(this.communityList)  //小区列表信息
            },
            //小区列表
            CommunityList(index) {
                this.planlistButton = index;
                this.$store.state.communityID = this.communityList[index].CommunityID
                this.$store.state.inspectionID = this.communityList[index].InspectionID
                this.Familyform(index)
            },
            //户列表
            Familyform(index) {
                this.$http
                    .get(this.$myConfig.host + '/Api/InspectionApp/GetSendJob', {
                        params: {
                            status: 1,
                            chargeYear: '2019-2020',
                            InspectionID: this.$store.state.inspectionID,
                            CommunityID: this.$store.state.communityID,
                            page: 1,
                            pageSize: 10
                        }
                    })
                    .then(res => {
                        var _this = this
                        this.familyList = res.body.Data
                        // console.log(this.familyList)
                        this.$store.state.familyList = this.familyList
                    })
            },
            //每户详情
            House(index) {
                this.houseList = this.familyList[index]

                this.$store.state.houseList = this.houseList
                console.log('houseList')
                console.log(this.houseList)
            }
        }
    }
</script>
<style scoped>

    .pending {
        height: 100%;
        background-color: #fff;
        color: #595959;
    }

    .titlehead {
        position: fixed;
        width: 100%;
        z-index: 1000;
    }

    .pending_plan {
        width: 100%;
        white-space: nowrap;
        overflow: auto;
        margin-bottom: 0;
        background-color: #FFF;

    }

    .pending_plan > li {
        /*width: 26%;*/
        font-size: 15px;
        padding: 10px;
        display: inline-block;
        text-align: center;

    }

    .pending_plan > li > button {
        padding: 8px 14px;
        box-shadow: 0 2px 4px 0 rgba(44, 44, 44, 0.50);
    }

    .liBackground {
        color: #fff;
        background: #45AFFF;
        border: none;
        box-shadow: 0 2px 4px 0 rgba(8, 57, 147, 0.50);
    }

    .planlistBackground {
        background-color: #fff;
    }

    .pendinglist {
        font-size: 10px;
        color: #727272;
        background-color: #F0F0F0;
        text-align: left;

    }

    .pending_listname {
        padding: 10px;
        font-size: 14px;
    }

    .plan_content {
        display: flex;
        flex-wrap: nowrap;
        background-color: #fff;
    }

    .eachplan_content {
        width: 77.8%;
        font-size: 14px;
        color: #333333;
    }

    .plan_list {
        width: 22.2%;
    }

    .audit_argument {
        margin: 0;
    }
    /*标签*/
    .status_icon{
        height:0.25rem;
        line-height:0.25rem;
        text-align:center;
        border-radius:0.04rem;
        color:#fff;
        display:inline-block
    }
    .status_qt{
        width:0.4rem;
        background:#FF6060;
    }
    .status_bt{
        width:0.4rem;
        background:#FFCC01;
    }
    .status_h{
        width:0.2rem;
        background:#676767;
    }
    .status_q1{
        width:0.2rem;
        background:#ccc;
    }
    .status_q2{
        width:0.2rem;
        background:#FA6400;
    }
    .status_wg{
        width:0.4rem;
        background:#ccc;
    }
    .status_zc{
        width:0.4rem;
        background:#2FB91E;
    }
    .name_icon{
        display: flex;
        font-size:12px ;
        /*flex-wrap: wrap;*/
        justify-content: space-between;
        /*position: absolute;*/
    }
    .cusname{
        display: inline-block;
    }
    .icon_status{
        /*align-self: flex-end;*/
        /*width:50%;*/
        display: inline-block;
        position: relative;
        float: right;
        /*right: 0;*/
    }
</style>