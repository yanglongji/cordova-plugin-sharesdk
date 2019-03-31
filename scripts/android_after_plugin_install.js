module.exports = function(context) {

    var cordova_util = context.requireCordovaModule("cordova-lib/src/cordova/util"),
        ConfigParser = context.requireCordovaModule('cordova-common').ConfigParser,
        path = require('path'),
        fs = require('fs');

    var xml = cordova_util.projectConfig(context.opts.projectRoot);
    var cfg = new ConfigParser(xml);

    var packageName = cfg.packageName();

    var androidPlatformDir = path.join(context.opts.projectRoot,'platforms', 'android');
    var cordova7 = path.join(androidPlatformDir, 'app', 'src', 'main', 'res', 'xml', 'config.xml');
    var wxapiPath = context.opts.projectRoot + '/platforms/android/' + (fs.existsSync(cordova7) ? 'app/src/main/java' : 'src') + '/' + packageName.replace(/\./g, '/') + '/wxapi';
    var WXEntryActivityPath = wxapiPath + '/WXEntryActivity.java';

    fs.readFile(context.opts.projectRoot + '/plugins/cordova-plugin-sharesdk/src/android/ShareSDK/src/behring/cordovasharesdk/wxapi/WXEntryActivity.java', 'utf8', function(err, data) {
        if (err) throw err;
        var result = data.replace(/PACKAGENAME/g, packageName);
        fs.exists(wxapiPath, function(exists) {
            if (!exists) fs.mkdir(wxapiPath);

            fs.exists(WXEntryActivityPath, function(fexists) {
                if (fexists) console.log(WXEntryActivityPath + ' is exists, Not be replaced.');
                else {
                    fs.writeFile(WXEntryActivityPath, result, 'utf8', function(err) {
                        if (err) throw err;
                    });
                }
            });
        });
    });
}
