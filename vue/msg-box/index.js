import msgBox from './msg-box'
import vue from 'vue'

const MsgBox = vue.extend(msgBox);
let timer = null;
const MsgBoxDom = new MsgBox({
  el: document.createElement('div'),
  data() {
    return {
      content: '',
      show: false,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonClass: null,
      cancelButtonClass: null
    }
  }
});

document.body.appendChild(MsgBoxDom.$el);

export default {show}

function show(options = {})  {
  let {content,confirmButtonText,cancelButtonText,confirmButtonClass,cancelButtonClass,cancel,confirm} = {...options};
  MsgBoxDom.show = true;
  MsgBoxDom.content = content;
  MsgBoxDom.confirmButtonText = confirmButtonText ? confirmButtonText: '确定';
  MsgBoxDom.cancelButtonText = cancelButtonText ? cancelButtonText: '取消';
  MsgBoxDom.confirmButtonClass = confirmButtonClass;
  MsgBoxDom.cancelButtonClass = cancelButtonClass;
  MsgBoxDom.cancel = function() {
    MsgBoxDom.show = false;
    cancel && cancel();
  };
  MsgBoxDom.confirm = function () {
    MsgBoxDom.show = false;
    confirm && confirm();
  }
}
