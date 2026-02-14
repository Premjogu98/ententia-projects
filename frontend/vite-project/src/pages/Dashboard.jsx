import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import InsightTable from '../components/InsightTable';
import InsightModal from '../components/InsightModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { getInsights, createInsight, updateInsight, deleteInsight } from '../services/api';
import { Plus, Trash, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [insights, setInsights] = useState([]);
    const [filters, setFilters] = useState({});

    // Modal States
    const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Data States
    const [currentInsight, setCurrentInsight] = useState(null);
    const [insightToDelete, setInsightToDelete] = useState(null); // ID or 'bulk'
    const [selectedIds, setSelectedIds] = useState([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const { user } = useAuth();

    const fetchInsights = async () => {
        try {
            const data = await getInsights(filters, currentPage, itemsPerPage);
            // data now contains { items: [], total: 100, ... }
            if (data && data.items) {
                setInsights(data.items);
                setTotalItems(data.total);
            } else {
                // Fallback if structure is different for some reason
                setInsights(Array.isArray(data) ? data : []);
                setTotalItems(Array.isArray(data) ? data.length : 0);
            }
        } catch (error) {
            console.error("Failed to fetch insights", error);
            setInsights([]);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, [filters, currentPage, itemsPerPage]);

    // Reset page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Create/Edit Handlers
    const handleCreate = () => {
        setCurrentInsight(null);
        setIsInsightModalOpen(true);
    };

    const handleEdit = (insight) => {
        setCurrentInsight(insight);
        setIsInsightModalOpen(true);
    };

    const handleModalSubmit = async (data) => {
        try {
            if (currentInsight) {
                await updateInsight(currentInsight.id, data);
            } else {
                await createInsight(data);
            }
            setIsInsightModalOpen(false);
            fetchInsights();
        } catch (error) {
            console.error("Operation failed", error);
            alert("Operation failed, please check inputs.");
        }
    };

    // Delete Handlers
    const confirmDelete = (id) => {
        setInsightToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setInsightToDelete('bulk');
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        try {
            if (insightToDelete === 'bulk') {
                await Promise.all(selectedIds.map(id => deleteInsight(id)));
                setSelectedIds([]);
            } else {
                await deleteInsight(insightToDelete);
            }
            setIsDeleteModalOpen(false);
            setInsightToDelete(null);
            fetchInsights();
        } catch (error) {
            console.error("Delete failed", error);
            const message = error.response?.data?.detail || "Failed to delete. Please try again.";
            alert(`Error: ${message}`);
        }
    };

    // Selection Handlers
    const handleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (idsInPage) => {
        // If all in page are selected, unselect them. Else select all in page.
        const allSelected = idsInPage.every(id => selectedIds.includes(id));
        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !idsInPage.includes(id)));
        } else {
            // Add ones that aren't already selected
            const toAdd = idsInPage.filter(id => !selectedIds.includes(id));
            setSelectedIds(prev => [...prev, ...toAdd]);
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '2rem' }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ marginBottom: '2rem' }}>
                    <div>
                        <h2 className="font-bold text-2xl text-slate-800 dark:text-white">Insight Dashboard</h2>
                        <p className="text-muted text-sm mt-1">Manage, filter, and track organizational insights</p>
                    </div>

                    <div className="flex gap-3">
                        {selectedIds.length > 0 && (
                            <button
                                onClick={confirmBulkDelete}
                                className="btn"
                                style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }}
                            >
                                <Trash2 size={18} />
                                Delete ({selectedIds.length})
                            </button>
                        )}
                        <button onClick={handleCreate} className="btn btn-primary shadow-sm hover:shadow-md">
                            <Plus size={18} />
                            Create Insight
                        </button>
                    </div>
                </div>

                <div className="card mb-6" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <FilterBar filters={filters} setFilters={setFilters} />
                </div>

                <InsightTable
                    insights={insights}
                    totalItems={totalItems} // Pass total items
                    onEdit={handleEdit}
                    onConfirmDelete={confirmDelete}
                    selectedIds={selectedIds}
                    onSelect={handleSelect}
                    onSelectAll={handleSelectAll}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
                />
            </main>

            <InsightModal
                isOpen={isInsightModalOpen}
                onClose={() => setIsInsightModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={currentInsight}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDelete}
                title={insightToDelete === 'bulk' ? 'Delete Multiple Items' : 'Delete Insight'}
                message={insightToDelete === 'bulk'
                    ? `Are you sure you want to delete ${selectedIds.length} selected insights? This action cannot be undone.`
                    : "Are you sure you want to delete this insight? This action cannot be undone."
                }
            />
        </div>
    );
};

export default Dashboard;
