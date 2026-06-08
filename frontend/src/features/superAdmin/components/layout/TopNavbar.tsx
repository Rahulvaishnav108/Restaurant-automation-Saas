// import { Bell, Moon, Sun, ChevronDown } from "lucide-react";

// export default function TopNavbar({
//   darkMode,
//   toggleTheme,
//   profileOpen,
//   setProfileOpen,
//   dropdownRef,
// }) {
//   return (
//     <header className="h-16 flex justify-between items-center px-6 border-b">
      
//       <h1 className="font-bold">Dashboard</h1>

//       <div className="flex items-center gap-4">

//         <button onClick={toggleTheme}>
//           {darkMode ? <Sun /> : <Moon />}
//         </button>

//         <Bell />

//         <div ref={dropdownRef} className="relative">
//           <button onClick={() => setProfileOpen(!profileOpen)}>
//             Admin <ChevronDown />
//           </button>

//           {profileOpen && (
//             <div className="absolute right-0 mt-2 border bg-white p-2">
//               Logout
//             </div>
//           )}
//         </div>

//       </div>
//     </header>
//   );
// }