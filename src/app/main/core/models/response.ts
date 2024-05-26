export interface IResponseHeader {
  requestReceivedTime: Date;
  responseTime: Date;
  hopCount: number;
  responseProcessingTimeInMs: number;
  requestId: string;
  responseCode: string;
  responseMessage: string;
  responseVersion: string;
  requestSourceService: string;
  traceId: string;
}

// tslint:disable-next-line:no-empty-interface
export interface IResponseData {
}

export interface IResponseBody<D extends IResponseData> {
    content: D[];
    pageable: {};
    totalElements: number;
}

export interface IResponse<D extends IResponseData> {
  res: any;
  header: IResponseHeader;
  // meta: Object;
  body: IResponseBody<D>;
}
