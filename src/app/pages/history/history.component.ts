import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';

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
        class="close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" style="white-space: pre-wrap">
      {{ lastSubmittedString }}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-success" (click)="copyString()">
        Copy String
      </button>
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

  constructor(private clipboard: Clipboard,public activeModal: NgbActiveModal) {}

  public copyString() {
    this.clipboard.copy(this.lastSubmittedString);
    Swal.fire({
      icon: 'success',
      title: 'String copied',
      showConfirmButton: false,
      timer: 1500,
    });
  }
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
