import { Button, Select, Accordion, AccordionPanel, AccordionTitle, AccordionContent } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiFolder } from 'react-icons/hi';
import { curriculum } from '../data/curriculum';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function QuestionPapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    branch: '',
    year: '',
    semester: '',
    examType: '',
  });

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter.branch) queryParams.append('branch', filter.branch);
      if (filter.year) queryParams.append('year', filter.year);
      if (filter.semester) queryParams.append('semester', filter.semester);
      if (filter.examType) queryParams.append('examType', filter.examType);

      const res = await fetch(`${BACKEND_URL}/api/question-paper/getpapers?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPapers(data.papers);
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPapers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);


  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    if (id === 'branch') {
      setFilter({ ...filter, branch: value, year: '', semester: '', examType: '' });
    } else if (id === 'year') {
      setFilter({ ...filter, year: value, semester: '', examType: '' });
    } else if (id === 'semester') {
      setFilter({ ...filter, semester: value, examType: '' });
    } else {
      setFilter({ ...filter, [id]: value });
    }
  };

  // Calculate dependent semesters based on selected year
  const getAvailableSemesters = () => {
    if (!filter.year) return [];
    const year = parseInt(filter.year);
    if (year === 1) return [1, 2];
    if (year === 2) return [3, 4];
    if (year === 3) return [5, 6];
    if (year === 4) return [7, 8];
    return [];
  };

  const availableSemesters = getAvailableSemesters();

  // Calculate expected subjects based on filters
  const getExpectedSubjects = () => {
    if (!filter.branch) return [];
    
    let subjects = [];
    if (filter.semester) {
      subjects = curriculum[filter.branch]?.[filter.semester] || [];
    } else if (filter.year) {
      const sems = getAvailableSemesters();
      sems.forEach(sem => {
        subjects = [...subjects, ...(curriculum[filter.branch]?.[sem] || [])];
      });
    } else {
      for (let i = 1; i <= 8; i++) {
        subjects = [...subjects, ...(curriculum[filter.branch]?.[i] || [])];
      }
    }
    return subjects;
  };

  const expectedSubjects = getExpectedSubjects();

  return (
    <div className='min-h-screen max-w-6xl mx-auto p-4'>
      <h1 className='text-3xl font-semibold text-center my-7'>University Question Papers</h1>
      
      <div className='flex flex-col md:flex-row gap-4 mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-1'>Branch</label>
          <Select id='branch' onChange={handleFilterChange} value={filter.branch}>
            <option value=''>All Branches</option>
            <option value='CSE'>Computer Science (CSE)</option>
            <option value='ECE'>Electronics (ECE)</option>
            <option value='EE'>Electrical (EE)</option>
            <option value='Mining'>Mining</option>
          </Select>
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-1'>Year</label>
          <Select 
            id='year' 
            onChange={handleFilterChange} 
            value={filter.year}
            disabled={!filter.branch}
          >
            <option value=''>
              {!filter.branch ? 'Select Branch first' : 'All Years'}
            </option>
            <option value='1'>1st Year</option>
            <option value='2'>2nd Year</option>
            <option value='3'>3rd Year</option>
            <option value='4'>4th Year</option>
          </Select>
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-1'>Semester</label>
          <Select 
            id='semester' 
            onChange={handleFilterChange} 
            value={filter.semester}
            disabled={!filter.year}
          >
            <option value=''>
              {!filter.year ? 'Select Year first' : 'All Semesters'}
            </option>
            {availableSemesters.map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </Select>
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-1'>Exam Type</label>
          <Select 
            id='examType' 
            onChange={handleFilterChange} 
            value={filter.examType}
            disabled={!filter.semester}
          >
            <option value=''>
              {!filter.semester ? 'Select Semester first' : 'All Types'}
            </option>
            <option value='sessional1'>Sessional 1</option>
            <option value='sessional2'>Sessional 2</option>
            <option value='final'>Final Exam</option>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className='text-center my-10'>Loading papers...</div>
      ) : !filter.branch ? (
        <div className='text-center my-10 text-gray-500'>Please select a branch to view the curriculum question papers.</div>
      ) : expectedSubjects.length === 0 ? (
        <div className='text-center my-10 text-gray-500'>No curriculum data available for this selection.</div>
      ) : (
        <div className='max-w-4xl mx-auto'>
          <Accordion collapseAll>
            {expectedSubjects.map((subj, index) => {
              const subjectPapers = papers.filter(p => p.subject === subj.code);
              
              return (
                <AccordionPanel key={index}>
                  <AccordionTitle className='bg-white dark:bg-gray-800 focus:ring-0'>
                    <div className='flex items-center gap-2'>
                      <HiFolder className='text-yellow-400 w-6 h-6' />
                      <span className='font-semibold text-gray-900 dark:text-white'>{subj.code} - {subj.name}</span>
                      <span className='text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full ml-2'>
                        {subjectPapers.length} paper(s)
                      </span>
                    </div>
                  </AccordionTitle>
                  <AccordionContent>
                    {subjectPapers.length === 0 ? (
                      <div className='text-center text-gray-500 my-4'>No papers yet</div>
                    ) : (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {subjectPapers.map(paper => (
                          <div key={paper._id} className='p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800/50'>
                            <h3 className='font-medium text-gray-800 dark:text-gray-200 mb-2'>
                              {paper.title.replace(/ - (sessional1|sessional2|final)/i, '')}
                            </h3>
                            <div className='text-sm text-gray-500 dark:text-gray-400 mb-4 flex gap-2 flex-wrap'>
                              <span className='bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded text-xs'>
                                {paper.branch}
                              </span>
                              <span className='bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300 px-2 py-0.5 rounded text-xs'>
                                Yr {paper.year} | Sem {paper.semester}
                              </span>
                              <span className='bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded text-xs capitalize'>
                                {paper.examType}
                              </span>
                            </div>
                            <a
                              href={paper.fileUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='w-full block'
                            >
                              <Button size='sm' color='gray' className='w-full'>
                                View PDF
                              </Button>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionPanel>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
}
