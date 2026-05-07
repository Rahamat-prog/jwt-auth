import react from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
        // console.log('Email:', email);
        // console.log('password:',password);

        try {
            const respose = await axios.post(
                'http://localhost:4000/api/auth/signin',
                { email, password },
                { withCredentials: true }
            )
            // console.log("data", respose.data);
                setUser(respose.data.data);
        } catch (error) {
            console.log(error.response.data);
        }
    };

    // get teh user data when the component is mounted
    useEffect(() => {
        const getUser = async () => {
            try {
                const respose = await axios.get(
                    'http://localhost:4000/api/auth/user',
                    { withCredentials: true }
                )
                // console.log("user data", respose.data);
                setUser(respose.data.data);
            } catch (error) {
                console.log(error.response.data);
            }
            finally {
                setLoading(false);
            }
        }
        getUser();
    }, [user])

       if (loading) {
             return <div className="flex justify-center items-center h-screen "><h2 className="text-xl font-semibold">Loading...</h2></div>;
            }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
         

                {user ? (
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-4 text-green-600">Welcome, {user.name}!</h3>
                        <ul className="bg-gray-50 p-4 rounded-md shadow-inner space-y-3 text-left max-w-xs mx-auto">
                            <li className="flex items-center">
                                <span className="font-medium text-gray-800 mr-2">👤 Name:</span> 
                                <span className="text-gray-700">{user.name}</span>
                            </li>
                            <li className="flex items-center">
                                <span className="font-medium text-gray-800 mr-2">📧 Email:</span> 
                                <span className="text-gray-700">{user.email}</span>
                            </li>
                        </ul>
                        <button 
                            onClick={() => setUser(null)} 
                            className="mt-6 bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );

};

export default Login;