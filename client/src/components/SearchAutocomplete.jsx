import { useState, useRef, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { POST_CATEGORIES } from '../utils/categories';

export default function SearchAutocomplete({ initialValue = '', className = '' }) {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Update search term when initial value changes
    useEffect(() => {
        setSearchTerm(initialValue);
    }, [initialValue]);

    // Filter suggestions based on input
    useEffect(() => {
        if (searchTerm.trim() === '') {
            // Show popular/recent categories when empty
            setFilteredSuggestions(POST_CATEGORIES.slice(0, 8));
        } else {
            const filtered = POST_CATEGORIES.filter(
                (cat) =>
                    cat.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    cat.value.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 10);
            setFilteredSuggestions(filtered);
        }
    }, [searchTerm]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                inputRef.current &&
                !inputRef.current.contains(e.target)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (term) => {
        navigate(`/search?searchTerm=${encodeURIComponent(term)}`);
        setShowSuggestions(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            handleSearch(searchTerm);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.label);
        handleSearch(suggestion.label);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) =>
                prev < filteredSuggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleSuggestionClick(filteredSuggestions[activeIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search topics..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setActiveIndex(-1);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-4 pr-10 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                    >
                        <AiOutlineSearch size={18} />
                    </button>
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[9999] animate-fadeIn"
                    style={{ maxHeight: '320px', overflowY: 'auto' }}
                >
                    {filteredSuggestions.map((suggestion, index) => (
                        <button
                            key={suggestion.value}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${index === activeIndex
                                ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            <AiOutlineSearch className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={14} />
                            <span className="truncate">{suggestion.label}</span>
                        </button>
                    ))}

                    {/* Search for typed term */}
                    {searchTerm.trim() && (
                        <button
                            type="button"
                            onClick={() => handleSearch(searchTerm)}
                            className="w-full px-4 py-3 text-left text-sm text-teal-600 dark:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 font-medium"
                        >
                            <AiOutlineSearch size={14} />
                            <span>Search for "{searchTerm}"</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
