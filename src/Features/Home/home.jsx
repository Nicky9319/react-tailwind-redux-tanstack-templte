import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { increment } from '../../../redux/slices/exampleSlice';

const Home = () => {
    const dispatch = useDispatch();
    const count = useSelector((state) => state.example.value);

    // Real API function
    const fetchExampleData = async () => {
        console.log("🚀 Making API call to HTTPBin at:", new Date().toLocaleString());
        const response = await fetch('https://httpbin.org/json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("✅ API call completed successfully");
        return {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers: Object.fromEntries(response.headers.entries()),
            data: data,
            timestamp: new Date().toISOString()
        };
    };

    // TanStack Query hook
    const { data: exampleData, isLoading: exampleLoading, error: exampleError, refetch: refetchExample, dataUpdatedAt, isStale, isFetching } = useQuery({
        queryKey: ['httpbin-json'],
        queryFn: fetchExampleData,
        staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes - data stays in cache for 10 minutes
        retry: 2,
        refetchOnWindowFocus: false, // Don't refetch when window gains focus
        refetchOnMount: true, // Always fetch on component mount if data is stale
    });

    // Debug logging
    React.useEffect(() => {
        console.log("📊 TanStack Query Status:", {
            hasData: !!exampleData,
            isLoading: exampleLoading,
            isFetching,
            isStale,
            dataUpdatedAt: dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString() : 'No data',
            cacheAge: dataUpdatedAt ? `${Math.round((Date.now() - dataUpdatedAt) / 1000)}s ago` : 'N/A'
        });
    }, [exampleData, exampleLoading, isFetching, isStale, dataUpdatedAt]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        TanStack Query Demo
                    </h1>
                    <p className="text-gray-600">Showcasing React, Redux, and TanStack Query with persistent caching</p>
                </div>

                {/* Redux Counter Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Redux Counter</h2>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <span className="text-lg font-medium text-gray-700">Count:</span>
                            <span className="text-3xl font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                                {count}
                            </span>
                        </div>
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            onClick={() => dispatch(increment())}
                        >
                            Increment
                        </button>
                    </div>
                </div>

                {/* HTTPBin JSON API Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">HTTPBin JSON API Call</h2>
                        <button
                            onClick={() => refetchExample()}
                            className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm"
                        >
                            Refetch
                        </button>
                    </div>
                    
                    {exampleLoading && (
                        <div className="flex items-center space-x-3 py-4">
                            <div className="w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
                            <p className="text-orange-600 font-medium">Loading HTTPBin data...</p>
                        </div>
                    )}
                    
                    {exampleError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                            <p className="font-semibold">Error fetching HTTPBin data:</p>
                            <p>{exampleError.message}</p>
                        </div>
                    )}
                    
                    {exampleData && (
                        <div className="space-y-4">
                            {/* Cache Status Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h4 className="font-semibold text-blue-800 mb-2">📊 Cache Status</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    <div>
                                        <span className="font-medium">Is Stale:</span> 
                                        <span className={`ml-1 ${isStale ? 'text-orange-600' : 'text-green-600'}`}>
                                            {isStale ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Is Fetching:</span> 
                                        <span className={`ml-1 ${isFetching ? 'text-orange-600' : 'text-green-600'}`}>
                                            {isFetching ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span> 
                                        <span className="ml-1 text-gray-600">
                                            {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Cache Age:</span> 
                                        <span className="ml-1 text-gray-600">
                                            {dataUpdatedAt ? `${Math.round((Date.now() - dataUpdatedAt) / 1000)}s` : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p><span className="font-semibold">Status:</span> <span className="text-green-600">{exampleData.status}</span></p>
                                    <p><span className="font-semibold">Status Text:</span> {exampleData.statusText}</p>
                                    <p><span className="font-semibold">URL:</span> {exampleData.url}</p>
                                </div>
                                <div className="space-y-2">
                                    <p><span className="font-semibold">Content Type:</span> {exampleData.headers['content-type'] || 'application/json'}</p>
                                    <p><span className="font-semibold">Fetched At:</span> {new Date(exampleData.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">JSON Response Data:</h3>
                                <pre className="bg-gray-800 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
                                    {JSON.stringify(exampleData.data, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* TanStack Query Info */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-xl font-semibold text-purple-800 mb-3">🚀 TanStack Query Features Demonstrated</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <ul className="space-y-2 text-purple-700">
                            <li>✅ <strong>Persistent Caching:</strong> Data survives page reloads</li>
                            <li>✅ <strong>Background Refetching:</strong> Auto-updates stale data</li>
                            <li>✅ <strong>Loading States:</strong> Beautiful loading indicators</li>
                        </ul>
                        <ul className="space-y-2 text-purple-700">
                            <li>✅ <strong>Error Handling:</strong> Graceful error boundaries</li>
                            <li>✅ <strong>CORS-friendly APIs:</strong> Using HTTPBin for demo</li>
                            <li>✅ <strong>Query Keys:</strong> Smart caching with unique identifiers</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;