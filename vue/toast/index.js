import toast from './toast'
import vue from 'vue'

const Toast = vue.extend(toast);
let timer = null;
const ToastDom = new Toast({
  el: document.createElement('div'),
  data() {
    return {
      msg: '',
      show: false,
      position: 'bottom'
    }
  }
});

document.body.appendChild(ToastDom.$el);

export default {show};

function show(msg, duration, position)  {
  ToastDom.msg = msg;
  ToastDom.show = true;
  ToastDom.position = position?position: 'bottom';
  clearTimeout(timer);
  timer = setTimeout(()=> {
    ToastDom.show = false;
    ToastDom.msg = ''
  }, duration)
}
