import { Order } from "./order";
import * as fs from "fs";
import { from } from 'rxjs';
import * as path from "path";
import * as uuidv1 from 'uuid/v1';
import * as download from 'download';
import * as xl from "excel4node";
import * as request from 'request';
import { Observable } from "rxjs/internal/Observable";

export function generateExcel(apiSrv: string, orderId: string, iconSize: number = 128): Observable<any> {
    //为了防止apiSrv后尾含有/,手动检查一下
    apiSrv = apiSrv[apiSrv.length - 1] == "/" ? apiSrv.slice(0, apiSrv.length - 1) : apiSrv;
    let tmpDir = path.join(process.cwd(), "tmp");
    let imageTmpDir = path.join(tmpDir, "order-icon-cache");
    if (!fs.existsSync(tmpDir))
        fs.mkdirSync(tmpDir);
    if (!fs.existsSync(imageTmpDir))
        fs.mkdirSync(imageTmpDir);

    return from(new Promise((resolve, reject) => {
        request(`${apiSrv}/order/${orderId}`, { json: true }, (err, res, body) => {
            if (err) { reject(err); }
            let order: Order = body;

            let imageDownloadUrlArr: string[] = [];
            if (order && order.orderDetails && order.orderDetails.length > 0) {
                for (let i = 0, len = order.orderDetails.length; i < len; i++) {
                    let it = order.orderDetails[i];
                    let dotIdx = it.icon.lastIndexOf('.');
                    let prefix = it.icon.slice(0, dotIdx);
                    let postfix = it.icon.slice(dotIdx + 1, it.icon.length);
                    let fileName = `${apiSrv}/${prefix}_${iconSize}.${postfix}`;
                    if (!fs.existsSync(fileName))
                        imageDownloadUrlArr.push(`${apiSrv}/${prefix}_${iconSize}.${postfix}`);
                }
            }

            //下载产品规格icon信息
            let imageDownloadPromise: Promise<any> = Promise.all(imageDownloadUrlArr.map(x => download(x, imageTmpDir)));
            //生成表格
            let createExcelPromise = () => {
                let execlPath = path.join(tmpDir, `${uuidv1()}.xlsx`);
                let detailRowStart = 2;
                let iconRowWidth = 17;
                let iconColumnHeight = 102;
                let wb = new xl.Workbook();

                let orderSheet = wb.addWorksheet('订单信息');

                //通用黑色边框
                let commonBlackBorder = {
                    style: "thin",
                    color: '000000'
                };
                let detailTableBoderStyle = {
                    left: commonBlackBorder,
                    right: commonBlackBorder,
                    top: commonBlackBorder,
                    bottom: commonBlackBorder,
                };
                let detailTableHeaderStyle = {
                    alignment: {
                        horizontal: ['center'],
                        vertical: ['center'],
                    },
                    border: detailTableBoderStyle,
                    font: {
                        bold: true
                    }
                };
                let detailTableBodyStyle = {
                    alignment: {
                        horizontal: ['center'],
                        vertical: ['center'],
                        wrapText: true
                    },
                    border: detailTableBoderStyle
                };

                orderSheet.cell(detailRowStart, 1).string("序号").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 2).string("图片").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 3).string("产品名称").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 4).string("规格").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 5).string("品牌").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 6).string("单位").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 7).string("数量").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 8).string("单价").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 9).string("小计").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 10).string("材质").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 11).string("面料").style(detailTableHeaderStyle);
                orderSheet.cell(detailRowStart, 12).string("备注").style(detailTableHeaderStyle);
                orderSheet.row(detailRowStart).setHeight(24);
                orderSheet.column(2).setWidth(iconRowWidth);
                if (order && order.orderDetails && order.orderDetails.length > 0) {

                    for (let i = 0, len = order.orderDetails.length; i < len; i++) {
                        let it = order.orderDetails[i];
                        let currentRow = detailRowStart + 1 + i;
                        orderSheet.row(currentRow).setHeight(iconColumnHeight);
                        orderSheet.cell(currentRow, 1).number(i + 1); //序号
                        let imageDowloadUrl = imageDownloadUrlArr[i];
                        let slashIdx = imageDowloadUrl.lastIndexOf('/');
                        let imageFileName = path.join(imageTmpDir, imageDowloadUrl.slice(slashIdx + 1, imageDowloadUrl.length));
                        orderSheet.addImage({
                            path: imageFileName,
                            type: 'picture',
                            position: {
                                type: 'oneCellAnchor',
                                from: {
                                    col: 2,
                                    colOff: '.1mm',
                                    row: currentRow,
                                    rowOff: '.1mm'
                                },
                            },
                        });
                        orderSheet.cell(currentRow, 3).string(it.productName); //产品名称
                        orderSheet.cell(currentRow, 4).string(it.productSpecName); //规格
                        orderSheet.cell(currentRow, 5).string(it.productBrand); //品牌
                        orderSheet.cell(currentRow, 6).string(it.productUnit); //单位
                        orderSheet.cell(currentRow, 7).number(it.num); //数量
                        orderSheet.cell(currentRow, 8).number(it.unitPrice); //单价
                        orderSheet.cell(currentRow, 9).number(it.totalPrice); //小计
                    }//for
                    orderSheet.cell(detailRowStart + 1, 1, detailRowStart + order.orderDetails.length, 12).style(detailTableBodyStyle);
                }//if


                wb.write(execlPath);
                return Promise.resolve(execlPath);
            }//createExcelPromise

            imageDownloadPromise.then(createExcelPromise).then(ps => {

                resolve(ps);
            });
        });//request
    }));//from
}//generateExcel






