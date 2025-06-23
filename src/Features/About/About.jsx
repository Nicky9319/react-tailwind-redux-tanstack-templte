import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, reset } from '../../../redux/slices/exampleSlice';

const About = () => {
    const dispatch = useDispatch();
    const count = useSelector((state) => state.example.value);

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">About Page</h1>
            <p className="mb-4 text-gray-600">
                This is a demo template showcasing React, Tailwind CSS, Redux Toolkit, and TanStack Query.
            </p>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Redux Counter Demo</h2>
                <p className="mb-2">Current count: <span className="font-bold">{count}</span></p>
                <div className="space-x-2">
                    <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => dispatch(decrement())}
                    >
                        Decrement
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => dispatch(reset())}
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="text-sm text-gray-500">
                <h3 className="font-semibold mb-2">Tech Stack:</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>React 19 with Vite</li>
                    <li>Tailwind CSS for styling</li>
                    <li>Redux Toolkit for state management</li>
                    <li>TanStack Query for data fetching</li>
                    <li>React Router for navigation</li>
                </ul>
            </div>
        </div>
    );
};

export default About;
