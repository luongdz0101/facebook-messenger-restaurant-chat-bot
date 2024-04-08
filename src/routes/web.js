import express from "express";
import homepageController from "../controllers/homepageController";
import chatBotController from "../controllers/chatBotController";
import chatBotService from "../services/chatBotService";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/reserve-table/:senderId", homepageController.handleReserveTable);
    router.get("/", homepageController.getHomepage);
    router.get("/webhook", chatBotController.getWebhook);
    router.post("/webhook", chatBotController.postWebhook);
    router.get("/profile", homepageController.getFacebookUserProfile);
    router.post("/set-up-user-fb-profile", homepageController.setUpUserFacebookProfile);
    router.post("/reserve-table-ajax", homepageController.handlePostReserveTable);
    router.get("/test",async (req, res) =>{
        let user = await chatBotService.getFacebookUsername(1503350760539358);
    });

   

    return app.use("/", router);
};

module.exports = initWebRoutes;