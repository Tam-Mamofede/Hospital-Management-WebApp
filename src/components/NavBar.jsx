import { useAuth } from "../contexts/AuthContext";

function NavBar() {
  const { currentStaff, logOut } = useAuth();

  return (
    <nav className="bg-blue-100 p-4">
      <div className="container mx-auto flex items-center justify-between px-8">
        <div className="flex text-lg font-bold text-blue-900">
          <h1> Hello, {currentStaff.staffFirstName}</h1>
        </div>
        <p className="w-fit rounded-lg border-none bg-green-900 px-2 font-bold text-white opacity-50">
          {currentStaff.role}
        </p>

        <button
          onClick={logOut}
          className="px-2 font-bold text-red-700 hover:rounded-lg hover:bg-red-700 hover:text-white hover:opacity-90"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
