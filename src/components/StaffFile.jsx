import { useAuth } from "../contexts/AuthContext";

function StaffFile() {
  const { currentStaff, loading } = useAuth();

  return (
    <div>
      {loading && <h1>Loading</h1>}
      <h1>{JSON.stringify(currentStaff, null, 2)}</h1>
    </div>
  );
}

export default StaffFile;
