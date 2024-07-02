import React from "react";
import ReactPaginate from "react-paginate";

export default function Paginate({ pages, onChange }) {
  return (
    <div className="flex justify-center items-center w-3/4 mb-8">
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        previousLabel="Previous"
        pageCount={pages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={onChange}
        containerClassName="pagination flex justify-center items-center space-x-2"
        activeClassName="bg-blue-500 text-white"
        previousLinkClassName="px-4 py-2 rounded-lg h-full bg-gray-200 hover:bg-gray-300 flex items-center"
        nextLinkClassName="px-4 py-2 rounded-lg h-full bg-gray-200 hover:bg-gray-300 flex items-center"
        pageClassName="px-3 py-2 rounded-lg"
        pageLinkClassName="hover:bg-blue-300 hover:p-2 hover:rounded-full"
      />
    </div>
  );
}
