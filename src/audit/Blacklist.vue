<template>
    <div class="black_list">
        <div class="black_select">
        <mt-header title="黑名单">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
        <div class="searchselect">
            <div class="searchdiv">
                <select class="select" v-model="SourcePath">
                <option v-bind:value="option.id" v-for="option in SourcePathSelect">{{option.val}}</option>
                </select>
                <span class="mui-icon mui-icon-arrowdown"></span>
                <input type="search" class="search" v-model="searchIf">
                <i class="mintui mintui-search" @click="auditPlan"></i>
            </div>
        </div>
        </div>
        <div style="height: 100px"></div>
        <ul class="datas">
                <li v-for="(item,index) in datas" :key="index" class="bolt_argument" @click="auditDetail(index)">
                    <div class="people_name"><span class="status">地址：</span>{{item.Address}}</div>
                    <div class="people_name"><span class="status">姓名：</span>{{item.CusName}}</div>
                    <div class="model_bottom">
                        <div class="name"><span><span class="texttitle">黑名单性质：</span>{{item.strBlackType}}</span>
                        </div>
                        <div class="phone"><span class="texttitle">操作人：</span>{{item.CreatorName}}</div>
                    </div>
                    <div class="model_bottom">
                        <div class="b_remark"><span><span class="texttitle">黑名单备注：</span>{{item.Remark}}</span>
                        </div>
                        <div v-show="btnShow" class="removelimit"><button  class="remove_btn" @click="RemoveBlack(index)">移除</button></div>
                    </div>
                    <!-- <div class="people_name"><span class="status">黑名单备注：</span>{{item.Remark}}</div> -->
                </li>
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
                <router-link :to="{name:'home',query:{id:'设置'}}">
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
    import $ from 'jquery'
    import { MessageBox } from "mint-ui";
    import { Toast } from "mint-ui";
    export default {
        data() {
            return {
                versions:"",//是否需要升级，需要升级则显示红点
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
                btnShow:false,
            }
        },
        mounted() {
            console.log(this.$store.isRemoveID)
            if(this.$store.isRemoveID.length == 0){
                this.btnShow = false
                console.log("没有操作权限")

            }else{
                this.btnShow = true
                console.log("可以进行操作")

            }
            this.userName = this.$store.state.loginInfo.UserName
            this.finishText = this.$store.state.finishText
            //稽查计划列表，小区列表 
            this.auditPlan()
            this.getHomeData()//获取新版本号
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
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
                        this.datas.forEach(function (item) {
                            if(item.Remark == 'null'){
                                item.Remark = ''
                            }
                        })

                    })
            },
            auditDetail(index){
                this.$store.state.reLiDetail = this.datas[index]
                // console.log(this.$store.state.blackDetail)
            },
            searchBtn(){
                this.auditPlan()
            },
            RemoveBlack(ind){
                console.log(this.datas[ind].CusID)
                var cusId=this.datas[ind].CusID
                     this.$http
                        .post(this.$myConfig.host + '/Api/BlackList/CancelBlackList',{ 
                            "isAll": false,
                            "CusIDs":[cusId]
                        }).then(res=>{
                            var resInfo = $.parseJSON(res.bodyText);
                            var newDatas = this.datas
                            if (resInfo.IsSuccess) {
                                this.datas=newDatas.filter(function(item){
                                    return item != newDatas[ind]
                                })
                                console.log(this.datas)
                                Toast(resInfo.Message);
                            } else {
                            Toast(resInfo.Message);
                            }
                        })
                // MessageBox.confirm("确定移出此黑名单?").then(action => {
                // //修改密码接口
                //     this.$http
                //         .post(this.$myConfig.host + '/Api/BlackList/CancelBlackList',{ 
                //             "isAll": false,
                //             "CusIDs":[cusId]
                //         })
                //         .then(
                //         function(res) {
                //             var resInfo = $.parseJSON(res.bodyText);
                //             if (resInfo.IsSuccess) {
                //                 this.$router.go(-1)
                //                 Toast(resInfo.Message);
                //             } else {
                //             Toast(resInfo.Message);
                //             }
                //         },
                //         function(err) {
                //             Toast("请检查您的网络");
                //         }
                //         );
                // });             
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
            },
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
    .black_list{
        font-size: 13px;

    }
    .mui-icon{
        line-height: 28px;
        font-weight: bold;
    }
    .mintui-search{
        padding: 7px 11px 0px 0px;
    }
    .select option{
        border: none;
        font-size: 14px;
        height: 35px;
        line-height: 35px;
    }
    .datas{
        margin-bottom: 50px;
    }
    .remove_btn{
        position: none;
        /* right: 20px; */
        background-color: #49a9ea;
        font-size: 13px;
        padding:5px 9px;
    }
   .black_select{
       z-index: 20;
       position: fixed; 
       top: 0px;
   }
   .b_remark{
       width:70%;
   }
</style>