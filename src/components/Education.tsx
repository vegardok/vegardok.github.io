export interface EducationItem {
    degree: string
    institution: string
    dates: string
    details?: string[]
}

export interface EducationEntryProps {
    item: EducationItem
}


export const EducationEntry: React.FC<EducationEntryProps> = ({ item }) => (
    <div className="mb-3 last:mb-0">
        <h3 className="text-base font-bold text-black dark:text-gray-100">
            {item.degree}
        </h3>
        <div className="text-sm italic text-gray-700 dark:text-gray-400 mb-1">
            {item.institution} | {item.dates}
        </div>
        {item.details && item.details.length > 0 && (
            <ul className="pl-5 list-none mt-1 text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                {item.details.map((detail, index) => (
                    <li key={index}>
                        {detail}
                    </li>
                ))}
            </ul>
        )}
    </div>
)
