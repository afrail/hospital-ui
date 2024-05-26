interface  CommonResponse {
    status: boolean;
    message: string;
    messageBn: string;
}

export interface CommonResponseObject<D> extends CommonResponse{
    data: D;
}

export interface CommonResponseList<D> extends CommonResponse{
    data: D[];
}

export interface CommonResponsePageable<D> extends CommonResponse{
    data: Pageable<D>;
}

export interface Pageable<D> {
    content: D[];
    pageable: {};
    totalElements: number;
}
