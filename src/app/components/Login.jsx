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
    const [isLoginForm, setIsLoginForm] = useState(true);

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
                <div className='fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center px-3'>
                    <div className='bg-white bg-opacity-95 rounded-lg p-8 shadow-md w-[450px] lg:w-[500px]'>
                    <button onClick={closePopup} className="w-full flex justify-end">X</button>
                    <Image 
                        src={Logo}
                        alt='logo' 
                        className='flex flex-col justify-center items-center w-32 mx-auto mb-4 rounded-md '/>
                        {isLoginForm ? (
                            <>
                                <h2 className='w-full flex justify-center text-3xl font-semibold mb-5'>Login</h2>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-4 block w-full px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                                <button className='mt-3 px-3 py-2 rounded bg-green-500 text-white' onClick={handleSubmit}>Submit</button>
                            </>
                        ) : (
                            <>
                                <h2 className='w-full flex justify-center text-3xl font-semibold mb-5'>Sign up</h2>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-4 block w-full px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-4 block w-full px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-4 block w-full px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                                <button className='mt-3 px-3 py-2 rounded bg-green-500 text-white' onClick={handleSubmit}>Submit</button>
                            </>
                        )}
                        
                        <button className='ml-5 text-blue-500 hover:underline hover:underline-offset-2' onClick={toggleForm}>
                            {isLoginForm ? "Don’t have an account yet? Signup." : 'Already have account? Log in.'}
                        </button>
                    </div> 
                    
                </div>
            )}
        </div>
    );
}

export default Login;
