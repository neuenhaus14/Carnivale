import { Request, Response, Router } from 'express';

import models from '../../db/models';
import axios from 'axios';
import { createTags, shareContent } from '../../utils/content_creation_helpers';
const Content = models.content;
const Plan = models.plan;
const User_plan = models.user_plan;

const PlanRouter = Router();

PlanRouter.post(
  '/getCoordinatesFromAddress',
  async (req: Request, res: Response) => {
    const apiUrlBeginning =
      'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const apiUrlEnd =
      '.json?proximity=ip&access_token=pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw';
    try {
      let { address } = req.body;
      address = address.replaceAll(' ', '%20');
      const apiUrl = apiUrlBeginning + address + apiUrlEnd;
      const coordinateResponse: any = await axios
        .get(apiUrl)
        .catch((error) => console.error(error));
      const coordinates = coordinateResponse.data.features[0].center;
      res.status(200).send(coordinates);
    } catch (err) {
      console.error(
        "SERVER ERROR: failed to 'POST' new coordinates from address",
        err
      );
      res.status(500).send(err);
    }
  }
);

PlanRouter.post(
  '/getAddressFromCoordinates',
  async (req: Request, res: Response) => {
    const { latitude, longitude } = req.body.coordinates;

    const apiUrlBeginning =
      'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const apiUrlEnd =
      '.json?proximity=ip&access_token=pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw';
    const coordinateString = `${longitude},${latitude}`;
    const apiUrl = apiUrlBeginning + coordinateString + apiUrlEnd;

    const addressResponse: any = await axios
      .get(apiUrl)
      .catch((error) => console.error(error));
    const address = addressResponse.data.features[0].place_name;

    res.status(200).send(address);
  }
);

PlanRouter.post('/createPlan', async (req: Request, res: Response) => {
  const { content, plan, tags, friendsToShareWith } = req.body;

  console.log('createPlan plan', plan)

  // create plan
  try {
    const createPlanResponse = await Plan.create(
      {
        content: {
          ...content,
        },
        ...plan,
      },
      {
        include: [Content],
      }
    );

    const contentId = createPlanResponse.dataValues.content.id;



    // create tags
    await createTags(contentId, tags);

    // share content (user who created is content.userId). User_plan record for each friendToShareWith is added through shareContent as needed
    await shareContent(friendsToShareWith, contentId, content.userId)

    // create userPlan records for friendsToShareWith ('pending') and for user who created the plan ('accepted')
    await User_plan.create({
      userId: content.userId,
      contentId: contentId,
      status: 'accepted',
    })

    res.status(200).send(createPlanResponse);
  } catch (e) {
    console.error('SERVER ERROR: failed to create plan', e);
    res.status(500).send(e);
  }
});

export default PlanRouter;