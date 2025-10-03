let fbPromise = null;

export const loadFbSdk = (APP_ID) => {
  if (fbPromise) return fbPromise;

  fbPromise = new Promise((resolve, reject) => {
    if (window.FB && window.FB.init) {
      resolve(window.FB);
      return;
    }

    window.fbAsyncInit = () => {
      try {
        window.FB.init({
          appId: APP_ID,
          cookie: true,
          xfbml: true,
          version: "v17.0",
        });
        window.FB.AppEvents.logPageView();
        setTimeout(() => resolve(window.FB), 50);
      } catch (err) {
        reject(err);
      }
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.id = "facebook-jssdk";
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return fbPromise;
};

export const resetFbSdk = () => {
    fbPromise = null;
    try {
        if (window.FB) {
            delete window.FB;
        }
        const script = document.getElementById("facebook-jssdk");
        if (script) script.remove();
    } catch (e) {
        console.warn(e);
    }
};
