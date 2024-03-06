import { Request, Response, Router } from 'express';

const Test = Router();

Test.get('/getTest', (req: Request, res: Response) => {
  res.status(200).send('Booyah')
})

export default Test;
