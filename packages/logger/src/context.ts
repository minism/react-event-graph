export interface IEventGraphContext {
  span<T>(
    eventName: string,
    cb: (ctx: IEventGraphContext) => Promise<T>
  ): Promise<T>;
}
