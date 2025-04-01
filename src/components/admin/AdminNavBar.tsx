
import React from "react";
import { Link } from "react-router-dom";

const AdminNavBar = () => {
  return (
    <header className="border-b pb-6 mb-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">AdUserRegistry</h2>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-brand-600">Home</Link>
            </li>
            <li>
              <Link to="/admin" className="text-brand-600 hover:text-brand-600 font-medium">Admin Dashboard</Link>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-brand-600">Help</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavBar;
