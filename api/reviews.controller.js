import ReviewsModel from '../Data/ReviewsModel.js';

export default class ReviwsControllerController {
    static async apiPostReview(req, res, next) {
        try {
            const hotelId = req.body.hotel_id;
            const review = req.body.text;
            const userinfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date();
            const reviewResponse = await ReviewsModel.addReview(hotelId, userinfo, review, date);
            var {
                error
            } = reviewResponse
            if (error) {
                res.status(400).json({
                    error
                });
            } else {
                res.json({
                    status: "success"
                });
            }

        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const text = req.body.text;
            const date = new Date();

            const reviewResponse = await ReviewsModel.updateReview(reviewId,req.body.user_id, text, date);
            var {
                error
            } = reviewResponse;
            if (error) {
                res.status(400).json({
                    error
                });
            }
            if (reviewResponse.modifiedCount === 0) {
                throw new error("Unable to update review - user may not be original poster");
            }
            res.json({
                status: "success"
            });

        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.id;
            const userId = req.body.user_id;
            console.log(reviewId);

            const reviewResponse = await ReviewsModel.deleteReview(reviewId, userId);

            res.json({
                status: "success"
            });

        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }
}