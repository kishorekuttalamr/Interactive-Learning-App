import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    parentName: "",
    parentUsername: "",
    parentPassword: "",
    parentEmail: "",
    childName: "",
    childUsername: "",
    childPassword: "",
    childEmail: "",
    childDob: "",
    preferredSubjects: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Skipping validation
    alert("Skipping validation and proceeding...");
    navigate("/verifyOtp", { state: { formData } });  
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/cool shapes.png')" }}
      ></div>

      {/* Register Form */}
      <div className="relative p-10 w-[800px] rounded-lg shadow-xl 
                     backdrop-blur-xl border border-white/40 bg-white/10 mt-16">
        <form onSubmit={handleRegister} className="flex flex-col gap-y-4">
          <h2 className="text-4xl font-poppins text-center mb-4 text-white">Welcome Aboard!</h2>
          {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Parent Information */}
            <div className="p-4 border border-white/40 rounded-lg bg-white/10">
              <div className="flex flex-col gap-y-4">
                <div className="text-white text-lg text-center">Parent Information</div>
                <input type="text" name="parentName" placeholder="Parent Name" onChange={handleChange} className="input-style rounded h-[40px] p-2 w-full"/>
                <input type="text" name="parentUsername" placeholder="Parent Username" onChange={handleChange} className="input-style rounded h-[40px] p-2 w-full"/>
                <input type="password" name="parentPassword" placeholder="Parent Password" onChange={handleChange} className="input-style rounded h-[40px] p-2 w-full"/>
                <input type="email" name="parentEmail" placeholder="Parent Email" onChange={handleChange} className="input-style rounded h-[40px] p-2 w-full"/>
              </div>
            </div>
            
            {/* Child Information */}
            <div className="p-4 border border-white/40 rounded-lg bg-white/10">
              <div className="text-white text-lg mb-2 text-center">Child Information</div>
              <div className="flex flex-col gap-y-4">
                <input type="text" name="childName" placeholder="Child Name" onChange={handleChange} className="input-style rounded h-[40px] p-2 w-full"/>
                <input type="text" name="childUsername" placeholder="Child Username" onChange={handleChange} className="input-style rounded h-[40px] p-2 w-full"/>
                <input type="password" name="childPassword" placeholder="Child Password" onChange={handleChange} className="input-style rounded h-[40px] p-2 w-full"/>
                <input type="email" name="childEmail" placeholder="Child Email" onChange={handleChange} className="input-style rounded h-[40px] p-2 w-full"/>
                <input
                  type="text"
                  name="childDob"
                  onChange={handleChange}
                  onFocus={(e) => e.target.type = "date"}
                  onBlur={(e) => e.target.value === "" ? e.target.type = "text" : null}
                  placeholder="Child Date of Birth"
                  className="input-style rounded h-[40px] p-2 w-full"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-blue-600">
            Next
          </button>
        </form>
        
        {/* Redirect to Login */}
        <p className="text-white text-center mt-4">
          Already have an account? 
          <span onClick={() => navigate('/login')} className="text-blue-400 cursor-pointer hover:underline"> Log in</span>
        </p>
      </div>
    </div>
  );
}
