declare module 'express-async-handler' {
    import { RequestHandler } from 'express';
    function expressAsyncHandler<T extends RequestHandler>(handler: T): T;
    export = expressAsyncHandler;
  }