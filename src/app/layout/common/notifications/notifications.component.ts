import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {MatButton} from '@angular/material/button';
import {interval, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Notification} from 'app/layout/common/notifications/notifications.types';
import {NotificationsService} from 'app/layout/common/notifications/notifications.service';
import {ApprovalHistory} from '../../../main/groups/system-admin/model/approval-history';
import {ApprovalHistoryService} from '../../../main/groups/system-admin/service/approval-history.service';
import {LocalStorageHelper} from '../../../main/core/helper/local-storage.helper';
import {AppUser} from '../../../main/groups/system-admin/model/app-user';
import {ApprovalStatusService} from '../../../main/groups/system-admin/mock-api/approval-status.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../main/shared/constant/confirm.dialog.constant';

@Component({
    selector       : 'notifications',
    templateUrl    : './notifications.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'notifications'
})
export class NotificationsComponent implements OnChanges, OnInit, OnDestroy {
    @Input() notifications: Notification[];
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

    appUser: AppUser;
    historyList: ApprovalHistory[] = new Array<ApprovalHistory>();
    subscription: Subscription;

    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private approvalHistoryService: ApprovalHistoryService,
        private approvalStatusService: ApprovalStatusService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private matDialog: MatDialog,
        private localStorageHelper: LocalStorageHelper
    ) { }

    ngOnInit(): void {
        this.appUser = this.localStorageHelper.getUserInfo();

       /* first get notification date then set interval*/
        this.notifications = [];
        this.getApprovalHistoryList();

        const source = interval(10000);
        this.subscription = source.subscribe(val => this.getApprovalHistoryList());

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this.subscription.unsubscribe();

        // Dispose the overlay
        if ( this._overlayRef ) {
            this._overlayRef.dispose();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log('hit change');
        // if ( 'notifications' in changes ) {
        //     // Store the notifications on the service
        //     this._notificationsService.store(changes.notifications.currentValue);
        // }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------
    getApprovalHistoryList(): any {
        this.approvalHistoryService.getByDefaultUserId(this.appUser.id).subscribe(res => {
            this.historyList = res.data;
            this.workForNotification();
        });
    }

    workForNotification(): void{

        this.historyList.forEach(history => {
            let isPresent = false;
            this.notifications.forEach(noti => {
                if (history.id === Number(noti.id)){
                    isPresent = true;
                    noti.read = history.read;
                    noti.action = history.action;
                }
            });

            if (!isPresent){
                const desc = history.approvalStatus === this.approvalStatusService.BACK_ID ? 'back request from ' : 'approval request from ';
                let icon = '';
                if (history.approvalStatus === this.approvalStatusService.BACK_ID){
                    icon =  'heroicons_outline:exclamation';
                }else if (history.approvalStatus === this.approvalStatusService.NOTIFY_ID){
                    icon =  'heroicons_solid:check';
                }else {
                    icon =  'heroicons_outline:bell';
                }
                this.notifications.push( {
                    id : history.id.toString(),
                    title: history.transactionType,
                    description : history.approvalStatus === this.approvalStatusService.NOTIFY_ID ? 'Request Approved' : desc + history.fromApprovalTeam.name,
                    icon : icon,
                    time : history.entryDate.toString(),
                    read : history.read,
                    action : history.action,
                    link : history.action ? null : history.link,
                    useRouter : history.approvalStatus === this.approvalStatusService.NOTIFY_ID ? false : true,
                    transactionId : history.transactionId
                });
            }

        });

        // Calculate the unread count
        this._calculateUnreadCount();

        // Mark for check
        this._changeDetectorRef.markForCheck();

       /* this.notifications = [];
        this.historyList.forEach(value => {
            this.notifications.push( {
                id : value.id.toString(),
                title: value.transactionType,
                description : 'approval request from ' + value.fromApprovalTeam.name,
                icon : 'heroicons_outline:bell',
                time : value.entryDate.toString(),
                read : value.read,
                action : value.action,
                link : value.action ? null : value.link,
                useRouter : true,
            });

            // Calculate the unread count
            this._calculateUnreadCount();

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });*/
    }

    update(model): any {
        console.log(model);
        this.approvalHistoryService.update(model).subscribe(res => {
            // this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
            this.getApprovalHistoryList();
        }, error => {
            // this.appUtils.onServerErrorResponse(error);
        });
    }



    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------
    showApproveDialog(notification: Notification): void {
        this.toggleRead(notification, false);
        this.openApproveDialog(notification);
    }

    toggleRead(notification: Notification, isToggle: boolean): void {
        // Toggle the read status
        notification.read = isToggle ? !notification.read : true;
        const selectHistory =  this.historyList.find(model => model.id === Number(notification.id));
        selectHistory.read = notification.read;
        // const currentDate = new Date();
        // currentDate.setHours(0, 0, 0, 0);
        selectHistory.readDate = new Date();
        this.update(selectHistory);
    }

    closeNotification(notification: Notification): void {
        console.log('first' + this.notifications.length);
        this.notifications.forEach((value, index) => {
            if (value.id === notification.id) {
                this.notifications.splice(index, 1);
            }
        });
        console.log('then' + this.notifications.length);


        const selectHistory =  this.historyList.find(model => model.id === Number(notification.id));
        selectHistory.close = true;
        this.update(selectHistory);
    }

    openPanel(): void {
        // Return if the notifications panel or its origin is not defined
        if ( !this._notificationsPanel || !this._notificationsOrigin )
        {
            return;
        }

        // Create the overlay if it doesn't exist
        if ( !this._overlayRef )
        {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }

    closePanel(): void
    {
        this._overlayRef.detach();
    }







    // -----------------------------------------------------------------------------------------------------
    // @ helper
    // -----------------------------------------------------------------------------------------------------
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                                  .withLockedPosition()
                                  .withPush(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'top',
                                          overlayX: 'end',
                                          overlayY: 'bottom'
                                      }
                                  ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }


    private _calculateUnreadCount(): void {
        let count = 0;

        if ( this.notifications && this.notifications.length ) {
            count = this.notifications.filter(notification => !notification.read).length;
        }

        this.unreadCount = count;
    }

    private openApproveDialog(notification: Notification): void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '95%';
        dialogConfig.height = '75%';
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {
            transactionId: notification.transactionId
        };

        if (notification.title === this.approvalStatusService.TYPE_LEAVE_APPLICATION){


        }else if (notification.title === this.approvalStatusService.TYPE_COMMON_NOTE){

        }


    }
}
