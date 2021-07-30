import express from "express"
import HotelController from "./hotel.controller.js";
import ReviewsController from "./reviews.controller.js";

const router = express.Router();
router.route("/").get(HotelController.apiGetAllHotels).post(HotelController.apiPostHotel).put(HotelController.apiUpdateHotel).delete(HotelController.apiDeleteHotel);
router.route("/id:id").get(HotelController.apiGetHotelById);
router.route("/type").get(HotelController.apiGethotelsTypes);
router.route("/review").post(ReviewsController.apiPostReview).put(ReviewsController.apiUpdateReview).delete(ReviewsController.apiDeleteReview);

export default router;