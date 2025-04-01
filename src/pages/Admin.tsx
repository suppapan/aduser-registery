
import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CsvImport from "@/components/admin/CsvImport";
import OuManagement from "@/components/admin/OuManagement";
import AuthTest from "@/components/admin/AuthTest";
import AdminNavBar from "@/components/admin/AdminNavBar";
import AdminLogin from "@/components/admin/AdminLogin";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
          <AdminNavBar />
          
          <PageHeader 
            title="Admin Authentication" 
            description="Please authenticate to access admin features."
          />
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <AdminLogin onSuccess={() => setIsAuthenticated(true)} />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <AdminNavBar />
        
        <PageHeader 
          title="AD User Administration" 
          description="Manage Active Directory users, organizational units, and perform batch operations."
        />
        
        <Tabs defaultValue="csv-import" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="csv-import">CSV Import</TabsTrigger>
            <TabsTrigger value="ou-management">OU Management</TabsTrigger>
            <TabsTrigger value="auth-test">Authentication Test</TabsTrigger>
          </TabsList>
          <TabsContent value="csv-import">
            <CsvImport />
          </TabsContent>
          <TabsContent value="ou-management">
            <OuManagement />
          </TabsContent>
          <TabsContent value="auth-test">
            <AuthTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
