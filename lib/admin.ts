// Fetch all pending store owners
export const fetchPendingStoreOwners = async () => {
  try {
    const response = await fetch('/api/admin/store-owners');
    if (!response.ok) {
      throw new Error('Failed to fetch pending store owners');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending store owners:', error);
    throw error;
  }
};

// Approve a store owner
export const approveStoreOwner = async (storeOwnerId: string) => {
  try {
    const response = await fetch('/api/admin/store-owners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'approve',
        storeOwnerId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to approve store owner');
    }

    return await response.json();
  } catch (error) {
    console.error('Error approving store owner:', error);
    throw error;
  }
};

// Reject a store owner
export const rejectStoreOwner = async (storeOwnerId: string, reason?: string) => {
  try {
    const response = await fetch('/api/admin/store-owners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'reject',
        storeOwnerId,
        reason,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject store owner');
    }

    return await response.json();
  } catch (error) {
    console.error('Error rejecting store owner:', error);
    throw error;
  }
};
