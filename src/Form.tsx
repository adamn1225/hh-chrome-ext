"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import equipmentDims from './assets/equipment_dims.json';
import trailerHeights from './assets/trailer-heights.json';
import FormFields from './FormFields';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

interface EscortRequirement {
    width_min?: number;
    width_max?: number;
    height_min?: number;
    escort_requirement: string;
}

const levenshteinDistance = (a: string, b: string) => {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + 1
                );
            }
        }
    }
    return matrix[a.length][b.length];
};

const Form = () => {
    const [year, setYear] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [freightDescription, setFreightDescription] = useState('');
    const [length, setLength] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);
    const [originInput, setOriginInput] = useState('');
    const [destinationInput, setDestinationInput] = useState('');
    const [originZip, setOriginZip] = useState('');
    const [destinationZip, setDestinationZip] = useState('');
    const [originCity, setOriginCity] = useState('');
    const [originState, setOriginState] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [destinationState, setDestinationState] = useState('');
    const [emailError, setEmailError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [originLat, setOriginLat] = useState<number>(0);
    const [originLon, setOriginLon] = useState<number>(0);
    const [destinationLat, setDestinationLat] = useState<number>(0);
    const [destinationLon, setDestinationLon] = useState<number>(0);
    const [distance, setDistance] = useState<number | null>(null);
    const [rate, setRate] = useState<number | null>(null);
    const [link, setLink] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(new Date().toISOString());
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };
        getSession();
    }, []);

    useEffect(() => {
        if (model.trim() === '') {
            return;
        }

        const normalizedMake = make.toLowerCase();
        const normalizedModel = model.toLowerCase();

        let closestMatch = null;
        let closestDistance = Infinity;

        for (const item of equipmentDims) {
            const itemMake = item.Manufacturer.toLowerCase();
            const itemModel = item.Model.toLowerCase();
            const makeDistance = levenshteinDistance(normalizedMake, itemMake);
            const modelDistance = levenshteinDistance(normalizedModel, itemModel);
            if (makeDistance <= 2 && modelDistance <= 2) {
                const totalDistance = makeDistance + modelDistance;
                if (totalDistance < closestDistance) {
                    closestDistance = totalDistance;
                    closestMatch = item;
                }
            }
        }

        if (closestMatch) {
            setLength(closestMatch.dimensions.Length);
            setWidth(closestMatch.dimensions.Width);
            setHeight(closestMatch.dimensions.Height);
            setWeight(closestMatch.dimensions.Weight);
        } else {
            setLength(0);
            setWidth(0);
            setHeight(0);
            setWeight(0);
        }
    }, [make, model]);

    const getTransportHeight = (equipmentHeight: number, weight: number) => {
        let trailerType = 'Stepdeck';
        let trailerHeight = parseFloat(trailerHeights.Stepdeck.Standard.replace(/[^0-9.]/g, ''));

        if (equipmentHeight > 10.5) {
            if (weight > 45000) {
                trailerType = 'RGN';
                trailerHeight = parseFloat(trailerHeights.RGN.Standard.replace(/[^0-9.]/g, ''));
            } else {
                trailerType = 'Lowboy';
                trailerHeight = parseFloat(trailerHeights.Lowboy.Standard.replace(/[^0-9.]/g, ''));
            }
        }

        const transportHeight = equipmentHeight + trailerHeight / 12; // Convert inches to feet
        return { transportHeight, trailerType };
    };

    useEffect(() => {
        console.log(`Origin Lat: ${originLat}, Origin Lon: ${originLon}`);
        console.log(`Destination Lat: ${destinationLat}, Destination Lon: ${destinationLon}`);
    }, [originLat, originLon, destinationLat, destinationLon]);

    function haversineDistance(originLat: number, originLon: number, destinationLat: number, destinationLon: number) {
        const toRadians = (degrees: number) => degrees * (Math.PI / 180);

        const R = 6371;
        const dLat = toRadians(destinationLat - originLat);
        const dLon = toRadians(destinationLon - originLon);
        const lat1 = toRadians(originLat);
        const lat2 = toRadians(destinationLat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return distance * 0.621371;
    }

    const handleOriginInputBlur = async () => {
        if (originInput.match(/^\d{5}$/)) {
            try {
                const response = await axios.get(`https://api.zippopotam.us/us/${originInput}`);
                if (response.status === 200) {
                    const data = response.data;
                    const city = data.places[0]['place name'];
                    const state = data.places[0]['state abbreviation'];
                    const lat = parseFloat(data.places[0].latitude);
                    const lon = parseFloat(data.places[0].longitude);
                    setOriginCity(city);
                    setOriginState(state);
                    setOriginZip(originInput);
                    setOriginLat(lat);
                    setOriginLon(lon);
                    setOriginInput(`${city}, ${state} ${originInput}`);
                }
            } catch (error) {
                console.error('Error fetching city and state:', error);
            }
        } else {
            const [city, state] = originInput.split(',').map((str) => str.trim());
            if (city && state) {
                try {
                    const response = await axios.get(`https://api.zippopotam.us/us/${state}/${city}`);
                    if (response.status === 200) {
                        const data = response.data;
                        const zip = data.places[0]['post code'];
                        const lat = parseFloat(data.places[0].latitude);
                        const lon = parseFloat(data.places[0].longitude);
                        setOriginCity(city);
                        setOriginState(state);
                        setOriginZip(zip);
                        setOriginLat(lat);
                        setOriginLon(lon);
                        setOriginInput(`${city}, ${state} ${zip}`);
                    }
                } catch (error) {
                    console.error('Error fetching zip code:', error);
                }
            }
        }
    };

    const handleDestinationInputBlur = async () => {
        if (destinationInput.match(/^\d{5}$/)) {
            try {
                const response = await axios.get(`https://api.zippopotam.us/us/${destinationInput}`);
                if (response.status === 200) {
                    const data = response.data;
                    const city = data.places[0]['place name'];
                    const state = data.places[0]['state abbreviation'];
                    const lat = parseFloat(data.places[0].latitude);
                    const lon = parseFloat(data.places[0].longitude);
                    setDestinationCity(city);
                    setDestinationState(state);
                    setDestinationZip(destinationInput);
                    setDestinationLat(lat);
                    setDestinationLon(lon);
                    setDestinationInput(`${city}, ${state} ${destinationInput}`);
                }
            } catch (error) {
                console.error('Error fetching city and state:', error);
            }
        } else {
            const [city, state] = destinationInput.split(',').map((str) => str.trim());
            if (city && state) {
                try {
                    const response = await axios.get(`https://api.zippopotam.us/us/${state}/${city}`);
                    if (response.status === 200) {
                        const data = response.data;
                        const zip = data.places[0]['post code'];
                        const lat = parseFloat(data.places[0].latitude);
                        const lon = parseFloat(data.places[0].longitude);
                        setDestinationCity(city);
                        setDestinationState(state);
                        setDestinationZip(zip);
                        setDestinationLat(lat);
                        setDestinationLon(lon);
                        setDestinationInput(`${city}, ${state} ${zip}`);
                    }
                } catch (error) {
                    console.error('Error fetching zip code:', error);
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const distance = haversineDistance(originLat, originLon, destinationLat, destinationLon) + 200;
        setDistance(distance);

        const { transportHeight, trailerType } = getTransportHeight(height, weight);
        console.log(`Transport Height: ${transportHeight} ft, Trailer Type: ${trailerType}`);

        const fullLoadRate = 3;
        const partialLoadRate = 2;
        let baseRate = fullLoadRate;

        // Overweight cost additions
        let overweightCost = 0;
        if (weight >= 48000 && weight <= 59999) {
            overweightCost = 1.5;
        } else if (weight >= 60000 && weight <= 79999) {
            overweightCost = 2.5;
        } else if (weight >= 80000 && weight <= 89999) {
            overweightCost = 3;
        } else if (weight >= 90000 && weight <= 105000) {
            overweightCost = 5;
        } else if (weight > 105001) {
            overweightCost = 8;
        }

        // Dimension-based full load check
        const isOverWidth = width > 96;
        const isOverHeight = transportHeight > 10.5;
        const isOverLength = length >= 40;
        const requiresFullLoad = isOverWidth || isOverHeight || weight >= 35000;

        if (requiresFullLoad) {
            baseRate = fullLoadRate;
        } else if (length >= 15 && length < 30 && weight < 20000 && !isOverWidth && !isOverHeight) {
            baseRate = partialLoadRate;
        }

        // Total rate per mile
        const totalRate = baseRate + overweightCost;

        // Calculate pilot car costs if applicable
        let pilotCarCost = 0;
        if (isOverWidth || isOverHeight) {
            const pilotCarsNeeded = isOverWidth && isOverHeight ? 2 : 1;
            if (pilotCarsNeeded === 1) {
                pilotCarCost = 500 + 1.5 * distance;
            } else if (pilotCarsNeeded === 2) {
                pilotCarCost = 1000 + 3 * distance;
            }
        }

        const permitsPerState = isOverWidth && isOverHeight ? 200 : (isOverWidth || isOverHeight ? 125 : 0);
        const numStates = 4;
        const permitCost = permitsPerState * numStates;
        const baseCost = totalRate * distance;
        const totalCost = baseCost + pilotCarCost + permitCost;
        const serviceFee = totalCost * 0.15;
        const finalCost = totalCost + serviceFee;

        setRate(finalCost);
        setSubmissionMessage(`Distance: ${distance.toFixed(2)} miles\nTrailer Type: ${trailerType}\nShipping Estimate: $${finalCost.toFixed(2)}`);
        setFormSubmitted(true);

        try {
            const { error } = await supabase
                .from('chrome_quotes')
                .insert([
                    {
                        year,
                        make,
                        model,
                        length,
                        width,
                        height,
                        weight,
                        origin_zip: originZip,
                        destination_zip: destinationZip,
                        notes,
                        link,
                        rate: finalCost,
                        email: session?.user?.email,
                        date: new Date().toISOString(),
                    },
                ]);

            if (error) {
                console.error('Error inserting data:', error);
                setSubmissionMessage('Error submitting the form. Please try again.');
            } else {
                console.log('Data inserted successfully');
            }
        } catch (error) {
            console.error('Error inserting data:', error);
            setSubmissionMessage('Error submitting the form. Please try again.');
        }
    };

    const handleGoBack = () => {
        setFormSubmitted(false);
    };

    return (
        <div>
            {formSubmitted ? (
                <div className="text-center p-4">
                    <p className="text-gray-900 text-md font-medium" style={{ whiteSpace: 'pre-line' }}>{submissionMessage}</p>
                    <button onClick={handleGoBack} className="mt-4 px-4 py-2 shadow-md bg-amber-400 text-gray-900 font-semibold">
                        Go Back
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="p-4 space-y-2 w-full text-gray-900">
                    <p className="text-gray-900 text-center text-lg text-nowrap w-full font-semibold mb-2">Fill out the form below to get an instant quote</p>
                    <span className='flex justify-center items-center'><hr className="my-4 w-1/2 text-gray-900/20" /></span>
                    <FormFields
                        year={year}
                        setYear={setYear}
                        make={make}
                        setMake={setMake}
                        model={model}
                        setModel={setModel}
                        freightDescription={freightDescription}
                        setFreightDescription={setFreightDescription}
                        length={length}
                        setLength={setLength}
                        width={width}
                        setWidth={setWidth}
                        height={height}
                        setHeight={setHeight}
                        weight={weight}
                        setWeight={setWeight}
                        originInput={originInput}
                        setOriginInput={setOriginInput}
                        destinationInput={destinationInput}
                        setDestinationInput={setDestinationInput}
                        originCity={originCity}
                        originState={originState}
                        destinationCity={destinationCity}
                        destinationState={destinationState}
                        handleOriginInputBlur={handleOriginInputBlur}
                        handleDestinationInputBlur={handleDestinationInputBlur}
                        link={link}
                        setLink={setLink}
                        notes={notes}
                        setNotes={setNotes}
                    />
                    <div className='flex justify-center'>
                        <button type="submit" className="m-0 px-4 py-2 shadow-md bg-amber-400 text-gray-900 font-semibold hover:border-gray-900 hover:bg-amber-400/70 hover:border hover:text-gray-900">
                            Submit
                        </button>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        {distance !== null && (
                            <div className="text-center px-4">
                                <p className="text-gray-950 text-md font-medium">Distance: <span className='font-bold'>{distance.toFixed(2)} miles</span></p>
                            </div>
                        )}
                        {rate !== null && (
                            <div className="text-center px-4">
                                <p className="text-gray-950 text-md font-medium">Shipping Estimate: <span className='font-bold'>${rate.toFixed(2)}</span></p>
                            </div>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default Form;
