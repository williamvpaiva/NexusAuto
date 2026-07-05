document.addEventListener('DOMContentLoaded', () => {
    const memoryContainer = document.getElementById('memoryContainer');
    const searchInput = document.getElementById('searchInput');
    const togglePrivate = document.getElementById('togglePrivate');

    // Fetch initial memories
    fetchMemories();

    // Event Listeners
    searchInput.addEventListener('input', debounce(fetchMemories, 500));
    togglePrivate.addEventListener('change', fetchMemories);

    // SSE Setup
    setupSSE();

    function fetchMemories() {
        const query = searchInput.value;
        const url = `/api/memories?query=${encodeURIComponent(query)}`;
        
        fetch(url)
            .then(res => res.json())
            .then(data => renderMemories(data))
            .catch(err => console.error('Erro ao buscar memórias:', err));
    }

    function renderMemories(memories) {
        memoryContainer.innerHTML = '';
        const showPrivate = togglePrivate.checked;

        memories.forEach(mem => {
            if (mem.isPrivate && !showPrivate) return;

            const card = document.createElement('div');
            card.className = 'memory-card';
            
            card.innerHTML = `
                <div class="memory-content">
                    <div class="memory-type">${mem.type} ${mem.isPrivate ? '(Privada)' : ''}</div>
                    <div>${mem.content}</div>
                </div>
                <div class="memory-actions">
                    <button onclick="markPrivate(${mem.id})">${mem.isPrivate ? '🔓 Revelar' : '🔒 Ocultar'}</button>
                </div>
            `;
            memoryContainer.appendChild(card);
        });
    }

    function setupSSE() {
        const eventSource = new EventSource('/api/memories/stream');
        eventSource.onmessage = (event) => {
            const newMemory = JSON.parse(event.data);
            fetchMemories(); // Refresh lista
        };
    }

    // Função utilitária para debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Expor função para janela
    window.markPrivate = (id) => {
        fetch(`/api/memories/${id}/private`, { method: 'POST' })
            .then(() => fetchMemories());
    };
});
