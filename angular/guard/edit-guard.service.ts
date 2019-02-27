import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {FirstStepComponent} from '../../app/user/scene-publish/first-step/first-step.component';
import {Observable} from 'rxjs/Observable';
import {DialogService} from '../../app/shared/dialog/dialog.service';
import {Globals} from '../../app/shared/bus/globals';

@Injectable()
export class EditGuard implements CanDeactivate<FirstStepComponent> {
  constructor(private dialogService: DialogService, private globals: Globals) {
  }

  canDeactivate(component: FirstStepComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable((observer) => {
      if (this.globals.scene_publish_step === 3) {
        observer.next(true);
        return;
      }
      this.dialogService.dialog({
        body: '离开页面数据将不会保存',
        ok: '离开',
        no: '留下',
        showCancel: true
      }).afterClose().subscribe(res => {
        if (res) {
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
