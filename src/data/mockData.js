/**
 * Mock data for the mobile app (mirrors the web app's mockData.js)
 */

export const recentItems = [
    {
        id: 1,
        type: 'Lost',
        item: 'Blue Backpack',
        submittedBy: 'Juan Dela Cruz',
        location: 'Library 2nd Floor',
        date: '2026-03-05',
        status: 'Pending Review',
    },
    {
        id: 2,
        type: 'Found',
        item: 'Silver Watch',
        submittedBy: 'Maria Santos',
        location: 'Cafeteria',
        date: '2026-03-05',
        status: 'Approved',
    },
    {
        id: 3,
        type: 'Lost',
        item: 'Scientific Calculator',
        submittedBy: 'Pedro Garcia',
        location: 'Room 301',
        date: '2026-03-04',
        status: 'Pending Review',
    },
    {
        id: 4,
        type: 'Found',
        item: 'Student ID Card',
        submittedBy: 'Ana Reyes',
        location: 'Gym',
        date: '2026-03-04',
        status: 'Approved',
    },
    {
        id: 5,
        type: 'Lost',
        item: 'Black Umbrella',
        submittedBy: 'Carlos Ramos',
        location: 'Parking Lot B',
        date: '2026-03-03',
        status: 'Rejected',
    },
    {
        id: 6,
        type: 'Found',
        item: 'Wireless Earbuds',
        submittedBy: 'Liza Mendoza',
        location: 'Computer Lab',
        date: '2026-03-03',
        status: 'Pending Review',
    },
];

export const notifications = [
    { id: 1, message: 'Your report for "Blue Backpack" is under review.', time: '2 min ago' },
    { id: 2, message: '"Silver Watch" has been matched with a claim!', time: '1 hour ago' },
    { id: 3, message: 'Your report for "Scientific Calculator" was approved.', time: '3 hours ago' },
    { id: 4, message: '"Black Aquaflask Tumbler" has been matched with a claim!', time: '5 hours ago' },
];
