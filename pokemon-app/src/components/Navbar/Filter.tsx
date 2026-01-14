// src/components/Filter.tsx
import React, { useState, useRef, useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import TagIcon from "../../assets/images/tag.svg?react";
import TextFormatIcon from "../../assets/images/text_format.svg?react";

const Filter: React.FC = () => {
  const { sortOrder, setSortOrder } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-white p-2 rounded-full shadow-inner-2dp text-identity hover:opacity-80 transition-opacity"
        aria-label={`Sort by ${sortOrder === "number" ? "number" : "name"}. Click to change sort order`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {sortOrder === "number" ? (
          <TagIcon className="w-6 h-6 fill-identity" aria-hidden="true"/>
        ) : (
          <TextFormatIcon className="w-6 h-6 fill-identity" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 z-50 shadow-drop-6dp rounded-lg"
          role="menu"
          aria-label="Sort options"
        >
          <div className="bg-identity rounded-lg overflow-hidden shadow-drop-8dp min-w-[200px]">
            {/* Header */}
            <div className="px-4 py-3">
              <h3 className="text-body-1 font-bold text-gray-white">
                Sort by:
              </h3>
            </div>

            {/* Content */}
            <div className="bg-gray-white rounded-lg m-2 shadow-inner-2dp">
              <div className="p-3 space-y-3">
                {/* Number option */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sortOrder"
                    value="number"
                    checked={sortOrder === "number"}
                    onChange={() => {
                      setSortOrder("number");
                      setIsOpen(false);
                    }}
                    className="w-5 h-5 text-identity focus:ring-identity focus:ring-2"
                    aria-label="Sort by number"
                  />
                  <span className="text-body-1 text-gray-dark">Number</span>
                </label>

                {/* Name option */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sortOrder"
                    value="name"
                    checked={sortOrder === "name"}
                    onChange={() => {
                      setSortOrder("name");
                      setIsOpen(false);
                    }}
                    className="w-5 h-5 text-identity focus:ring-identity focus:ring-2"
                    aria-label="Sort by name"
                  />
                  <span className="text-body-1 text-gray-dark">Name</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
