"use client";
import { useState } from "react";
import Image from "next/image";
import Logo from "../../../public/Imges/LOGO.png";

import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

function Login() {
  const [isOpen, setIsOpen] = useState(false);
  //Signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  //Signup
  //Login
//   const [email2, setEmail2] = useState("");
//   const [password2, setPassword2] = useState("");
//   const [error2, setError2] = useState("");
  //Login
  const [isLoginForm, setIsLoginForm] = useState(true);

  const router = useRouter();


  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  console.log(name, email, password);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
          email, password, redirect: false
      })

      if (res.error) {
        setError("Invalid credentials");
        return;
      }

      router.refresh();
      setIsOpen(false)

    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setError("Password don't match!");
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      setError("Please complete all inputs!");
      return;
    }

    try {
      const resCheckUser = await fetch("http://localhost:3000/api/checkUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const { user } = await resCheckUser.json();

      if (user) {
        setError("User already exist!");
        return;
      }

      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        setError("");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsLoginForm(true);
      } else {
        console.log("User registered failed");
      }
    } catch (error) {
      console.log("Error during registration:", error);
    }
  };

  const toggleForm = () => {
    setIsLoginForm((prevState) => !prevState);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="relative">
      <button
        onClick={openPopup}
        className="flex text-white text-xl font-sans border border-white rounded-3xl px-4 py-2"
      >
        Login
      </button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center px-3">
          <div className="bg-white bg-opacity-95 rounded-lg p-8 shadow-md w-[450px] lg:w-[500px]">
            <button onClick={closePopup} className="w-full flex justify-end">
              X
            </button>
            <Image
              src={Logo}
              alt="logo"
              className="flex flex-col justify-center items-center w-32 mx-auto mb-4 rounded-md "
            />
            {isLoginForm ? (
              <form onSubmit={handleSubmitLogin}>
                <h2 className="w-full flex justify-center text-3xl font-semibold mb-5">
                  Login
                </h2>
                {error && (
                  <div className="my-2 bg-red-500 w-fit text-white py-2 px-3 rounded-md">
                    {error}
                  </div>
                )}
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
                <button type="submit" className="mt-3 px-3 py-2 rounded bg-green-500 text-white">
                  Submit
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitSignup}>
                <h2 className="w-full flex justify-center text-3xl font-semibold mb-5">
                  Signup
                </h2>
                {error && (
                  <div className="my-2 bg-red-500 w-fit text-white py-2 px-3 rounded-md">
                    {error}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <button
                  className="mt-3 px-3 py-2 rounded bg-green-500 text-white"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )}

            <button
              className="mt-2 text-blue-500 hover:underline hover:underline-offset-2"
              onClick={toggleForm}
            >
              {isLoginForm
                ? "Don’t have an account yet? Signup."
                : "Already have account? Log in."}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
