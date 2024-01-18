import { Router, Request, Response } from 'express';
import { User, Comment, Photo, Join_shared_post } from '../db';
import { Op } from 'sequelize';
const HomeRoutes = Router();

HomeRoutes.post('/share/comment', async (req: Request, res: Response) => {
  const { recipient_userId, sender_userId, id } = req.body;
  try {
    const sharedComment = await Join_shared_post.create({recipient_userId, sender_userId, shared_commentId: id})
    res.status(201)
      .send(sharedComment);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.post('/share/photo', async (req: Request, res: Response) => {
  const { recipient_userId, sender_userId, id } = req.body;
  try {
    const sharedPhoto = await Join_shared_post.create({recipient_userId, sender_userId, shared_photoId: id})
    res.status(201)
      .send(sharedPhoto);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.post('/share/pin', async (req: Request, res: Response) => {
  const { recipient_userId, sender_userId, id } = req.body;
  try {
    const sharedComment = await Join_shared_post.create({recipient_userId, sender_userId, shared_pinId: id})
    res.status(201)
      .send(sharedComment);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.get('/post/:id', async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    const owner = await User.findByPk(id);
    res.status(200)
      .send(owner);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.get('/photo/:id', async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    const owner = await User.findByPk(id);
    res.status(200)
      .send(owner);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.get('/photo/:id', async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    const owner = await User.findByPk(id);
    res.status(200)
      .send(owner);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


HomeRoutes.post('/user', async (req: Request, res: Response) => {
  const { user } = req.body;
  try {
    const userData = await User.findOrCreate({where: { email: user.email, firstName: user.given_name, lastName: user.family_name } })
    res.status(200)
      .send(userData);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.get('/posts', async (req: Request, res: Response) => {
  try {
    const comments = await Comment.findAll();
    const photos = await Photo.findAll({where: {[Op.and]: [{isCostume: false}, {isThrow: false}, {isPin: false}]}});
    const posts = comments.concat(photos);
    res.status(200)
      .send(posts);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.get('/costumes', async (req: Request, res: Response) => {
  try {
    const costumes = await Photo.findAll({where: {isCostume: true}});
    res.status(200)
      .send(costumes);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.get('/throws', async (req: Request, res: Response) => {
  try {
    const throws = await Photo.findAll({where: {isThrow: true}});
    res.status(200)
      .send(throws);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.post('/:ownerId', async (req: Request, res: Response) => {
  const { ownerId } = req.params;
  const { comment } = req.body;
  try {
    const post = await Comment.create({ ownerId, comment })
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default HomeRoutes;