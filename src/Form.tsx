// src/Form.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useUser } from './UserContext';

const Form = () => {
    const { userProfile } = useUser();
    const [year, setYear] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [freightDescription, setFreightDescription] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [originZip, setOriginZip] = useState('');
    const [destinationZip, setDestinationZip] = useState('');
    const [name, setName] = useState(userProfile?.first_name || '');
    const [email, setEmail] = useState(userProfile?.email || '');
    const [phone, setPhone] = useState(userProfile?.phone_number || '');
    const [emailError, setEmailError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.first_name || '');
            setEmail(userProfile.email || '');
            setPhone(userProfile.phone_number || '');
        }
    }, [userProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        setEmailError('');

        try {
            const { error } = await supabase
                .from('chrome_quotes')
                .insert([
                    {
                        year,
                        make,
                        model,
                        freightdescription: freightDescription, // Updated to match column name
                        length,
                        width,
                        height,
                        weight,
                        originzip: originZip, // Updated to match column name
                        destinationzip: destinationZip, // Updated to match column name
                        name,
                        email,
                        phone,
                    },
                ]);

            if (error) {
                console.error('Error inserting data:', error);
            } else {
                console.log('Data inserted successfully');
                setFormSubmitted(true); // Set formSubmitted to true after successful submission
            }
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    return (
        <div>
            {formSubmitted ? (
                <div className="text-center p-4">
                    <p className="text-stone-100 text-md font-medium">Thank you - A Heavy Haulers Representative should be contacting you shortly</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full">
                    <p className="text-stone-100 text-center text-md text-nowrap w-full font-medium my-2">Fill out the form below to get an instant quote</p>
                    <span className='flex justify-center items-center'><hr className="my-4 w-1/2 text-stone-100/20" /></span>
                    <div className='flex gap-1 items-center justify-center  w-full'>
                        <input
                            type="text"
                            placeholder="Year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="border p-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Make"
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                            className="border p-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className='w-full flex justify-stretch items-center my-2'>
                        <span className='border border-b border-gray-100/50 w-full' />
                        <span className='text-stone-50 font-medium text-lg px-2'> Or </span>
                        <span className='border border-b border-gray-100/50 w-full' />
                    </div>
                    <textarea
                        placeholder="Freight Description"
                        value={freightDescription}
                        onChange={(e) => setFreightDescription(e.target.value)}
                        className="border p-2 w-full"
                    />
                    <div className='flex gap-1 items-center justify-center  w-full'>
                        <input
                            type="text"
                            placeholder="Length"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            className="border p-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Width"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="border p-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="border p-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className='w-full flex justify-stretch items-center my-2'>
                        <span className='border border-b border-gray-100/50 w-full' />
                        <span className='border border-b border-gray-100/50 w-full' />
                    </div>
                    <div className='flex gap-2 justify-evenly items-center  w-full'>
                        <input
                            type="text"
                            placeholder="Origin Zip"
                            value={originZip}
                            onChange={(e) => setOriginZip(e.target.value)}
                            className="border p-2 w-full self-center"
                        />
                        <input
                            type="text"
                            placeholder="Destination Zip"
                            value={destinationZip}
                            onChange={(e) => setDestinationZip(e.target.value)}
                            className="border p-2 w-full self-center"
                        />
                    </div>
                    {!userProfile && (
                        <div className='flex gap-2 justify-center items-center w-full'>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-2 w-full"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border p-2 w-full"
                            />
                            {emailError && <p className="text-red-500">{emailError}</p>}
                            <input
                                type="text"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="border p-2 w-full"
                            />
                        </div>
                    )}
                    <div className='flex justify-center'>
                        <button type="submit" className="m-0 px-4 py-2 border border-gray-900 shadow-md bg-amber-400 text-gray-900 font-semibold hover:border-gray-900 hover:bg-amber-400/70 hover:border hover:text-gray-900">
                            Submit
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Form;