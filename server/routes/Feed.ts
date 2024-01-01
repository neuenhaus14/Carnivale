import express, { Request, Response } from "express";
import {
  Join_shared_post,
  User,
  Photo,
  Comment,
  Pin,
  Join_comment_vote,
  Join_photo_vote,
  Join_pin_vote,
} from "../db";

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

feedRouter.delete("/shared-posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    await Join_shared_post.destroy({ where: { id: postId } });
    res.json({ message: `Post with ID ${postId} deleted successfully.` });
  } catch (error) {
    console.error(`Error deleting post:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

feedRouter.get(
  "/shared-photo/:photo_id",
  async (req: Request, res: Response) => {
    try {
      const photoId = req.params.photo_id;
      const sharedPhoto = await Photo.findByPk(photoId);
      res.json(sharedPhoto);
    } catch (error) {
      console.error("Error getting shared photo information:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

feedRouter.get(
  "/shared-comment/:comment_id",
  async (req: Request, res: Response) => {
    try {
      const commentId = req.params.comment_id;
      const sharedComment = await Comment.findByPk(commentId);
      res.json(sharedComment);
    } catch (error) {
      console.error("Error getting shared comment information:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// feedRouter.get("/shared-pin/:pin_id", async (req: Request, res: Response) => {
//   try {
//     const pinId = req.params.pin_id;
//     const sharedPin = await Pin.findByPk(pinId);
//     res.json(sharedPin);
//   } catch (error) {
//     console.error("Error getting shared pin information:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

feedRouter.post(
  "/upvote-comment/:user_id/:comment_id",
  async (req: Request, res: Response) => {
    try {
      const commentId = req.params.comment_id;
      const userId = req.params.user_id;

      const existingVote = await Join_comment_vote.findOne({
        where: { voter_userId: userId, commentId: commentId },
      });

      if (existingVote) {
        if (!existingVote.dataValues.isUpvoted) {
          await Join_comment_vote.update(
            {
              isUpvoted: true,
            },
            { where: { voter_userId: userId, commentId: commentId } }
          );
          await Comment.increment({ upvotes: 2 }, { where: { id: commentId } });
          res.json({ success: true });
        } else {
          res
            .status(400)
            .json({ error: "User has already upvoted on this comment." });
        }
      } else {
        await Join_comment_vote.create({
          voter_userId: userId,
          commentId: commentId,
          isUpvoted: true,
        });

        await Comment.increment({ upvotes: 1 }, { where: { id: commentId } });

        res.json({ success: true });
      }
    } catch (error) {
      console.error(`Error handling comment vote:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

feedRouter.post("/downvote-comment/:user_id/:comment_id", async (req, res) => {
  try {
    const commentId = req.params.comment_id;
    const userId = req.params.user_id;

    const existingVote = await Join_comment_vote.findOne({
      where: { voter_userId: userId, commentId: commentId },
    });

    if (existingVote) {
      if (existingVote.dataValues.isUpvoted) {
        await Join_comment_vote.update(
          { isUpvoted: false },
          { where: { voter_userId: userId, commentId: commentId } }
        );

        const comment = await Comment.findByPk(commentId);

        if (comment.dataValues.upvotes <= -4) {
          // Remove references in join_shared_posts
          await Join_shared_post.destroy({
            where: { shared_commentId: commentId },
          });

          // Remove references in join_comment_votes
          await Join_comment_vote.destroy({ where: { commentId: commentId } });

          // Delete the comment
          await Comment.destroy({ where: { id: commentId } });

          res.json({
            success: true,
            message: "Comment deleted due to excessive downvotes.",
          });
        } else {
          await Comment.increment(
            { upvotes: -2 },
            { where: { id: commentId } }
          );
          res.json({ success: true });
        }
      } else {
        res
          .status(400)
          .json({ error: "User has already voted down on this comment." });
      }
    } else {
      await Join_comment_vote.create({
        voter_userId: userId,
        commentId: commentId,
        isUpvoted: false,
      });

      const comment = await Comment.findByPk(commentId);

      if (comment.dataValues.upvotes <= -4) {
        // Remove references in join_shared_posts
        await Join_shared_post.destroy({
          where: { shared_commentId: commentId },
        });

        // Remove references in join_comment_votes
        await Join_comment_vote.destroy({ where: { commentId: commentId } });

        // Delete the comment
        await Comment.destroy({ where: { id: commentId } });

        res.json({
          success: true,
          message: "Comment deleted due to excessive downvotes.",
        });
      } else {
        await Comment.increment({ upvotes: -1 }, { where: { id: commentId } });
        res.json({ success: true });
      }
    }
  } catch (error) {
    console.error(`Error handling comment vote:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedRouter.post(
  "/upvote-pin/:user_id/:pin_id",
  async (req: Request, res: Response) => {
    try {
      const pinId = req.params.pin_id;
      const userId = req.params.user_id;

      const existingVote = await Join_pin_vote.findOne({
        where: { voter_userId: userId, pinId: pinId },
      });

      if (existingVote) {
        if (!existingVote.dataValues.isUpvoted) {
          await Join_pin_vote.update(
            {
              isUpvoted: true,
            },
            { where: { voter_userId: userId, pinId: pinId } }
          );
          await Pin.increment({ upvotes: 2 }, { where: { id: pinId } });
          res.json({ success: true });
        } else {
          res
            .status(400)
            .json({ error: "User has already upvoted on this pin." });
        }
      } else {
        await Join_pin_vote.create({
          voter_userId: userId,
          pinId: pinId,
          isUpvoted: true,
        });

        await Pin.increment({ upvotes: 1 }, { where: { id: pinId } });

        res.json({ success: true });
      }
    } catch (error) {
      console.error(`Error handling pin vote:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

feedRouter.post(
  "/upvote-photo/:user_id/:photo_id",
  async (req: Request, res: Response) => {
    try {
      const photoId = req.params.photo_id;
      const userId = req.params.user_id;

      const existingVote = await Join_photo_vote.findOne({
        where: { voter_userId: userId, photoId: photoId },
      });

      if (existingVote) {
        if (!existingVote.dataValues.isUpvoted) {
          await Join_photo_vote.update(
            {
              isUpvoted: true,
            },
            { where: { voter_userId: userId, photoId: photoId } }
          );
          await Photo.increment({ upvotes: 2 }, { where: { id: photoId } });
          res.json({ success: true });
        } else {
          res
            .status(400)
            .json({ error: "User has already upvoted on this photo." });
        }
      } else {
        await Join_photo_vote.create({
          voter_userId: userId,
          photoId: photoId,
          isUpvoted: true,
        });

        await Photo.increment({ upvotes: 1 }, { where: { id: photoId } });

        res.json({ success: true });
      }
    } catch (error) {
      console.error(`Error handling photo vote:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

feedRouter.post(
  "/downvote-pin/:user_id/:pin_id",
  async (req: Request, res: Response) => {
    try {
      const pinId = req.params.pin_id;
      const userId = req.params.user_id;

      const existingVote = await Join_pin_vote.findOne({
        where: { voter_userId: userId, pinId: pinId },
      });

      if (existingVote) {
        if (existingVote.dataValues.isUpvoted) {
          await Join_pin_vote.update(
            {
              isUpvoted: false,
            },
            { where: { voter_userId: userId, pinId: pinId } }
          );

          const pin = await Pin.findByPk(pinId);

          if (pin.dataValues.upvotes <= -4) {
            // Remove references in join_shared_posts
            await Join_shared_post.destroy({
              where: { shared_pinId: pinId },
            });

            // Remove references in join_pin_votes
            await Join_pin_vote.destroy({ where: { pinId: pinId } });

            // Delete the pin
            await Pin.destroy({ where: { id: pinId } });

            res.json({
              success: true,
              message: "Pin deleted due to excessive downvotes.",
            });
          } else {
            await Pin.increment({ upvotes: -2 }, { where: { id: pinId } });
            res.json({ success: true });
          }
        } else {
          res
            .status(400)
            .json({ error: "User has already downvoted on this pin." });
        }
      } else {
        await Join_pin_vote.create({
          voter_userId: userId,
          pinId: pinId,
          isUpvoted: false,
        });

        const pin = await Pin.findByPk(pinId);

        if (pin.dataValues.upvotes <= -4) {
          // Remove references in join_shared_posts
          await Join_shared_post.destroy({
            where: { shared_pinId: pinId },
          });

          // Remove references in join_pin_votes
          await Join_pin_vote.destroy({ where: { pinId: pinId } });

          // Delete the pin
          await Pin.destroy({ where: { id: pinId } });

          res.json({
            success: true,
            message: "Pin deleted due to excessive downvotes.",
          });
        } else {
          await Pin.increment({ upvotes: -1 }, { where: { id: pinId } });
          res.json({ success: true });
        }
      }
    } catch (error) {
      console.error(`Error handling pin vote:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

feedRouter.post(
  "/downvote-photo/:user_id/:photo_id",
  async (req: Request, res: Response) => {
    try {
      const photoId = req.params.photo_id;
      const userId = req.params.user_id;

      const existingVote = await Join_photo_vote.findOne({
        where: { voter_userId: userId, photoId: photoId },
      });

      if (existingVote) {
        if (existingVote.dataValues.isUpvoted) {
          await Join_photo_vote.update(
            {
              isUpvoted: false,
            },
            { where: { voter_userId: userId, photoId: photoId } }
          );

          const photo = await Photo.findByPk(photoId);

          if (photo.dataValues.upvotes <= -4) {
            // Remove references in join_shared_posts
            await Join_shared_post.destroy({
              where: { shared_photoId: photoId },
            });

            // Remove references in join_photo_votes
            await Join_photo_vote.destroy({ where: { photoId: photoId } });

            // Delete the photo
            await Photo.destroy({ where: { id: photoId } });

            res.json({
              success: true,
              message: "Photo deleted due to excessive downvotes.",
            });
          } else {
            await Photo.increment({ upvotes: -2 }, { where: { id: photoId } });
            res.json({ success: true });
          }
        } else {
          res
            .status(400)
            .json({ error: "User has already downvoted on this photo." });
        }
      } else {
        await Join_photo_vote.create({
          voter_userId: userId,
          photoId: photoId,
          isUpvoted: false,
        });

        const photo = await Photo.findByPk(photoId);

        if (photo.dataValues.upvotes <= -4) {
          // Remove references in join_shared_posts
          await Join_shared_post.destroy({
            where: { shared_photoId: photoId },
          });

          // Remove references in join_photo_votes
          await Join_photo_vote.destroy({ where: { photoId: photoId } });

          // Delete the photo
          await Photo.destroy({ where: { id: photoId } });

          res.json({
            success: true,
            message: "Photo deleted due to excessive downvotes.",
          });
        } else {
          await Photo.increment({ upvotes: -1 }, { where: { id: photoId } });
          res.json({ success: true });
        }
      }
    } catch (error) {
      console.error(`Error handling photo vote:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default feedRouter;
