import { useState, useRef, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

// All available categories/topics for suggestions - COMPLETE LIST
const CATEGORIES = [
    // Frontend Development
    { value: 'html', label: 'HTML', group: 'Frontend Development' },
    { value: 'css', label: 'CSS', group: 'Frontend Development' },
    { value: 'javascript', label: 'JavaScript', group: 'Frontend Development' },
    { value: 'typescript', label: 'TypeScript', group: 'Frontend Development' },
    { value: 'responsive-design', label: 'Responsive Design', group: 'Frontend Development' },
    { value: 'web-performance', label: 'Web Performance', group: 'Frontend Development' },

    // Frontend Frameworks
    { value: 'reactjs', label: 'React.js', group: 'Frontend Frameworks' },
    { value: 'angular', label: 'Angular', group: 'Frontend Frameworks' },
    { value: 'vuejs', label: 'Vue.js', group: 'Frontend Frameworks' },
    { value: 'svelte', label: 'Svelte', group: 'Frontend Frameworks' },
    { value: 'nextjs', label: 'Next.js', group: 'Frontend Frameworks' },
    { value: 'nuxtjs', label: 'Nuxt.js', group: 'Frontend Frameworks' },

    // Backend Development
    { value: 'nodejs', label: 'Node.js', group: 'Backend Development' },
    { value: 'php', label: 'PHP', group: 'Backend Development' },
    { value: 'java-backend', label: 'Java Backend', group: 'Backend Development' },
    { value: 'python-backend', label: 'Python (Django/Flask/FastAPI)', group: 'Backend Development' },
    { value: 'dotnet', label: 'C# (.NET)', group: 'Backend Development' },

    // Databases
    { value: 'mysql', label: 'MySQL', group: 'Databases' },
    { value: 'postgresql', label: 'PostgreSQL', group: 'Databases' },
    { value: 'mongodb', label: 'MongoDB', group: 'Databases' },
    { value: 'firebase', label: 'Firebase', group: 'Databases' },
    { value: 'redis', label: 'Redis', group: 'Databases' },

    // Full Stack Development
    { value: 'mern', label: 'MERN Stack', group: 'Full Stack Development' },
    { value: 'mean', label: 'MEAN Stack', group: 'Full Stack Development' },
    { value: 'lamp', label: 'LAMP Stack', group: 'Full Stack Development' },
    { value: 'jamstack', label: 'JAMstack', group: 'Full Stack Development' },

    // Blockchain Fundamentals
    { value: 'blockchain-basics', label: 'Blockchain Basics', group: 'Blockchain Fundamentals' },
    { value: 'cryptography', label: 'Cryptography Basics', group: 'Blockchain Fundamentals' },
    { value: 'consensus-algorithms', label: 'Consensus Algorithms', group: 'Blockchain Fundamentals' },
    { value: 'smart-contracts', label: 'Smart Contracts', group: 'Blockchain Fundamentals' },

    // Ethereum Ecosystem
    { value: 'solidity', label: 'Solidity', group: 'Ethereum Ecosystem' },
    { value: 'erc-standards', label: 'ERC Standards', group: 'Ethereum Ecosystem' },
    { value: 'hardhat', label: 'Hardhat', group: 'Ethereum Ecosystem' },
    { value: 'foundry', label: 'Foundry', group: 'Ethereum Ecosystem' },
    { value: 'ethersjs', label: 'Ethers.js', group: 'Ethereum Ecosystem' },
    { value: 'web3js', label: 'Web3.js', group: 'Ethereum Ecosystem' },

    // Solana Ecosystem
    { value: 'rust-solana', label: 'Rust for Solana', group: 'Solana Ecosystem' },
    { value: 'anchor', label: 'Anchor Framework', group: 'Solana Ecosystem' },
    { value: 'spl-tokens', label: 'SPL Tokens', group: 'Solana Ecosystem' },
    { value: 'solana-wallets', label: 'Solana Wallets', group: 'Solana Ecosystem' },

    // TON Blockchain
    { value: 'ton-basics', label: 'TON Basics', group: 'TON Blockchain' },
    { value: 'func', label: 'FunC', group: 'TON Blockchain' },
    { value: 'tact', label: 'Tact', group: 'TON Blockchain' },
    { value: 'ton-smart-contracts', label: 'TON Smart Contracts', group: 'TON Blockchain' },

    // Enterprise Blockchain
    { value: 'hyperledger-fabric', label: 'Hyperledger Fabric', group: 'Enterprise Blockchain' },
    { value: 'hyperledger-sawtooth', label: 'Hyperledger Sawtooth', group: 'Enterprise Blockchain' },
    { value: 'chaincode', label: 'Chaincode Development', group: 'Enterprise Blockchain' },

    // DeFi & ReFi
    { value: 'defi-protocols', label: 'DeFi Protocols', group: 'DeFi & ReFi' },
    { value: 'dex', label: 'DEX (Uniswap, PancakeSwap)', group: 'DeFi & ReFi' },
    { value: 'yield-farming', label: 'Yield Farming', group: 'DeFi & ReFi' },
    { value: 'staking', label: 'Staking', group: 'DeFi & ReFi' },
    { value: 'refi', label: 'ReFi (Regenerative Finance)', group: 'DeFi & ReFi' },

    // Data Structures & Algorithms
    { value: 'dsa-cpp', label: 'DSA with C++', group: 'Data Structures & Algorithms' },
    { value: 'dsa-java', label: 'DSA with Java', group: 'Data Structures & Algorithms' },
    { value: 'dsa-python', label: 'DSA with Python', group: 'Data Structures & Algorithms' },
    { value: 'arrays', label: 'Arrays', group: 'Data Structures & Algorithms' },
    { value: 'strings', label: 'Strings', group: 'Data Structures & Algorithms' },
    { value: 'linked-list', label: 'Linked List', group: 'Data Structures & Algorithms' },
    { value: 'stack', label: 'Stack', group: 'Data Structures & Algorithms' },
    { value: 'queue', label: 'Queue', group: 'Data Structures & Algorithms' },
    { value: 'trees', label: 'Trees', group: 'Data Structures & Algorithms' },
    { value: 'bst', label: 'Binary Search Tree', group: 'Data Structures & Algorithms' },
    { value: 'heaps', label: 'Heaps', group: 'Data Structures & Algorithms' },
    { value: 'graphs', label: 'Graphs', group: 'Data Structures & Algorithms' },
    { value: 'recursion', label: 'Recursion', group: 'Data Structures & Algorithms' },
    { value: 'backtracking', label: 'Backtracking', group: 'Data Structures & Algorithms' },
    { value: 'dynamic-programming', label: 'Dynamic Programming', group: 'Data Structures & Algorithms' },
    { value: 'greedy', label: 'Greedy Algorithms', group: 'Data Structures & Algorithms' },
    { value: 'bit-manipulation', label: 'Bit Manipulation', group: 'Data Structures & Algorithms' },

    // Artificial Intelligence
    { value: 'ai-fundamentals', label: 'AI Fundamentals', group: 'Artificial Intelligence' },
    { value: 'search-algorithms', label: 'Search Algorithms', group: 'Artificial Intelligence' },
    { value: 'knowledge-representation', label: 'Knowledge Representation', group: 'Artificial Intelligence' },

    // Machine Learning
    { value: 'supervised-learning', label: 'Supervised Learning', group: 'Machine Learning' },
    { value: 'unsupervised-learning', label: 'Unsupervised Learning', group: 'Machine Learning' },
    { value: 'reinforcement-learning', label: 'Reinforcement Learning', group: 'Machine Learning' },
    { value: 'model-evaluation', label: 'Model Evaluation', group: 'Machine Learning' },

    // Deep Learning
    { value: 'neural-networks', label: 'Neural Networks', group: 'Deep Learning' },
    { value: 'cnn', label: 'CNN', group: 'Deep Learning' },
    { value: 'rnn', label: 'RNN', group: 'Deep Learning' },
    { value: 'transformers', label: 'Transformers', group: 'Deep Learning' },
    { value: 'llms', label: 'LLMs', group: 'Deep Learning' },

    // Cyber Security
    { value: 'ethical-hacking', label: 'Ethical Hacking', group: 'Cyber Security' },
    { value: 'network-security', label: 'Network Security', group: 'Cyber Security' },
    { value: 'web-security', label: 'Web Security', group: 'Cyber Security' },
    { value: 'cryptography-security', label: 'Cryptography', group: 'Cyber Security' },
    { value: 'malware-analysis', label: 'Malware Analysis', group: 'Cyber Security' },
    { value: 'digital-forensics', label: 'Digital Forensics', group: 'Cyber Security' },

    // Android Development
    { value: 'android-java', label: 'Android with Java', group: 'Android Development' },
    { value: 'kotlin', label: 'Kotlin', group: 'Android Development' },
    { value: 'jetpack-compose', label: 'Jetpack Compose', group: 'Android Development' },

    // iOS Development
    { value: 'swift', label: 'Swift', group: 'iOS Development' },
    { value: 'swiftui', label: 'SwiftUI', group: 'iOS Development' },

    // Cross Platform
    { value: 'flutter', label: 'Flutter', group: 'Cross Platform' },
    { value: 'react-native', label: 'React Native', group: 'Cross Platform' },
    { value: 'xamarin', label: 'Xamarin', group: 'Cross Platform' },

    // Cloud & DevOps
    { value: 'linux', label: 'Linux', group: 'Cloud & DevOps' },
    { value: 'git-github', label: 'Git & GitHub', group: 'Cloud & DevOps' },
    { value: 'docker', label: 'Docker', group: 'Cloud & DevOps' },
    { value: 'kubernetes', label: 'Kubernetes', group: 'Cloud & DevOps' },
    { value: 'aws', label: 'AWS', group: 'Cloud & DevOps' },
    { value: 'azure', label: 'Azure', group: 'Cloud & DevOps' },
    { value: 'gcp', label: 'GCP', group: 'Cloud & DevOps' },
    { value: 'ci-cd', label: 'CI/CD', group: 'Cloud & DevOps' },
    { value: 'nginx', label: 'Nginx & Load Balancing', group: 'Cloud & DevOps' },

    // Programming Languages
    { value: 'c', label: 'C', group: 'Programming Languages' },
    { value: 'cpp', label: 'C++', group: 'Programming Languages' },
    { value: 'java', label: 'Java', group: 'Programming Languages' },
    { value: 'python', label: 'Python', group: 'Programming Languages' },
    { value: 'go', label: 'Go', group: 'Programming Languages' },
    { value: 'rust', label: 'Rust', group: 'Programming Languages' },

    // Computer Science Core
    { value: 'operating-systems', label: 'Operating Systems', group: 'Computer Science Core' },
    { value: 'computer-networks', label: 'Computer Networks', group: 'Computer Science Core' },
    { value: 'dbms', label: 'DBMS', group: 'Computer Science Core' },
    { value: 'compiler-design', label: 'Compiler Design', group: 'Computer Science Core' },
    { value: 'software-engineering', label: 'Software Engineering', group: 'Computer Science Core' },
    { value: 'distributed-systems', label: 'Distributed Systems', group: 'Computer Science Core' },

    // Competitive Programming
    { value: 'codeforces', label: 'Codeforces', group: 'Competitive Programming' },
    { value: 'codechef', label: 'CodeChef', group: 'Competitive Programming' },
    { value: 'atcoder', label: 'AtCoder', group: 'Competitive Programming' },
    { value: 'leetcode', label: 'LeetCode', group: 'Competitive Programming' },
    { value: 'interview-problems', label: 'Interview Problems', group: 'Competitive Programming' },

    // Career & Interview Prep
    { value: 'resume-building', label: 'Resume Building', group: 'Career & Interview Prep' },
    { value: 'internship-prep', label: 'Internship Preparation', group: 'Career & Interview Prep' },
    { value: 'placement-guidance', label: 'Placement Guidance', group: 'Career & Interview Prep' },
    { value: 'system-design', label: 'System Design', group: 'Career & Interview Prep' },
    { value: 'mock-interviews', label: 'Mock Interviews', group: 'Career & Interview Prep' },
    { value: 'hr-questions', label: 'HR Questions', group: 'Career & Interview Prep' },

    // Projects & Case Studies
    { value: 'web-projects', label: 'Web Projects', group: 'Projects & Case Studies' },
    { value: 'app-projects', label: 'App Projects', group: 'Projects & Case Studies' },
    { value: 'ai-projects', label: 'AI Projects', group: 'Projects & Case Studies' },
    { value: 'blockchain-projects', label: 'Blockchain Projects', group: 'Projects & Case Studies' },
    { value: 'open-source', label: 'Open Source', group: 'Projects & Case Studies' },

    // Emerging Technologies
    { value: 'metaverse', label: 'Metaverse', group: 'Emerging Technologies' },
    { value: 'ar-vr', label: 'AR/VR', group: 'Emerging Technologies' },
    { value: 'iot', label: 'Internet of Things (IoT)', group: 'Emerging Technologies' },
    { value: 'quantum-computing', label: 'Quantum Computing', group: 'Emerging Technologies' },
    { value: 'robotics', label: 'Robotics', group: 'Emerging Technologies' },

    // Mathematics for CS
    { value: 'discrete-math', label: 'Discrete Math', group: 'Mathematics for CS' },
    { value: 'linear-algebra', label: 'Linear Algebra', group: 'Mathematics for CS' },
    { value: 'probability', label: 'Probability', group: 'Mathematics for CS' },
    { value: 'statistics', label: 'Statistics', group: 'Mathematics for CS' },

    // Student Growth
    { value: 'study-techniques', label: 'Study Techniques', group: 'Student Growth' },
    { value: 'time-management', label: 'Time Management', group: 'Student Growth' },
    { value: 'productivity', label: 'Productivity', group: 'Student Growth' },
    { value: 'mental-health', label: 'Mental Health', group: 'Student Growth' },
    { value: 'public-speaking', label: 'Public Speaking', group: 'Student Growth' },
    { value: 'entrepreneurship', label: 'Entrepreneurship', group: 'Student Growth' },
];

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
            setFilteredSuggestions(CATEGORIES.slice(0, 8));
        } else {
            const filtered = CATEGORIES.filter(
                (cat) =>
                    cat.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    cat.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    // Group suggestions by category
    const groupedSuggestions = filteredSuggestions.reduce((acc, item) => {
        if (!acc[item.group]) {
            acc[item.group] = [];
        }
        acc[item.group].push(item);
        return acc;
    }, {});

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
                    {Object.keys(groupedSuggestions).map((group) => (
                        <div key={group}>
                            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                                {group}
                            </div>
                            {groupedSuggestions[group].map((suggestion, index) => {
                                const globalIndex = filteredSuggestions.findIndex(
                                    (s) => s.value === suggestion.value
                                );
                                return (
                                    <button
                                        key={suggestion.value}
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${globalIndex === activeIndex
                                            ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <AiOutlineSearch className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={14} />
                                        <span className="truncate">{suggestion.label}</span>
                                    </button>
                                );
                            })}
                        </div>
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
