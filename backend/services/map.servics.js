// const axios = require('axios');
// const captainModel = require('../models/captain.model');

// module.exports.getAddressCoordinate = async (address) => {
//     const apiKey = process.env.GOOGLE_API;
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         console.log(response)
//         if (response.data.status === 'OK') {
//             const location = response.data.results[ 0 ].geometry.location;
//             return {
//                 ltd: location.lat,
//                 lng: location.lng
//             };
//         } else {
//             throw new Error('Unable to fetch coordinates');
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

const axios = require('axios');
const captainModel = require('../models/captain.model');

// Photon se coordinates nikalne wala helper function
async function getCoordinatesFromPhoton(address) {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1&lang=en`;

    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'UberCloneApp/1.0'
        }
    });

    const features = response.data.features.filter(
        (place) => place.properties.countrycode === 'IN'
    );

    if (features.length === 0) {
        throw new Error('Unable to fetch coordinates');
    }

    const place = features[0];
    return {
        ltd: place.geometry.coordinates[1], // Photon mein [lng, lat] order hai
        lng: place.geometry.coordinates[0]
    };
}

module.exports.getAddressCoordinate = async (address) => {
    if (!address) {
        throw new Error('Address is required');
    }

    try {
        return await getCoordinatesFromPhoton(address);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        const originCoordinates = await getCoordinatesFromPhoton(origin);
        const destinationCoordinates = await getCoordinatesFromPhoton(destination);

        const url = `http://router.project-osrm.org/route/v1/driving/${originCoordinates.lng},${originCoordinates.ltd};${destinationCoordinates.lng},${destinationCoordinates.ltd}?overview=false`;

        const response = await axios.get(url);

        if (response.data.code === 'Ok' && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                distance: route.distance,
                duration: route.duration
            };
        } else {
            throw new Error('Unable to fetch distance and time');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Input is required');
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=5&lang=en`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'UberCloneApp/1.0'
            }
        });

        const suggestions = response.data.features
            .filter((place) => place.properties.countrycode === 'IN')
            .map((place) => ({
                display_name: [
                    place.properties.name,
                    place.properties.city,
                    place.properties.state,
                    place.properties.country
                ].filter(Boolean).join(', '),
                lat: place.geometry.coordinates[1],
                lng: place.geometry.coordinates[0]
            }));

        return suggestions;

    } catch (error) {
        console.error(error);
        throw new Error('Unable to fetch autocomplete suggestions');
    }
};


module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km


    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}

// module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

//     const captains = await captainModel.find({
//         location: {
//             $geoWithin: {
//                 $centerSphere: [
//                     [lng, ltd],
//                     radius / 6371
//                 ]
//             }
//         }
//     });

//     return captains;
// }