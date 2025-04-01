
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Check, Download } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = "http://localhost:5000";

// Sample OUs for the template
const organizationalUnits = [
  "OU=Marketing,DC=example,DC=com",
  "OU=Sales,DC=example,DC=com",
  "OU=IT,DC=example,DC=com",
  "OU=Finance,DC=example,DC=com",
  "OU=HR,DC=example,DC=com",
];

// Represents a user from CSV
interface CsvUser {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  fullname: string;
  ou: string;
  email: string;
  zipcode: string;
  description: string;
  telephone: string;
  jobtitle: string;
  department: string;
}

const CsvImport = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [users, setUsers] = useState<CsvUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
        
        const parsedUsers: CsvUser[] = [];
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // Skip empty rows
          
          const values = rows[i].split(',').map(value => value.trim());
          const user: any = {};
          
          headers.forEach((header, index) => {
            if (index < values.length) {
              user[header] = values[index];
            }
          });
          
          // Ensure all required fields
          if (user.username && user.firstname && user.lastname) {
            // Set fullname if not provided
            if (!user.fullname) {
              user.fullname = `${user.firstname} ${user.lastname}`;
            }
            
            parsedUsers.push(user as CsvUser);
          }
        }
        
        setUsers(parsedUsers);
      }
    };
    
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      // Use the OUs from the CSV data
      const usersToImport = users.map(user => ({
        ...user,
      }));
      
      // In a real app, this would call your Flask backend
      console.log("Users to import:", usersToImport);
      
      /* Uncomment this for actual backend integration
      const response = await fetch(`${API_URL}/api/admin/import-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users: usersToImport
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Import failed');
      }
      */
      
      // For demo purposes, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Users Imported Successfully",
        description: `${users.length} users were imported with their respective OUs`,
      });
      
      // Clear form
      setFile(null);
      setUsers([]);
      
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "An error occurred during import",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = "username,password,firstname,lastname,ou,email,zipcode,description,telephone,jobtitle,department\n";
    const sampleRow = "jdoe,Password123!,John,Doe,OU=IT\\,DC=example\\,DC=com,jdoe@example.com,12345,IT Specialist,555-1234,Systems Admin,IT\n";
    const sampleRow2 = "asmith,SecurePass456!,Alice,Smith,OU=Marketing\\,DC=example\\,DC=com,asmith@example.com,67890,Marketing Specialist,555-5678,Marketing Manager,Marketing";
    
    const csvContent = headers + sampleRow + sampleRow2;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ad_users_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Import Users from CSV</h2>
      <p className="mb-6 text-gray-600">
        Upload a CSV file containing user information to bulk create AD users.
        The CSV should contain columns for: username, password, firstname, lastname, ou, email, etc.
      </p>
      
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={downloadTemplate}
          className="w-full mb-4"
        >
          <Download className="mr-2 h-4 w-4" />
          Download CSV Template
        </Button>
        
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CSV File
        </label>
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        <p className="text-xs text-gray-500 mt-1">
          File should be a CSV with headers matching required AD attributes including the OU
        </p>
      </div>
      
      {users.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Preview ({users.length} users)</h3>
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>OU</TableHead>
                  <TableHead>Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 5).map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.ou}</TableCell>
                    <TableCell>{user.department}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {users.length > 5 && (
              <div className="p-2 text-center text-sm text-gray-500">
                ... and {users.length - 5} more users
              </div>
            )}
          </div>
        </div>
      )}
      
      <Button 
        onClick={handleImport} 
        disabled={users.length === 0 || isLoading}
        className="w-full"
      >
        {isLoading ? (
          "Importing..."
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Import {users.length > 0 ? `${users.length} Users` : 'Users'}
          </>
        )}
      </Button>
    </div>
  );
};

export default CsvImport;
