import { generateExcel } from "./generate-excel";


let apiSrv: string = "http://testapi.damaozhu.com.cn/";

// let excelPath = generateExcel(order, apiSrv);
// console.log(`excel path is:${excelPath}`);

// generateExcel(order, apiSrv).then((excelPath: any) => {
//     console.log(`excel path is:`, excelPath);
// });
// generateExcel(apiSrv, 'Y6UEA3Z79JZNVQ').then((excelPath: any) => {
//     console.log(`excel path is:`, excelPath);
// });

generateExcel(apiSrv, 'Y6UEA3Z79JZNVQ').subscribe((excelPath: any) => {
    console.log(`excel path is:`, excelPath);
});








