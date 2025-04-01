
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FolderTree, ArrowRight, Search, Plus, X } from "lucide-react";
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

// Sample users database for demonstration
const userDatabase = [
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
  },
  {
    username: "dlee",
    fullname: "David Lee",
    ou: "OU=IT,DC=example,DC=com",
    email: "dlee@example.com",
    department: "IT"
  },
  {
    username: "jbrown",
    fullname: "Jessica Brown",
    ou: "OU=Finance,DC=example,DC=com",
    email: "jbrown@example.com",
    department: "Finance"
  }
];

interface User {
  username: string;
  fullname: string;
  ou: string;
  email: string;
  department: string;
}

const OuManagement = () => {
  const { toast } = useToast();
  const [targetOu, setTargetOu] = useState<string>(organizationalUnits[0]);
  const [usersToMove, setUsersToMove] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to search",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    // In a real app, this would call your backend
    // For demo, we'll search our mock database
    const results = userDatabase.filter(
      user => user.username.toLowerCase().includes(username.toLowerCase())
    );
    
    setSearchResults(results);
    setIsSearching(false);
    
    if (results.length === 0) {
      toast({
        title: "No users found",
        description: `No users matching "${username}" were found`,
        variant: "destructive",
      });
    }
  };

  const addUserToMove = (user: User) => {
    // Don't add duplicates
    if (!usersToMove.some(u => u.username === user.username)) {
      setUsersToMove([...usersToMove, user]);
    }
    // Clear search
    setUsername("");
    setSearchResults([]);
  };

  const removeUserToMove = (username: string) => {
    setUsersToMove(usersToMove.filter(user => user.username !== username));
  };

  const handleMoveUsers = async () => {
    if (usersToMove.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please add at least one user to move",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const usernames = usersToMove.map(user => user.username);
      
      // In a real app, this would call your Flask backend
      console.log(`Moving users to ${targetOu}:`, usernames);
      
      /* Uncomment this for actual backend integration
      const response = await fetch(`${API_URL}/api/admin/move-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernames: usernames,
          targetOu
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Move operation failed');
      }
      */
      
      // For demo purposes, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Users Moved Successfully",
        description: `${usersToMove.length} users were moved to ${targetOu}`,
      });
      
      // Clear selection
      setUsersToMove([]);
      
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Manage Organizational Units</h2>
      <p className="mb-6 text-gray-600">
        Search for users by username and move them to a target OU.
      </p>
      
      <div className="mb-6">
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
      
      <div className="mb-6">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter username to search"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <Button 
            onClick={handleSearch} 
            variant="outline"
            disabled={isSearching}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="mt-2 border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Current OU</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.ou}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => addUserToMove(user)}
                        disabled={usersToMove.some(u => u.username === user.username)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {usersToMove.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Users to move ({usersToMove.length})</h3>
          <div className="flex flex-wrap gap-2">
            {usersToMove.map(user => (
              <div key={user.username} className="flex items-center bg-muted px-2 py-1 rounded-md">
                <span>{user.username}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 ml-1"
                  onClick={() => removeUserToMove(user.username)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Button 
        onClick={handleMoveUsers} 
        disabled={usersToMove.length === 0 || isLoading}
        className="w-full space-x-2"
      >
        <FolderTree className="h-4 w-4" />
        <span>Move {usersToMove.length} user(s) to {targetOu.split(',')[0].replace('OU=', '')}</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OuManagement;
