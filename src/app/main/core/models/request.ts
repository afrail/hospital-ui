export interface IRequestHeader {
  requestId: string;
  requestSource: string;
  requestSourceService: string;
  requestClient: string;
  requestType: string;
  requestTime: string;
  requestVersion: string;
  requestTimeoutInSeconds: number;
  requestRetryCount: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBody {
}

export interface IPageableRequestBodyDTO {
  page: number;
  size: number;
}

export interface IUuidHolderRequestBody {
  uuid: string;
}

export interface IIdUuidHolderRequestBody {
  id: number;
  uuid: string;
}

export interface INameHolderRequestBody extends IIdUuidHolderRequestBody{
  nameEn: string;
  nameBn: string;
}

export interface IUuidsHolderRequestBody {
  uuids: string[];
}

export interface IValueUuidsHolderRequestBody {
  value: string;
  uuids: string[];
}

export interface IValueHolderRequestBody {
  value: string;
}

export interface IUuidValuesHolderRequestBody {
  uuid: string;
  values: string[];
}

export interface IValuesHolderRequestBody {
  value: string[];
}

export interface IGetListByUuidSetHolderRequestBody {
  uuids: string[];
  strict?: string;
}

export interface IRequest<T extends IRequestBody> {
  header: IRequestHeader;
  meta: {};
  body: T;
}


