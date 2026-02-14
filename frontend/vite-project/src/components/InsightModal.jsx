import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const InsightModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        category: 'General',
        status: 'Draft',
        complexity: 'Medium'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                tags: initialData.tags ? initialData.tags.join(', ') : '',
                category: initialData.category || 'General',
                status: initialData.status || 'Draft',
                complexity: initialData.complexity || 'Medium'
            });
        } else {
            setFormData({
                title: '',
                content: '',
                tags: '',
                category: 'General',
                status: 'Draft',
                complexity: 'Medium'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        onSubmit({ ...formData, tags: tagsArray });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="font-bold text-lg">
                        {initialData ? 'Edit Insight' : 'Create New Insight'}
                    </h3>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                className="form-input"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter insight title"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Content</label>
                            <textarea
                                className="form-textarea"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                placeholder="Describe the insight details..."
                                rows="4"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="form-group w-full">
                                <label className="form-label">Category</label>
                                <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                                    <option value="General">General</option>
                                    <option value="Generative AI">Generative AI</option>
                                    <option value="Process Automation">Process Automation</option>
                                    <option value="Governance">Governance</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Finance">Finance</option>
                                </select>
                            </div>

                            <div className="form-group w-full">
                                <label className="form-label">Complexity</label>
                                <select className="form-select" name="complexity" value={formData.complexity} onChange={handleChange}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="form-group w-full">
                                <label className="form-label">Status</label>
                                <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>

                            <div className="form-group w-full">
                                <label className="form-label">Tags</label>
                                <input
                                    className="form-input"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="AI, ML, Ops..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} />
                            {initialData ? 'Update Insight' : 'Create Insight'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InsightModal;
