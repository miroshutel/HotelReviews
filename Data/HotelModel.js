import mongodb from "mongodb";
const ObjectID = mongodb.ObjectId;

let hotels;
export default class HotelModel {
    static async injectDB(conn) {
        if (hotels) {
            return;
        }
        try {
            hotels = await conn.db(process.env.Hotel_NS).collection("Hotels");
        } catch (e) {
            console.error(`unable to connect to db:${e}`);
        }
    }
    static async addHotel({
        name,
        description,
        city,
        country,
        date,
        type,
        rooms
    }) {
        try {
            const hotelDoc = {
                name: name,
                description: description,
                city: city,
                country: country,
                date: date,
                type: type,
                rooms: rooms,
            }
            console.log(hotelDoc);
            return await hotels.insertOne(hotelDoc)
        } catch (e) {
            console.error(`Unable to post Hotel: ${e}`);
            return {
                error: e
            };
        }
    }
    static async updateHotel({
        _id,
        name,
        description,
        city,
        country,
        date,
        type,
        rooms
    }) {
        try {
            const hotelResponse = await hotels.updateOne({
                _id: ObjectID(_id)
            }, {
                $set: {
                    name: name,
                    description: description,
                    city: city,
                    country: country,
                    date: date,
                    type: type,
                    rooms: rooms
                }
            });
            return hotelResponse;

        } catch (e) {
            console.error(`Unable to update hotel: ${e}`);
            return {
                error: e
            };
        }
    }
    static async deleteHotel(hotelid) {
        try {
            const deleteResponse = await hotels.deleteOne({
                _id: ObjectID(hotelid)
            });
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete hotel: ${e}`);
            return {
                error: e
            };
        }
    }

    static async getHotels({
        filters = null,
        page = 0,
        hotelsPerPage = 20,
    } = {}) {

        let query;
        if (filters) {
            if ("name" in filters) {
                query = {
                    $text: {
                        $search: filters["name"]
                    }
                }
            } else if ("type" in filters) {
                query = {
                    "type": {
                        $eq: filters["type"]
                    }
                }
            } else if ("rooms" in filters) {
                query = {
                    "rooms": {
                        $eq: parseInt(filters["rooms"])
                    }
                }
            }
        }
        let cursor;
        try {
            cursor = await hotels.find(query);
        } catch (e) {
            console.error(`Unable to issue find command,${e}`);
            return {
                hotelsList: [],
                totalNumOfhotels: 0
            };
        }
        const displayCursor = cursor.limit(hotelsPerPage).skip(hotelsPerPage * page);
        try {
            const hotelsList = await displayCursor.toArray();
            const totalNumOfhotels = await hotels.countDocuments(query);
            return ({
                hotelsList,
                totalNumOfhotels
            });
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents,${e}`);
            return {
                hotelsList: [],
                totalNumOfhotels: 0
            };
        }
    }
    static async apiGethotelsTypes() {
        let bedTypes = [];
        try {
            bedTypes = await hotels.distinct("type");
            return bedTypes;
        } catch (e) {
            console.error(`Unable to get types ${e}`);
        }
    }
    static async apiGetHotelById(id) {
        try {
            const pipeline = [{
                    $match: {
                        _id: new ObjectID(id),
                    },
                },
                {
                    $lookup: {
                        from: "Reviews",
                        let: {
                            id: "$_id",
                        },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $eq: ["$_hotel_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews",
                    },
                },
            ]
            return await hotels.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in gethotels Reviews ${e}`);
        }


    }


}