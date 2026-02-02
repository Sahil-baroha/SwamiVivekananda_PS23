import { Zap, FileText, List, Layers, Search } from 'lucide-react';

const MODES = [
    {
        id: 'executive',
        name: 'Executive',
        description: 'Concise 3-5 sentence overview for decision-makers',
        icon: Zap,
        color: 'cyan',
    },
    {
        id: 'detailed',
        name: 'Detailed',
        description: 'Comprehensive 2-4 paragraph analysis',
        icon: FileText,
        color: 'magenta',
    },
    {
        id: 'bullet_points',
        name: 'Bullet Points',
        description: '5-10 key takeaways in list format',
        icon: List,
        color: 'yellow',
    },
    {
        id: 'section_wise',
        name: 'Section-wise',
        description: 'Summarize each section individually',
        icon: Layers,
        color: 'purple',
    },
    {
        id: 'query_focused',
        name: 'Query Focused',
        description: 'Answer specific questions about the document',
        icon: Search,
        color: 'blue',
    },
];

export default function ModeSelector({ selectedMode, onModeSelect, onQueryChange, query }) {
    return (
        <div className="card slide-up">
            <h2 className="text-2xl font-bold mb-6">Select Summary Type</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MODES.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = selectedMode === mode.id;

                    return (
                        <button
                            key={mode.id}
                            onClick={() => onModeSelect(mode.id)}
                            className={`
                p-6 rounded-xl border-2 text-left transition-all duration-300
                ${isSelected
                                    ? 'border-cyan-400 bg-cyan-400/20 scale-105'
                                    : 'border-gray-700 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                                }
              `}
                        >
                            <div className="flex items-start gap-4">
                                <Icon
                                    size={32}
                                    className={`flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`}
                                />
                                <div>
                                    <h3 className="font-bold text-lg mb-2">{mode.name}</h3>
                                    <p className="text-sm text-gray-400">{mode.description}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedMode === 'query_focused' && (
                <div className="mt-6 fade-in">
                    <label className="block text-sm font-semibold mb-2 text-cyan-400">
                        Your Question
                    </label>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="What would you like to know about this document?"
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
}
