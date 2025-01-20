import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { Database } from './database.types';
import { supabase } from './supabaseClient';

const QuoteHistory = () => {
    const { userProfile } = useUser();
    const [quotes, setQuotes] = useState<Database['public']['Tables']['chrome_quotes']['Row'][]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuotes = async () => {
            if (!userProfile) return;

            const { data, error } = await supabase
                .from('chrome_quotes')
                .select('*')
                .eq('email', userProfile.email);

            if (error) {
                setError(error.message);
            } else {
                setQuotes(data as Database['public']['Tables']['chrome_quotes']['Row'][]);
            }
        };

        fetchQuotes();
    }, [userProfile]);

    return (
        <div className="p-4">
            <h2 className="text-xl text-gray-950 font-bold mb-4 text-center">Quote Request History</h2>
            {error && <p className="text-red-500">{error}</p>}
            {!userProfile ? (
                <span className='flex justify-center align-center w-full'>
                    <p className='text-gray-950 text-center w-3/4'>
                        Your quote request history will appear here once you've submitted a quote request.
                    </p>
                </span>
            ) : quotes.length === 0 ? (
                <p className='text-gray-950 text-center'>No quote requests found.</p>
            ) : (
                <ul>
                    {quotes.map((quote) => (
                        <li key={quote.id} className="mb-2">
                            <div className="border text-white flex flex-col gap-2">
                                <div className='flex gap-4 justify-start items-center border-b p-1'>
                                    <p><strong>Year:</strong> {quote.year}</p>
                                    <p><strong>Make:</strong> {quote.make}</p>
                                    <p><strong>Model:</strong> {quote.model}</p>
                                </div>
                                <div className='flex gap-2 justify-start items-center border-b p-1'>
                                    <p><strong>Length:</strong> {quote.length}</p>
                                    <p><strong>Width:</strong> {quote.width}</p>
                                    <p><strong>Height:</strong> {quote.height}</p>
                                    <p><strong>Weight:</strong> {quote.weight}</p>
                                </div>
                                <div className='flex gap-3 justify-start items-center'>
                                    <p><strong>Origin Zip:</strong> {quote.origin_zip}</p>
                                    <p><strong>Destination Zip:</strong> {quote.destination_zip}</p>
                                </div>
                                <div className='flex gap-3 justify-start items-center'>
                                    <p><strong>Rate:</strong> ${quote.rate ? quote.rate.toFixed(2) : 'N/A'}</p>
                                </div>
                                <div className='flex gap-3 justify-start items-center'>
                                    <p><strong>Link:</strong> {quote.link ? <a href={quote.link} target="_blank" rel="noopener noreferrer">{quote.link}</a> : 'N/A'}</p>
                                </div>
                                <div className='flex gap-3 justify-start items-center'>
                                    <p><strong>Notes:</strong> {quote.notes}</p>
                                </div>
                                <div className='flex gap-3 justify-start items-center'>
                                    <p><strong>Date:</strong> {quote.date ? new Date(quote.date).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default QuoteHistory;