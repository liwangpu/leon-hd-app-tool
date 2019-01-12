const exec = require('child_process').exec;
const fs = require('fs');
const appConfigPath = '/app/dist/browser/assets/app-config.json';

var appConfig = {
    server: process.env.APISERVER
};
fs.writeFile(appConfigPath, JSON.stringify(appConfig), function (err) {
    if (err) {
        console.error('app config error:', err);
        return;
    }
    console.log('app config ready!');

    exec('node /app/dist/server.js', function (error, stdOut, stdErr) {
        if (error) {
            console.error(error);
            return;
        }
    });
});
