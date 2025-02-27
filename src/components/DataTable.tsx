import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom'; // For detecting route
import { Search } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  filterable?: boolean;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading: boolean;
  onFilterChange?: (key: string, value: string) => void;
}

const DataTable = ({
  data,
  columns,
  pageSize,
  onPageSizeChange,
  loading,
  onFilterChange,
}: DataTableProps) => {
  const location = useLocation(); // Get the current route
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const pageSizeOptions = [5, 10, 20, 50];

  // Detect if the current route is /products
  const isProductsPage = location.pathname === '/products';
  const filters = isProductsPage
    ? [
        { key: 'title', label: 'Title' },
        { key: 'brand', label: 'Brand' },
        { key: 'category', label: 'Category' },
      ]
    : [
        { key: 'firstName', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'birthDate', label: 'Birth Date' },
        { key: 'gender', label: 'Gender' },
      ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      columns.every((column) => {
        if (activeFilters[column.key]) {
          return item[column.key]
            .toString()
            .toLowerCase()
            .includes(activeFilters[column.key].toLowerCase());
        }
        return true;
      })
    );
  }, [data, activeFilters, columns]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 flex flex-wrap justify-between items-center border-b">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border rounded px-3 py-1 bg-white"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} entries
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-secondary rounded-full"
            >
              <Search size={20} />
            </button>
            {showSearch && (
              <div className="flex flex-wrap space-x-4">
                {filters.map((filter) => (
                  <div key={filter.key} className="flex items-center space-x-1 mb-2 sm:mb-0">
                    <span className="text-sm font-medium">{filter.label}:</span>
                    <input
                      type="text"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      placeholder={filter.label}
                      className="border rounded px-2 py-1 text-sm w-24 sm:w-auto"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-tableHeader border-b border-gray-400">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-sm font-bold text-primary uppercase border border-gray-300"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center border border-gray-300">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center border border-gray-300">
                  No data found
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {columns.map((column) => (
                    <td key={`${item.id}-${column.key}`} className="px-6 py-4 text-sm border border-gray-300">
                      {item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
