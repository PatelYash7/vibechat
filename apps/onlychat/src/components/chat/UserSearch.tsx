import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { UserType } from '@/types/types';
import { handleSearch } from '@/action/handleSearch';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { UserSearchResults } from './UserSearchResult';

export const UserSearch = ({ number, setNumber, handleCurrentChat }:{
    number:string,
    setNumber:Dispatch<SetStateAction<string>>,
    handleCurrentChat: ({ user, roomId, }: {
        user: UserType;
        roomId: string;
    }) => void
}) => {
  const [users, setUsers] = useState<UserType[]>();
  const debouncedNumber = useDebounce({ value: number, delay: 400 });

  useEffect(() => {
    const searchUsers = async () => {
      if (debouncedNumber) {
        const result = await handleSearch({ number: debouncedNumber });
        setUsers(result);
      } else {
        setUsers(undefined);
      }
    };
    searchUsers();
  }, [debouncedNumber]);

  return (
    <div className='space-y-4 mb-6'>
      <Input
        type='text'
        placeholder='Search users...'
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <UserSearchResults 
        users={users}
        onUserSelect={(user) => {
          setUsers(undefined);
          setNumber('');
          handleCurrentChat({ user, roomId: '' });
        }}
      />
    </div>
  );
};