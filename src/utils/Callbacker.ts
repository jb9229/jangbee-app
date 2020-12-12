export type Callback = (...args: Array<any>) => void;
export type CallbackArgument = Array<any>;

export class CallbackData
{
  constructor (callback, args)
  {
    this.callback = callback;
    this.callbackArgument = args;
  }

  callback: Callback;
  callbackArgument: CallbackArgument;
}

const events: { [key: string]: CallbackData[] } = {};

export class Callbacker
{
  static add (eventName: string, callback: Callback, parameter?: Array<any>): void
  {
    const handlers = events[eventName] || [];

    handlers.push(new CallbackData(callback, parameter));

    events[eventName] = handlers;
  }

  static trigger (eventName: string, addArg?: any): void
  {
    const handlers = events[eventName];

    if (!handlers || handlers.length === 0) { return }

    handlers.forEach((callbackdata) =>
    {
      const argList = callbackdata.callbackArgument;
      const reSetArguments = new Array<any>();
      if (addArg) { argList.forEach((arg) => arg === undefined ? reSetArguments.push(addArg) : reSetArguments.push(arg)) }
      callbackdata.callback(...reSetArguments);
      console.log('before delete event:', events[eventName]);
      delete events[eventName];
      console.log('after delete event:', events[eventName]);
    });
  }
}
