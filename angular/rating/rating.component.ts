import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit, OnChanges {
  @Input() size;
  @Input() disabled = false;
  @Input() score;
  @Output() rateHoverEmitter: EventEmitter<number> = new EventEmitter();
  @Output() rateLeaveEmitter: EventEmitter<number> = new EventEmitter();
  @Output() rateClickEmitter: EventEmitter<number> = new EventEmitter();
  init = 0;
  clickable = false;
  dataList: Rate[] = [{
    status: 0
  }, {
    status: 0
  }, {
    status: 0
  }, {
    status: 0
  }, {
    status: 0
  }];

  constructor() {
  }

  ngOnInit() {
    this.onInit(this.score);
  }

  ngOnChanges() {
    if (this.disabled) {
      this.onInitDisabled(this.score);
    }
  }

  statusClass(status) {
    return {
      'default': status === 0,
      'hover': status === 1,
      'half': status === 2,
      'active': status === 3,
      'disabled': status === 4,


    };
  }

  onInitDisabled(index) {
    this.dataList.forEach((item, idx) => {
      if (index >= idx + 1) {
        item.status = 3;
      } else if (index > idx) {
        item.status = 2;
      } else {
        item.status = 4;
      }
    });

  }

  onInit(index) {
    this.dataList.forEach((item, idx) => {
      if (index > idx) {
        item.status = 3;
      } else {
        item.status = 0;
      }
    });
  }

  onHover(index) {
    if (this.disabled || this.clickable) {
      return;
    }
    this.dataList.forEach((item, idx) => {
      if (idx > index) {
        return;
      }
      item.status = 1;
    });
    this.rateHoverEmitter.emit(index + 1);
  }

  onLeave() {
    if (this.disabled || this.clickable) {
      return;
    }
    this.dataList.forEach(item => item.status = 0);
    this.rateLeaveEmitter.emit(this.init);
  }

  onClick(index) {
    if (this.disabled) {
      return;
    }
    this.clickable = true;
    this.dataList.forEach((item, idx) => {
      if (idx > index) {
        item.status = 4;
      } else {
        item.status = 3;
      }
    });
    this.rateClickEmitter.emit(index + 1);
  }

}

const enum RatingStatus {
  DEFAULT,
  ACTIVE,
  DISABLED
}

class Rate {
  status: RatingStatus;
}
