import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Database } from './database.types';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

interface QuoteHistoryProps {
    session: Session | null;
}

const QuoteHistory: React.FC<QuoteHistoryProps> = ({ session }) => {
    const [quotes, setQuotes] = useState<Database['public']['Tables']['chrome_quotes']['Row'][]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuotes = async () => {
            if (!session) return;

            const { data, error } = await supabase
                .from('chrome_quotes')
                .select('*')
                .eq('email', session.user.email);

            if (error) {
                setError(error.message);
            } else {
                setQuotes(data as Database['public']['Tables']['chrome_quotes']['Row'][]);
            }
        };

        fetchQuotes();
    }, [session]);

    const handleSetupTransport = async (quote: Database['public']['Tables']['chrome_quotes']['Row']) => {
        const emailData = {
            personalizations: [
                {
                    to: [{ email: 'noah@ntslogistics.com' }],
                    subject: 'Transport Setup Request',
                },
            ],
            from: { email: 'noah@ntslogistics.com' },
            content: [
                {
                    type: 'text/plain',
                    value: `Quote ID: ${quote.id}\nYear: ${quote.year}\nMake: ${quote.make}\nModel: ${quote.model}\nLength: ${quote.length}\nWidth: ${quote.width}\nHeight: ${quote.height}\nWeight: ${quote.weight}\nOrigin Zip: ${quote.origin_zip}\nDestination Zip: ${quote.destination_zip}\nRate: ${quote.rate}\nLink: ${quote.link}\nNotes: ${quote.notes}`,
                },
            ],
        };

        try {
            await axios.post('/api/send-email', emailData); // Updated to use Netlify function endpoint
            alert('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error sending email. Please try again.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl text-gray-950 font-bold mb-4 text-center">Quote Request History</h2>
            {error && <p className="text-red-500">{error}</p>}
            {quotes.length === 0 ? (
                <p className='text-gray-950 text-center'>No quote requests found.</p>
            ) : (
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Freight Item</th>
                            <th className="py-2 px-4 border-b">Dimensions/Weight</th>
                            <th className="py-2 px-4 border-b">Origin</th>
                            <th className="py-2 px-4 border-b">Destination</th>
                            <th className="py-2 px-4 border-b">Rate</th>
                            <th className="py-2 px-4 border-b">Link</th>
                            <th className="py-2 px-4 border-b">Notes</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map((quote) => (
                            <tr key={quote.id}>
                                <td className="py-2 px-4 border-b">{quote.year} {quote.make} {quote.model}</td>
                                <td className="py-2 px-4 border-b">{quote.length} * {quote.width} * {quote.height}, <br /> {quote.weight} lbs</td>
                                <td className="py-2 px-4 border-b">{quote.origin_city} {quote.origin_state} {quote.origin_zip}</td>
                                <td className="py-2 px-4 border-b">{quote.destination_city} {quote.destination_state} {quote.destination_zip}</td>
                                <td className="py-2 px-4 border-b">${quote.rate ? quote.rate.toFixed(2) : 'N/A'}</td>
                                <td className="py-2 px-4 border-b">
                                    {quote.link ? <a href={quote.link} target="_blank" rel="noopener noreferrer">{quote.link}</a> : ''}
                                </td>
                                <td className="py-2 px-4 border-b">{quote.notes}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleSetupTransport(quote)}
                                        className="px-4 py-2 border text-nowrap border-gray-300 shadow-md bg-blue-500 text-white font-medium hover:bg-blue-600"
                                    >
                                        Set Up Transport
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default QuoteHistory;