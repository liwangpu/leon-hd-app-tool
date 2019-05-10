// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
import * as QRCode from "qrcode";
import * as fs from "fs";
import * as path from "path";
import * as uuidv1 from 'uuid/v1';
import { generateExcel } from "./src/plugins/order2excel/generate-excel";
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});


app.get('/tool/qrcode', (req, res) => {
  var content = req.query.content;
  var size = req.query.size ? req.query.size : 250;
  var margin = req.query.margin ? req.query.margin : 2;
  var qrcodeType = req.query.type ? req.query.type : 'png';
  if (!content)
    content = "you can see me if you don't pass \"content\" query param";

  let imagePath = path.join(process.cwd(), `${uuidv1()}.${qrcodeType}`);
  QRCode.toFile(imagePath, content, { width: size, margin: margin, type: qrcodeType }, err => {
    if (err)
      res.send(err.toString());
    res.sendFile(imagePath, function () {
      fs.unlink(imagePath, err => { });
    });
  });//toFile
});//get

app.get('/tool/order-export', (req, res) => {
  let orderId = req.query.orderId;
  let apiSrv = req.query.server;
  if (!orderId)
    res.send("query参数orderId不能为空");
  if (!apiSrv)
    res.send("query参数server不能为空");

  generateExcel(apiSrv, orderId).subscribe(execlPath => {
    res.sendFile(execlPath, function () {
      fs.unlink(execlPath, err => { });
    });
  });//generateExcel
});//get


// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
