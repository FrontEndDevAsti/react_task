import { MoveLeft, MoveRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-6 mb-4">
      {/* Left Arrow */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-2 px-2 py-1 cursor-pointer text-gray-600 disabled:text-gray-300"
      >
       <MoveLeft />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`mx-1 w-6 h-6 flex items-center justify-center cursor-pointer ${
              currentPage === page ? "font-bold translate-y-[-2px] text-black" : "text-gray-600 hover:text-black"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="mx-2 text-gray-500">...</span>
        )
      )}

      {/* Right Arrow */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-2 px-2 py-1 cursor-pointer text-gray-600 disabled:text-gray-300"
      >
        <MoveRight />
      </button>
    </div>
  );
};

export default Pagination;
