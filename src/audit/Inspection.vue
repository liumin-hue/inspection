<!--wode -->
<template>
    <div>
        <div class="audit_family_information">
            <!-- 页面导航 稽查  稽查历史  用户信息-->
            <mt-header title="待稽查" fixed>
                <mt-button icon="back" slot="left" @click="back"></mt-button>
                <span slot="right" @click="tel()" v-if="ContactPhone == ''?false:true">
                <mt-button class="tel_btn"></mt-button>
                </span>
            </mt-header>
            <mt-navbar v-model="selected" class="audit_nav" fixed>
                <mt-tab-item id="audit_inspection" class="audit_information_audit">稽查</mt-tab-item>
                <mt-tab-item id="audit_history" class="audit_history">客户资料</mt-tab-item>
                <mt-tab-item id="audit_user" class="audit_user_news">稽查记录</mt-tab-item>
            </mt-navbar>


            <mt-tab-container v-model="selected" swipeable>
                <!--    稽查-->
                <mt-tab-container-item id="audit_inspection" class="audit_form" >
                    <div id="inspec">
                        <div class="pending_auditnews">
                            <ul >
                                <div style="height: 76px;width: 100%;"></div>
                                <!--                            <pre>{{$data.proStatusItems}}</pre>-->
                                <li class="content_list">
                                    <router-link to="/inspection">
                                        <div class="people_name"><span class="status">地址：</span>{{this.houseList.Address}}
                                        </div>
                                        <div class="people_name"><span class="status">姓名：</span>{{this.houseList.CusName}}
                                        </div>
                                    </router-link>
                                </li>
                            </ul>

                            <div class="mui-table-view-cell">
                                <div>是否有问题</div>
                                <span>
                                <div class="radio-box" v-for="(item,index) in radios" :key="item.id">
                                    <span class="radio" :class="{'on':item.isChecked}"></span>
                                    <input v-model="question" :value="item.value" class="input-radio" :checked='item.isChecked' @click="isQuestion(index)" type="radio">
                                    {{item.label}}
                                </div>
                            </span>
                            </div>



                            <div id="quesTypeID" class="mui-table-view-cell" @click="choosequesType()" v-show="!haveQuestion">
                                <div>问题类型</div>
                                <span>{{quesTypeSelectedName}}<span class="mui-icon mui-icon-arrowdown"></span></span>
                            </div>
                            <!-- 问题类型下拉 -->
                            <mt-popup v-model="quesType" popup-transition="popup-fade" position="bottom" class="bottomPicker">
                                <div class="pickerTitle">请选择问题类型</div>
                                <mt-picker :slots="quesTypeItems" @change="quesTypeChange" value-key="TypeName"></mt-picker>
                            </mt-popup>


                            <div class="mui-table-view-cell" id="detailID" v-show="!haveQuestion">
                                <mt-field  label="详情" type="textarea" rows="4" v-bind:value="details" v-model="details" :attr="{ maxlength: 100 }"
                                           style="padding-left:0.06rem;">
                                </mt-field>
                            </div>

                            <div class="mui-table-view-cell">
                                <div class="filesend">上传照片</div>
                                <div class="content">
                                    <input type="hidden" id="ckjl.id" name="ckjl.id" value="429">
                                    <div class="collapse-content">
                                        <form>
                                            <label class="row-label"></label>

                                            <div id='ImageS' class="row image-list clearfix">

                                                <viewer class="image-item" v-for="(img,index) in Image" :key="img.id">
                                                    <img class="preview-img" @click="$preview.open(index, Image)"
                                                         :src="img">
                                                    <span class="del_btn"
                                                          @click="delImage(index)"></span>
                                                    <div class="fa fa-times-circle"></div>
                                                </viewer>

                                                <div :id="imgID" class="image-item" v-for="(img,index) in imgs" :key="img.id">
                                                    <img id="picBig" class="preview-img" @click="$preview.open(index, imgs)"
                                                         :src="img.src">
                                                    <span class="del_btn"
                                                          @click="delImg(img.imgId,img.imgkey,img.id,img.img_index)"></span>
                                                    <div class="fa fa-times-circle"></div>
                                                </div>
                                                <span class="uploadImage" id="Image" @click="showActionSheet()"></span>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div id="statuID" class="mui-table-view-cell" @click="chooseProStatus()" v-show="!haveQuestion">
                                <div>处理状态</div>
                                <span>{{proStatusSelectedName}}<span class="mui-icon mui-icon-arrowdown"></span></span>
                            </div>
                            <!-- 处理状态下拉 -->
                            <mt-popup v-model="proStatusList" popup-transition="popup-fade" position="bottom"
                                      class="bottomPicker">
                                <div class="pickerTitle">请选择处理状态</div>
                                <mt-picker :slots="proStatusItems" @change="proStatusChange" value-key="Name"></mt-picker>
                            </mt-popup>

                            <div class="mui-table-view-cell" id="advanceID" v-show="!haveQuestion">
                                <mt-field  label="处理意见" type="textarea" rows="4" v-model="advance" :attr="{ maxlength: 100 }" style="padding-left:0.06rem"></mt-field>
                            </div>

                            <div class="mui-table-view-cell checkmod">
                                <div>黑名单</div>
                                <span><mt-checklist v-model="blackcheck" :options="radiolist" @change="blackChange" class="checkblack" style="height:0.2rem"></mt-checklist>
                                    </span>
<!--                                <input type="checkbox" v-model="blackcheck" :options="radiolist" @change="blackChange" class="checkblack" style="height:0.23rem">-->
                            </div>

                            <div class="mui-table-view-cell" v-show="!blackShow">
                                <div>黑名单性质</div>
                                <span>{{BlackListSelectedName2}}<span class="mui-icon mui-icon-arrowdown"></span></span>
                            </div>

                            <div id="popselet" class="mui-table-view-cell" @click="chooseBlackList()" v-show="blackShow">
                                <div>黑名单性质</div>
                                <span>{{BlackListSelectedName}}<span class="mui-icon mui-icon-arrowdown"></span></span>
                            </div>
                            <!-- 黑名单性质下拉 -->
                            <mt-popup v-model="BlackList" popup-transition="popup-fade" position="bottom" class="bottomPicker" >
                                <div class="pickerTitle">请选择黑名单性质</div>
                                <mt-picker :slots="BlackListItems" @change="BlackListChange" value-key="TypeName"></mt-picker>
                            </mt-popup>

                            <div class="mui-table-view-cell" >
                                <mt-field label="黑名单备注" type="textarea" rows="4" v-model="blackRemark" class="black_remark"  :attr="{ maxlength: 100 }" :readonly="read" style="padding-left:0.06rem"></mt-field>
                            </div>

                            <mt-button type="primary" size="large" @click="savaData" class="submit_btn">确定</mt-button>
                        </div>
                    </div>
                </mt-tab-container-item>

                <!--     客户资料-->
                <mt-tab-container-item id="audit_history">
                    <ul>
                        <div style="height: 76px;width: 100%;"></div>
                        <li class="audit_cus">
                            <div class="cusNews">
                                <div class="people_name"><span class="status">地址：</span>{{this.houseList.Address}}
                                </div>
                                <div class="cusname"><span class="status">姓名：</span>{{this.cusInform.CusName}}
                                    <div class="icon_status">
                                    <div v-if="HeatStatus==0" class="status_icon status_zc">
                                        {{HeatStatusMeaning}}
                                    </div>
                                    <div v-if="HeatStatus==1" class="status_icon status_bt">
                                        {{HeatStatusMeaning}}
                                    </div>
                                    <div v-if="HeatStatus==2" class="status_icon status_qt">
                                        {{HeatStatusMeaning}}
                                    </div>
                                    <div v-if="HeatStatus==3" class="status_icon status_wg">
                                        {{HeatStatusMeaning}}
                                    </div>
                                    <div v-if="IsArrears ==1" class="status_icon status_q2">欠</div>
                                    <div v-if="IsArrears ==0" class="status_icon status_q1">欠</div>
                                    <div v-if="IsCheckBlack==1" class="status_icon status_h">
                                        {{IsCheckBlackMeaning}}
                                    </div>
                                    <!--                            <div v-if="item.IsCheckBlack==0" class="status_icon status_h">{{item.IsCheckBlackMeaning}}</div>-->
                                </div>
                                </div>

                            </div>
                            <div class="model_bottom">
                                <div class="phone"><span class=""><span class="status">房间号：</span>{{this.cusInform.RoomID}}</span>
                                </div>
                                <div class="phone"><span class="status">客户类型：</span>{{this.cusInform.strCusType}}</div>
                            </div>
                            <div class="model_bottom">
                                <div class="phone"><span class=""><span class="status">用热状态：</span>{{HeatStatusMeaning}}</span>
                                </div>
                                <div class="phone"><span class="status">是否是黑名单：</span>{{isCheckBlack}}</div>
                            </div>
                            <div class="people_remark"><span class="status">备注：</span>{{this.cusInform.Remark}}</div>
<!--                            <mt-field label="备注" type="textarea" rows="3" class="cus_remark"-->
<!--                                      readonly>{{this.cusInform.Remark}}</mt-field>-->
                        </li>
                    </ul>

                </mt-tab-container-item>

                <!--      稽查记录-->
                <mt-tab-container-item id="audit_user">
                    <ul>
                        <div style="height: 87px;width: 100%;"></div>
                        <router-link to="/InspectionDetail" >
                            <li v-for="(item,index) in auditHistory" :key="index"
                                class="bolt_argument" @click="recordDetail(index)">
                                <div class="plan">
                                    <span class="status">稽查计划：</span><span>{{item.PlanName}}</span>
                                </div>
                                <div class="model_bottom">
                                    <div class="isQues">
                                        <span class="status">供热年度：</span>{{item.ChargeYear}}
                                    </div>
                                    <div class="status_deal"><span class="status">稽查时间：</span>{{item.InspectionTime}}</div>
                                </div>
                                <div class="model_bottom">
                                    <div class="isQues"><span class="status">是否有问题：</span>{{item.strIsProblem}}
                                    </div>
                                    <div class="status_deal"><span class="status">处理状态：</span>{{item.strProStatus}}</div>
                                </div>
                                <div class="address"><span class="status">稽查人员：</span>{{item.InspectionPersonName}}</div>
                            </li>
                        </router-link>
                    </ul>
                </mt-tab-container-item>

            </mt-tab-container>
        </div>
    </div>
</template>
<script>
    import {MessageBox, Popup, Toast, Picker, Actionsheet, Cell, DatetimePicker} from "mint-ui";
    var index = 1;
    var files = [];
    var w = null;
    var procinstid = 0;
    var lfs = null;
    var zm = 0;
    var img_index = 0;
    var pageSource = "";
    export default {
        data() {
            return {
                tabActive: "audit_inspection",
                haveQuestion:false,//无问题：显示 问题类型，详情，处理状态，处理意见
                auditHistory: [],
                question: '', //初始选择有问题
                houseList: [],       //每户信息
                HeatStatus:'',
                HeatStatusMeaning:'',
                IsArrears:'',
                IsCheckBlack:'',
                IsCheckBlackMeaning:'',
                cusInform: {Remark:'',CusName:'',},     //客户资料
                communityID: '',
                IsProblem: '',
                planName: '',
                ContactPhone: "",//电话
                questionList: [],  //问题列表
                optionRemark: '',
                optionTypename: '',
                optionID: '',
                SourcePath: '',//代收渠道默认选中值
                radios: [
                    {
                        id: 2,
                        label: '有问题',  //单选按钮
                        value: '有问题', //返回值
                        isChecked: true,
                    },
                    {
                        id: 1,
                        label: '无问题',  //单选按钮
                        value: '无问题',   //返回值
                        isChecked: false,
                    }
                ], //有问题  无问题  单选按钮
                blackCheckbox:0,
                slotsDeal: [],  //问题类型/处理状态
                questionState: false,  //问题类型  点击显示隐藏的变量
                changeDealState: false, //处理状态  点击显示隐藏的变量
                blackState: false,      //黑名单列表  点击显示隐藏的变量
                questionType: '',     //问题类型  选项值
                btnState: '',    //处理状态  选项值
                blacker: '',      //黑名单 性质
                details: '',    //详情（表单textarea）
                advance: '',    //处理意见（表单textarea）
                imgs: [],    //上传图片
                blackRemark: '',   //黑名单备注（表单textarea）
                blacklist: '',     //黑名单   加入 移除
                isCheckBlack:'',   //客户资料中是否是黑名单
                radiolist: '',
                blackcheck: "",
                ProStatusMeaning: '',
                BlackListType: '',
                BlackListRemark: '',
                remark_bz: '',  //备注
                cusBlack:'', // 客户资料里 是否是黑名单
                //--------------------------处理状态
                proStatusSelectedName: "",//选中项中文名称
                proStatusValue: "",//选中项value（即ID）
                proStatusList: false,
                proStatusItems: [
                    {
                        flex: 1,
                        values: [],
                        className: "slot1",
                        textAlign: "center"
                    }
                ],

//--------------------------黑名单性质
                blackShow:true,
                BlackListSelectedName: "",//选中项中文名称
                BlackListSelectedName2: "",//选中项中文名称
                BlackListValue: "",//选中项value（即ID）
                BlackList: false,
                BlackListItems: [
                    {
                        flex: 1,
                        values: [],
                        className: "slot1",
                        textAlign: "center"
                    }
                ],
                // quesTypeValue:'', // 取问题类型select的选项ID

                //--------------------------问题类型
                quesTypeSelectedName: "",//选中项中文名称
                quesTypeValue: "",   //选中项value（即ID）
                quesType: false,
                quesTypeItems: [
                    {
                        flex: 1,
                        values: [],
                        className: "slot1",
                        textAlign: "center"
                    }
                ],
                onlyread: '',
                selected: 'audit_inspection',
                family: '',
                charge: 'charge',
                user_information: 'user_information',


                //是否有问题的数组
                slots: [{values: ['是', '否']}],


                // action sheet 默认不显示，为false。操作sheetVisible可以控制显示与隐藏

                show: [],
                scrollTop: "",
                offsetTop: "",
                //==============================================
                address: "",
                person: "",
                startTime: "",
                finishText: "", //完成情况文字
                isQualifiedText: "", //是否合格文字
                specificText: "", //具体情况文字
                FinishValue: "", //记录完成情况节点信息
                FinishDetailValue: "", //记录具体情况节点信息
                disposeText: "",
                pickerValue: false,
                tempTimeList: true,
                addRoomPopup: false,
                tempTimeText: "",//测温时间
                handleOpinionStatus: false,
                replyFinishList: false,
                isQualifiedList: false,
                isLoading: true, //是否加载动画
                checklist: false,
                checkRoomList: [],
                tempIntroduction: "",

                note: "",
                bedRoomNum: 2,
                livingRoomNum: 1,
                toiletNum: 0,
                kitchenNum: 0,
                replyFinishItems: [
                    //完成情况
                    {
                        flex: 1,
                        values: [],
                        className: "slot1",
                        textAlign: "center"
                    }
                ],
                isQualifiedItems: [
                    //完成情况
                    {
                        flex: 1,
                        values: ["是", "否"],
                        className: "slot1",
                        textAlign: "center"
                    }
                ],
                replySpecificList: false,
                allReplySpecificItems: [], //全部具体情况
                replySpecificItems: [
                    //具体情况
                    {
                        flex: 1,
                        values: [],
                        className: "slot1",
                        textAlign: "center"
                    }
                ],
                selectPhoto: [
                    {
                        name: "拍照",
                        method: this.getImage // 调用methods中的函数
                    },
                    {
                        name: "从相册中选择",
                        method: this.galleryImg // 调用methods中的函数
                    }
                ],
                // action sheet 默认不显示，为false。操作sheetVisible可以控制显示与隐藏
                sheetVisible: false,
                replyResultDefault: true, //处理结果无值时，默认显示“点击输入内容”
                replyResultValue: false, //处理结果有值时，显示值
                wordOrderReplyResult: "" //处理结果
            }
        },
        //保存数据，store渲染页面数据
        activated() {
            zm = 0;
            img_index = 0;
            this.workBillParams = this.$route.params;
            this.WorkBillID = this.$route.params.WorkBillID;

            if (pageSource !== "workOrderReplyResult") {
                this.imgs = [];
                index = 1;
                files = [];
                w = null;
                procinstid = 0;
                lfs = null;
                zm = 0;
                img_index = 0;
            }
        },
        watch:{
            quesTypeSelectedName(val,oldval){
                console.log(val + ' ' +'val')
                console.log(oldval)
            },
            proStatusSelectedName(val,oldval){
                console.log(val + ' ' +'val')
                console.log(oldval)
            },
        },
        mounted() {
            var total = document.documentElement.clientHeight;
            // document.getElementById("eachplan_content").style.height=total+"px";
            document.getElementById("inspec").style.height=total+"px";
            // 初始化页面赋值
            this.houseList = this.$store.state.houseList;        //上页获取的信息
            this.IsProblem = this.houseList.IsProblem;   //是否有问题 无1  有2
            this.HeatStatus = this.houseList.HeatStatus
            this.HeatStatusMeaning = this.houseList.HeatStatusMeaning
            this.IsArrears = this.houseList.IsArrears
            this.IsCheckBlack = this.houseList.IsCheckBlack
            this.blackRemark = this.houseList.BlackRemark
            this.IsCheckBlackMeaning = this.houseList.IsCheckBlackMeaning
            this.isQuestion(1);        //是否有问题   初始选择1  无问题
            this.ContactPhone = this.$store.state.houseList.Mobile   // 手机号


            //----------------------------------------------------------------黑名单显示  加入 / 移除
            if (this.houseList.IsCheckBlack == 0) {
                this.radiolist = ["加入"]

            } else if (this.houseList.IsCheckBlack == 1) {
                this.radiolist = ["移出"]
            }

            if (this.houseList.IsCheckBlackMeaning == '黑'){
                this.isCheckBlack = '是'
            }else{
                this.isCheckBlack = '否'
            }
            if(this.radiolist[0] == "移出"){
                this.blackShow = false
                this.read=true
                console.log(this.blackShow)
            }
            //---------------------------------------------------------------问题类型
            this.$http
                .get(this.$myConfig.host + "/Api/DropdownList/GetProblemDropDown")
                .then(
                    function (res) {
                        var resInfo = res.body.Data
                        if (resInfo) {
                            this.quesTypeItems[0].values = res.body.Data;
                            this.quesTypeItems[0].values.unshift({TypeName:'请选择 *', ID:''})
                            console.log(this.quesTypeItems)
                        }
                    });


            //---------------------------------------------------------------处理状态
            this.$http
                .get(this.$myConfig.host + "/Api/DropdownList/GetProStatusDropDown")
                .then(
                    function (res) {
                        var resInfo = res.body.Data
                        if (resInfo) {
                            this.proStatusItems[0].values = res.body.Data;
                            this.proStatusItems[0].values.unshift({Name:'请选择 *', ID:''})
                            console.log(this.proStatusItems)
                            // console.log(resInfo)
                        }
                    });


            //---------------------------------------------------------------黑名单性质
            this.$http
                .get(this.$myConfig.host + "/Api/DropdownList/GetBlackListDropDown")
                .then(
                    function (res) {
                        var resInfo = res.body.Data
                        this.houseList=this.$store.state.houseList
                        var bLT = this.houseList.BlackListType
                        this.BlackListItems[0].values = res.body.Data;
                        this.BlackListItems[0].values.unshift({TypeName:'请选择 *', ID:''})
                        var BlackName=this.BlackListItems.map(function (item,index) {
                            var blackName = item.values
                            for (var i = 0; i < blackName.length; i++){
                                if(bLT==blackName[i].ID){
                                    var BlackT = blackName[i].TypeName
                                    return BlackT
                                }
                            }
                        })
                        this.BlackListSelectedName2 = BlackName[0]
                        console.log(this.BlackListSelectedName2)
                    });
            this.CusList()         //客户资料接口
            this.AuditHistory()   //稽查历史
            if(this.blackRemark == 'null'){
                this.blackRemark = ''
            }

        },

        methods: {
            isQuestion(index) {
                // 先取消所有选中项
                this.radios.filter((item) => {
                    item.isChecked = false;
                });

                //再设置当前点击项选中
                this.question = this.radios[index].value;
                this.IsProblem = this.radios[index].id;
                // 设置值，以供传递
                this.radios[index].isChecked = true;
                console.log(this.IsProblem);
                console.log(this.question)
                console.log(this.radios[index].isChecked);
                // if(this.IsProblem == 2){
                //     $('#quesTypeID').show()
                //     $('#detailID').show()
                //     $('#statuID').show()
                //     $('#advanceID').show()
                // }else if(this.IsProblem == 1){
                //     $('#quesTypeID').hide()
                //     $('#detailID').hide()
                //     $('#statuID').hide()
                //     $('#advanceID').hide()
                // }
                if(this.IsProblem == 2){//无问题
                    this.haveQuestion=false
                }else if(this.IsProblem == 1){//有问题
                    this.haveQuestion=true
                }
            },
            //选择问题类型
            choosequesType() {
                this.quesType = !this.quesType;
            },
            //picker监听变化事件
            quesTypeChange(picker, values) {
                if (values[0]) {
                    this.quesTypeSelectedName = values[0].TypeName;
                    this.quesTypeValue = values[0].ID;
                    this.details = values[0].Remark;
                    console.log(this.quesTypeValue)
                }
            },

            blackChange() {     //t添加移除 黑名单
                if (this.radiolist[0] == "加入") {
                    if (this.blackCheckbox == 0) {
                        this.blackCheckbox = 1;
                        this.blackcheck = "1"
                    } else if (this.blackCheckbox == 1) {
                        this.blackCheckbox = 0;
                        this.blackcheck = ''
                    }
                }else if(this.radiolist[0] == "移出"){
                    if (this.blackCheckbox == 0) {
                        this.blackCheckbox = 1;
                        this.blackcheck = "0"
                    } else if (this.blackCheckbox == 1) {
                        this.blackCheckbox = 0;
                        this.blackcheck = ''
                    }
                }

            },
            //--------------------------------------------------处理状态
            //选择处理状态
            chooseProStatus() {
                this.proStatusList = !this.proStatusList;
            },
            //picker监听变化事件
            proStatusChange(picker, values) {
                if (values[0]) {
                    this.proStatusSelectedName = values[0].Name;
                    this.proStatusValue = values[0].ID;
                    console.log(this.proStatusValue)
                }
            },
            //--------------------------------------------------黑名单性质
            //选择黑名单性质
            chooseBlackList() {
                this.BlackList = !this.BlackList;
            },
            //picker监听变化事件
            BlackListChange(picker, values) {
                if (values[0]) {
                    this.BlackListSelectedName = values[0].TypeName;
                    this.BlackListValue = values[0].ID;
                    console.log(this.BlackListValue)
                }
            },

            back() {
                this.$router.go(-1);
            },
            finishStatus() {
                this.questionState = !this.questionState;
            },
            btnStateClick() {
                this.changeDealState = !this.changeDealState
            },
            blackClick() {
                this.blackState = !this.blackState
            },
            onValuesChange(picker, values) {
                this.questionType = values[0];
                console.log(this.questionType)
                // console.log(this.finishText);
            },
            blackList(picker, values) {
                this.blacker = values[0];
            },

            getValues(picker, value) {

                value = this.slotsDeal
                this.btnState = value[0];//打开蒙版   赋值为选择的选项
                //this.slotsDeal = res.data.Data     //连接口  接收处理状态

            },


            //调用原生选项
            showActionSheet(conf) {
                // if (zm >= 5) {
                if(this.imgs.length > 4){
                    MessageBox("提示", "只能上传五张图片");
                } else {
                    var _this = this;
                    var divid = $("#Image").attr("id");
                    var actionbuttons = [{title: "拍照"}, {title: "相册选取"}];
                    var actionstyle = {
                        title: "选择照片",
                        cancel: "取消",
                        buttons: actionbuttons
                    };
                    plus.nativeUI.actionSheet(actionstyle, function (e) {
                        if (e.index == 1) {
                            _this.getImage(divid);
                        } else if (e.index == 2) {
                            _this.galleryImg(divid);
                        }
                    });
                }
            },
            //图片加载
            showImgDetail(imgId, imgkey, id, src) {
                img_index += 1;

                // console.log(img_index);
                this.imgs.push({
                    imgId: imgId,
                    imgkey: imgkey,
                    id: id,
                    src: src,
                    img_index: this.imgs.length,
                    w: 400,
                    h: 550
                });
            },
            //删除图片
            delImg(imgId, imgkey, id, img_index) {
                var _this = this;
                var bts = ["否","是"];
                plus.nativeUI.confirm(
                    "是否删除图片？",
                    function (e) {
                        var i = e.index;
                        if (i == 1) {
                            var itemname = id + "img-" + imgkey; //429img-F_ZDDZZ
                            var itemvalue = plus.storage.getItem(itemname);
                            //{IMG_20160704_112614,_doc/upload/F_ZDDZZ-IMG_20160704_112614.jpg,file:///storage/emulated/0/Android/data/io.dcloud...../doc/upload/F_ZDDZZ-1467602809090.jpg}
                            _this.delImgFromLocal(
                                itemname,
                                itemvalue,
                                imgId,
                                imgkey,
                                index,
                                img_index
                            );
                        }
                    },
                    "提示",
                    bts
                );
            },
            //删除本地
            delImgFromLocal(itemname, itemvalue, imgId, imgkey, index, imgIndex) {
                var wa = plus.nativeUI.showWaiting();
                this.imgs.splice(imgIndex - 1, 1);
                for (var r = 0; r < this.imgs.length; r++) {
                    this.imgs[r].img_index = r + 1;
                }
                zm -= 1;
                img_index -= 1;
                //校正
                if (this.imgs.length == 0) {
                    zm = 0;
                    img_index = 0;
                }
                wa.close();
            },
            //选取相册图片
            galleryImg(divid) {
                var _this = this;
                // var n = 5 - zm;
                var n = 5 - this.imgs.length
                var id = document.getElementById("ckjl.id").value;

                plus.gallery.pick(
                    function (e) {
                        for (var i in e.files) {
                            var name = e.files[i].substring(0, e.files[i].indexOf("."));
                            _this.showImgDetail(name, divid, id, e.files[i]);
                            zm += 1;
                        }
                        lfs = e.files;
                    },
                    function (e) {
                        console.log("取消选择图片");
                    },
                    {
                        filename: "_doc/camera/",
                        filter: "image",
                        multiple: true,
                        maximum: n, // 最多选择5张图片
                        selected: _this.lfs,
                        system: false,
                        onmaxed: function () {
                            plus.nativeUI.alert("最多只能选择5张图片");
                        }
                    }
                );
            },
            //拍照选取
            getImage(divid) {
                var _this = this;
                var cmr = plus.camera.getCamera();
                var id = document.getElementById("ckjl.id").value;
                cmr.captureImage(
                    function (p) {
                        plus.io.resolveLocalFileSystemURL(
                            p,
                            function (entry) {
                                plus.gallery.save(
                                    p,
                                    function () {
                                        Toast("保存成功");
                                    },
                                    function (e) {
                                        Toast("保存失败: " + JSON.stringify(e));
                                    }
                                );
                                _this.showImgDetail(entry.name, divid, id, entry.toLocalURL());
                                zm += 1;
                            },
                            function (e) {
                                Toast("读取拍照文件错误：" + e.message);
                            }
                        );
                    },
                    function (e) {
                    },
                    {
                        filename: "_doc/camera/",
                        index: 1
                    }
                );
            },
            //点击保存按钮上传图片

            savaData() {
                let _this = this;
                // console.log(this.$store.token + '')
                // console.log(this.houseList.SendJobID)
                // console.log(this.houseList.CusID)
                // console.log(this.houseList.CusName)
                // console.log(this.quesTypeValue)   //问题类型ID
                // console.log(this.IsProblem)
                // console.log(this.details)
                // console.log(this.advance)
                // console.log(this.blackcheck+'')
                // console.log(this.proStatusValue + '')
                // console.log(this.BlackListValue +'')
                // console.log(this.blackRemark)
                if(this.blackCheckbox==1 && this.BlackListValue=='' && this.radiolist[0] == "加入"){
                    Toast('请选择黑名单性质')
                    return
                }
                else if(this.IsProblem == 2 && this.quesTypeValue == ''){
                    Toast('请选择问题类型')
                    return
                } else if(this.IsProblem == 2 && this.proStatusValue == ''){
                    Toast('请选择处理状态')
                    return
                }else{
                let wa = plus.nativeUI.showWaiting();
                let task = plus.uploader.createUpload(
                    _this.$myConfig.host + "/Api/InspectionApp/AddInspectionRec",
                    {
                        method: "POST"
                    },
                    function (t, status) {
                        if (status == 200) {
                            try {
                                let info = $.parseJSON(t.responseText);
                                _this.$router.go(-1);
                                zm=0
                                Toast(info.Message);
                            } catch (e) {

                            }
                            wa.close();
                        } else {
                            wa.close();
                            Toast(info.Message);
                        }
                    }
                );
                task.setRequestHeader('auth', _this.$store.token);
                task.setRequestHeader('Content-Type', 'multipart/form-data');
                task.addData("SendJobID", _this.houseList.SendJobID + '');//_this.workBillParams.WorkBillID);
                task.addData("CusID", _this.houseList.CusID + '');//_this.workBillParams.WorkBillID);
                task.addData("CusName", _this.houseList.CusName + '');//_this.workBillParams.WorkBillID);
                task.addData("ProblemID", _this.quesTypeValue + '');// 问题类型ID
                task.addData("IsProblem", _this.IsProblem + '');  // 是否有问题 1 无  2 有
                task.addData("ProblemDes", _this.details + '');  // 详情
                task.addData("SuggestDes", _this.advance + '');  //处理意见
                task.addData("IsBlack", _this.blackcheck + '');  //黑名单  0 移除 1 加入
                task.addData("ProStatus", _this.proStatusValue + ''); //处理状态ID 123
                task.addData("BlackListType", _this.BlackListValue + '')// 黑名单性质
                task.addData("BlackListRemark", _this.blackRemark + '')   //黑名单备注
                task.start();
                for (let i = 0; i < _this.imgs.length; i++) {
                    //key需要字符串类型
                    task.addFile(_this.imgs[i].src, {
                        key: Math.floor(Math.random() * 1000 + 1000).toString()
                    });
                }
                }
            },

            // 图片压缩

            compress(img) {
                let imgs = JSON.parse(JSON.stringify(img))
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext('2d');
                //瓦片canvas
                let tCanvas = document.createElement("canvas");
                let tctx = tCanvas.getContext("2d");
                let initSize = imgs.src.length;
                let width = imgs.w;
                let height = imgs.h;
                //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
                let ratio;
                if ((ratio = width * height / 4000000) > 1) {
                    console.log("大于400万像素")
                    ratio = Math.sqrt(ratio);
                    width /= ratio;
                    height /= ratio;
                } else {
                    ratio = 1;
                }
                canvas.width = width;
                canvas.height = height;
                //        铺底色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                //如果图片像素大于100万则使用瓦片绘制
                let count;
                // if ((count = width * height / 1000000) > 1) {
                //     console.log("超过100W像素");
                //     count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
                //     //            计算每块瓦片的宽和高
                //     let nw = ~~(width / count);
                //     let nh = ~~(height / count);
                //     tCanvas.width = nw;
                //     tCanvas.height = nh;
                //     for (let i = 0; i < count; i++) {
                //         for (let j = 0; j < count; j++) {
                //             tctx.drawImage(imgs, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                //             ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                //         }
                //     }
                // } else {
                //     ctx.drawImage(imgs, 0, 0, width, height);
                // }
                //进行最小压缩
                let ndata = canvas.toDataURL('image/jpeg', 0.1);
                console.log('压缩前：' + initSize);
                console.log('压缩后：' + ndata.length);
                console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                return ndata;
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
            },

            //========================客户资料接口
            CusList() {
                this.$http
                    .post(this.$myConfig.host + '/Api/InspectionPlan/GetCustomerDetail',
                        {
                            "CusID": this.$store.state.houseList.CusID,
                        }).then(res => {
                            if(res.body.IsSuccess){
                                let resInfo = res.body.Data
                                if(resInfo != ''){
                                    this.cusInform=resInfo
                                }
                            }else{

                            }

                })
            },

            //=======================稽查记录接口
            AuditHistory() {
                // var _this = this
                this.$http
                    .get(this.$myConfig.host + '/Api/InspectionApp/GetAppInspectionRecList', {
                        params: {
                            CurrentYear: this.$store.CurrentYear,
                            CusID: this.$store.state.houseList.CusID,
                            PlanName: '',
                            Address: '',
                            IsProblem: '',
                        },
                    })
                    .then(res => {
                        // console.log(this.$store.state.houseList.CusID)
                        res.body.Data.forEach(function (item) {
                            item.InspectionTime = item.InspectionTime.substr(0, 10) +' '+ item.InspectionTime.substr(11,8)
                        })
                        this.auditHistory = res.body.Data
                        console.log('this.auditHistory')
                        console.log(this.auditHistory)
                    })
            },
            recordDetail(index){
                this.$store.state.reLiDetail = this.auditHistory[index]
                console.log(this.$store.state.reLiDetail)
            },
            //拨打电话
            tel() {
                plus.device.dial(this.ContactPhone, true);
            },
        },

    }
</script>
<style scoped>
    .cusNews{
        padding-bottom:0.1rem
    }
    .content_list{
        border-bottom: 1px solid #E0E0E0;
        background: #fff
    }
    .people_name {
        margin: 0;
    }
    .people_remark{
        margin: 0;
        padding:10px 0;
    }
    .people_name > div {
        text-align: left;
        width: 15%;
        display: inline-block;
        font-size: 0.14rem;
        color: #232323;
        vertical-align: top;
    }

    .people_name > span {
        max-width: 80%;
        display: inline-block;
        font-size: 0.14rem;
        color: #595959;
    }


    .audit_family_information {
        background-color: #F9F9F9;
        height: 100%;
        font-size: 0.14rem;
        /*padding-right: 30px;*/
    }

    .typename {
        display: flex;
        background-color: #fff;
        justify-content: space-between;
    }

    .optionstyle {
        width: 30%;
    }

    .selectques {
        width: 50%;
        float: right;
    }

    .audit_nav {
        /*width:60%;*/
        padding: 0 22%;
        margin: 0 auto;
        margin-top: 44px;
    }
    .item {
        display: inline-block;
    }
    .mint-tab-container {
        height: 100%;
        overflow: visible;
    }
    .nav {
        background-color: #efeff4;
        padding: 0;
        text-align: center;
        position: fixed;
        top: 0.38rem;
        width: 100%;
        z-index: 9;
    }
    .nav .tab_btn {
        width: 100%;
        background: #fff;
    }
    .nav .tab_btn > div {
        width: 33.333%;
        text-align: center;
        /* padding:0 0.08rem;
        margin:0 0.1rem; */
        height: 0.44rem;
        line-height: 0.44rem;
        float: left;
        font-size: 0.14rem;
        color: #666;
        background-color: #fff;
    }
    .checked {
        color: #49a9ea !important;
        border-bottom: 0.02rem solid #49a9ea;
        box-sizing: border-box;
    }

    .tab_btn {
        margin: 0 auto;
        display: inline-block;
    }

    .mint-tab-container {
        height: 100%;
        overflow: visible;
    }

    .radio-box {
        margin-right: 15px;
        display: inline-block;
    }

    .mint-field.is-textarea .mint-cell-value {
        padding: 5px 10px;
    }
    .mui-table-view-cell > .step_title {
        background-color: #49a9ea;
        color: #fff;
        float: left;
        width: 0.8rem;
        height: 0.24rem;
        padding: 0.05rem;
        text-align: center;
        border-radius: 0.04rem;
    }

    .mui-table-view-cell {
        padding: 7px 15px;
        line-height:34px;
        background-color: #fff;
    }

    .mui-table-view-cell > div {
        float: left;
        width: 25%;
        color: #232323;
    }
    .filesend{
        line-height: 60px;
    }
    .mui-table-view-cell > span {
        float: right;

        max-width: 75%;
        color: #595959;
    }

    .mui-icon {
        /*font-size: 0.17rem;*/
        margin-left: 0.08rem;
    }

    /*.mint-popup.opinion {*/
    /*    width: 2.5rem;*/
    /*}*/

    /*.mint-popup.opinion textarea {*/
    /*    padding: 0;*/
    /*}*/


    /* 上传图片样式 */


    /* 媒体查询 */

    @media only screen and (max-device-width: 413px) {
        /*iPhone 6 Portrait*/
        .uploadImage {
            background: url("../../static/images/audit/record/Group 13.png") no-repeat center;
        }
    }

    @media only screen and (min-device-width: 414px) {
        /*iPhone 6+ Portrait*/
        .uploadImage {
            background: url("../../static/images/audit/record/Group 13@1.5x.png") no-repeat center;
        }
    }
    .cus_remark mint-cell-wrapper{
        padding:0;
    }
    .uploadImage {
        display: inline-block;
        width: 0.6rem;
        height: 0.6rem;
        background-size: 0.6rem;
        border-radius: 10%;
    }

    .mui-table-view-cell > div.content {
        width: 75%;
        font-size:0.14rem;
    }

    .mui-table-view-cell > div.content #Image {
        float: left;
    }

    /*.photoShow.mint-popup {*/
    /*    width: 100%;*/
    /*}*/

    /*.photoShow.mint-popup > img {*/
    /*    width: 100%;*/
    /*}*/
    .eachplan_content{
        font-size:0.14rem !important;
    }
    .tempBtn {
        margin-top: 10px;
        border-radius: 25px;
        background-color: rgba(38, 162, 255, 0.1)
    }

    .addRoomBtns {
        width: 50%;
        float: left;
        text-align: center;
        border: none;
        border-top: 0.01rem solid #999;
        border-radius: 0px;
    }

    .addRoomBtns:nth-child(1) {
        color: #232323;
        border-right: 0.01rem solid #999;
    }

    .hideDiv {
        display: none;
    }

    .model_bottom {
        border-bottom: 1px solid #e0e0e0;
        line-height: 40px;
    }

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

    .submit_btn {
        position: absolute;
        bottom: 0;
    }

    .mint-tab-container-item {
        height: 100%;
    }

    .router-view {
        height: 100%;
    }

    .black_remark {
        margin-bottom: 55px;
    }

    .searchselect {
        position: fixed;
    }

    .mint-cell-wrapper {
        padding: 0;
        background-image: none !important
    }
    .isQues{
        width:40%;
        display: inline-block;
    }
    .status_deal{
        width: 58%;
        display: inline-block;
    }
    .address{
        padding-top: 5px;
    }
    .pending_auditnews{
        margin-bottom:51px;
    }
    #inspec{
        overflow: scroll;
    }

    /*标签*/
    .status_icon {
        height: 0.25rem;
        line-height: 0.25rem;
        text-align: center;
        border-radius: 0.04rem;
        color: #fff;
        display: inline-block
    }

    .status_qt {
        width: 0.4rem;
        background: #FF6060;
        margin-right: 0.05rem;
    }

    .status_bt {
        width: 0.4rem;
        background: #FFCC01;
        margin-right: 0.05rem;
    }

    .status_h {
        width: 0.25rem;
        background: #676767;
        margin-right: 0.05rem;
    }

    .status_q1 {
        width: 0.25rem;
        background: #ccc;
        margin-right: 0.05rem;
    }

    .status_q2 {
        width: 0.25rem;
        background: #FA6400;
        margin-right: 0.05rem;
    }

    .status_wg {
        width: 0.4rem;
        background: #ccc;
        margin-right: 0.05rem;
    }

    .status_zc {
        width: 0.4rem;
        background: #2FB91E;
        margin-right: 0.05rem;
    }

    .name_icon {
        display: flex;
        /*font-size:12px ;*/
        /*flex-wrap: wrap;*/
        justify-content: space-between;
        /*position: absolute;*/
    }
    .icon_status {
        display: inline-block;
        position: relative;
        float: right;
        margin-right: 10px;
        width:33%;
        font-size: 0.12rem;
    }
    .mint-tab-container-wrap{
        background: #fff
    }

</style>
