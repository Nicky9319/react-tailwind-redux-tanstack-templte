import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { increment } from '../../../redux/slices/exampleSlice';

const Home = () => {
    const dispatch = useDispatch();
    const count = useSelector((state) => state.example.value);
    const queryClient = useQueryClient();

    // Simple mock data fetcher for demo
    const fetchHomeData = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { message: "Welcome to the Home page!", timestamp: new Date().toISOString() };
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['homeData'],
        queryFn: fetchHomeData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return (
        <div className="p-8 max-w-xl mx-auto bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-blue-600">Home</h1>
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <span className="text-lg font-semibold text-gray-700">Redux Counter: </span>
                <span className="text-2xl font-bold text-blue-600">{count}</span>
                <button
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={() => dispatch(increment())}
                >
                    Increment
                </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Home Data (TanStack Query)</h2>
                {isLoading && (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-blue-600">Loading...</p>
                    </div>
                )}
                {error && <p className="text-red-500 bg-red-50 p-2 rounded">Error: {error.message}</p>}
                {data && (
                    <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default Home;