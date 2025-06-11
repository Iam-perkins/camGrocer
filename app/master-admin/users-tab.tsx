'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, User, Store, ShieldAlert, ShieldCheck, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'store_owner' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  storeName?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function UsersTab() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<PlatformUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Handle updating user status
  const handleUpdateUserStatus = async (userId: string, status: 'active' | 'suspended' | 'banned') => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      console.error('User not found in local state:', userId);
      toast({
        title: 'Error',
        description: 'User not found in local state',
        variant: 'destructive',
      });
      return;
    }
    
    const statusMessages = {
      active: 'activate',
      suspended: 'suspend',
      banned: 'ban'
    };
    
    const action = statusMessages[status];
    
    try {
      setIsProcessing(userId);
      
      console.log(`Updating user ${userId} status to ${status}`);
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response from server');
      }
      
      console.log('Update status response:', {
        status: response.status,
        statusText: response.statusText,
        responseData
      });
      
      if (!response.ok) {
        console.error('Update failed with status:', response.status, 'Response:', responseData);
        throw new Error(responseData.error || `Failed to update user status (HTTP ${response.status})`);
      }
      
      // Update the local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
      
      // Show success toast with user details
      toast({
        title: (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span>User {status === 'active' ? 'Activated' : status === 'suspended' ? 'Suspended' : 'Banned'}</span>
          </div>
        ),
        description: (
          <div className="flex flex-col gap-1">
            <p className="font-medium">{user.name || user.email.split('@')[0]}</p>
            <p className="text-sm text-muted-foreground">
              {status === 'active' 
                ? 'The user account has been reactivated.' 
                : `The user account has been ${status}. An email notification has been sent.`}
            </p>
          </div>
        ),
        duration: 5000,
        className: 'border-l-4 border-green-500 bg-background',
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user status';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to delete user');
      }
      
      // Remove the user from the local state
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      // Show success toast with user details
      toast({
        title: (
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            <span>User Deleted</span>
          </div>
        ),
        description: (
          <div className="flex flex-col gap-1">
            <p className="font-medium">{userToDelete.name || userToDelete.email.split('@')[0]}</p>
            <p className="text-sm text-muted-foreground">
              The user account has been permanently deleted. An email notification has been sent.
            </p>
          </div>
        ),
        duration: 5000,
        className: 'border-l-4 border-red-500 bg-background',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  // Filter users based on search and active tab
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.phone.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'customers') return user.role === 'customer' && matchesSearch;
      if (activeTab === 'store_owners') return user.role === 'store_owner' && matchesSearch;
      if (activeTab === 'suspended' || activeTab === 'banned') return user.status === activeTab && matchesSearch;
      
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="store_owners">Store Owners</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
          <TabsTrigger value="banned">Banned</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No users found</p>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {user.role === 'store_owner' ? (
                              <Store className="h-6 w-6" />
                            ) : (
                              <User className="h-6 w-6" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{user.name}</h3>
                            <Badge
                              variant={
                                user.role === 'admin'
                                  ? 'default'
                                  : user.role === 'store_owner'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {user.role === 'store_owner' ? 'Store Owner' : user.role}
                            </Badge>
                            <Badge
                              variant={
                                user.status === 'active'
                                  ? 'default'
                                  : user.status === 'suspended'
                                  ? 'destructive'
                                  : 'destructive'
                              }
                            >
                              {user.status}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 mr-1.5" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-1.5" />
                            <span>{user.phone}</span>
                          </div>
                          {user.storeName && (
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <Store className="h-4 w-4 mr-1.5" />
                              <span>{user.storeName}</span>
                            </div>
                          )}
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            <span>
                              Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          {user.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateUserStatus(user.id, 'suspended')}
                              disabled={isProcessing === user.id}
                              className="w-full sm:w-auto"
                            >
                              {isProcessing === user.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <ShieldAlert className="mr-2 h-4 w-4" />
                              )}
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateUserStatus(user.id, 'active')}
                              disabled={isProcessing === user.id}
                              className="w-full sm:w-auto"
                            >
                              {isProcessing === user.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <ShieldCheck className="mr-2 h-4 w-4" />
                              )}
                              {user.status === 'suspended' ? 'Unsuspend' : 'Unban'}
                            </Button>
                          )}
                          {user.status !== 'banned' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleUpdateUserStatus(user.id, 'banned')}
                              disabled={isProcessing === user.id}
                              className="w-full sm:w-auto"
                            >
                              {isProcessing === user.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              Ban
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUserToDelete(user);
                            }}
                            disabled={isProcessing === user.id}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 w-full sm:w-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and all associated data.
              {userToDelete?.storeName && (
                <span className="block mt-2 font-medium text-amber-600">
                  Note: This is a store owner account. Deleting it will also remove the associated store.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
