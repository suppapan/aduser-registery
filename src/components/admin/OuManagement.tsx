
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FolderTree, ArrowRight } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = "http://localhost:5000";

// Sample OUs
const organizationalUnits = [
  "OU=Marketing,DC=example,DC=com",
  "OU=Sales,DC=example,DC=com",
  "OU=IT,DC=example,DC=com",
  "OU=Finance,DC=example,DC=com",
  "OU=HR,DC=example,DC=com",
];

// Sample users
const sampleUsers = [
  {
    username: "jsmith",
    fullname: "John Smith",
    ou: "OU=Marketing,DC=example,DC=com",
    email: "jsmith@example.com",
    department: "Marketing"
  },
  {
    username: "ajones",
    fullname: "Alice Jones",
    ou: "OU=Marketing,DC=example,DC=com",
    email: "ajones@example.com",
    department: "Marketing"
  },
  {
    username: "mwilliams",
    fullname: "Mike Williams",
    ou: "OU=Sales,DC=example,DC=com",
    email: "mwilliams@example.com",
    department: "Sales"
  }
];

const OuManagement = () => {
  const { toast } = useToast();
  const [sourceOu, setSourceOu] = useState<string>(organizationalUnits[0]);
  const [targetOu, setTargetOu] = useState<string>(organizationalUnits[1]);
  const [users, setUsers] = useState<typeof sampleUsers>(sampleUsers);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMoveUsers = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select at least one user to move",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call your Flask backend
      console.log(`Moving users from ${sourceOu} to ${targetOu}:`, selectedUsers);
      
      /* Uncomment this for actual backend integration
      const response = await fetch(`${API_URL}/api/admin/move-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users: selectedUsers,
          targetOu
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Move operation failed');
      }
      */
      
      // For demo purposes, we'll simulate success and update the local state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user OUs in our fake state
      setUsers(users.map(user => 
        selectedUsers.includes(user.username) 
          ? { ...user, ou: targetOu } 
          : user
      ));
      
      toast({
        title: "Users Moved Successfully",
        description: `${selectedUsers.length} users were moved to ${targetOu}`,
      });
      
      // Clear selection
      setSelectedUsers([]);
      
    } catch (error) {
      toast({
        title: "Move Failed",
        description: error instanceof Error ? error.message : "An error occurred while moving users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserSelection = (username: string) => {
    if (selectedUsers.includes(username)) {
      setSelectedUsers(selectedUsers.filter(u => u !== username));
    } else {
      setSelectedUsers([...selectedUsers, username]);
    }
  };

  // Filter users by source OU
  const filteredUsers = users.filter(user => user.ou === sourceOu);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Manage Organizational Units</h2>
      <p className="mb-6 text-gray-600">
        Select users from a source OU and move them to a target OU.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source OU
          </label>
          <Select 
            value={sourceOu} 
            onValueChange={setSourceOu}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source OU" />
            </SelectTrigger>
            <SelectContent>
              {organizationalUnits.map((ou) => (
                <SelectItem key={ou} value={ou}>
                  {ou}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target OU
          </label>
          <Select 
            value={targetOu} 
            onValueChange={setTargetOu}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target OU" />
            </SelectTrigger>
            <SelectContent>
              {organizationalUnits.map((ou) => (
                <SelectItem key={ou} value={ou}>
                  {ou}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Users in {sourceOu}</h3>
        {filteredUsers.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell>
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(user.username)}
                        onChange={() => toggleUserSelection(user.username)}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.department}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-4 border rounded-md bg-gray-50">
            No users found in this OU
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm">
          {selectedUsers.length} user(s) selected
        </span>
        <Button 
          onClick={handleMoveUsers} 
          disabled={selectedUsers.length === 0 || isLoading || sourceOu === targetOu}
          className="space-x-2"
        >
          <FolderTree className="h-4 w-4" />
          <span>Move to {targetOu.split(',')[0].replace('OU=', '')}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OuManagement;
