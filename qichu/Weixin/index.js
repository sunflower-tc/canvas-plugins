/**
 * Created by lvlq on 15/9/24.
 */
var oauthService = require("./controller/oauthController");
var jsapiService = require("./controller/jsapiController");

module.exports = function (app) {
    app.use("/oauth/getUrl", oauthService.getUrl);
    //app.use("/oauth/getUrlForWeb", oauthService.getUrlForWeb);
    app.use("/oauth/getOauth", oauthService.getOauth);
    app.use("/oauth/getOauthUserInfo", oauthService.getOauthUserInfo);

    app.use("/jsapi/getJsConfig", jsapiService.getJsConfig);
    //app.use("/jsapi/getCardExt", jsapiService.getCardExt);
    //app.use("/jsapi/getTicket", jsapiService.getTicket);
    //app.use("/jsapi/getLatestTicket", jsapiService.getLatestTicket);
};