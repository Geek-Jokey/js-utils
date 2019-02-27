import {ValidatorFn, AbstractControl, FormGroup} from '@angular/forms';

export {validate, onValueChanged, ItaRegExp};

function validate(type: string, regex: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    // 获取当前控件的内容
    const str = control.value;
    // 设置我们自定义的严重类型
    const res = {};
    res[type] = {str};
    // 如果验证通过则返回 null 否则返回一个对象（包含我们自定义的属性）
    return regex.test(str) ? null : res;
  };
}

// 每次数据发生改变时触发此方法
function onValueChanged(options: {form: FormGroup, errors, validateMsg}, checkAll?: Boolean) {
  // 如果表单不存在则返回
  if (!options.form) return;

  // 遍历错误消息对象
  for (const field in options.errors) {
    // 清空当前的错误消息
    options.errors[field] = '';
    // 获取当前表单的控件
    const control = options.form.get(field);

    // 当前表单存在此空间控件 && 此控件没有被修改 && 此控件验证不通过
    if ( control && (checkAll || control.dirty) && !control.valid) {
      // 获取验证不通过的控件名，为了获取更详细的不通过信息
      const messages = options.validateMsg[field];
      // 遍历当前控件的错误对象，获取到验证不通过的属性
      for (const key in control.errors) {
        // 把所有验证不通过项的说明文字拼接成错误消息
        // options.errors[field] += messages[key] + '\n';
        options.errors[field] = messages[key];
        break;
      }
    }
  }
}

const ItaRegExp = {
  phone: /^(1[3-9]|9[2,8])\d{9}$/
};
