import { Component, Injectable } from '@angular/core';
import { StorageService } from '../service/api/storage.service';
import { environment } from '../environments/environment';

declare let $: any;
declare let plupload: any;
declare let Qiniu: any;

@Injectable()
export class QiniuService {

  downloadURL = '';
  keystring = '';
  token = '';
  data: object;

  constructor( private storageService: StorageService, ) {
  }

  dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  formUpload(dataUrl, path) {
    const me = this;
    const blob = this.dataURLtoBlob(dataUrl);
    const formData = new FormData();
    const extension = dataUrl.split(';')[0].split('/')[1];
    formData.append('file', blob);
    return new Promise((resolve, rejected) => {
      me.storageService.getToken({
        num: 1,
        key: path,
        bucket: environment.bucket,
        extension: extension
      }).then(data => {
        const result = data['tokens'];
        formData.append('token', result[0]['token']);
        formData.append('key', result[0]['key']);
        $.ajax({
          url: environment.qiniu_domain,
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function (res) {
            resolve(res);
          },
          error: function (res) {
            rejected(res);
          }
        });
      }, error => {
        rejected(error);
      });
    });

  }

  init( params: { browse_button?, max_file_size?, init?, data?, container?, path? } ) {
    const me = this;
    const uploader = new plupload.Uploader( {
      runtimes: 'html5,flash,html4',    // 上传模式,依次退化
      browse_button: params[ 'browse_button' ],       // 上传选择的点选按钮，**必需**
      save_key: false,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
      domain: environment.upload_url,   // bucket 域名，下载资源时用到，**必需**
      max_file_size: params[ 'max_file_size' ],           // 最大文件体积限制
      flash_swf_url: 'plupload/js/plupload/Moxie.swf',  // 引入flash,相对路径
      url: environment.qiniu_domain,
      max_retries: 3,                   // 上传失败最大重试次数
      dragdrop: true,                   // 开启可拖曳上传
      multipart: true,
      multipart_params: { 'token': '', 'key': '' },
      // chunk_size: '400kb',                // 分块上传时，每片的体积
      auto_start: false,                 // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
      filters: {
        max_file_size: params[ 'max_file_size' ],
        mime_types: [ {
          title: 'Image files',
          extensions: 'jpg,gif,png,jpeg'
        } ],
        prevent_duplicates: false // 不允许选取重复文件
      },
      init: {
        'FilesAdded': function ( up, files ) {
          if ( params[ 'init' ][ 'FilesAdded' ] ) {
            params[ 'init' ][ 'FilesAdded' ](up, files);
          }
          me.storageService.getToken( {
            num: 1,
            key: params.path,
            bucket: environment.bucket,
            extension: files[0].type.split('/')[1]
          } ).then( data => {
            const result = data[ 'tokens' ];
            up.setOption( 'multipart_params', { token: result[ 0 ][ 'token' ], key: result[ 0 ][ 'key' ] } );
            up.start();
          }, error => {
          } );
        },
        'BeforeUpload': function ( up, file ) {
          if ( params[ 'init' ][ 'BeforeUpload' ] ) {
            params[ 'init' ][ 'BeforeUpload' ](up, file);
          }
          me.storageService.getToken( {
            num: 1,
            key: params.path,
            bucket: environment.bucket,
            extension: file.type.split('/')[1]
          } ).then( data => {
            const result = data[ 'tokens' ];
            up.setOption( 'multipart_params', { token: result[ 0 ][ 'token' ], key: result[ 0 ][ 'key' ] } );
            up.start();
          }, error => {
          } );
          // 每个文件上传前,处理相关的事情
        },
        'UploadProgress': function ( up, file ) {
          if ( params[ 'init' ][ 'UploadProgress' ] ) {
            params[ 'init' ][ 'UploadProgress' ](file.percent);
          }
          // 每个文件上传时,处理相关的事情
        },
        'FileUploaded': function ( up, file, info ) {
          // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
          const domain = up.getOption( 'domain' );
          const res = JSON.parse( info.response );
          const sourceLink = domain + res.key; // 获取上传成功后的文件的Url
          if ( params[ 'init' ][ 'FileUploaded' ] ) {
            params[ 'init' ][ 'FileUploaded' ](up, sourceLink);
          }
        },
        'Error': function ( up, err, errTip ) {
          if ( params[ 'init' ][ 'Error' ] ) {
            params[ 'init' ][ 'Error' ]( up, err.code );
          }
        },
        'UploadComplete': function () {
          // 队列文件处理完毕后,处理相关的事情
        }
      }
    } );
    uploader.init();
  }

  destroy( obj ) {
    obj.destroy();
  }

  private errorTip( code ) {
    let tipstr = '';
    switch ( code ) {
      case -100: {
        tipstr = '上传出错了';
      }
        break;
      case -200: {
        tipstr = '服务器端错误';
      }
        break;
      case -300: {
        tipstr = '文件读写错误';
      }
        break;
      case -400: {
        tipstr = '上传出错了';
      }
        break;
      case -500: {
        tipstr = '初始化时发生错误';
      }
        break;
      case -600: {
        tipstr = '选择的文件太大';
      }
        break;
      case -601: {
        tipstr = '选择的文件类型不符合要求';
      }
        break;
      case -602: {
        tipstr = '选取了重复的文件';
      }
        break;
      case -700: {
        tipstr = '图片格式错误';
      }
        break;
      case -702: {
        tipstr = '文件大小超过所能处理的最大值';
      }
        break;
    }
    return tipstr;
  }
}
