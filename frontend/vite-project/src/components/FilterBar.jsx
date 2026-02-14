import { Search } from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Filter changed: ${name} = ${value}`);
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 w-full">
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="form-input"
                        type="text"
                        name="search"
                        placeholder="Search by title or content..."
                        style={{ paddingLeft: '2.5rem' }}
                        value={filters.search || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex gap-4">
                    <select
                        className="form-select"
                        name="category"
                        value={filters.category || ''}
                        onChange={handleChange}
                        style={{ width: 'auto', minWidth: '150px' }}
                    >
                        <option value="">All Categories</option>
                        <option value="General">General</option>
                        <option value="Generative AI">Generative AI</option>
                        <option value="Process Automation">Process Automation</option>
                        <option value="Governance">Governance</option>
                        <option value="Operations">Operations</option>
                        <option value="Finance">Finance</option>
                    </select>

                    <select
                        className="form-select"
                        name="status"
                        value={filters.status || ''}
                        onChange={handleChange}
                        style={{ width: 'auto', minWidth: '150px' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Archived">Archived</option>
                    </select>

                    <select
                        className="form-select"
                        name="complexity"
                        value={filters.complexity || ''}
                        onChange={handleChange}
                        style={{ width: 'auto', minWidth: '150px' }}
                    >
                        <option value="">All Complexities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
