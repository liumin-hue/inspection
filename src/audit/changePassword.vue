<template>
  <div id="big-box">
      <mt-header fixed title="密码修改">
          <mt-button icon="back" slot="left" @click="back"></mt-button>
      </mt-header>

      <div id="info_body">
        <div class="input_test">
            <mt-field class="mui-table-view-cell" label="原密码" placeholder="请输入原密码" :attr="{ maxlength: 20 }" v-model="OldPassword"></mt-field>
            <mt-field class="mui-table-view-cell" label="新密码" placeholder="请输入新密码" :attr="{ maxlength: 20 }" type="password" v-model="NewPasword"></mt-field>
            <mt-field class="mui-table-view-cell" label="确认密码" placeholder="请再次输入密码" :attr="{ maxlength: 20 }" type="password" v-model="NewPaswordAgain"></mt-field>
          </div>
      </div>   
      <mt-tabbar v-model="selected">
          <mt-button type="primary" size="large" @click="confirm()">保存设置</mt-button>
      </mt-tabbar>
  </div>
</template>
<script>
//引入mint-ui插件
import { Field } from "mint-ui";
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      passage: "",
    };
  },
  methods: {
    back(){
        this.$router.go(-1)
    },
    confirm: function() {
      this.isLoading = true
      var _this = this;
      //判断密码输入
      if (this.OldPassword == "" || this.OldPassword == undefined) {
        Toast("请输入原密码");
      } else if (this.NewPasword == "" || this.NewPasword == undefined) {
        Toast("新密码不能为空");
      } else if (this.NewPaswordAgain == "" || this.NewPaswordAgain == undefined) {
        Toast("确认密码不能为空");
      } else if (this.NewPasword !== this.NewPaswordAgain) {
        Toast("两次密码输入不一致");
      } else {
        var _this=this;
        MessageBox.confirm("确定保存设置?").then(action => {
          //修改密码接口
          this.$http
            .get(
              this.$myConfig.host + "/Api/InspectionApp/UpdatePassword?oldPassword="+this.OldPassword+"&newPassword="+this.NewPasword,
              { emulateJSON: true }
            )
            .then(
              function(res) {
                var resInfo = $.parseJSON(res.bodyText);

                if (resInfo.IsSuccess) {
                    this.$router.go(-1)
                    Toast(resInfo.Message);
                  plus.storage.setItem("gdkykf_password", _this.NewPasword);
                  //清空用户数据
                  //plus.storage.removeItem("gdkykf_password");
                  //提示信息

                } else {
                  Toast(resInfo.Message);
                }

              },
              function(err) {
                Toast("请检查您的网络");
              }
            );
        });
      }
    }
  }
};
</script>
<style scoped>
#info_body {
  padding: 0.095rem 0;
}

/* 修改cell尺寸 */
.mint-cell {
  min-height: 0.45rem;
}

.mui-table-view-cell {
  padding: 0;
}
</style>