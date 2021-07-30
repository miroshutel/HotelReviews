import HotelModel from '../Data/HotelModel.js';

export default class HotelController {
    static async apiGetAllHotels(req, res, next) {
        const hotelPerPage = req.query.hotelPerPage ? parseInt(req.query.hotelPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.type)
            filters.type = req.query.type;
        else if (req.query.rooms)
            filters.rooms = req.query.rooms;
        else if (req.query.name)
            filters.name = req.query.name;
        const {
            hotelsList,
            totalNumOfhotels
        } = await HotelModel.getHotels({
            filters,
            page,
            hotelPerPage
        });
        let response = {
            hotels: hotelsList,
            page: page,
            filters: filters,
            entries_per_page: hotelPerPage,
            total_results: totalNumOfhotels,
        }
        res.json(response);
    }
    static async apiGetHotelById(req, res, next) {
        try {
            let id = req.query.id || {};
            let hotel = HotelModel.getHotelById(id);
            if (!hotel) {
                res.status(404).json({
                    erorr: "Not Found"
                });
            }
            res.json(hotel);
        } catch (e) {
            console.log(`api,${e}`);
            res.status(500).json({
                error: e
            });
        }
    }
    static async apiGethotelsTypes(req, res, next) {
        try {
            let types = await HotelModel.apiGethotelsTypes();
            res.json(types);
        } catch (e) {
            console.log(`api,${e}`);
            res.status(500).json({
                error: e
            });
        }
    }
    static async apiPostHotel(req, res, next) {
        try {
            const date = new Date();
            const reqHotel = {
                name: req.body.name,
                description: req.body.description,
                city: req.body.city,
                country: req.body.country,
                type: req.body.type,
                rooms: req.body.rooms,
                date: date
            };
            const hotelResponse = await HotelModel.addHotel(reqHotel);
            var {
                error
            } = hotelResponse
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
    static async apiUpdateHotel(req, res, next) {
        try {
            const date = new Date();
            const reqHotel = {
                _id: req.body.id,
                name: req.body.name,
                description: req.body.description,
                city: req.body.city,
                country: req.body.country,
                type: req.body.type,
                rooms: req.body.rooms,
                date: date
            };
            const hotelResponse = await HotelModel.updateHotel(reqHotel);
            var {
                error
            } = hotelResponse;
            if (error) {
                res.status(400).json({
                    error
                });
            }
            if (hotelResponse.modifiedCount === 0) {
                throw new error("Unable to update Hotel");
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
    static async apiDeleteHotel(req, res, next) {
        try {
            const hotelId = req.body.id;
            console.log(hotelId);
            const hotelResponse = await HotelModel.deleteHotel(hotelId);

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