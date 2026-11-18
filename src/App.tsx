import { useState, useEffect } from 'react'
import { fetchUsers } from '@/services/sheetService'

import type { UserItem } from '@/schema/schemas'

function App() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBDData = async () => {
    setLoading(true);

    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBDData();
  }, []);

  return (
    <>
      {loading && users.length === 0 ? (
        <p>loading</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.nama} - {user.panggoaran ? user.panggoaran : "belum berkembang biak"} - {user.tgllahir} - {user.blnlahir} - {user.thnlahir}
            </li>
          ))}
        </ul>
      )
      }
    </>
  )
}

export default App