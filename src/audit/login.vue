<template>
  <div id="big-box">
      <div id="login_title"></div>
      <div id="login_from">
          <div class="input_test">
            <mt-field label=" " placeholder="用户名" v-model="username" value="username" style="border-bottom: 0.02rem solid #fff;"></mt-field>
            <mt-field label=" " placeholder="密码" type="password" v-model="password" value="password" style="border-bottom: 0.02rem solid #fff;"></mt-field>
            <mt-checklist v-model="rememberPasswordCheck" :options="checkBoxList" align="left" style="align-items:center;padding-left:0.1rem"></mt-checklist>
            </div>
          <router-link to=''>
            <mt-button type="primary"  size="large" @click="goHome()">登&nbsp;&nbsp;&nbsp;&nbsp;录</mt-button>
           </router-link>
           <router-link to='/host' v-if="isIOS">
            <mt-button type="default"  size="large">返&nbsp;&nbsp;&nbsp;&nbsp;回</mt-button>
           </router-link>
      </div>
      <span id="compony">河北工大科雅能源科技股份有限公司&nbsp;&nbsp;版权所有</span>
  </div>
</template>
<script>
import { Field, Toast, Picker, Cell, Checklist } from "mint-ui";
import $ from 'jQuery';

export default {
  data() {
    return {
      username: "",
      password: "",
      isIOS: false,
      //--------------------------记住密码
      rememberPasswordCheck: "",//不为空：勾选，为空：不勾选
      checkBoxList: ['记住密码'],
    };
  },
  mounted() {
  // 判断手机平台
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        console.log("This is iOS'browser."); //这是iOS平台下浏览器
        this.isIOS = true;
        if(plus.storage.getItem("gdkykf_host")){
            this.$myConfig.host = plus.storage.getItem("gdkykf_host")
        } else {
            this.$myConfig.host = ""
            this.$router.push({ path: "/host" })
        }

    } else {
        console.log("This is android'browser.");
        this.isIOS = false;
    }

    //获取本地用户名密码
    try {
      this.username = plus.storage.getItem("gdkykf_userName");
      this.password = plus.storage.getItem("gdkykf_password");
      this.rememberPasswordCheck = plus.storage.getItem("gdkykf_rememberPassword");
    } catch (e) {
      this.username = "";
      this.password = "";
      this.rememberPasswordCheck = "";
    }


    //加载html5+
    var _this = this;
    // 扩展API加载完毕后调用onPlusReady回调函数
    document.addEventListener("plusready", onPlusReady, false);
    // 扩展API加载完毕，现在可以正常调用扩展API
    function onPlusReady() {

      // 在本地获取账号密码
      _this.username = plus.storage.getItem("gdkykf_userName") ? plus.storage.getItem("gdkykf_userName") : "";
      _this.password = plus.storage.getItem("gdkykf_password") ? plus.storage.getItem("gdkykf_password") : "";
      _this.rememberPasswordCheck = plus.storage.getItem("gdkykf_rememberPassword") ? plus.storage.getItem("gdkykf_rememberPassword") : "";

      //首页返回键处理
      //处理逻辑：1秒内，连续两次按返回键，则退出应用；
      var first = null;
      plus.key.addEventListener(
        "backbutton",
        function() {
          //首次按键，提示‘再按一次退出应用’
          console.log("触发返回按钮");
          //判断首页不能返回
          if (_this.$route.path === "/home" || _this.$route.path === "/login") {
            if (!first) {
              first = new Date().getTime();
              Toast("再按一次退出应用");
              setTimeout(function() {
                first = null;
              }, 1000);
            } else {
              if (new Date().getTime() - first < 1000) {
                plus.runtime.quit();
              }
            }
          } else {
            _this.$router.go(-1);
          }
        },
        false
      );
    }
  },
  methods: {
    goHome() {
      if (this.username == "") {
        Toast("用户名不能为空");
      } else if (this.password == "") {
        Toast("密码不能为空");
      } else if (this.username == "" || this.password == "") {
        Toast("用户名和密码不能为空");
      } else {

        var _this = this;
        this.$store.isLogin = true;
        //验证登录信息
        this.$http
          .post(
            this.$myConfig.host + '/Api/Home/Login?userName='+this.username+'&password='+this.password,
            { emulateJSON: false }//form形式传给后台，而非json形式
          )
          .then(
            function(res) {
              let resInfo = $.parseJSON(res.bodyText);
              console.log(res)
              console.log(resInfo);
              //判断登录信息
              if (resInfo.IsSuccess) {
                _this.$store.token = resInfo.Message;//token
                _this.$router.push({ path: "/home" });

                //Toast("rememberPasswordCheck:"+_this.rememberPasswordCheck)

                //保存账号密码
                if(_this.rememberPasswordCheck){
                  plus.storage.setItem("gdkykf_userName", _this.username);
                  plus.storage.setItem("gdkykf_password", _this.password);
                  plus.storage.setItem("gdkykf_rememberPassword", "1");

                  localStorage.setItem("gdkykf_userName", _this.username);
                  localStorage.setItem("gdkykf_password", _this.password);
                  localStorage.setItem("gdkykf_rememberPassword", "1");
                 }else{
                  plus.storage.setItem("gdkykf_userName", "");
                  plus.storage.setItem("gdkykf_password", "");
                  plus.storage.setItem("gdkykf_rememberPassword", "");
                  
                  localStorage.setItem("gdkykf_userName", "");
                  localStorage.setItem("gdkykf_password", "");
                  localStorage.setItem("gdkykf_rememberPassword", "");
                }

              } else {
                Toast(resInfo.Message);
              }
            },
            function(err) {
              if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                console.log("This is iOS'browser."); //这是iOS平台下浏览器
                Toast("请检查您的网络或重新填写服务器地址");
                this.isIOS = true
              } else {
                Toast("请检查您的网络");
              }
            }
          );
      }
    }
  }
};
</script>
<style scoped>
#big-box {
  padding: 0;
  background: url("../../static/images/audit/record/bg.png") no-repeat 0 0;
  background-size: 100% 100%;
  overflow: hidden;
}

#login_from {
  padding: 0.3rem 0.35rem;
  background: none
}

#login_from > div,
#login_from > div input {
  font-size: 0.18rem;
  background: none
}

#login_from > div input {
  outline: none;
  border: none;
}

/* .input_test {
  margin-bottom: 0.6rem;
} */

.mint-button {
  height: 0.5rem;
  width: 3.05rem;
  border-radius: 0.25rem;
  margin: 0.2rem auto;
}

/* 媒体查询 */
/* 图标样式 */
@media only screen and (max-device-width: 413px) {
  /*iPhone 6 Portrait*/
  #login_title {
    background: url("../../static/images/audit/record/background.png") no-repeat
      center;
  }
}

@media only screen and (min-device-width: 414px) {
  /*iPhone 6+ Portrait*/
  #login_title {
    background: url("../../static/images/audit/record/background@1.5x.png") no-repeat
      center;
  }
}

#login_title {
  width: 100%;
  height: 0.4rem;
  background-size: 2.44rem 0.38rem;
  margin-top: 1.54rem;
}

#compony {
  display: block;
  font-size: 0.12rem;
  margin: 0.1rem auto;
  color: #fff;
  text-align: center;
}
</style>
