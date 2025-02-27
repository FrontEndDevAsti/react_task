import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchProducts,
  setSearchTerm,
  setPageSize,
  setCurrentPage,
  setActiveTab
} from '../store/productsSlice';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title', filterable: true },
  { key: 'brand', label: 'Brand', filterable: true },
  { key: 'category', label: 'Category', filterable: true },
  { key: 'price', label: 'Price' },
  { key: 'rating', label: 'Rating' },
  { key: 'stock', label: 'Stock' },
  { key: 'discountPercentage', label: 'Discount' },
];

interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  discountPercentage: number;
}

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    items, 
    total, 
    loading, 
    searchTerm, 
    pageSize, 
    currentPage,
    activeTab 
  } = useSelector((state: RootState) => state.products);

  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchProducts({ 
      limit: pageSize, 
      skip: (currentPage - 1) * pageSize,
      category: activeTab === 'LAPTOPS' ? 'laptops' : ''
    }));
  }, [dispatch, pageSize, currentPage, activeTab]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = items.filter((product: Product) => {
    // Apply all active filters
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return product[key as keyof Product] && product[key as keyof Product]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="space-x-2">
          <button
            onClick={() => dispatch(setActiveTab('ALL'))}
            className={`px-4 py-2 rounded ${
              activeTab === 'ALL' ? 'bg-primary text-white' : 'bg-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => dispatch(setActiveTab('LAPTOPS'))}
            className={`px-4 py-2 rounded ${
              activeTab === 'LAPTOPS' ? 'bg-primary text-white' : 'bg-white'
            }`}
          >
            Laptops
          </button>
        </div>
      </div>
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

export default Products;
