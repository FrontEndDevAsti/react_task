import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchUsers, setSearchTerm, setPageSize, setCurrentPage } from '../store/usersSlice';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

const columns = [
  { key: 'id', label: 'ID', filterable: true },
  { key: 'firstName', label: 'First Name', filterable: true },
  { key: 'lastName', label: 'Last Name', filterable: true },
  { key: 'maidenName', label: 'Maiden Name' },
  { key: 'age', label: 'Age' },
  { key: 'gender', label: 'Gender', filterable: true },
  { key: 'email', label: 'Email', filterable: true },
  { key: 'phone', label: 'Phone' },
  { key: 'username', label: 'Username' },
  { key: 'birthDate', label: 'Birth Date', filterable: true },
  { key: 'bloodGroup', label: 'Blood Group' },
  { key: 'eyeColor', label: 'Eye Color' },
];

// Define the User interface (ensure this matches the shape of your user data)
interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  bloodGroup: string;
  eyeColor: string;
}

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, searchTerm, pageSize, currentPage } = useSelector(
    (state: RootState) => state.users
  );
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchUsers({ limit: pageSize, skip: (currentPage - 1) * pageSize }));
  }, [dispatch, pageSize, currentPage]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = items.filter((user) => {
    // Apply all active filters
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;

      // Special case for name filter - check both first and last name
      if (key === 'firstName' && value) {
        return (
          (user.firstName && user.firstName.toLowerCase().includes(value.toLowerCase())) ||
          (user.lastName && user.lastName.toLowerCase().includes(value.toLowerCase()))
        );
      }

      // For other filters, safely access the user property
      return user[key as keyof User] && user[key as keyof User]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <DataTable
        data={filteredData}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(size) => dispatch(setPageSize(size))}
        searchTerm={searchTerm}
        onSearchChange={(term) => dispatch(setSearchTerm(term))}
        loading={loading}
        onFilterChange={handleFilterChange}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />
    </div>
  );
};

export default Users;
