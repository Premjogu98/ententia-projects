import { Edit2, Trash2, CheckSquare, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InsightTable = ({
    insights,
    totalItems,
    onEdit,
    onConfirmDelete,
    selectedIds,
    onSelect,
    onSelectAll,
    currentPage,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange
}) => {
    const { user } = useAuth();

    // Server-side pagination means we trust `insights` is the current page data.
    // Total pages is calculated from `totalItems`
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Only calculation needed for display:
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'published': return 'badge badge-published';
            case 'draft': return 'badge badge-draft';
            case 'archived': return 'badge badge-archived';
            default: return 'badge badge-planned';
        }
    };

    const isAllSelected = insights.length > 0 && insights.every(i => selectedIds.includes(i.id));

    // Pagination Logic for "Style 2"
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="card w-full flex flex-col">
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }} className="text-center">
                                <button
                                    onClick={() => onSelectAll(insights.map(i => i.id))}
                                    className={`btn-checkbox ${isAllSelected ? 'active' : ''}`}
                                    title="Select All"
                                >
                                    {isAllSelected ?
                                        <CheckSquare size={20} className="text-primary" /> :
                                        <Square size={20} />
                                    }
                                </button>
                            </th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Complexity</th>
                            <th>Last Updated</th>
                            <th>Last Updated</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insights.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-12">
                                    <p className="text-muted">No insights found.</p>
                                </td>
                            </tr>
                        ) : (
                            insights.map((insight) => {
                                const id = insight.id || insight._id;
                                const isSelected = selectedIds.includes(id);
                                return (
                                    <tr key={id} className={isSelected ? 'bg-sky-50 dark:bg-sky-900/10' : ''}>
                                        <td className="text-center">
                                            <button
                                                onClick={() => onSelect(insight.id)}
                                                className={`btn-checkbox ${isSelected ? 'active' : ''}`}
                                                title="Select Item"
                                            >
                                                {isSelected ?
                                                    <CheckSquare size={20} className="text-primary" /> :
                                                    <Square size={20} />
                                                }
                                            </button>
                                        </td>
                                        <td className="font-semibold">{insight.title}</td>
                                        <td>{insight.category}</td>
                                        <td>
                                            <span className={getStatusClass(insight.status)}>
                                                {insight.status}
                                            </span>
                                        </td>
                                        <td>{insight.complexity}</td>
                                        <td>{formatDate(insight.updated_at || insight.created_at)}</td>
                                        <td>{formatDate(insight.updated_at || insight.created_at)}</td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button className="btn-icon" onClick={() => onEdit(insight)} title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button className="btn-icon" onClick={() => onConfirmDelete(insight.id)} title="Delete">
                                                    <Trash2 size={18} style={{ color: 'var(--destructive)' }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <div className="rows-per-page">
                    <span>Rows per page:</span>
                    <select
                        className="rows-select"
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={1000}>1000</option>
                    </select>
                </div>

                <div className="pagination-controls">
                    <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="text-muted text-xs px-1">...</span>
                        ) : (
                            <button
                                key={page}
                                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        className="page-btn"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div className="text-sm text-muted hidden md:block">
                    <span className="font-medium text-main">{totalItems > 0 ? startIndex + 1 : 0}-{endIndex}</span> of {totalItems}
                </div>
            </div>
        </div>
    );
};

export default InsightTable;
