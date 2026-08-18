import { useState } from 'react';

/**
 * FAQs Component
 */
export function FAQsSlide() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'What topics does Z Blogs cover?',
            answer: 'Z Blogs is a highly curated computer science library focusing exclusively on four core subjects: Data Structures & Algorithms, Database Management Systems, Operating Systems, and System Design.',
        },
        {
            question: 'Is this a course or tutorial website?',
            answer: 'No. Z Blogs is a professional, editorial knowledge library. You won\'t find gamified courses or step-by-step tutorials here—just clean, structured notes and high-quality technical blogs.',
        },
        {
            question: 'Can I contribute to Z Blogs?',
            answer: 'Yes, this platform thrives on community participation! Any registered user can publish their own technical articles. To maintain a high standard of quality, users are limited to submitting one blog post per month.',
        },
        {
            question: 'Is the content free to access?',
            answer: 'Yes! All articles and structured resources on Z Blogs are completely free to access. We believe in making quality CS education accessible to everyone.',
        },
        {
            question: 'Are the authors anonymous?',
            answer: 'Yes, privacy is a core feature. When you comment or post an article, only your username and profile picture are visible to the public. Your personal details remain completely hidden.',
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full bg-white dark:bg-black py-16 md:py-24 border-t border-gray-300 dark:border-gray-800">
            <div className="max-w-3xl mx-auto px-5 md:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Frequently Asked <span className="text-teal-600 dark:text-teal-500">Questions</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Got questions? We've got answers. Here are the most common questions about Z Blogs.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`rounded-xl border overflow-hidden transition-all duration-300 ${openIndex === index
                                ? 'border-teal-500 dark:border-teal-500'
                                : 'border-gray-300 dark:border-gray-800'
                                }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-5 text-left bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="text-base font-semibold text-gray-900 dark:text-white pr-4">
                                    {faq.question}
                                </span>
                                <span className={`text-xl font-light transition-all duration-300 shrink-0 ${openIndex === index
                                    ? 'rotate-45 text-teal-500'
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                    +
                                </span>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="p-5 pt-0 bg-gray-50 dark:bg-gray-900">
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

// ============================================
// COMBINED SLIDES COMPONENT
// ============================================
export default function HomeSlides() {
    return (
        <>
            <FAQsSlide />
        </>
    );
}
