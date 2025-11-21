import React, { useState } from 'react';

interface WorkExperience {
  id: number;
  name: string;
  company: string;
  duration: string;
  description: string;
}

const workExperiences: WorkExperience[] = [
  {
    id: 1,
    name: 'Senior Mobile Developer',
    company: 'Qemer Software Technologies',
    duration: 'Jul 2024 – Present',
    description: `
      - Full-Cycle Development: Designing, developing, and deploying mobile applications.
      - UI/UX Design: Crafting intuitive user interfaces.
      - Debugging and Bug Fixing: Identifying, troubleshooting, and resolving issues.
      - Performance Optimization: Enhancing speed, efficiency, and scalability.
      - Technical Leadership: Defining project architecture and ensuring robust applications.
      - Mentorship and Training: Guiding and mentoring junior developers.
      - Documentation and Standards: Maintaining comprehensive documentation.
    `,
  },
  {
    id: 2,
    // name: 'Founder & Tech Lead',
    name: 'Founder & Tech Lead | Flutter Developer ',
    company: 'Metshafe (Startup)',
    duration: 'Jun 2022 – Present',
    description: `
      - Co-founded and led the development of Metshafe, an eBook app.
      - Managed technical development and strategic direction.
      - Developed using Flutter, Firebase, NodeJs, and Kotlin for plugins.
    `,
  },
  {
    id: 3,
    name: 'Assistant ERP Functional Consultant',
    company: 'Red Cloud ICT Solutions',
    duration: 'Dec 2023 – Sep 2024',
    description: `
      - Participated in enterprise consulting projects.
      - Conducted in-depth testing and provided technical support.
      - Developed strong project management and problem-solving skills.
    `,
  },
  {
    id: 4,
    name: 'Junior ERP Functional Consultant',
    company: 'Red Cloud ICT Solutions',
    duration: 'Mar 2023 – Dec 2023',
    description: `
      - Contributed to enterprise consulting projects.
      - Assisted in project implementation and testing.
      - Acquired basic skills in project management and problem-solving.
    `,
  },
  {
    id:5,
    name: 'Freelance Software Developer',
    company: 'Self-Employed',
    duration: 'Jul 2022 – Mar 2023',
    description: `
      - Delivered custom full-stack solutions tailored to client needs.
      - Specialized in creating scalable, user-friendly applications.
      - Managed project timelines and client communication.
    `,
  },

  {
    id: 6,
    name: 'System Networking and Maintenance Intern',
    company: 'Ministry of Foreign Affairs (FDRE)',
    duration: 'Sep 2021 – Nov 2021',
    description: `
      - Set up and configured network hardware.
      - Resolved network issues and provided technical support.
      - Learned to step out of comfort zones and ask questions to enhance skills.
    `,
  },
];

const WorkExperience: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);

  const toggleExperience = (id: number) => {
    setSelectedExperience((prev) => (prev === id ? null : id));
  };

  return (
      <section id="work-experience" className="py-16 text-white">
        <header className="text-3xl font-semibold text-center mb-8">My Work Experiences</header>
        <div className="container mx-auto px-6 relative">
          {/* Central Vertical Line */}
          {/*<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-gray-400 h-full"></div>*/}
          <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-gray-400 h-full hidden md:block"></div>


          {/* Desktop View */}
          <div className="hidden md:flex flex-col space-y-3 relative">
            {workExperiences.map((experience, index) => (
                <div
                    key={experience.id}
                    className={`relative flex items-center ${
                        index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                >
                  {/* Experience Node */}
                  <div
                      className={`w-1/2 ${
                          index % 2 === 0 ? "pr-8 text-left" : "pl-8 text-left"
                      }`}
                  >
                    <button
                        onClick={() => toggleExperience(experience.id)}
                        className={`w-full p-4 text-left border-l-4 ${
                            selectedExperience === experience.id
                                ? "border-blue-500 bg-gray-900"
                                : "border-gray-900 hover:border-blue-500 hover:bg-gray-900"
                        }`}
                    >
                      <h3 className="text-xl font-semibold">{experience.name}</h3>
                      <p className="text-sm text-gray-400">
                        {experience.company} | {experience.duration}
                      </p>
                    </button>

                    {/* Expanded Details */}
                    {selectedExperience === experience.id && (
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                          <p className="text-gray-300 whitespace-pre-line">
                            {experience.description}
                          </p>
                        </div>
                    )}
                  </div>

                  {/* Node Connector */}
                  <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-6">
            {workExperiences.map((experience) => (
                <div key={experience.id} className="relative">
                  <button
                      onClick={() => toggleExperience(experience.id)}
                      className={`w-full p-4 text-left border-l-4 ${
                          selectedExperience === experience.id
                              ? "border-blue-500 bg-gray-900"
                              : "border-gray-900 hover:border-blue-500 hover:bg-gray-900"
                      }`}
                  >
                    <h3 className="text-xl font-semibold">{experience.name}</h3>
                    <p className="text-sm text-gray-400">
                      {experience.company} | {experience.duration}
                    </p>
                  </button>

                  {/* Expanded Details */}
                  {selectedExperience === experience.id && (
                      <div className="p-4 mt-4 bg-gray-800 rounded-lg">
                        <p className="text-gray-300 whitespace-pre-line">
                          {experience.description}
                        </p>
                      </div>
                  )}
                </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default WorkExperience;