export interface ExperienceItem {
    role: string
    company: string
    dates: string
    description: string[]
}

interface ExperienceEntryProps {
    item: ExperienceItem
}

export const ExperienceEntry: React.FC<ExperienceEntryProps> = ({ item }) => (
    <div className="mb-3 last:mb-0">
        <h3 className="text-base font-bold text-black dark:text-gray-100">
            {item.role}
        </h3>
        <div className="text-sm italic text-gray-700 dark:text-gray-400 mb-1">
            {item.company} | {item.dates}
        </div>
        <ul className="pl-5 list-disc space-y-0.5 text-black dark:text-gray-200">
            {item.description.map((point, index) => (
                <li key={index}>{point}</li>
            ))}
        </ul>
    </div>
)
