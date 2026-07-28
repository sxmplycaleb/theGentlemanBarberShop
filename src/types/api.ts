export interface ApiSuccess<TData> {
  readonly data: TData;
  readonly success: true;
}
