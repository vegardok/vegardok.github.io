
interface SkillListProps {
    category: string
    skills: string[]
}

export const SkillList: React.FC<SkillListProps> = ({ category, skills }) => (
    <div className="mb-1 flex">
        <span className="font-semibold mr-2 w-36 flex-shrink-0 text-black dark:text-gray-200">
            {category}:
        </span>
        <span className="inline text-black dark:text-gray-300">
            {skills.join(', ')}
        </span>
    </div>
)
