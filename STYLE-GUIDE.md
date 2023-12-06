# STYLE GUIDE

This is the Style Guide. It lays out syntax and style best-practices for developers working on Carnivale.

## Use Async-Await-Try-Catch syntax for asynchronous operations. In the catch block's console.error, specify where the error happened and why it's happening.

```
async function main() { 
  try { 
    var quote = await getQuote(); 
    console.log(quote); 
  } catch (error) { 
    console.error('LOCATION OF ERROR: could not DO this', error); 
  } 
};
```

## Add ‘api’ after the route subdirectory but before the endpoint to designate routes that go to the database. 

Other routes (like api calls for the weather that don’t go to db) don’t need “api”. The point is that we are defining our route subdirectories and endpoints as if our site is an api for others.

### someRouter.ts
```
import { Router } from "express";

Const DatatypeRouter = Router();

DatatypeRouter.get(‘/api/getSomething’, (req, res) => {.../* database call */...})
DatatypeRouter.get(‘/externalCall’, (req, res) => {.../* some random api call */...})

Export default DatatypeRouter;
```
### server’s index.ts
```
import DatatypeRouter from ‘../routes/someRouter.ts;

app.use(‘/datatype’, DatatypeRouter);
```
