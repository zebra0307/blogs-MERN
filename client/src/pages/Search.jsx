import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${BACKEND_URL}/api/post/getposts?${searchQuery}`
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized';
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(
      `${BACKEND_URL}/api/post/getposts?${searchQuery}`
    );
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex   items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              <option value='uncategorized'>All Categories</option>

              {/* Web Development - Web 2 */}
              <optgroup label="Frontend Development">
                <option value='html'>HTML</option>
                <option value='css'>CSS</option>
                <option value='javascript'>JavaScript</option>
                <option value='typescript'>TypeScript</option>
                <option value='responsive-design'>Responsive Design</option>
                <option value='web-performance'>Web Performance</option>
              </optgroup>

              <optgroup label="Frontend Frameworks">
                <option value='reactjs'>React.js</option>
                <option value='angular'>Angular</option>
                <option value='vuejs'>Vue.js</option>
                <option value='svelte'>Svelte</option>
                <option value='nextjs'>Next.js</option>
                <option value='nuxtjs'>Nuxt.js</option>
              </optgroup>

              <optgroup label="Backend Development">
                <option value='nodejs'>Node.js</option>
                <option value='php'>PHP</option>
                <option value='java-backend'>Java Backend</option>
                <option value='python-backend'>Python (Django/Flask/FastAPI)</option>
                <option value='dotnet'>C# (.NET)</option>
              </optgroup>

              <optgroup label="Databases">
                <option value='mysql'>MySQL</option>
                <option value='postgresql'>PostgreSQL</option>
                <option value='mongodb'>MongoDB</option>
                <option value='firebase'>Firebase</option>
                <option value='redis'>Redis</option>
              </optgroup>

              <optgroup label="Full Stack Development">
                <option value='mern'>MERN Stack</option>
                <option value='mean'>MEAN Stack</option>
                <option value='lamp'>LAMP Stack</option>
                <option value='jamstack'>JAMstack</option>
              </optgroup>

              {/* Web 3 / Blockchain */}
              <optgroup label="Blockchain Fundamentals">
                <option value='blockchain-basics'>Blockchain Basics</option>
                <option value='cryptography'>Cryptography Basics</option>
                <option value='consensus-algorithms'>Consensus Algorithms</option>
                <option value='smart-contracts'>Smart Contracts</option>
              </optgroup>

              <optgroup label="Ethereum Ecosystem">
                <option value='solidity'>Solidity</option>
                <option value='erc-standards'>ERC Standards</option>
                <option value='hardhat'>Hardhat</option>
                <option value='foundry'>Foundry</option>
                <option value='ethersjs'>Ethers.js</option>
                <option value='web3js'>Web3.js</option>
              </optgroup>

              <optgroup label="Solana Ecosystem">
                <option value='rust-solana'>Rust for Solana</option>
                <option value='anchor'>Anchor Framework</option>
                <option value='spl-tokens'>SPL Tokens</option>
                <option value='solana-wallets'>Solana Wallets</option>
              </optgroup>

              <optgroup label="TON Blockchain">
                <option value='ton-basics'>TON Basics</option>
                <option value='func'>FunC</option>
                <option value='tact'>Tact</option>
                <option value='ton-smart-contracts'>TON Smart Contracts</option>
              </optgroup>

              <optgroup label="Enterprise Blockchain">
                <option value='hyperledger-fabric'>Hyperledger Fabric</option>
                <option value='hyperledger-sawtooth'>Hyperledger Sawtooth</option>
                <option value='chaincode'>Chaincode Development</option>
              </optgroup>

              <optgroup label="DeFi & ReFi">
                <option value='defi-protocols'>DeFi Protocols</option>
                <option value='dex'>DEX (Uniswap, PancakeSwap)</option>
                <option value='yield-farming'>Yield Farming</option>
                <option value='staking'>Staking</option>
                <option value='refi'>ReFi (Regenerative Finance)</option>
              </optgroup>

              {/* DSA */}
              <optgroup label="Data Structures & Algorithms">
                <option value='dsa-cpp'>DSA with C++</option>
                <option value='dsa-java'>DSA with Java</option>
                <option value='dsa-python'>DSA with Python</option>
                <option value='arrays'>Arrays</option>
                <option value='strings'>Strings</option>
                <option value='linked-list'>Linked List</option>
                <option value='stack'>Stack</option>
                <option value='queue'>Queue</option>
                <option value='trees'>Trees</option>
                <option value='bst'>Binary Search Tree</option>
                <option value='heaps'>Heaps</option>
                <option value='graphs'>Graphs</option>
                <option value='recursion'>Recursion</option>
                <option value='backtracking'>Backtracking</option>
                <option value='dynamic-programming'>Dynamic Programming</option>
                <option value='greedy'>Greedy Algorithms</option>
                <option value='bit-manipulation'>Bit Manipulation</option>
              </optgroup>

              {/* AI & ML */}
              <optgroup label="Artificial Intelligence">
                <option value='ai-fundamentals'>AI Fundamentals</option>
                <option value='search-algorithms'>Search Algorithms</option>
                <option value='knowledge-representation'>Knowledge Representation</option>
              </optgroup>

              <optgroup label="Machine Learning">
                <option value='supervised-learning'>Supervised Learning</option>
                <option value='unsupervised-learning'>Unsupervised Learning</option>
                <option value='reinforcement-learning'>Reinforcement Learning</option>
                <option value='model-evaluation'>Model Evaluation</option>
              </optgroup>

              <optgroup label="Deep Learning">
                <option value='neural-networks'>Neural Networks</option>
                <option value='cnn'>CNN</option>
                <option value='rnn'>RNN</option>
                <option value='transformers'>Transformers</option>
                <option value='llms'>LLMs</option>
              </optgroup>

              {/* Cyber Security */}
              <optgroup label="Cyber Security">
                <option value='ethical-hacking'>Ethical Hacking</option>
                <option value='network-security'>Network Security</option>
                <option value='web-security'>Web Security</option>
                <option value='cryptography-security'>Cryptography</option>
                <option value='malware-analysis'>Malware Analysis</option>
                <option value='digital-forensics'>Digital Forensics</option>
              </optgroup>

              {/* Mobile Development */}
              <optgroup label="Android Development">
                <option value='android-java'>Android with Java</option>
                <option value='kotlin'>Kotlin</option>
                <option value='jetpack-compose'>Jetpack Compose</option>
              </optgroup>

              <optgroup label="iOS Development">
                <option value='swift'>Swift</option>
                <option value='swiftui'>SwiftUI</option>
              </optgroup>

              <optgroup label="Cross Platform">
                <option value='flutter'>Flutter</option>
                <option value='react-native'>React Native</option>
                <option value='xamarin'>Xamarin</option>
              </optgroup>

              {/* Cloud & DevOps */}
              <optgroup label="Cloud & DevOps">
                <option value='linux'>Linux</option>
                <option value='git-github'>Git & GitHub</option>
                <option value='docker'>Docker</option>
                <option value='kubernetes'>Kubernetes</option>
                <option value='aws'>AWS</option>
                <option value='azure'>Azure</option>
                <option value='gcp'>GCP</option>
                <option value='ci-cd'>CI/CD</option>
                <option value='nginx'>Nginx & Load Balancing</option>
              </optgroup>

              {/* Programming Languages */}
              <optgroup label="Programming Languages">
                <option value='c'>C</option>
                <option value='cpp'>C++</option>
                <option value='java'>Java</option>
                <option value='python'>Python</option>
                <option value='go'>Go</option>
                <option value='rust'>Rust</option>
              </optgroup>

              {/* CS Core Subjects */}
              <optgroup label="Computer Science Core">
                <option value='operating-systems'>Operating Systems</option>
                <option value='computer-networks'>Computer Networks</option>
                <option value='dbms'>DBMS</option>
                <option value='compiler-design'>Compiler Design</option>
                <option value='software-engineering'>Software Engineering</option>
                <option value='distributed-systems'>Distributed Systems</option>
              </optgroup>

              {/* Competitive Programming */}
              <optgroup label="Competitive Programming">
                <option value='codeforces'>Codeforces</option>
                <option value='codechef'>CodeChef</option>
                <option value='atcoder'>AtCoder</option>
                <option value='leetcode'>LeetCode</option>
                <option value='interview-problems'>Interview Problems</option>
              </optgroup>

              {/* Career & Interview */}
              <optgroup label="Career & Interview Prep">
                <option value='resume-building'>Resume Building</option>
                <option value='internship-prep'>Internship Preparation</option>
                <option value='placement-guidance'>Placement Guidance</option>
                <option value='system-design'>System Design</option>
                <option value='mock-interviews'>Mock Interviews</option>
                <option value='hr-questions'>HR Questions</option>
              </optgroup>

              {/* Projects */}
              <optgroup label="Projects & Case Studies">
                <option value='web-projects'>Web Projects</option>
                <option value='app-projects'>App Projects</option>
                <option value='ai-projects'>AI Projects</option>
                <option value='blockchain-projects'>Blockchain Projects</option>
                <option value='open-source'>Open Source</option>
              </optgroup>

              {/* Emerging Technologies */}
              <optgroup label="Emerging Technologies">
                <option value='metaverse'>Metaverse</option>
                <option value='ar-vr'>AR/VR</option>
                <option value='iot'>Internet of Things (IoT)</option>
                <option value='quantum-computing'>Quantum Computing</option>
                <option value='robotics'>Robotics</option>
              </optgroup>

              {/* Mathematics */}
              <optgroup label="Mathematics for CS">
                <option value='discrete-math'>Discrete Math</option>
                <option value='linear-algebra'>Linear Algebra</option>
                <option value='probability'>Probability</option>
                <option value='statistics'>Statistics</option>
              </optgroup>

              {/* Non-Technical */}
              <optgroup label="Student Growth">
                <option value='study-techniques'>Study Techniques</option>
                <option value='time-management'>Time Management</option>
                <option value='productivity'>Productivity</option>
                <option value='mental-health'>Mental Health</option>
                <option value='public-speaking'>Public Speaking</option>
                <option value='entrepreneurship'>Entrepreneurship</option>
              </optgroup>
            </Select>
          </div>
          <Button type='submit' outline className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white'>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}