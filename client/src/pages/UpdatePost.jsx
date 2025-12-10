import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(
          `${BACKEND_URL}/api/post/getposts?postId=${postId}`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  /**
   * Convert image file to Base64 string
   */
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }

      // Validate file size (max 500KB for post images)
      if (file.size > 500 * 1024) {
        setImageUploadError('Image must be less than 500KB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageUploadError('Please select an image file');
        return;
      }

      setImageUploadError(null);
      setImageUploadProgress(0);

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setImageUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Convert to Base64
      const base64 = await convertToBase64(file);

      clearInterval(progressInterval);
      setImageUploadProgress(100);
      setFormData({ ...formData, image: base64 });

      // Clear progress after a moment
      setTimeout(() => {
        setImageUploadProgress(null);
      }, 500);

    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value='uncategorized'>Select a category</option>

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
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            size='sm'
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
            className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white'
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          value={formData.content}
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white'>
          Update post
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}