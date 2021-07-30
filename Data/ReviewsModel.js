import mongodb from "mongodb";
const ObjectID = mongodb.ObjectId;

let reviewsDB;

export default class ReivewModel {
    static async injectDB(conn) {
        if (reviewsDB) {
            return;
        }
        try {
            reviewsDB = await conn.db(process.env.Hotel_NS).collection("reviews");
        } catch (e) {
            console.error(`unable to connect to db:${e}`);
        }
    }
    static async addReview(hotelid, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                text: review,
                _id: ObjectID(hotelid)
            }
            return await reviewsDB.insertOne(reviewDoc)
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return {
                error: e
            };
        }
    }
    static async updateReview(reviewid, userid, text, date) {
        try {
            const updateResponse = await reviewsDB.updateOne({
                user_id: userid,
                _id: ObjectID(reviewid)
            }, {
                $set: {
                    text: text,
                    date: date
                }
            });
            return updateResponse;

        } catch (e) {
            console.error(`Unable to update review: ${e}`);
            return {
                error: e
            };
        }
    }
    static async deleteReview(reviewid, userid) {
        try {
            const deleteResponse = await reviewsDB.deleteOne({
                user_id: userid,
                _id: ObjectID(reviewid)
            });
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete review: ${e}`);
            return {
                error: e
            };
        }
    }
}