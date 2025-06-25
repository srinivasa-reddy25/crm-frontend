'use client';


import Cookies from "js-cookie";


export const deteleBulkContacts = async (contactIds) => {
    const token = Cookies.get('auth');
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/bulk-delete`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: contactIds })
        });

        if (!response.ok) {
            return false;
        }
        const result = await response.json();
        console.log('Contacts deleted successfully:', result);
        return true;
    } catch (error) {
        console.error('Error deleting contacts:', error);
        return false;
    }
}
