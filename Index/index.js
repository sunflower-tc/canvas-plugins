/**
 * Created by lvlq on 15/11/7.
 */
var page = require("./controller/pageController");
module.exports = function (app) {
    app.use("/upload", page.upload);
    app.use("/share", page.showshare);
    app.use("/getprize", page.getPrize);
    app.use("/addinfo", page.addinfo);
    app.use("/addzan", page.addzan);
    app.use("/getzan", page.getzan);
    app.use("/", page.dispaly);

};