import express, { Request, Response } from "express";
import { Join_shared_post, User } from "../db";

const feedRouter = express.Router();

feedRouter.get(
  "/shared-posts/:user_id",
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.user_id;
      const sharedPosts = await Join_shared_post.findAll({
        where: { recipient_userId: userId },
      });
      res.json(sharedPosts);
    } catch (error) {
      console.error("Error getting shared posts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

feedRouter.get("/user/:user_id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id;
    const user = await User.findByPk(userId);
    res.json(user);
  } catch (error) {
    console.error("Error getting user information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default feedRouter;
