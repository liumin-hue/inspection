<template>
  <div id="big-box" :class="black">
      <mt-header fixed title="工单回复">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goback()"></mt-button>
        </router-link>
      </mt-header>
        <div class="reply_content">
            <div class="mui-table-view-cell">
            <div>客户地址</div>
            <span>{{address}}</span>
          </div>
          <div class="mui-table-view-cell">
            <div>客户姓名</div>
            <span>{{person}}</span>
          </div>
          <div class="mui-table-view-cell">
            <div>受理时间</div>
            <span>{{startTime}}</span>
          </div>
          <div class="mui-table-view-cell" @click="finishStatus()">
            <div>完成情况</div>
            <span>{{finishText}}<span class="mui-icon mui-icon-arrowdown"></span></span>
          </div>
          <div class="mui-table-view-cell" @click="specificStatus()">
            <div>具体情况</div>
            <span>{{specificText}}<span class="mui-icon mui-icon-arrowdown"></span></span>
          </div>
          <div class="mui-table-view-cell" @click="handleOpinion()">
            <div>处理结果</div>
            <span class="reply_result_default" v-show="replyResultDefault">点击输入内容</span>
            <span class="reply_result_value" v-show="replyResultValue">{{wordOrderReplyResult}}</span>
          </div>
          <div class="mui-table-view-cell">
            <div>上传照片</div>
            <div class="content">  
                <input type="hidden" id="ckjl.id" name="ckjl.id" value="429">  
                <div class="collapse-content" >  
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
        </div>
      <mt-tabbar v-model="selected">
          <mt-button class="workOrder_handle" type="primary" size="large" @click="save()">保存</mt-button>
      </mt-tabbar>
      <!-- 完成情况 -->
      <mt-popup v-model="replyFinishList" popup-transition="popup-fade" position="bottom" class="bottomPicker">
        <div class="pickerTitle">完成情况</div>
          <mt-picker :slots="replyFinishItems" @change="onValuesChange" value-key="FinishText"></mt-picker>
      </mt-popup>
      <!-- 具体情况 -->
      <mt-popup v-model="replySpecificList" popup-transition="popup-fade" position="bottom" class="bottomPicker">
        <div class="pickerTitle">具体情况</div>
          <mt-picker :slots="replySpecificItems" @change="onSpecificValuesChange" value-key="FinishDetailText"></mt-picker>
      </mt-popup>
      <!-- 处理结果 -->
      <mt-popup v-model="handleOpinionStatus" popup-transition="popup-fade" class="opinion">
        <div class="popupTitle">处理结果</div>
        <mt-field placeholder="处理结果" :value="disposeOpinion" type="textarea" rows="6" v-model="opinionText"></mt-field>
      </mt-popup>
      <!-- 相片选择 -->
      <mt-actionsheet :actions= "selectPhoto" v-model="sheetVisible"></mt-actionsheet>
      <my-spinner :showSpinner="isLoading"></my-spinner>
    </div>
</template>
<script>
import { MessageBox, Popup, Toast, Picker, Actionsheet, Cell } from "mint-ui"; //引入mint-ui插件
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
      address: "",
      person: "",
      startTime: "",
      finishText: "", //完成情况文字
      specificText: "", //具体情况文字
      FinishValue: "", //记录完成情况节点信息
      FinishDetailValue: "", //记录具体情况节点信息
      disposeText: "",
      handleOpinionStatus: false,
      replyFinishList: false,
      isLoading: true, //是否加载动画
      replyFinishItems: [
        //完成情况
        {
          flex: 1,
          values: [],
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
      imgs: [],
      replyResultDefault: true, //处理结果无值时，默认显示“点击输入内容”
      replyResultValue: false, //处理结果有值时，显示值
      wordOrderReplyResult: "" //处理结果
    };
  },
  beforeRouteEnter: (to, from, next) => {
    pageSource = from.name;
    next();
  },
  //监听变化
  watch: {
    //控制输入框状态
    handleOpinionStatus(val, oldVal) {
      if (val) {
        this.opinionText = this.disposeText;
      } else {
        this.disposeText = this.opinionText;
      }
    }
  },
  mounted() {
    
  },
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
    // if (pageSource !== "workOrderReplyResult") {
    //   //获取工单信息
    // this.$http
    //   .get(this.$myConfig.host + "/api/MyWorkBill/GetWaitReplyConditions", {
    //     params: {
    //       WorkBillID: this.workBillParams.WorkBillID,
    //       FlowID: this.workBillParams.FlowID,
    //       FlowNodeID: this.workBillParams.FlowNodeID,
    //       FlowInstantID: this.workBillParams.FlowInstantID,
    //       FlowToDoTs: this.workBillParams.FlowToDoTS,
    //       UserID: this.$store.UserInfo.UserID,
    //       FinishDetailValue: this.specificText,
    //       FinishValue: this.FinishText,
    //       UpLoadImages: this.workBillParams.UpLoadImages
    //     }
    //   })
    //   .then(
    //     function(res) {
    //       var resInfo = $.parseJSON(res.bodyText);
    //       this.person = resInfo.contactPerson;
    //       this.address = resInfo.HouseAddress;
    //       this.startTime = resInfo.addTime;
    //       //具体情况赋值
    //       this.replyFinishItems[0].values = resInfo.FinishStateList;
    //       let replySpecificItemsArr = [];
    //       for (let i = 0; i < resInfo.FinishDetailStateList.length; i++) {
    //         if (
    //           resInfo.FinishDetailStateList[i].FinishValue ==
    //           resInfo.FinishStateList[0].FinishValue
    //         ) {
    //           replySpecificItemsArr.push(resInfo.FinishDetailStateList[i]);
    //         }
    //       }
    //       this.replySpecificItems[0].values = replySpecificItemsArr;
    //       this.allReplySpecificItems = resInfo.FinishDetailStateList;
    //       this.isLoading = false;
    //     },
    //     function(err) {
    //       Toast("请检查您的网络");
    //       this.isLoading = false;
    //     }
    //   );
    // }

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
  methods: {
    goback: function() {
      this.$store.wordOrderReplyResult = ""; //清空处理结果
      this.$router.go(-1); //返回上一次历史记录
    },
    //选择完成情况
    finishStatus() {
      this.replyFinishList = !this.replyFinishList;
    },
    //选择具体情况
    specificStatus() {
      this.replySpecificList = !this.replySpecificList;
    },
    //picker监听变化事件
    onValuesChange(picker, values) {
      if (values[0]) {
        //获取完成情况名称
        this.finishText = values[0].FinishText;
        this.FinishValue = values[0].FinishValue;
        //修改匹配的具体情况
        let arr = [];
        for (let i = 0; i < this.allReplySpecificItems.length; i++) {
          if (
            this.allReplySpecificItems[i].FinishValue == values[0].FinishValue
          ) {
            arr.push(this.allReplySpecificItems[i]);
          }
        }
        this.replySpecificItems[0].values = arr;
      }
    },
    //监听具体情况
    onSpecificValuesChange(picker, values) {
      if (values[0]) {
        this.specificText = values[0].FinishDetailText;
      }
    },
    //处理意见
    handleOpinion() {
      //this.handleOpinionStatus = !this.handleOpinionStatus;
      this.$router.push({ path: "/myWorkOrder/workOrderReplyResult" });
    },
    //调用原生选项
    showActionSheet(conf) {
      if (zm >= 3) {
        MessageBox("提示", "只能上传三张图片");
      } else {
        var _this = this;
        var divid = $("#Image").attr("id");
        var actionbuttons = [{ title: "拍照" }, { title: "相册选取" }];
        var actionstyle = {
          title: "选择照片",
          cancel: "取消",
          buttons: actionbuttons
        };
        plus.nativeUI.actionSheet(actionstyle, function(e) {
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
      console.log(img_index);
      this.imgs.push({
        imgId: imgId,
        imgkey: imgkey,
        id: id,
        src: src,
        img_index: img_index,
        w: 400,
        h: 550
      });
    },
    //删除图片
    delImg(imgId, imgkey, id, img_index) {
      var _this = this;
      var bts = ["是", "否"];
      plus.nativeUI.confirm(
        "是否删除图片？",
        function(e) {
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
        function(e) {
          for (var i in e.files) {
            var name = e.files[i].substring(0, e.files[i].indexOf("."));
            _this.showImgDetail(name, divid, id, e.files[i]);
            zm += 1;
          }
          lfs = e.files;
        },
        function(e) {
          console.log("取消选择图片");
        },
        {
          filename: "_doc/camera/",
          filter: "image",
          multiple: true,
          maximum: n, // 最多选择3张图片
          selected: _this.lfs,
          system: false,
          onmaxed: function() {
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
        function(p) {
          plus.io.resolveLocalFileSystemURL(
            p,
            function(entry) {
              plus.gallery.save(
                p,
                function() {
                  Toast("保存成功");
                },
                function(e) {
                  Toast("保存失败: " + JSON.stringify(e));
                }
              );
              _this.showImgDetail(entry.name, divid, id, entry.toLocalURL());
              zm += 1;
            },
            function(e) {
              Toast("读取拍照文件错误：" + e.message);
            }
          );
        },
        function(e) {},
        {
          filename: "_doc/camera/",
          index: 1
        }
      );
    },
    //点击保存按钮上传图片
    save() {
      let _this = this;
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

        task.setRequestHeader('auth',_this.$store.token);
        // task.setRequestHeader('Content-Type','multipart/form-data');
        task.addData("SendJobID",'1');
      // task.addData("WorkBillID", _this.workBillParams.WorkBillID);
      // task.addData("latestVersion", _this.workBillParams.latestVersion);
      // task.addData("FlowID", _this.workBillParams.FlowID);
      // task.addData("FlowNodeID", _this.workBillParams.FlowNodeID);
      // task.addData("FlowInstantID", _this.workBillParams.FlowInstantID);
      // task.addData("FlowToDoTs", _this.workBillParams.FlowToDoTS);
      // task.addData("UserID", _this.$store.UserInfo.UserID + "");
      // task.addData("OrgCode", _this.$store.UserInfo.OrgID);
      // task.addData("FinishDetailValue", _this.FinishDetailValue);
      // task.addData("FinishValue", _this.FinishValue);
      // task.addData("DealResult", _this.wordOrderReplyResult); //处理结果

      // for (let i = 0; i < _this.imgs.length; i++) {
      //   //key需要字符串类型
      //   task.addFile(_this.imgs[i].src, {
      //     key: Math.floor(Math.random() * 1000 + 1000).toString()
      //   });
      // }
      task.start();
    }
  }
};
</script>
<style scoped>
.reply_content {
  margin-top: 0.15rem;
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
  color: #232323;
}

.mui-icon {
  font-size: 0.17rem;
  margin-left: 0.08rem;
}

.mint-popup.opinion {
  width: 2.5rem;
}

.mint-popup.opinion textarea {
  padding: 0;
}

/* 上传图片样式 */
/* 媒体查询 */
@media only screen and (max-device-width: 413px) {
  /*iPhone 6 Portrait*/
  .uploadImage {
    background: url("../../static/images/客服移动端切图/首页/Group 13.png") no-repeat
      center;
  }
}

@media only screen and (min-device-width: 414px) {
  /*iPhone 6+ Portrait*/
  .uploadImage {
    background: url("../../static/images/客服移动端切图/首页/Group 13@1.5x.png")
      no-repeat center;
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

.photoShow.mint-popup {
  width: 100%;
}
.photoShow.mint-popup > img {
  width: 100%;
}
</style>
