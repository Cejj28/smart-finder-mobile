import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = __DEV__ 
    ? 'https://smart-finder-django.onrender.com/api' // Temporarily pointed to deployed backend for testing
    : 'https://smart-finder-django.onrender.com/api'; // Production deployment URL

const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('sf_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {})
    };
};

export const registerStudent = async ({ full_name, email, department, password, confirm_password }) => {
    const response = await fetch(`${API_URL}/register/student/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, department, password, confirm_password })
    });
    const data = await response.json();
    if (!response.ok) throw data; // throw the raw error object so we can display field errors
    return data;
};

export const loginApi = async (identifier, password) => {
    const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier, password })
    });
    
    if (!response.ok) {
        throw new Error('Invalid credentials');
    }
    return await response.json();
};

export const fetchItems = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/items/`, { headers });
    if (!response.ok) throw new Error('Failed to fetch items');
    const data = await response.json();
    
    const BASE_SERVER_URL = API_URL.replace('/api', '');

    return data.map(item => ({
        id: item.id,
        type: item.type,
        item: item.item_name,
        location: item.location,
        submittedBy: item.reporter_username || 'Admin',
        date: new Date(item.created_at).toLocaleDateString(),
        description: item.description,
        // Ensure image_url is formatted for mobile display
        image_url: (item.image && typeof item.image === 'string') 
            ? (item.image.startsWith('http') ? item.image : `${BASE_SERVER_URL}${item.image}`)
            : null,
        status: item.status || 'Pending Review'
    }));
};

export const createItem = async (formData) => {
    const token = await AsyncStorage.getItem('sf_token');
    const response = await fetch(`${API_URL}/items/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            // Do NOT set Content-Type for FormData
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData) || 'Failed to create item');
    }
    return await response.json();
};

export const fetchMyItems = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/items/my_posts/`, { headers });
    if (!response.ok) throw new Error('Failed to fetch my items');
    const data = await response.json();
    
    const BASE_SERVER_URL = API_URL.replace('/api', '');

    return data.map(item => ({
        id: item.id,
        type: item.type,
        item: item.item_name,
        location: item.location,
        submittedBy: item.reporter_username || 'Admin',
        date: new Date(item.created_at).toLocaleDateString(),
        description: item.description,
        contact_info: item.contact_info,
        image_url: (item.image && typeof item.image === 'string') 
            ? (item.image.startsWith('http') ? item.image : `${BASE_SERVER_URL}${item.image}`)
            : null,
        status: item.status || 'Pending Review'
    }));
};

export const deleteItem = async (id) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/items/${id}/`, {
        method: 'DELETE',
        headers
    });
    if (!response.ok) throw new Error('Failed to delete item');
    return true;
};

export const updateItem = async (id, data) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/items/${id}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch(e) {
            errorData = { error: 'Unknown server error' };
        }
        throw new Error(JSON.stringify(errorData) || 'Failed to update item');
    }
    return await response.json();
};
