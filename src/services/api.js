import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = 'http://192.168.0.112:8000/api'; // Using local LAN IP for physical device testing

const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('sf_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {})
    };
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
