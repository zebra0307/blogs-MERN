import { useState } from 'react';

/**
 * Home Page Slides Component
 * 4 Full-width slides: About Us, How to Use, FAQs, Resources
 * All slides support both light and dark modes - Teal accent color
 */

// ============================================
// SLIDE 1: ABOUT US (Light/Dark Compatible)
// ============================================
export function AboutUsSlide() {
    const features = [
        {
            number: '01',
            title: 'Quality Content',
            description: 'Curated articles and tutorials written by experienced developers to accelerate your learning journey.',
        },
        {
            number: '02',
            title: 'Latest Technologies',
            description: 'Stay updated with Web3, AI/ML, Cloud Computing, and other cutting-edge technologies.',
        },
        {
            number: '03',
            title: 'Practical Learning',
            description: 'Real-world projects, code examples, and hands-on tutorials to build your portfolio.',
        },
        {
            number: '04',
            title: 'Career Growth',
            description: 'Interview preparation, resume building tips, and placement guidance for your career success.',
        },
    ];

    return (
        <section className="w-full bg-white dark:bg-black py-16 md:py-24 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        About <span className="text-teal-600 dark:text-teal-500">Z Blogs</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
                        Your one-stop destination for learning web development, blockchain, AI/ML,
                        and everything tech. Built by developers, for developers.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="text-3xl font-bold text-teal-500 dark:text-teal-500 mb-3">
                                {feature.number}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Trust Section */}
                <div className="text-center py-8 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">Trusted by students and developers worldwide</p>
                    <div className="flex flex-wrap justify-center gap-12">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-teal-600 dark:text-teal-500">20+</span>
                            <span className="text-sm text-gray-500 dark:text-gray-500">Articles</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-teal-600 dark:text-teal-500">30+</span>
                            <span className="text-sm text-gray-500 dark:text-gray-500">Categories</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-teal-600 dark:text-teal-500">300+</span>
                            <span className="text-sm text-gray-500 dark:text-gray-500">Readers</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================
// SLIDE 2: HOW TO USE BLOGS (Dark Background)
// ============================================
export function HowToUseSlide() {
    const steps = [
        {
            number: '01',
            title: 'Browse Topics',
            description: 'Explore our comprehensive categories covering Web Dev, Blockchain, DSA, AI/ML, and more.',
        },
        {
            number: '02',
            title: 'Read & Learn',
            description: 'Dive deep into well-structured articles with code examples and practical explanations.',
        },
        {
            number: '03',
            title: 'Practice Along',
            description: 'Follow tutorials, build projects, and apply what you learn in real-world scenarios.',
        },
        {
            number: '04',
            title: 'Grow Your Skills',
            description: 'Track your progress, bookmark favorites, and continuously expand your knowledge.',
        },
    ];

    return (
        <section className="w-full bg-gray-900 dark:bg-black py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        How to <span className="text-teal-500">Use Z Blogs</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Get started in minutes. Follow these simple steps to make the most of your learning journey.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative p-6 rounded-2xl bg-gray-800/50 dark:bg-gray-900/50 border border-gray-700 dark:border-gray-800 hover:border-teal-500/50 hover:bg-gray-800 transition-all duration-300"
                        >
                            {/* Step Number */}
                            <div className="text-5xl font-bold text-teal-500/40 group-hover:text-teal-500/60 transition-colors mb-4">
                                {step.number}
                            </div>

                            {/* Connecting Line (hidden on mobile and last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-teal-500/50 to-transparent" />
                            )}

                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/search"
                        className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors text-center"
                    >
                        Start Exploring
                    </a>
                    <a
                        href="/about"
                        className="px-8 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 hover:border-teal-500 transition-colors text-center"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </section>
    );
}

// ============================================
// SLIDE 3: FAQs (Light/Dark Compatible)
// ============================================
export function FAQsSlide() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'What topics does Z Blogs cover?',
            answer: 'Z Blogs covers a wide range of tech topics including Web Development (React, Node.js, Next.js), Blockchain (Ethereum, Solana, TON), Data Structures & Algorithms, AI/ML, Cyber Security, Cloud Computing, and much more.',
        },
        {
            question: 'Is the content free to access?',
            answer: 'Yes! All articles and tutorials on Z Blogs are completely free to access. We believe in making quality tech education accessible to everyone.',
        },
        {
            question: 'Can I contribute to Z Blogs?',
            answer: 'We welcome contributions from the community! If you have valuable knowledge to share, reach out to us through our contact page to discuss guest posting opportunities.',
        },
        {
            question: 'How often is new content published?',
            answer: 'We regularly publish new articles covering the latest technologies and trends. Subscribe to stay updated with our newest content.',
        },
        {
            question: 'Are the tutorials beginner-friendly?',
            answer: 'Absolutely! We have content for all skill levels. Each article is marked with difficulty level, and we explain concepts from basics to advanced.',
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full bg-white dark:bg-black py-16 md:py-24 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-4xl mx-auto px-6 md:px-10">
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
                                : 'border-gray-200 dark:border-gray-800'
                                }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-5 text-left bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="text-base font-semibold text-gray-900 dark:text-white pr-4">
                                    {faq.question}
                                </span>
                                <span className={`text-xl font-light transition-all duration-300 flex-shrink-0 ${openIndex === index
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

                {/* Contact CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-500 dark:text-gray-500 mb-4">Still have questions?</p>
                    <a
                        href="/about"
                        className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-500 font-semibold hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                    >
                        Contact Us
                        <span>→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}

// ============================================
// SLIDE 4: RESOURCES (Dark Background)
// ============================================
export function ResourcesSlide() {
    const resources = [
        {
            number: '01',
            title: 'Documentation',
            description: 'Comprehensive guides and documentation for various technologies and frameworks.',
            link: '/coming-soon',
        },
        {
            number: '02',
            title: 'Tutorials',
            description: 'Step-by-step content explaining complex concepts in simple terms.',
            link: '/coming-soon',
        },
        {
            number: '03',
            title: 'Code Examples',
            description: 'Ready-to-use code snippets and boilerplates for your projects.',
            link: '/coming-soon',
        },
        {
            number: '04',
            title: 'Project Ideas',
            description: 'Curated project ideas to practice and showcase your skills.',
            link: '/coming-soon',
        },
        {
            number: '05',
            title: 'Interview Prep',
            description: 'DSA problems, system design, and HR questions for interview success.',
            link: '/coming-soon',
        },
        {
            number: '06',
            title: 'Learning Paths',
            description: 'Structured roadmaps to guide your learning journey in various domains.',
            link: '/coming-soon',
        },
    ];

    return (
        <section className="w-full bg-gray-900 dark:bg-black py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Learning <span className="text-teal-500">Resources</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Everything you need to accelerate your development journey, all in one place.
                    </p>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {resources.map((resource, index) => (
                        <a
                            key={index}
                            href={resource.link}
                            className="group p-6 rounded-2xl bg-gray-800/50 dark:bg-gray-900/50 border border-gray-700 dark:border-gray-800 hover:border-teal-500 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="text-2xl font-bold text-teal-500/50 group-hover:text-teal-500 transition-colors mb-3">
                                {resource.number}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
                                {resource.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                {resource.description}
                            </p>
                            <span className="text-teal-500 text-sm font-medium group-hover:text-teal-400 transition-colors">
                                Coming Soon
                            </span>
                        </a>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <a
                        href="/coming-soon"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
                    >
                        Coming Soon
                    </a>
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
            <AboutUsSlide />
            <HowToUseSlide />
            <FAQsSlide />
            <ResourcesSlide />
        </>
    );
}
