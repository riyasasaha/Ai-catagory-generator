import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Zap } from 'lucide-react';
import ResultsDashboard from './ResultsDashboard';

const CATEGORY_OPTIONS = [
    "Apparel & Fashion",
    "Home & Furniture",
    "Beauty & Personal Care",
    "Food & Beverage",
    "Electronics",
    "Outdoor & Sports"
];

export default function ProductForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        allowedCategories: []
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleCategoryToggle = (cat) => {
        setFormData(prev => {
            const isSelected = prev.allowedCategories.includes(cat);
            if (isSelected) {
                return { ...prev, allowedCategories: prev.allowedCategories.filter(c => c !== cat) };
            } else {
                return { ...prev, allowedCategories: [...prev.allowedCategories, cat] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.description) {
            toast.error("Please fill in the product name and description.");
            return;
        }
        if (formData.allowedCategories.length === 0) {
            toast.error("Please select at least one primary category.");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await axios.post('/api/categorize', formData);
            setResult(response.data);
            toast.success("Categorization successful!");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || "Failed to categorize product.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Zap className="text-primary-500 w-6 h-6" />
                    Product Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                            placeholder="e.g. Bamboo Fiber T-Shirt"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                            placeholder="Detailed description of the product, materials used, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Categories</label>
                        <p className="text-xs text-gray-500 mb-3">Select the top-level categories the AI can choose from.</p>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORY_OPTIONS.map(cat => {
                                const isSelected = formData.allowedCategories.includes(cat);
                                return (
                                    <button
                                        type="button"
                                        key={cat}
                                        onClick={() => handleCategoryToggle(cat)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${isSelected ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                        {loading ? 'Analyzing Product...' : 'Generate AI Categorization'}
                    </button>
                </form>
            </div>

            {/* Results Section */}
            <div className="lg:sticky lg:top-24">
                <ResultsDashboard data={result} loading={loading} />
            </div>
        </div>
    );
}
