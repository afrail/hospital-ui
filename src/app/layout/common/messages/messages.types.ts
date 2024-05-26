export interface Message
{
    id: string;
    icon?: string;
    image?: string;
    title?: string;
    description?: string;
    time: string;
    transactionId?: number;
    link?: string;
    useRouter?: boolean;
    read: boolean;
    action?: boolean;
}
