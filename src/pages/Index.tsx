
import React from "react";
import PageHeader from "@/components/PageHeader";
import AdUserForm from "@/components/AdUserForm";
import BackendInfo from "@/components/BackendInfo";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
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
                  <a href="#" className="text-gray-600 hover:text-brand-600">Help</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-600">Contact</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main>
          <PageHeader 
            title="Create Advertising User Account" 
            description="Complete the form below to register for a new advertising account. Form data will be sent to a Flask backend with PyAD integration."
          />
          
          <BackendInfo />
          <AdUserForm />
        </main>
        
        <footer className="mt-16 pt-8 border-t text-center text-gray-500 text-sm">
          <p>&copy; 2023 AdUserRegistry. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
