function Pagination({ currentPage = 1, totalPages = 3, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-8 border-t border-gray-200 pt-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          text-xs tracking-[0.2em] font-light
          ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-black transition-colors"
          }
        `}
      >
        PREVIOUS
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-6">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              text-sm font-serif relative py-2
              ${
                currentPage === page
                  ? "text-black"
                  : "text-gray-400 hover:text-black transition-colors"
              }
              ${
                currentPage === page &&
                "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-black"
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          text-xs tracking-[0.2em] font-light
          ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-black transition-colors"
          }
        `}
      >
        NEXT
      </button>
    </div>
  );
}

export default Pagination;
