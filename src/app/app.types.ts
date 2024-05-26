import {FuseNavigationItem} from '@fuse/components/navigation';
import {Message} from 'app/layout/common/messages/messages.types';
import {Notification} from 'app/layout/common/notifications/notifications.types';
import {User} from './main/core/user/user.model';


export interface InitialData
{
    messages: Message[];
    navigation: {
        security: FuseNavigationItem[],
        adminstration: FuseNavigationItem[],
        futuristic: FuseNavigationItem[],
        horizontal: FuseNavigationItem[]
    };
    notifications: Notification[];
    user: User;
}
