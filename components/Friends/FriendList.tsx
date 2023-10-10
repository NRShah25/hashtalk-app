import React from 'react';
import { UserButton } from '@clerk/nextjs';

const FriendList = () => {
    // Hardcoded/fake friends data
    const fakeFriends = [
        { id: 1, userId: 'user_id_1', name: 'John Doe', isOnline: true },
        { id: 2, userId: 'user_id_2', name: 'Jane Smith', isOnline: false },
        { id: 3, userId: 'user_id_3', name: 'Jayson Smith', isOnline: false },
        { id: 4, userId: 'user_id_4', name: 'Steven Smith', isOnline: false },
        { id: 5, userId: 'user_id_5', name: 'Adeel Smith', isOnline: false },
        { id: 6, userId: 'user_id_6', name: 'Smith Smith', isOnline: false },
        { id: 7, userId: 'user_id_7', name: 'Brittany Smith', isOnline: false },
        { id: 8, userId: 'user_id_8', name: 'Jack Smith', isOnline: false },
        { id: 9, userId: 'user_id_9', name: 'Tucker Smith', isOnline: false },
        { id: 10, userId: 'user_id_10', name: 'Tim Smith', isOnline: false },



        // Add more fake friends as needed
    ];

    return (
        <div>
            <h2>Friend List</h2>
            {fakeFriends.map((friend) => (
                <div key={friend.id}>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: 'h-[48px] w-[48px]',
                            },
                        }}
                    />
                    {friend.name} {/* Display friend's name */}
                </div>
            ))}
        </div>
    );
};

export default FriendList;


