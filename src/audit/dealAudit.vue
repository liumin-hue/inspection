<!--wode -->
<template>
    <div>
        <div class="audit_family_information">
            <!-- 页面导航 稽查  稽查历史  用户信息-->
            <mt-header title="待处理" fixed>
                <mt-button icon="back" slot="left" @click="back"></mt-button>
                <span slot="right" @click="tel()" v-if="ContactPhone == ''?false:true">
                <mt-button class="tel_btn" ></mt-button>
                </span>
            </mt-header>
            <mt-navbar v-model="selected" class="audit_nav" fixed>
                <mt-tab-item id="audit_inspection" class="audit_information_audit">稽查</mt-tab-item>
                <mt-tab-item id="audit_history" class="audit_history">客户资料</mt-tab-item>
                <mt-tab-item id="audit_user" class="audit_user_news">稽查记录</mt-tab-item>
            </mt-navbar>


            <mt-tab-container v-model="selected">
                <!--    稽查-->
                <mt-tab-container-item id="audit_inspection" class="audit_form">
                  <div class="pending_auditnews">
                    <ul>
                        <div style="height: 76px;width: 100%;"></div>
                        <li  class="content_list">

                            <router-link to="/inspection">
                                <div class="address">
                                    <div class="addressleft">地址：</div>
                                    <div class="addressright">{{this.houseList.Address}}</div>
                                </div>
                                <div class="people_name"><span class="status">姓名：</span>{{this.houseList.CusName}}</div>
                            </router-link>
                        </li>
                    </ul>


                        <mt-cell title="是否有问题">
                            <div class="radio-box" v-for="(item,index) in radios" :key="item.id">
                                <span class="radio" :class="{'on':item.isChecked}"></span>
                                <input v-model="question" :value="item.value" class="input-radio"
                                       :checked='item.isChecked' @click="check(index)" type="radio">{{item.label}}
                            </div>
                        </mt-cell>

                    </div>
                    <div class="mui-table-view-cell" @click="choosequesType()">
                        <div>问题类型</div>
                        <span>{{quesTypeSelectedName}}<span class="mui-icon mui-icon-arrowdown"></span></span>
                    </div>
                    <!-- 问题类型下拉 -->
                    <mt-popup v-model="quesType" popup-transition="popup-fade" position="bottom" class="bottomPicker">
                        <div class="pickerTitle">请选择问题类型</div>
                        <mt-picker :slots="quesTypeItems" @change="quesTypeChange" value-key="TypeName"></mt-picker>
                    </mt-popup>
                    <mt-field label="详情" placeholder="请输入详细信息"
                              type="textarea" rows="4"
                              v-bind:value="optionID"
                              v-model="details">
                    </mt-field>
<!--                    <div @click="finishStatus()" class="btn_state typeques">-->
<!--                        <div class="typename">-->
<!--                        <mt-cell title="问题类型" v-model="optionTypename"></mt-cell>-->
<!--                       <select class="selectques" v-model="SourcePath" @click="searchSelect(SourcePath)" >-->
<!--                           <option v-bind:value="option.ID"-->
<!--                                   v-for="(option) in questionList"-->
<!--                                   @change="option"-->
<!--                           class="optionstyle">{{option.TypeName}}</option>-->
<!--                       </select>-->

<!--                        </div>-->
<!--                    </div>-->
<!--  <mt-popup v-model="questionState" popup-transition="popup-fade" class="bottomPicker">-->
<!--                        <div class="pickerTitle">问题类型</div>-->
<!--                        <mt-picker :slots="slotsDeal" @change="getValues" class="typecon"></mt-picker>-->
<!--                    </mt-popup>-->

<!--                    <mt-field label="详情" placeholder="请输入详细信息" type="textarea" rows="4" v-model="details"></mt-field>-->
<!--                    <mt-field label="详情" placeholder="请输入详细信息"-->
<!--                              type="textarea" rows="4"-->
<!--                              v-bind:value="optionID"-->
<!--                              v-model="ProblemDes">-->
<!--                    </mt-field>-->

                              <div class="mui-table-view-cell">
                                <div>上传照片</div>
                                <div class="content">
                                  <input type="hidden" id="ckjl.id" name="ckjl.id" value="429">
                                  <div class="collapse-content">
                                    <form>
                                      <label class="row-label"></label>
                                      <div id='ImageS' class="row image-list clearfix">
                                        <span class="uploadImage" id="Image" @click="showActionSheet()"></span>
                                        <div :id="imgID" class="image-item" v-for="(img,index) in imgs" :key="img.id">
                                          <img id="picBig" class="preview-img" @click="$preview.open(index, imgs)" :src="img.src">
                                          <span class="del_btn" @click="delImg(img.imgId,img.imgkey,img.id,img.img_index)"></span>
                                          <div class="fa fa-times-circle"></div>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>

<!--                    <div @click="btnStateClick()" class="btn_state">-->
<!--                        <mt-cell title="处理状态" v-model="questionType"></mt-cell>-->
<!--                    </div>-->
<!--                    <mt-popup v-model="changeDealState" popup-transition="popup-fade" class="bottomPicker">-->
<!--                        <div class="pickerTitle">处理状态</div>-->
<!--                        <mt-picker :slots="slotsDeal" @change="onValuesChange" class="typecon"></mt-picker>-->
<!--                    </mt-popup>-->



                    <div class="mui-table-view-cell" @click="chooseProStatus()">
                        <div>处理状态</div>
                        <span>{{proStatusSelectedName}}<span class="mui-icon mui-icon-arrowdown"></span></span>
                    </div>
                    <!-- 处理状态下拉 -->
                    <mt-popup v-model="proStatusList" popup-transition="popup-fade" position="bottom" class="bottomPicker">
                        <div class="pickerTitle">请选择处理状态</div>
                        <mt-picker :slots="proStatusItems" @change="proStatusChange" value-key="Name"></mt-picker>
                    </mt-popup>

                    <mt-field label="处理意见" placeholder="请输入处理意见" type="textarea" rows="4" v-model="advance"
                              class="detailscss"></mt-field>

                    <div class="mui-table-view-cell" @click="chooseBlackList()">
                        <div>黑名单性质</div>
                        <span>{{BlackListSelectedName}}<span class="mui-icon mui-icon-arrowdown"></span></span>
                    </div>
                    <!-- 黑名单性质下拉 -->
                    <mt-popup v-model="BlackList" popup-transition="popup-fade" position="bottom" class="bottomPicker">
                        <div class="pickerTitle">请选择黑名单性质</div>
                        <mt-picker :slots="BlackListItems" @change="BlackListChange" value-key="TypeName"></mt-picker>
                    </mt-popup>

                    <mt-cell title="黑名单" class="detailscss" @change="blackChange">
                        <!--              <mt-radio v-model="value" :options="radiolist"></mt-radio>-->
                        <mt-checklist v-model="blackcheck" :options="radiolist"  ></mt-checklist>
                    </mt-cell>

<!--                    <div @click="blackClick()" class="btn_state">-->
<!--                        <mt-cell title="黑名单性质" v-model="blacker"></mt-cell>-->
<!--                    </div>-->
<!--                    <mt-popup v-model="blackState" popup-transition="popup-fade" class="bottomPicker">-->
<!--                        <div class="pickerTitle">黑名单性质</div>-->
<!--                        <mt-picker :slots="slotsDeal" @change='blackList' class="typecon"></mt-picker>-->
<!--                    </mt-popup>-->
                    <mt-field label="黑名单备注" placeholder="请输入黑名单备注" type="textarea" rows="4" v-model="blackRemark"
                              class="black_remark"></mt-field>
                    <mt-button type="primary" size="large" @click="savaData" class="submit_btn">确定</mt-button>

                </mt-tab-container-item>

                <!--     客户资料-->
                <mt-tab-container-item id="audit_history">
                    <!--        稽查历史点击==》到详情-->
                    <ul >
                        <div style="height: 76px;width: 100%;"></div>
                        <li class="audit_cus">
                            <div class="cusNews">
                                <div class="houseAddr"><span><span class="status">地址：</span>{{this.houseList.Address}}</span>
                                </div>
                                <div class="cusname"><span class="status">姓名：</span>{{this.cusInform.CusName}}</div>
                            </div>
                            <div class="model_bottom">
                                <div class="phone"><span class=""><span class="status">客户卡号：</span>{{this.cusInform.RoomID}}</span>
                                </div>
                                <div class="phone"><span class="status">客户类型：</span>{{this.cusInform.strCusType}}</div>
                            </div>
                          <mt-field label="备注" placeholder="备注" type="textarea" rows="3" v-model="remark_bz"></mt-field>
                        </li>
                    </ul>

                </mt-tab-container-item>

                <!--      稽查记录-->
                <mt-tab-container-item id="audit_user">
                    <ul>
                        <div style="height: 87px;width: 100%;"></div>
                        <li v-for="(item,index) in auditHistory" :key="index"
                            class="bolt_argument">
                            <div class="plan">
                                <span class="status">稽查计划：</span><span>{{item.PlanName}}</span>
                            </div>
                            <div class="model_bottom">
                                <div class="phone">
                                    <span class="status">供热年度：</span>{{item.CurrentYear}}</div>
                                <div class="phone"><span class="status">稽查时间：</span>{{item.InspectionTime}}</div>
                            </div>
                            <div class="model_bottom">
                                <div class="phone"><span class="status">是否有问题：</span>{{item.strIsProblem}}
                                </div>
                                <div class="phone"><span class="status">处理状态：</span>{{item.strProStatus}}</div>
                            </div>
                            <div class="address"><span class="status">稽查人员：</span>{{item.InspectionPersonName}}</div>
                        </li>
                    </ul>
                </mt-tab-container-item>

            </mt-tab-container>
        </div>
    </div>
</template>
<script>
    import {MessageBox, Popup, Toast, Picker, Actionsheet, Cell, DatetimePicker} from "mint-ui"; //引入mint-ui插件
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

        let that = this;
        return {
          auditHistory: [],
          question: '', //初始选择有问题
          houseList: [],       //每户信息
          cusInform: [],     //客户资料
          communityID:'',
          IsProblem:'',
          planName:'',
          ContactPhone:"",//电话
            questionList:[],  //问题列表
            optionRemark:'',
            optionTypename:'',
            optionID:'',
            SourcePath:'',//代收渠道默认选中值
          radios: [

            {
              id:1,
              label: '无问题',  //单选按钮
              value: '无问题',   //返回值
              isChecked: false,
            },
          {
              id:2,
              label: '有问题',  //单选按钮
              value: '有问题', //返回值
              isChecked: true,
          },
          ],         //有问题  无问题  单选按钮


          slotsDeal: [],  //问题类型/处理状态
          questionState: false,  //问题类型  点击显示隐藏的变量
          changeDealState: false, //处理状态  点击显示隐藏的变量
          blackState: false,      //黑名单列表  点击显示隐藏的变量
          questionType: '',     //问题类型  选项值
          btnState: '',    //处理状态  选项值
          blacker: '',      //黑名单  选项值
          details: '',    //详情（表单textarea）
          advance: '',    //处理意见（表单textarea）
        imgs:[],    //上传图片
          blackRemark: '',   //黑名单备注（表单textarea）
          blacklist: '',     //黑名单   加入 移除
          radiolist:'',
          blackcheck: "",
        ProStatus:'',      //处理状态
            ProStatusMeaning:'',
            BlackListType:'',
            BlackListRemark:'',
            remark_bz:'',  //备注

            //--------------------------处理状态
            proStatusSelectedName: "",//选中项中文名称
            proStatusValue:"",//选中项value（即ID）
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
            BlackListSelectedName: "",//选中项中文名称
            BlackListValue:"",//选中项value（即ID）
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
            quesTypeValue:"",   //选中项value（即ID）
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
            quesType:false,
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

            //获取工单信息
            if (pageSource !== "workOrderReplyResult") {
                //获取工单信息
                this.$http
                    .get(this.$myConfig.host + "/api/MyWorkBill/GetWaitReplyConditions", {
                        params: {
                            WorkBillID: this.workBillParams.WorkBillID,
                            FlowID: this.workBillParams.FlowID,
                            FlowNodeID: this.workBillParams.FlowNodeID,
                            FlowInstantID: this.workBillParams.FlowInstantID,
                            FlowToDoTs: this.workBillParams.FlowToDoTS,
                            UserID: this.$store.UserInfo.UserID,
                            FinishDetailValue: this.specificText,
                            FinishValue: this.FinishText,
                            UpLoadImages: this.workBillParams.UpLoadImages
                        }
                    })
                    .then(
                        function(res) {
                            var resInfo = $.parseJSON(res.bodyText);
                            this.person = resInfo.contactPerson;
                            this.address = resInfo.HouseAddress;
                            this.startTime = resInfo.addTime;
                            //具体情况赋值
                            this.replyFinishItems[0].values = resInfo.FinishStateList;
                            let replySpecificItemsArr = [];
                            for (let i = 0; i < resInfo.FinishDetailStateList.length; i++) {
                                if (
                                    resInfo.FinishDetailStateList[i].FinishValue ==
                                    resInfo.FinishStateList[0].FinishValue
                                ) {
                                    replySpecificItemsArr.push(resInfo.FinishDetailStateList[i]);
                                }
                            }
                            this.replySpecificItems[0].values = replySpecificItemsArr;
                            this.allReplySpecificItems = resInfo.FinishDetailStateList;
                            this.isLoading = false;
                        },
                        function(err) {
                            Toast("请检查您的网络");
                            this.isLoading = false;
                        }
                    );
            }

            //判断处理结果是否已输入内容并保存
            console.log(this.$store.wordOrderReplyResult);
            if (
                this.$store.wordOrderReplyResult == undefined ||
                this.$store.wordOrderReplyResult == ""
            ) {
                this.replyResultDefault = true;
                this.replyResultValue = false;
            } else {
                this.wordOrderReplyResult = this.$store.wordOrderReplyResult;
                this.replyResultDefault = false;
                this.replyResultValue = true;
            }
        },
      mounted() {

          var _this = this
          this.$http
              .get(this.$myConfig.host + '/Api/DropdownList/GetProblemDropDown')
              .then(res => {
                  _this.questionList = res.body.Data
                  console.log('wentiliexing')
                  console.log(_this.questionList)
                  _this.slotsDeal = _this.questionList.map(function (item) {
                      return item.TypeName
                  })
                  // console.log('solrs')
                  console.log(this.slotsDeal)
              })
          this.SourcePath = this.optionID//初始化赋值



          // console.log(this.SourcePath)

        // 将store中定义的对象变量先赋给当前页面的变量，进行初始化，
          this.question = '无问题'
        this.houseList = this.$store.state.houseList
        this.questionType = this.$store.state.questionType    //问题类型  选项值
        this.question = this.$store.state.question      //是否有问题
        this.details = this.$store.state.details    //详情（表单textarea）
        this.blacker = this.$store.state.blacker    //黑名单性质
        this.blackRemark = this.$store.state.blackRemark
        this.onlyread = this.$store.state.onlyread
        this.btnState = this.$store.state.btnState//处理状态  选项值
        this.check(0)    //是否有问题   初始选择0
          console.log(this.question)
        // this.ContactPhone = this.$store.state.reLiDetail.Mobile
        //   console.log('缪你的')
          // console.log(this.houseList)
          // console.log(_this.$store.state.UserInfo)
          this.ContactPhone = 15543690927
        this.$http
                .get(this.$myConfig.host + '/Api/InspectionApp/GetSendJob', {
                  params: {
                    status: 0,
                    chargeYear: this.$store.state.CurrentYear,
                    InspectionID: this.$store.state.inspectionID,
                    CommunityID: this.$store.state.communityID,
                    page: 1,
                    pageSize: 10
                  }
                })
                .then(res => {
                  // console.log(res)
                  this.familyList = res.body.Data
                  // console.log('住户列表')
                  // console.log(this.familyList)
                })
        this.CusList()
        this.AuditHistory()

          if(this.houseList.IsCheckBlack == 0){
              this.radiolist = ["加入"]
          }else if(this.houseList.IsCheckBlack == 1){
              this.radiolist =  ["移除"]
          }
          //---------------------------------------------------------------问题类型
          //---------------------------------------------------------------问题类型
          this.$http
              .get(this.$myConfig.host +"/Api/DropdownList/GetProblemDropDown")
              .then(
                  function(res) {
                      var resInfo=res.body.Data
                      if(resInfo){
                          this.quesTypeItems[0].values = res.body.Data;
                      }
                  });

          //---------------------------------------------------------------处理状态
          this.$http
              .get(this.$myConfig.host +"/Api/DropdownList/GetProStatusDropDown")
              .then(
                  function(res) {
                      var resInfo=res.body.Data
                      if(resInfo){
                          this.proStatusItems[0].values = res.body.Data;
                      }
                  });


          //---------------------------------------------------------------黑名单性质
          this.$http
              .get(this.$myConfig.host +"/Api/DropdownList/GetBlackListDropDown")
              .then(
                  function(res) {
                      var resInfo=res.body.Data
                      if(resInfo){
                          this.BlackListItems[0].values = res.body.Data;
                      }
                  });

      },

      methods: {
        check(index) {
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

        },
          // searchSelect(SourcePath){
          //     console.log('this.optionID')
          //     // this.SourcePath = this.optionID
          // },
          //--------------------------------------------------问题类型
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
              }
          },
          blackChange(){     //t添加移除 黑名单

            if(toString(this.radiolist[0]) == "加入"){
                // this.blackcheck =   //加入
                var a = new Number(1)
                this.blackcheck = a
                console.log(a)
            }else{
               //移除a
                var b = new Number(0)
                this.blackcheck=b
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
              }
          },

        // 取消更改数据
        deleteData() {
          this.questionType = this.$store.state.questionType    //问题类型
          this.details = this.$store.state.details     //详情（表单textarea）
          this.blacker = this.$store.state.blacker    //黑名单性质
          this.blackRemark = this.$store.state.blackRemark   //黑名单备注
          this.question = this.$store.state.question       //是否有问题  值
          this.btnState = this.$store.state.btnState    //处理状态  选项值
          this.family = this.$store.state.family
          this.onlyread = this.$store.state.onlyread
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
          console.log(values)
          // console.log(this.finishText);
        },
        blackList(picker, values) {
          this.blacker = values[0];
        },

        getValues(picker, value) {

            value = this.slotsDeal
            this.btnState =value[0];//打开蒙版   赋值为选择的选项
          //this.slotsDeal = res.data.Data     //连接口  接收处理状态

        },


        //调用原生选项
        showActionSheet(conf) {
          if (zm >= 3) {
            MessageBox("提示", "只能上传三张图片");
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
            img_index: img_index,
            w: 400,
            h: 550
          });
            Toast(this.imgs.src)
        },
        //删除图片
        delImg(imgId, imgkey, id, img_index) {
          var _this = this;
          var bts = ["是", "否"];
          plus.nativeUI.confirm(
                  "是否删除图片？",
                  function (e) {
                    var i = e.index;
                    if (i == 0) {
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
          var n = 3 - zm;
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
                    maximum: n, // 最多选择3张图片
                    selected: _this.lfs,
                    system: false,
                    onmaxed: function () {
                      plus.nativeUI.alert("最多只能选择3张图片");
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
              Toast('aaaa')
              let _this = this;
              console.log(this.$store.token + '')
              console.log(this.houseList.SendJobID)
              console.log(this.houseList.CusID)
              // console.log(_this.houseList.CusID)
              console.log(this.houseList.CusName)
              console.log(this.quesTypeValue)
              console.log( this.IsProblem)
              console.log(this.details)
              console.log(this.advance)
              console.log(this.blackcheck)
              console.log(this.btnState + '')
              console.log(this.blacker )
              console.log(this.blackRemark )



                  //plus.storage.clear();
                  let wa = plus.nativeUI.showWaiting();
                  let task = plus.uploader.createUpload(
                      _this.$myConfig.host + "/Api/InspectionApp/AddInspectionRec",
                      {
                          method: "POST"
                      },
                      function(t, status) {
                          if (status == 200) {
                              try {
                                  let info = $.parseJSON(t.responseText);
                                  console.log(info);
                                  //改变全局参数
                                  // _this.$store.operateType = true;
                                  // _this.$router.go(-2);
                                  // _this.$store.wordOrderReplyResult = ""; //清空处理结果
                                  Toast(info.Message);
                              } catch (e) {
                                  // Toast("文件上传失败");
                              }
                              wa.close();
                          } else {
                              wa.close();
                              Toast("上传失败:" + info.Message);
                          }
                      }
                  );
              // task.setRequestHeader('auth',_this.$store.token);
              // task.setRequestHeader('Content-Type','multipart/form-data');
              // task.addData("SendJobID","1");//_this.workBillParams.WorkBillID);
              // task.addData("CusID","1");//_this.workBillParams.WorkBillID);
              // task.addData("CusName", "1");//_this.workBillParams.WorkBillID);
              // task.addData("ProblemID","1");//_this.workBillParams.WorkBillID);
              // task.addData("IsProblem","1");// _this.workBillParams.latestVersion);
              // task.addData("ProblemDes","1")// _this.workBillParams.FlowInstantID);
              // task.addData("SuggestDes","1")//_this.workBillParams.FlowToDoTS);
              // task.addData("IsBlack","1")//_this.$store.UserInfo.UserID + "");
              // task.addData("ProStatus","1")// _this.$store.UserInfo.OrgID);
              // task.addData("BlackListType","1")// _this.FinishValue);
              // task.addData("BlackListRemark","1")
              // task.start();
              task.setRequestHeader('auth',_this.$store.token);
              task.setRequestHeader('Content-Type','multipart/form-data');
              task.addData("SendJobID",_this.houseList.SendJobID + '');//_this.workBillParams.WorkBillID);
              task.addData("CusID",_this.houseList.CusID + '');//_this.workBillParams.WorkBillID);
              task.addData("CusName", _this.houseList.CusName + '');//_this.workBillParams.WorkBillID);
              task.addData("ProblemID",_this.quesTypeValue + '');//_this.workBillParams.WorkBillID);
              task.addData("IsProblem",_this.IsProblem + '');// _this.workBillParams.latestVersion);
              task.addData("ProblemDes",_this.details + '')// _this.workBillParams.FlowInstantID);
              task.addData("SuggestDes",_this.advance + '')//_this.workBillParams.FlowToDoTS);
              task.addData("IsBlack",_this.blackcheck + '')//_this.$store.UserInfo.UserID + "");
              task.addData("ProStatus",_this.btnState + '')// _this.$store.UserInfo.OrgID);
              task.addData("BlackListType",_this.blacker + '')// _this.FinishValue);
              task.addData("BlackListRemark",_this.blackRemark + '')
              task.start();
              task.setRequestHeader('Content-Type','multipart/form-data');
              task.addFile("ImgList", 1)// _this.wordOrderReplyResult); //处理结果

              for (let i = 0; i < _this.imgs.length; i++) {
                  //key需要字符串类型
                  task.addFile(_this.imgs[i].src, {
                      key: Math.floor(Math.random() * 1000 + 1000).toString()
                  });
              }

          },

          // savaData(){
          //     var _this = this
          //     console.log(_this.houseList.SendJobID)
          //         console.log(_this.houseList.CusID)
          //
          //         console.log(_this.houseList.CusName)
          //         console.log(_this.quesTypeValue)
          //         console.log( _this.IsProblem)
          //         console.log(_this.details)
          //         console.log(_this.advance)
          //         console.log(_this.blackcheck)
          //         console.log(_this.btnState )
          //         console.log(_this.blacker )
          //         console.log(_this.blackRemark )
          //     var formData = new FormData();
          //     formData.append('SendJobID', this.houseList.SendJobID);
          //     formData.append('UserID', '');
          //     formData.append('CusID', this.houseList.CusID);
          //     formData.append('CusName', this.houseList.CusName);
          //     formData.append('ProblemID', this.quesTypeValue);
          //     formData.append('IsProblem', this.IsProblem);
          //     // formData.append('IsProblemMeaning',  );
          //     formData.append('ProblemDes',0);
          //     formData.append('SuggestDes', this.advance);
          //     formData.append('IsBlack', this.blackcheck);
          //     formData.append('ProStatus', this.btnState);
          //     // formData.append('ProStatusMeaning', this.ProStatusMeaning);
          //     formData.append('BlackListType', this.blacker);  //黑名单类型
          //     formData.append('BlackListRemark', this.blackRemark);
          //
          //     this.imgs.filter(item=>typeof item != 'string').forEach(item =>{
          //         formData.append('file', item)
          //     })
          //     this.$http.post(_this.$myConfig.host + "/Api/InspectionApp/AddInspectionRec", formData, {
          //         headers: {
          //             'auth': _this.$store.token,
          //             "Content-Type": "multipart/form-data"
          //         },
          //     },{emulateJSON: true})
          //         .then(
          //         function (res) {
          //             Toast(res.bodyText);
          //             // Toast(res);
          //             // this.msg = res.bodyText;
          //         },
          //         function (res) {
          //             Toast(res.status);
          //         }
          //     );
          // },

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
            // console.log(res)
            this.cusInform = res.body.Data
            // console.log(this.cusInform)
          })
        },

      //=======================稽查记录接口
          AuditHistory() {
            // var _this = this
            this.$http
                    .get(this.$myConfig.host + '/Api/InspectionApp/GetAppInspectionRecList',{
                      params:{
                        CurrentYear:this.$store.state.CurrentYear,
                        CusID:this.$store.state.houseList.CusID,
                        PlanName:'',
                        CommunityName:'',
                        IsProblem:'',
                      },
                    })
                    .then(res=> {
                      // console.log(this.$store.state.houseList.CusID)
                      res.body.Data.forEach(function (item) {
                        item.InspectionTime = item.InspectionTime.substr(0, 10)
                      })
                      this.auditHistory = res.body.Data
                        console.log(this.auditHistory)
                    })
          },
          //拨打电话
          tel() {
              plus.device.dial(this.ContactPhone, true);
          },
    },
        watch: {
            selected(val) {
                if (this.selected == "audit_inspection" || this.selected == "audit_user") {
                    this.audittitle = "稽查—住户详情"
                } else if (this.historyContent == true) {
                    //在监听之后才能改变
                    // this.audittitle = "稽查—历史详情"
                    // console.log(1111)
                } else {
                    // this.audittitle = "稽查—住户详情"
                }
            },
        }
    }
</script>
<style scoped>
    .audit_family_information {
        background-color: #F9F9F9;
        height: 100%;
        /*padding-right: 30px;*/
    }
.typename{
    display: flex;
    background-color: #fff;
    justify-content: space-between;
}
.optionstyle{
    width:30%;
}
.selectques{
    width:50%;
    float:right;
}
    .audit_nav {
        /*width:60%;*/
        padding: 0 22%;
        margin: 0 auto;
        margin-top: 44px;
    }

    .mint-tab-container {
        margin-top: 10px;
    }

    .radio-box {
        margin-right: 15px;
    }

    /*.mint-popup {*/
    /*    text-align: center;*/
    /*    background-color: #fff;*/
    /*    color: #000;*/
    /*    border-radius: 8px;*/
    /*    !**!*/
    /*}*/

    /*!*弹框标题样式*!*/
    /*.pickerTitle {*/
    /*    width: 200px;*/
    /*    color: #fff;*/
    /*    background-color: #49A9EA;*/
    /*    height: 50px;*/
    /*    line-height: 35px;*/
    /*    font-size: 17px;*/
    /*    padding: 10px;*/
    /*    border-top-left-radius: 8px;*/
    /*    border-top-right-radius: 8px;*/

    /*}*/

    /*.picker-slot {*/
    /*    font-size: 14px;*/
    /*    margin: 10px;*/
    /*    overflow: hidden;*/
    /*    position: relative;*/
    /*    max-height: 100%;*/
    /*}*/

    .sendimg {
        width: 50px;
        height: 50px;
    }

    .mint-field.is-textarea .mint-cell-value {
        padding: 5px 10px;
    }

    .reply_content {
        margin-top: 0.15rem;
        height: 86%;
        overflow: scroll;
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
        padding: 0.15rem;
        background-color: #fff;
    }

    .mui-table-view-cell > div {
        float: left;
        width: 25%;
        color: #666;
    }

    .mui-table-view-cell > span {
        float: right;
        max-width: 75%;
        color: #333;
    }

    .mui-icon {
        font-size: 0.17rem;
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

    .uploadImage {
        display: inline-block;
        width: 0.6rem;
        height: 0.6rem;
        background-size: 0.6rem;
        border-radius: 10%;
    }

    .mui-table-view-cell > div.content {
        width: 75%;
    }

    .mui-table-view-cell > div.content #Image {
        float: right;
    }

    /*.photoShow.mint-popup {*/
    /*    width: 100%;*/
    /*}*/

    /*.photoShow.mint-popup > img {*/
    /*    width: 100%;*/
    /*}*/

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
        color: #999;
        border-right: 0.01rem solid #999;
    }

    .hideDiv {
        display: none;
    }
  .model_bottom{
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
    .submit_btn{
        position: fixed;
        bottom: 0;
    }
    .mint-tab-container-item{
        height: 100%;
    }
    .router-view{
        height: 100%;
    }
    .black_remark{
        margin-bottom: 55px;
    }
.searchselect{
    position:fixed;
}
</style>
