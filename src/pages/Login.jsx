import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const {
    logIn,
    logInEmail,
    setLogInEmail,
    logInPassword,
    setLogInPassword,
    isLoading,
  } = useAuth();

  return (
    <div className="login-page relative flex min-h-screen items-center justify-center">
      {/* Waves Background */}
      <div className="absolute inset-0 -z-10">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      {/* Login Form Container */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full max-w-md rounded-2xl bg-white bg-opacity-20 p-8 text-white shadow-lg backdrop-blur-lg">
          <h2 className="mb-4 text-center text-2xl font-bold">
            SureCare Specialist Orthopedic Hospital
          </h2>
          <p className="mb-6 text-center text-gray-200">
            Securely log in to access the system.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="text"
                value={logInEmail}
                onChange={(e) => setLogInEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 bg-white bg-opacity-30 px-4 py-2 text-white placeholder-gray-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium">Password</label>
              <input
                type="password"
                value={logInPassword}
                onChange={(e) => setLogInPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 bg-white bg-opacity-30 px-4 py-2 text-white placeholder-gray-300 focus:outline-none"
              />
            </div>
            <button
              onClick={logIn}
              className="w-full rounded-lg bg-white bg-opacity-30 px-4 py-2 font-bold text-white transition-all duration-300 hover:bg-opacity-50"
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
