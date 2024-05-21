'use client'
import { useState } from 'react';
import Image from 'next/image';
import Logo from '../../../public/Imges/LOGO.png'

function Login() {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoginForm, setIsLoginForm] = useState(true); // State to toggle between login and register form

    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

    const handleSubmit = () => {
        if (isLoginForm) {
            // Handle login
            console.log('Logging in with username:', username, 'and password:', password);
        } else {
            // Handle register
            console.log('Registering with username:', username, 'email:', email, 'and password:', password);
        }
        // Clear form fields after submission
        setUsername('');
        setPassword('');
        setEmail('');
        setConfirmPassword('');
        closePopup();
    };

    const toggleForm = () => {
        setIsLoginForm(prevState => !prevState);
    };

    return (
        <div className="relative">
            <button onClick={openPopup}
                className='flex text-white text-xl font-sans border border-white rounded-3xl px-4 py-2'>Login</button>

            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white bg-opacity-95 rounded-lg p-8 shadow-md w-1/3">
                        <Image 
                        src={Logo} 
                        className='flex justify-center items-center w-32 mx-auto mb-4 rounded-md '/>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
                            <input type="email" id="email" name="email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
                            <input type="text" id="username" name="username" value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
                            <input type="password" id="password" name="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-blue-500" />
                        </div>
                        {isLoginForm ? null : (
                            <>
                                
                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password:</label>
                                    <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-blue-500" />
                                </div>
                            </>
                        )}
                       
                        <div className="mt-4 text-center">
                            <button onClick={toggleForm} className="text-blue-500 hover:text-blue-700 focus:outline-none mb-4">
                                {isLoginForm ? 'Register Instead' : 'Login Instead'}
                            </button>
                        </div>
                        <div className="text-center">
                            <button onClick={handleSubmit}
                                className=" bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
                            <button onClick={closePopup}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2">Close</button>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
