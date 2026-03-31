import { useState } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, Save, X, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFaqs, type FAQ } from '../../hooks/useFaqs';

const FAQManagementView = () => {
  const { faqs, loading, addFaq, updateFaq, deleteFaq } = useFaqs();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Temporary state for the form
  const [formData, setFormData] = useState<Partial<FAQ>>({
    category: '',
    question: '',
    answer: '',
    sort_order: 0,
    is_active: true
  });

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (faq: FAQ) => {
    setEditingId(faq.id);
    setIsAdding(false);
    setFormData(faq);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      category: '일반',
      question: '',
      answer: '',
      sort_order: faqs.length + 1,
      is_active: true
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!formData.question || !formData.answer || !formData.category) {
      alert("분류, 질문, 답변을 모두 입력해주세요.");
      return;
    }

    if (isAdding) {
      await addFaq(formData as Omit<FAQ, 'id' | 'created_at'>);
    } else if (editingId) {
      await updateFaq(editingId, formData);
    }

    setEditingId(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 이 FAQ를 삭제하시겠습니까?")) {
      await deleteFaq(id);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto relative">
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 text-purple-400 mb-2">
              <HelpCircle className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-purple-400">Settings</span>
            </div>
            <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
              FAQ MANAGEMENT
            </h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
              클라이언트 런처의 'Call Admin' 시 노출될 FAQ 항목을 관리합니다.
            </p>
          </div>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95 font-bold"
          >
            <Plus className="w-5 h-5" />
            <span>새 항목 추가</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5 shadow-xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="FAQ 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 font-medium transition-all"
            />
          </div>
        </div>

        {/* Form Editor (Add or Edit) */}
        {(isAdding || editingId) && (
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-purple-400" />
              {isAdding ? "새 FAQ 등록" : "FAQ 수정"}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">분류 (Category)</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="예: 결제/환불, 시설 고장"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">노출 순서 (Sort Order)</label>
                  <input 
                    type="number" 
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">질문 (Question)</label>
                <input 
                  type="text" 
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">답변 (Answer)</label>
                <textarea 
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  rows={3}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-purple-500/50 transition-colors resize-none"
                />
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 rounded border-white/20 bg-slate-900 text-purple-600 focus:ring-purple-600 focus:ring-offset-slate-900"
                  />
                  <span className="text-sm font-bold text-slate-300">활성화 (클라이언트에 노출)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-bold"
                >
                  <X className="w-4 h-4" />
                  취소
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-bold shadow-lg shadow-purple-500/20"
                >
                  <Save className="w-4 h-4" />
                  저장
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/10 text-xs font-black uppercase tracking-widest text-slate-400">
                <th className="p-4 w-20 text-center">순서</th>
                <th className="p-4 w-32">분류</th>
                <th className="p-4">질문 및 내용</th>
                <th className="p-4 w-24 text-center">상태</th>
                <th className="p-4 w-32 text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-purple-500 animate-spin mx-auto mb-4" />
                    <span className="font-bold">데이터를 불러오는 중입니다...</span>
                  </td>
                </tr>
              ) : filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-bold">
                    등록된 FAQ 항목이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((faq) => (
                  <tr 
                    key={faq.id} 
                    className={cn(
                      "border-b border-white/5 hover:bg-white/[0.02] transition-colors group",
                      editingId === faq.id && "bg-purple-500/5"
                    )}
                  >
                    <td className="p-4 text-center text-sm font-bold text-slate-500">
                      {faq.sort_order}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded">
                        {faq.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white mb-1">Q. {faq.question}</div>
                      <div className="text-sm text-slate-400 truncate max-w-xl">A. {faq.answer}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={cn(
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest",
                        faq.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                      )}>
                        {faq.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditClick(faq)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(faq.id)}
                          className="p-1.5 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
};

export default FAQManagementView;
