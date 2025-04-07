import React from 'react'
import '../styles/global.css'
import { cvData } from '../data/cv'
import { Section } from './Section'
import { ExperienceEntry, type ExperienceItem } from './Experience'
import { SkillList } from './Skills'
import { EducationEntry, type EducationItem } from './Education'

export interface ContactInfo {
    phone: string
    email: string
    linkedin: string
    github: string
    location: string
}

export interface SkillsData {
    languages: string[]
    frameworksLibraries: string[]
    databases: string[]
    toolsPlatforms: string[]
    methodologies: string[]
}

export interface CVData {
    name: string
    title: string
    contact: ContactInfo
    summary: string
    experience: ExperienceItem[]
    education: EducationItem[]
    skills: SkillsData
}

const CVPage: React.FC = () => {
    return (
        <div className="bg-gray-100 dark:bg-zinc-950 min-h-screen py-4">
            <div className="font-serif leading-normal bg-white text-black dark:bg-zinc-900 dark:text-zinc-200 text-sm max-w-4xl mx-auto shadow-lg dark:shadow-md dark:shadow-zinc-800/50">
                <header className="text-center mb-6 border-b border-gray-400 dark:border-zinc-700 pb-4 pt-8 px-12">
                    <h1 className="text-4xl  m-0 text-black dark:text-zinc-50">
                        {cvData.name}
                    </h1>
                    {cvData.title && (
                        <p className="text-lg text-gray-700 dark:text-zinc-400 mt-1">
                            {cvData.title}
                        </p>
                    )}
                    <div className="text-xs text-gray-600 dark:text-zinc-400 mt-2 space-x-3">
                        <span>{cvData.contact.location}</span>
                        <span aria-hidden="true">&middot;</span>
                        <span aria-hidden="true">&middot;</span>
                        <a
                            href={`mailto:${cvData.contact.email}`}
                            className="text-gray-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50 hover:underline"
                        >
                            {cvData.contact.email}
                        </a>
                        <span aria-hidden="true">&middot;</span>
                        <a
                            href={`https://${cvData.contact.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50 hover:underline"
                        >
                            LinkedIn
                        </a>
                        <span aria-hidden="true">&middot;</span>
                        <a
                            href={`https://${cvData.contact.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50 hover:underline"
                        >
                            Github
                        </a>
                    </div>
                </header>
                <main className="px-12 pb-12">
                    {cvData.summary && (
                        <Section title="Summary">
                            <p className="my-1 text-black dark:text-zinc-200">
                                {cvData.summary}
                            </p>
                        </Section>
                    )}

                    <Section title="Experience">
                        {cvData.experience.map((item, index) => (
                            <ExperienceEntry key={index} item={item} />
                        ))}
                    </Section>

                    <Section title="Education">
                        {cvData.education.map((item, index) => (
                            <EducationEntry key={index} item={item} />
                        ))}
                    </Section>

                    <Section title="Skills">
                        <SkillList
                            category="Languages"
                            skills={cvData.skills.languages}
                        />
                        <SkillList
                            category="Frameworks/Libraries"
                            skills={cvData.skills.frameworksLibraries}
                        />
                        <SkillList
                            category="Databases"
                            skills={cvData.skills.databases}
                        />
                        <SkillList
                            category="Tools/Platforms"
                            skills={cvData.skills.toolsPlatforms}
                        />
                        <SkillList
                            category="Methodologies"
                            skills={cvData.skills.methodologies}
                        />
                    </Section>
                </main>
            </div>
        </div>
    )
}

export default CVPage
