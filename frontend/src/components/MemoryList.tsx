import React, { useState, useEffect } from 'react';
import { sanitizeText } from '../utils/sanitize';

interface Conversation {
  id: string;
  title: string;
  agent_id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  token_count: number;
  message_count: number;
}

interface MemoryListProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string | null) => void;
}

export function MemoryList({ selectedConversation, onSelectConversation }: MemoryListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedConvDetails, setSelectedConvDetails] = useState<Conversation | null>(null);

  const perPage = 20;

  useEffect(() => {
    fetchConversations();
  }, [page, searchTerm]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/v1/memory/conversations?${params}`);
      const data = await response.json();

      if (data.success) {
        setConversations(data.data);
        setTotal(data.meta.total);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (id: string) => {
    if (selectedConversation === id) {
      onSelectConversation(null);
      setSelectedConvDetails(null);
      return;
    }

    onSelectConversation(id);

    // Fetch conversation details
    try {
      const response = await fetch(`/api/v1/memory/conversations/${id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedConvDetails(data.data);
      }
    } catch (error) {
      console.error('Error fetching conversation details:', error);
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Tem certeza que deseja deletar esta conversa?')) return;

    try {
      const response = await fetch(`/api/v1/memory/conversations/${id}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        setConversations(conversations.filter((c) => c.id !== id));
        setTotal(total - 1);
        if (selectedConversation === id) {
          onSelectConversation(null);
          setSelectedConvDetails(null);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleOptimizeTokens = async (conversationId: string, strategy: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const response = await fetch(`/api/v1/memory/conversations/${conversationId}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Otimização concluída! Tokens economizados: ${data.data.savedTokens}`);
        fetchConversations();
      }
    } catch (error) {
      console.error('Error optimizing tokens:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total: {total} conversas
        </div>
      </div>

      {/* Conversations List */}
      <div className="grid gap-4">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleSelectConversation(conversation.id)}
            className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow cursor-pointer transition-all ${
              selectedConversation === conversation.id
                ? 'ring-2 ring-blue-500'
                : 'hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sanitizeText(conversation.title)}
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Agent:</span> {sanitizeText(conversation.agent_id)}
                  </div>
                  <div>
                    <span className="font-medium">Messages:</span> {conversation.message_count}
                  </div>
                  <div>
                    <span className="font-medium">Tokens:</span> {conversation.token_count.toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  Atualizado em: {new Date(conversation.updated_at).toLocaleString()}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={(e) => handleOptimizeTokens(conversation.id, 'truncate', e)}
                  className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800"
                  title="Otimizar (truncar)"
                >
                  Truncar
                </button>
                <button
                  onClick={(e) => handleOptimizeTokens(conversation.id, 'summary', e)}
                  className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800"
                  title="Otimizar (resumir)"
                >
                  Resumir
                </button>
                <button
                  onClick={(e) => handleDeleteConversation(conversation.id, e)}
                  className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800"
                  title="Deletar"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Anterior
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Página {page} de {Math.ceil(total / perPage)}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= Math.ceil(total / perPage)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Próxima
        </button>
      </div>

      {/* Selected Conversation Details */}
      {selectedConvDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {sanitizeText(selectedConvDetails.title)}
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div><strong>ID:</strong> {sanitizeText(selectedConvDetails.id)}</div>
              <div><strong>Agent:</strong> {sanitizeText(selectedConvDetails.agent_id)}</div>
              <div><strong>Session:</strong> {sanitizeText(selectedConvDetails.session_id)}</div>
              <div><strong>Mensagens:</strong> {selectedConvDetails.message_count}</div>
              <div><strong>Tokens:</strong> {selectedConvDetails.token_count.toLocaleString()}</div>
              <div><strong>Criado:</strong> {new Date(selectedConvDetails.created_at).toLocaleString()}</div>
              <div><strong>Atualizado:</strong> {new Date(selectedConvDetails.updated_at).toLocaleString()}</div>
            </div>
            <button
              onClick={() => {
                onSelectConversation(null);
                setSelectedConvDetails(null);
              }}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}