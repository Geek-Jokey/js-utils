import { Injectable } from '@angular/core';
import { StorageService } from '../service/api/storage.service';
import { environment } from '../environments/environment';

declare let plupload: any;

@Injectable()
export class UpyunService {

  constructor( private storageService: StorageService ) {

  }

  init( params: { container?, browse_button?, max_file_size?, init?, data?, file_limit? } ) {
    const me = this;
    return new plupload.Uploader( {
      container: params[ 'container' ],
      runtimes: 'html5,flash,html4',    // 上传模式,依次退化
      browse_button: params[ 'browse_button' ],       // 上传选择的点选按钮，**必需**
      save_key: false,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
      domain: environment.ypyun_video_domain,   // bucket 域名，下载资源时用到，**必需**
      max_file_size: params[ 'max_file_size' ],           // 最大文件体积限制
      flash_swf_url: 'plupload/js/plupload/Moxie.swf',  // 引入flash,相对路径
      url: environment.ypyun_video_url + environment.ypyun_video_bucket,
      dragdrop: true,                   // 开启可拖曳上传
      // chunk_size: '100kb',                // 分块上传时，每片的体积
      auto_start: false, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
      max_retries: 3,
      multi_selection: params[ 'file_limit' ] > 1 ? true : false, // 是否可以多次上传
      filters: {
        max_file_size: params[ 'max_file_size' ],
        mime_types: [ {
          title: 'Video files',
          extensions: 'mp4'
        } ],
        prevent_duplicates: false // 不允许选取重复文件
      },
      init: {
        'FilesAdded': function ( up, files ) {
          if ( params[ 'init' ][ 'FilesAdded' ] ) {
            if ( params[ 'init' ][ 'FilesAdded' ] ) {
              plupload.each( files, function ( file ) {
                // 文件添加进队列后,处理相关的事情
                const date = new Date();
                const year = date.getFullYear();
                const mon = date.getMonth() + 1;
                const day = date.getDate();
                const randomTime = date.getTime();
                me.storageService.getVideoSignature( {
                  uri: `/${year}/${mon}/${day}/scene/${randomTime}.${file.name.split( '.' )[ 1 ]}`,
                  method: 'POST',
                } ).then( data => {
                  const result = data[ 'upyun' ];
                  up.setOption( 'multipart_params', {
                    'Filename': file.name,
                    'signature': result[ 'signature' ],
                    'policy': result[ 'policy' ],
                    'Content-Type': '',
                  } );
                  up.start();
                }, error => {
                  if ( params[ 'init' ][ 'Error' ] ) {
                    params[ 'init' ][ 'Error' ]( file, error );
                  }
                  console.log( 'error', '上传失败', error );
                } );
              } );
            }
          }
        },
        'BeforeUpload': function ( up, file ) {
          // 每个文件上传前,处理相关的事情
          if ( params[ 'init' ][ 'BeforeUpload' ] ) {
            params[ 'init' ][ 'BeforeUpload' ]( up, file );
          }
        },
        'UploadProgress': function ( up, file ) {
          // 每个文件上传时,处理相关的事情
          if ( params[ 'init' ][ 'UploadProgress' ] ) {
            params[ 'init' ][ 'UploadProgress' ]( up, file );
          }
        },
        'FileUploaded': function ( up, file, info ) {
          const domain = up.getOption( 'domain' );
          const res = JSON.parse( info.response );
          const sourceLink = domain + res.url; // 获取上传成功后的文件的Url
          if ( params[ 'init' ][ 'FileUploaded' ] ) {
            params[ 'init' ][ 'FileUploaded' ]( file, sourceLink );
          }
        },
        'Error': function ( up, err, errTip ) {
          console.log( 'error', '上传失败', err.message || me.errorTip( err.code ) );
          if ( params[ 'init' ][ 'Error' ] ) {
            params[ 'init' ][ 'Error' ]( err.file, err.code );
          }
        },
        'UploadComplete': function () {
          // 队列文件处理完毕后,处理相关的事情
        }
      }
    } );
  }

  destroy( obj ) {
    obj.destroy();
  }

  errorTip( code ) {
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
