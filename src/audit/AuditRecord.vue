<template>
    <div class="audit_record">
        <div class="black_select" style="position: fixed; top: 0px">
        <mt-header title="稽查记录">
            <mt-button icon="back" @click="back"></mt-button>
            <div slot="right" class="select">
                <details close>
                    <summary><img src="../../static/images/audit/record/select.png"></summary>
                    <div class="tongzhi">
                        <ul class="xiaoxi">
                            <li class="hao1" ><mt-button @click="hao1" v-model="value" value="">全部</mt-button></li>
                            <li class="hao2" ><mt-button @click="hao2" v-model="value" value="无" >无问题</mt-button></li>
                            <li class="hao3" ><mt-button @click.native="hao3" v-model="value" value="有">有问题</mt-button></li>
                        </ul>
                    </div>
                </details>
            </div>
        </mt-header>
        <div class="searchselect">
            <div class="searchdiv">
                <select class="select" v-model="SourcePath" @click="searchSelect" >
                    <option v-bind:value="option.id" v-for="option in SourcePathSelect" >{{option.val}}</option>
                </select>
                <input type="search" class="search" v-model="searchIf">
                <i class="mintui mintui-search" @click="auditPlan"></i>
            </div>
        </div>
        </div>
        <div style="height: 100px"></div>
        <ul class="datas">
            <router-link to="/InspectionDetail" >
                <li v-for="(item,index) in datas" :key="index"
                    class="bolt_argument" @click="recordDetail(index)">
                    <div class="plan">
                        <span class="Pname">稽查计划：</span><span>{{item.PlanName}}</span>
                    </div>
                    <div class="people_name"><span class="status">地址：</span>{{item.Address}}</div>
                    <div class="model_bottom">
                        <div class="name"><span class="nametext"><span
                                class="texttitle">姓名：</span>{{item.CusName}}</span></div>
                        <div class="phone"><span class="texttitle">稽查时间：</span>{{item.InspectionTime}}</div>
                    </div>
                    <div class="model_bottom">
                        <div class="name"><span class="nametext"><span class="texttitle">是否有问题：</span>{{item.strIsProblem}}</span>
                        </div>
                        <div class="phone"><span class="texttitle">处理状态：</span>{{item.strIsProblem}}</div>
                    </div>
                </li>
            </router-link>
        </ul>
        <!--  底部tab      -->
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
                replyFinishList: false,
                slots: [{values: ['全部', '无问题', '有问题']}],
                finishText: "",
                planlist: ["稽查计划", "地址"],  //map 数组datas 接收稽查计划名
                searchIf:'', //搜索条件
                searchques:'',
                noques:1,
                yesques:2,
                allques:'',
                planName:'',
                searchadd:'',
                value:'',
                current: 0,
                select: '',
                datas: [],
                currentYear:'',
                cusID:'',
                communityID:'',
                IsProblem:'',
                SourcePathSelect: [
                    { "id": "1", "val": "稽查计划" },
                    { "id": "2", "val": "地址" }
                ],//代收渠道
                SourcePath:"1",//代收渠道默认选中值

            }
        },
        mounted() {
            this.finishText = this.$store.state.finishText
                //稽查计划列表，小区列表
            this.searchSelect()
            this.auditPlan()

        },
        methods: {
            back(){
              this.$router.go(-1);
            },
            backset() {
                this.$router.push('/setting/changeInfo')
            },
            backhome() {
                this.$router.push('/home')
            },
            hao1() {
                $(".hao1").addClass("hao");
                $(".hao2").removeClass("hao");
                $(".hao3").removeClass("hao");
                this.searchSelect()
                this.searchques=this.allques
                this.auditPlan()

            },
            hao2() {
                $(".hao2").addClass("hao");
                $(".hao1").removeClass("hao");
                $(".hao3").removeClass("hao");
                this.searchques=this.yesques
                this.auditPlan()
            },
            hao3() {
                $(".hao3").addClass("hao");
                $(".hao1").removeClass("hao");
                $(".hao2").removeClass("hao");
                this.searchques=this.noques
                console.log(this.searchques)
                this.auditPlan()
            },
            searchSelect(){
                if(this.SourcePath==1){
                    this.planName=this.searchIf
                    this.searchadd=''
                    this.searchques=''
                }
                else if (this.SourcePath==2){
                    this.planName=''
                    this.searchadd=this.searchIf
                    this.searchques=''
                }
            },
            auditPlan(){
                this.$http
                    .get(this.$myConfig.host + '/Api/InspectionApp/GetAppInspectionRecList',{
                        params:{
                            CurrentYear:this.$store.state.CurrentYear,
                            CusID:'',
                            PlanName:this.planName,
                            CommunityName:this.searchadd ,
                            IsProblem:this.searchques,
                        },
                    })
                    .then(res=> {
                        res.body.Data.forEach(function (item) {
                            item.InspectionTime = item.InspectionTime.substr(0,10)
                        })
                        console.log(this.SourcePath)
                        console.log(this.planName)
                        console.log(this.searchadd)
                        console.log(this.searchques)
                        this.datas = res.body.Data
                    })
            },
            searchBtn(){
                this.auditPlan()
            },
            recordDetail(index){
                this.$store.state.reLiDetail = this.datas[index]
                console.log(this.$store.state.reLiDetail)
            }
        }
    }
</script>
<style scoped>
.audit_record{
    font-size: 13px;
}
.mintui-search{
    padding: 7px 11px 0 0;
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