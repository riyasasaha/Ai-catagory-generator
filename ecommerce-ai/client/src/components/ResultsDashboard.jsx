import { CheckCircle, Tag, Leaf, Target } from 'lucide-react';

export default function ResultsDashboard({ data, loading }) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center animate-pulse">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <div className="w-8 h-8 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Product Data...</h3>
                <p className="text-gray-500 max-w-sm">
                    Please wait while our AI engine categorizes your product and generates SEO attributes for sustainable commerce.
                </p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-sm border border-primary-100/50 p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary-100/50 rounded-full flex items-center justify-center mb-4 text-primary-600">
                    <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Awaiting Product</h3>
                <p className="text-gray-500 max-w-sm">
                    Enter your product details and generate the AI categorization to view the results here.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-primary-500/5 border border-primary-100 overflow-hidden h-full">
            <div className="bg-primary-50 px-6 py-4 border-b border-primary-100 flex items-center gap-3">
                <CheckCircle className="text-primary-600 w-5 h-5" />
                <h3 className="font-semibold text-primary-900">Analysis Complete</h3>
            </div>

            <div className="p-6 md:p-8 space-y-8">
                {/* Categories */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold border-b border-gray-100 pb-2">
                        <Target className="w-5 h-5 text-indigo-500" />
                        <h4>Classification</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Primary Category</span>
                            <span className="text-lg font-medium text-gray-900">{data.primary_category}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Sub Category</span>
                            <span className="text-lg font-medium text-gray-900">{data.sub_category || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* SEO Tags */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold border-b border-gray-100 pb-2">
                        <Tag className="w-5 h-5 text-emerald-500" />
                        <h4>SEO & Search Tags</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.seo_tags && data.seo_tags.length > 0 ? (
                            data.seo_tags.map((tag, idx) => (
                                <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-md text-sm font-medium">
                                    #{tag}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 italic text-sm">No tags generated.</span>
                        )}
                    </div>
                </div>

                {/* Sustainability Filters */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold border-b border-gray-100 pb-2">
                        <Leaf className="w-5 h-5 text-primary-500" />
                        <h4>Sustainability Highlights</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.sustainability_filters && data.sustainability_filters.length > 0 ? (
                            data.sustainability_filters.map((filter, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                                    <Leaf className="w-3.5 h-3.5" />
                                    {filter}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 italic text-sm">No specific sustainability highlights identified.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
