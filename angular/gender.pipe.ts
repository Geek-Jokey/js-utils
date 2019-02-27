import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'gender'})
export class GenderPipe implements PipeTransform {
  transform(value: string): string {
    let gender: string;
    switch (value) {
      case 'Male':
        gender = '男';
        break;
      case 'Female':
        gender = '女';
        break;
      case 'Unknown':
        gender = '未知';
        break;
      default:
        gender = '';
        break;
    }
    return gender;
  }
}
