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
import {Message} from 'app/layout/common/messages/messages.types';
import {MessagesService} from 'app/layout/common/messages/messages.service';
import {CommonMessageHistoryService} from '../../../main/groups/system-admin/service/common-message-history.service';
import {LocalStorageHelper} from '../../../main/core/helper/local-storage.helper';
import {CommonMessageHistory} from '../../../main/groups/system-admin/model/common-message-history';
import {ValidationMessage} from '../../../main/core/constants/validation.message';
import {Router} from '@angular/router';
import {AppUtils} from '../../../main/core/utils/app.utils';
@Component({
    selector: 'messages',
    templateUrl: './messages.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'messages'
})
export class MessagesComponent implements OnInit, OnChanges, OnDestroy {
    @Input() messages: Message[];
    @ViewChild('messagesOrigin') private _messagesOrigin: MatButton;
    @ViewChild('messagesPanel') private _messagesPanel: TemplateRef<any>;

    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    userName: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    messageList: CommonMessageHistory[];
    validationMsg: ValidationMessage = new ValidationMessage();
    subscription: Subscription;
    prefixUrl: string;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _messagesService: MessagesService,
        private _overlay: Overlay,
        private modelService: CommonMessageHistoryService,
        private _viewContainerRef: ViewContainerRef,
        private localStorageHelper: LocalStorageHelper,
        private router: Router,
        private appUtils: AppUtils,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        // Messages
        if ('messages' in changes) {
            // Store the messages on the service
            this._messagesService.store(changes.messages.currentValue);
        }
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.prefixUrl = this.appUtils.getPrefixUrl();
        this.getUserId();
        this.getMessageList();
        this.messages = [];

        const source = interval(10000);
        this.subscription = source.subscribe(val => this.getMessageList());
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this.subscription.unsubscribe();

        // Dispose the overlay
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    getMessageList(): any {
        this.modelService.getByUsername(this.userName).subscribe(res => {
            this.messageList = res.data;
            this.generateMessageFromHistory();
        });
    }

    generateMessageFromHistory(): any {
        this.messageList.forEach(value => {
            let isPresent = false;
            this.messages.forEach(msg => {
                if (value.id === Number(msg.id)) {
                    isPresent = true;
                    msg.read = value.read;
                    msg.action = value.action;
                }
            });

            if (!isPresent) {
                this.messages.push({
                    id: value.id.toString(),
                    title: value.transactionType,
                    description: value.message,
                    icon: null,
                    time: value.entryDate.toString(),
                    read: value.read,
                    action : value.action,
                    link: value.action ? null : value.link,
                    useRouter: true,
                    transactionId: value.transactionId
                });
            }
        });

        // Calculate the unread count
        this._calculateUnreadCount();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    getUserId(): any {
        const userInfo = this.localStorageHelper.getUserInfo();
        this.userName = userInfo.username;
    }

    /**
     * Open the messages panel
     */
    openPanel(): void {
        // Return if the messages panel or its origin is not defined
        if (!this._messagesPanel || !this._messagesOrigin) {
            return;
        }

        // Create the overlay if it doesn't exist
        if (!this._overlayRef) {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._messagesPanel, this._viewContainerRef));
    }

    /**
     * Close the messages panel
     */
    closePanel(): void {
        this._overlayRef.detach();
    }

    /**
     * Mark all messages as read
     */
    markAllAsRead(): void {
        // Mark all as read
        this._messagesService.markAllAsRead().subscribe();
    }

    update(model): any {
        console.log(model);
        this.modelService.update(model).subscribe(res => {
            this.getMessageList();
        }, error => {});
    }

    /**
     * Toggle read status of the given message
     */
    toggleRead(message: Message, isToggle: boolean): void {
        // Toggle the read status
        message.read = isToggle ? !message.read : true;
        const selectHistory =  this.messageList.find(model => model.id === Number(message.id));
        selectHistory.read = message.read;
        selectHistory.readDate = new Date();
        this.update(selectHistory);
    }

    /**
     * Delete the given message
     */
    delete(message: Message): void {
        this.messages.forEach((value, index) => {
            if (value.id === message.id) {
                this.messages.splice(index, 1);
            }
        });

        const selectHistory =  this.messageList.find(model => model.id === Number(message.id));
        selectHistory.close = true;
        this.update(selectHistory);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._messagesOrigin._elementRef.nativeElement)
                .withLockedPosition()
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom'
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top'
                    },
                    {
                        originX: 'end',
                        originY: 'top',
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

    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void {
        let count = 0;

        if (this.messages && this.messages.length) {
            count = this.messages.filter(message => !message.read).length;
        }

        this.unreadCount = count;
    }

    showFileListDialog(message: Message): any {
        this.toggleRead(message, false);
        this.router.navigateByUrl(
            message.link,
            {state: message}
        );
    }

}
