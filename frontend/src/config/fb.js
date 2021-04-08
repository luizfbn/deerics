export const initFbsdk = () => {
    return new Promise(() => {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId : process.env.VUE_APP_FACE_APP_ID,
          cookie : true,
          xfbml : true,
          version : 'v2.8'
        })
      };
      (function(d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) return
        js = d.createElement(s)
        js.id = id
        js.src = "//connect.facebook.net/pt_BR/sdk.js"
        fjs.parentNode.insertBefore(js, fjs)
      }(document, 'script', 'facebook-jssdk'))
    })
  }