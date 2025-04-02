interface SectionProps {
    title: string
    children: React.ReactNode
}

export const Section: React.FC<SectionProps> = ({ title, children }) => (
    <section className="mb-4">
        <h2 className="text-xl font-semibold border-b border-black dark:border-gray-500 pb-1 mb-2 text-black dark:text-gray-100 uppercase tracking-wider">
            {title}
        </h2>
        <div className="text-sm text-black dark:text-gray-200">{children}</div>
    </section>
)
