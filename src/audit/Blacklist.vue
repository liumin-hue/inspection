<template>
    <div class="black_list">
        <div class="black_select" style="position: fixed; top: 0px">
        <mt-header title="黑名单"></mt-header>
        <div class="searchselect">
            <div class="searchdiv">
                <select class="select" v-model="SourcePath">
                <option v-bind:value="option.id" v-for="option in SourcePathSelect">{{option.val}}</option>
                </select>
                <input type="search" class="search" v-model="searchIf">
                <i class="mintui mintui-search" @click="auditPlan"></i>
            </div>
        </div>
        </div>
        <div style="height: 100px"></div>
        <ul class="datas">
            <router-link to="/InspectionDetail">
                <li v-for="(item,index) in datas" :key="index" class="bolt_argument" @click="auditDetail(index)">
                    <div class="people_name"><span class="status">地址：</span>{{item.Address}}</div>
                    <div class="people_name"><span class="status">姓名：</span>{{item.CusName}}</div>
                    <div class="model_bottom">
                        <div class="name"><span class="nametext"><span class="texttitle">黑名单性质：</span>{{item.strBlackType}}</span>
                        </div>
                        <div class="phone"><span class="texttitle">操作人：</span>{{userName}}</div>
                    </div>
                    <div class="people_name"><span class="status">黑名单备注：</span>{{item.Remark}}</div>
                </li>
            </router-link>
        </ul>
        <!--  底部tab      -->
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
    import $ from 'jquery'

    export default {
        data() {
            return {
                userName:'',//操作人 首页获取
                SourcePathSelect: [
                    { "id": "1", "val": "客户名称" },
                    { "id": "2", "val": "地址" }
                ],//代收渠道
                SourcePath:"1",//代收渠道默认选中值
                replyFinishList: false,
                planName:'',
                finishText: "",
                searchIf:'',      //搜索条件
                searchadd:'',
                current: 0,
                select: '',
                datas: [],
                currentYear:'',
                cusID:'',
                communityID:'',
                IsProblem:'',
            }
        },
        mounted() {
            console.log(this.$store.state.loginInfo)
            this.userName = this.$store.state.loginInfo.UserName
            this.finishText = this.$store.state.finishText
            //稽查计划列表，小区列表
            this.auditPlan()
        },
        methods: {
            backset() {
                this.$router.push('/setting/changeInfo')
            },
            backhome() {
                this.$router.push('/home')
            },
            auditPlan(){
                if(this.SourcePath==1){
                    this.planName=this.searchIf
                    this.searchadd=''
                }
                else if (this.SourcePath==2){
                    this.planName=''
                    this.searchadd=this.searchIf
                }
                this.$http
                    .get(this.$myConfig.host + '/Api/InspectionApp/GetAppBlackList',{
                        params:{
                            CusName:this.planName,
                            Address:this.searchadd ,
                        },
                    })
                    .then(res=> {
                        console.log('sousuo')
                        console.log(res.body.Data)
                        console.log(this.planName)
                        console.log(this.searchadd)
                        console.log(this.SourcePath)
                        this.datas = res.body.Data

                    })
            },
            auditDetail(index){
                this.$store.state.reLiDetail = this.datas[index]
                console.log(this.$store.state.blackDetail)
            },
            searchBtn(){
                this.auditPlan()
            }
        }
    }
</script>
<style scoped>
    .black_list{
        font-size: 13px;

    }
    .mintui-search{
        padding: 7px 11px 0px 0px;
    }
    .select option{
        border: none;
        height: 35px;
        line-height: 35px;
    }
    .datas{
        margin-bottom: 50px;
    }
</style>