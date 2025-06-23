import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { increment } from '../../../redux/slices/exampleSlice';

const Home = () => {
    const dispatch = useDispatch();
    const count = useSelector((state) => state.example.value);
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState(1);

    // Mock API functions
    const fetchUserData = async (id) => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        // Simulate API response
        return {
            id,
            name: `User ${id}`,
            email: `user${id}@example.com`,
            lastLogin: new Date().toISOString(),
            posts: Math.floor(Math.random() * 50) + 1,
            followers: Math.floor(Math.random() * 1000) + 10
        };
    };

    const fetchPosts = async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const posts = [];
        for (let i = 1; i <= 5; i++) {
            posts.push({
                id: i,
                title: `Demo Post ${i}`,
                content: `This is the content for post ${i}. It demonstrates TanStack Query caching.`,
                likes: Math.floor(Math.random() * 100),
                timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        return posts;
    };

    const createPost = async (newPost) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            id: Date.now(),
            ...newPost,
            likes: 0,
            timestamp: new Date().toISOString()
        };
    };

    // TanStack Query hooks
    const { data: userData, isLoading: userLoading, error: userError, refetch: refetchUser } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUserData(userId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    });

    const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        staleTime: 1000 * 60 * 2, // 2 minutes
        refetchOnWindowFocus: false,
    });

    const createPostMutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            // Invalidate and refetch posts
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const handleCreatePost = () => {
        createPostMutation.mutate({
            title: `New Post ${Date.now()}`,
            content: 'This post was created using TanStack Query mutation!'
        });
    };

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

                {/* User Data Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">User Data Query</h2>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">User ID:</label>
                            <select
                                value={userId}
                                onChange={(e) => setUserId(Number(e.target.value))}
                                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[1, 2, 3, 4, 5].map(id => (
                                    <option key={id} value={id}>User {id}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => refetchUser()}
                                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                            >
                                Refetch
                            </button>
                        </div>
                    </div>
                    
                    {userLoading && (
                        <div className="flex items-center space-x-3 py-4">
                            <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                            <p className="text-blue-600 font-medium">Loading user data...</p>
                        </div>
                    )}
                    
                    {userError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                            Error: {userError.message}
                        </div>
                    )}
                    
                    {userData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p><span className="font-semibold">Name:</span> {userData.name}</p>
                                <p><span className="font-semibold">Email:</span> {userData.email}</p>
                                <p><span className="font-semibold">Posts:</span> {userData.posts}</p>
                            </div>
                            <div className="space-y-2">
                                <p><span className="font-semibold">Followers:</span> {userData.followers}</p>
                                <p><span className="font-semibold">Last Login:</span> {new Date(userData.lastLogin).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Posts Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Posts Query & Mutation</h2>
                        <button
                            onClick={handleCreatePost}
                            disabled={createPostMutation.isPending}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                        </button>
                    </div>
                    
                    {postsLoading && (
                        <div className="flex items-center space-x-3 py-4">
                            <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                            <p className="text-blue-600 font-medium">Loading posts...</p>
                        </div>
                    )}
                    
                    {postsError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                            Error: {postsError.message}
                        </div>
                    )}
                    
                    {postsData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {postsData.map(post => (
                                <div key={post.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-gray-800 mb-2">{post.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{post.content}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>❤️ {post.likes} likes</span>
                                        <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
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
                            <li>✅ <strong>Mutations:</strong> Optimistic updates & invalidation</li>
                            <li>✅ <strong>Query Keys:</strong> Smart caching with dependencies</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;