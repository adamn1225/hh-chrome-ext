"use client";
import React from "react";

interface FormFieldsProps {
    year: string;
    setYear: (value: string) => void;
    make: string;
    setMake: (value: string) => void;
    model: string;
    setModel: (value: string) => void;
    freightDescription: string;
    setFreightDescription: (value: string) => void;
    length: number;
    setLength: (value: number) => void;
    width: number;
    setWidth: (value: number) => void;
    height: number;
    setHeight: (value: number) => void;
    weight: number;
    setWeight: (value: number) => void;
    originInput: string;
    setOriginInput: (value: string) => void;
    destinationInput: string;
    setDestinationInput: (value: string) => void;
    originCity: string;
    originState: string;
    destinationCity: string;
    destinationState: string;
    handleOriginInputBlur: () => void;
    handleDestinationInputBlur: () => void;
}

const FormFields: React.FC<FormFieldsProps> = ({
    year,
    setYear,
    make,
    setMake,
    model,
    setModel,
    freightDescription,
    setFreightDescription,
    length,
    setLength,
    width,
    setWidth,
    height,
    setHeight,
    weight,
    setWeight,
    originInput,
    setOriginInput,
    destinationInput,
    setDestinationInput,
    originCity,
    originState,
    destinationCity,
    destinationState,
    handleOriginInputBlur,
    handleDestinationInputBlur,
}) => {
    return (
        <>
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
            <div className='flex gap-1 items-center justify-center  w-full'>
                <input
                    type="number"
                    placeholder="Length"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="border p-2 w-full"
                />
                <input
                    type="number"
                    placeholder="Width"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="border p-2 w-full"
                />
                <input
                    type="number"
                    placeholder="Height"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="border p-2 w-full"
                />
                <input
                    type="number"
                    placeholder="Weight"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="border p-2 w-full"
                />
            </div>
            <div className='w-full flex justify-stretch items-center my-2'>
                <span className='border border-b border-gray-100/50 w-full' />
                <span className='border border-b border-gray-100/50 w-full' />
            </div>
            <div className='flex flex-col md:flex-row md:justify-evenly gap-12 w-full'>
                <div className='flex flex-col items-start w-full'>
                    <label className='text-stone-100 font-medium text-sm'>Origin</label>
                    <input
                        className="border p-2 w-full placeholder:text-zinc-500 text-sm"
                        type="text"
                        placeholder='Zip or City, State'
                        value={originInput}
                        onChange={(e) => setOriginInput(e.target.value)}
                        onBlur={handleOriginInputBlur}
                    />
                    <input type="hidden" value={originCity} />
                    <input type="hidden" value={originState} />
                </div>
                <div className='flex flex-col items-start w-full'>
                    <label className='text-stone-100 font-medium text-sm w-full'>Destination</label>
                    <input
                        className="border p-2 w-full placeholder:text-zinc-500 text-sm"
                        type="text"
                        placeholder='Zip or City, State'
                        value={destinationInput}
                        onChange={(e) => setDestinationInput(e.target.value)}
                        onBlur={handleDestinationInputBlur}
                    />
                    <input type="hidden" value={destinationCity} />
                    <input type="hidden" value={destinationState} />
                </div>
            </div>
        </>
    );
};

export default FormFields;