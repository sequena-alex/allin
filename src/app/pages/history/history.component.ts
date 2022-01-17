import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


interface History {
  playerCount: number;
  adminFunds: number;
  playerPondo: number;
  totalProfit: number;
  totalOverBet: number;
  alamat: number;
  dutyProfit: number;
  lastSubmittedString?: string;
  lastSubmittedResults?: string;
  currentAlamat?: number;
  lastAlamat?: number;
  created_at?: Date;
}

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Last Submitted String</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body">
      {{ lastSubmittedString }}
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-dark"
        (click)="activeModal.close('Close click')"
      >
        Close
      </button>
    </div>
  `,
})
export class NgbdModalContent {
  @Input() lastSubmittedString: any;

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  public histories: History[] = [];
  public pagedHistories: History[] = [];
  page = 1;
  pageSize = 100;
  collectionSize = 0;
  constructor(
    private dataService: DataService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.dataService.getHistories().subscribe((data: any) => {
      this.histories = data;
      this.collectionSize = this.histories.length;
      this.refreshHistories();
    });
  }

  refreshHistories() {
    this.pagedHistories = this.histories
      .map((history, i) => ({ id: i + 1, ...history }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }

  viewSubmittedString(lastSubmittedString?: string) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.lastSubmittedString = lastSubmittedString;
  }
}
