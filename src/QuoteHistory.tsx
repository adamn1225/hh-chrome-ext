// src/QuoteHistory.tsx
import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { Database } from './database.types';
import { supabase } from './supabaseClient';

const QuoteHistory = () => {
    const { userProfile } = useUser();
    const [quotes, setQuotes] = useState<Database['public']['Tables']['shippingquotes']['Row'][]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuotes = async () => {
            if (!userProfile) return;

            const { data, error } = await supabase
                .from('shippingquotes')
                .select('*')
                .eq('email', userProfile.email);

            if (error) {
                setError(error.message);
            } else {
                setQuotes(data as Database['public']['Tables']['shippingquotes']['Row'][]);
            }
        };

        fetchQuotes();
    }, [userProfile]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Quote Request History</h2>
            {error && <p className="text-red-500">{error}</p>}
            {quotes.length === 0 ? (
                <p>No quote requests found.</p>
            ) : (
                <ul>
                    {quotes.map((quote) => (
                        <li key={quote.id} className="mb-2">
                            <div className="border p-2">
                                <p><strong>Year:</strong> {quote.year_amount}</p>
                                <p><strong>Make:</strong> {quote.make}</p>
                                <p><strong>Model:</strong> {quote.model}</p>
                                <p><strong>Freight Description:</strong> {quote.commodity}</p>
                                <p><strong>Length:</strong> {quote.length}</p>
                                <p><strong>Width:</strong> {quote.width}</p>
                                <p><strong>Height:</strong> {quote.height}</p>
                                <p><strong>Weight:</strong> {quote.weight}</p>
                                <p><strong>Origin Zip:</strong> {quote.origin_zip}</p>
                                <p><strong>Destination Zip:</strong> {quote.destination_zip}</p>
                                <p><strong>Inserted At:</strong> {quote.inserted_at}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default QuoteHistory;