import json2csv from 'json2csv';
import moment from 'moment';

export default handleExport;

function handleExport({
  data = [],
  fields = [],
  fileName = `${moment().format('YYYYMMDDHHmmss')}.csv`,
  charset = 'UTF-8',
} = {}) {
  try {
    let result = json2csv.parse(data, {
      fields,
    });
    if (MyBrowserIsIE()) {
      let BOM = '\uFEFF';
      let csvData = new Blob([BOM + result], { type: 'text/csv' });
      navigator.msSaveBlob(csvData, fileName);
    } else {
      let csvContent = result;
      createDownLoadClick(csvContent, fileName, charset);
    }
  } catch (err) {
    console.log(err);
  }
}

function MyBrowserIsIE() {
  let isIE = false;
  if (navigator.userAgent.indexOf('compatible') > -1 && navigator.userAgent.indexOf('MSIE') > -1) {
    isIE = true;
  }
  if (navigator.userAgent.indexOf('Trident') > -1) {
    isIE = true;
  }
  return isIE;
}

function createDownLoadClick(content, fileName, charset) {
  let link = document.createElement('a');
  if (charset !== 'UTF-8') {
    link.href = `data:text/csv;charset=${charset},${encodeURIComponent(content)}`;
  } else {
    link.href = `data:text/csv;charset=${charset},\ufeff${encodeURIComponent(content)}`;
  }
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
