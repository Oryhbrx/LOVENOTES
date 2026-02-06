// Tab switching for dashboard
function showTab(tabName) {
    const activeTab = document.getElementById('activeTab');
    const archivedTab = document.getElementById('archivedTab');
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (tabName === 'active') {
        activeTab.classList.remove('hidden');
        archivedTab.classList.add('hidden');
        tabs[0].classList.add('active');
    } else {
        activeTab.classList.add('hidden');
        archivedTab.classList.remove('hidden');
        tabs[1].classList.add('active');
    }
}

// Handle send button click
document.querySelector('.btn-send').addEventListener('click', function() {
    const textarea = document.querySelector('.reply-input');
    if (textarea.value.trim()) {
        // Add new reply
        const newReply = document.createElement('div');
        newReply.className = 'reply';
        newReply.innerHTML = `
            <span class="emoji">😊</span>
            <p class="reply-date">Just now</p>
        `;
        document.querySelector('.replies-section').insertBefore(newReply, textarea);
        textarea.value = '';
    }
});

// Handle create note button
document.querySelector('.btn-create').addEventListener('click', function() {
    alert('Create new love note feature coming soon!');
});

// Handle notifications button
document.querySelector('.btn-notifications').addEventListener('click', function() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Love Notes', {
                    body: 'Notifications enabled! You\'ll receive daily reminders.',
                    icon: '❤️'
                });
            }
        });
    }
});

// Smooth page navigation
document.querySelector('.footer a').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('notePage').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
});

document.querySelector('.btn-logout').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('notePage').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
});