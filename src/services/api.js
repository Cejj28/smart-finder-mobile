import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = 'http://192.168.0.108:8000/api'; // Using local LAN IP for physical device testing

const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('sf_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {})
    };
};

export const loginApi = async (email, password) => {
    const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
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
    return data.map(item => ({
        id: item.id,
        type: item.type,
        item: item.item_name,
        location: item.location,
        submittedBy: item.reporter_username || 'Admin',
        date: new Date(item.created_at).toLocaleDateString(),
        description: item.description,
        status: item.status || 'Pending Review'
    }));
};
