document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('subjectSearch');
  const subjectCards = document.querySelectorAll('.card');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();

      subjectCards.forEach(card => {
        const subjectName = card.querySelector('h3').textContent.toLowerCase();
        if (subjectName.includes(term)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});

// Calendar Logic
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar(month, year) {
  const monthDisplay = document.getElementById('monthDisplay');
  const calendarGrid = document.getElementById('calendarGrid');
  const monthlyExamList = document.getElementById('monthlyExamList');
  if (!monthDisplay || !calendarGrid || !monthlyExamList) return;

  calendarGrid.innerHTML = '';
  monthlyExamList.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthDisplay.textContent = `${monthNames[month]} ${year}`;

  // Empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('calendar-day', 'empty');
    calendarGrid.appendChild(emptyDiv);
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  const monthExams = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    dayDiv.textContent = day;

    const checkDate = new Date(year, month, day);
    
    if (checkDate.getTime() === today.getTime()) {
      dayDiv.classList.add('today');
    }

    // Highlight exams
    const examsOnThisDay = examDates.filter(e => {
      const eDate = new Date(e.date);
      return eDate.getFullYear() === year && eDate.getMonth() === month && eDate.getDate() === day;
    });

    if (examsOnThisDay.length > 0) {
      dayDiv.classList.add('has-exam');
      const subjectNames = examsOnThisDay.map(e => e.name).join(', ');
      dayDiv.setAttribute('data-subject', subjectNames);
      
      // Combine all topics for the tooltip
      const allTopics = examsOnThisDay.flatMap(e => e.topics || []);
      if (allTopics.length > 0) {
        dayDiv.setAttribute('title', `Subject: ${subjectNames}\nTopics:\n• ${allTopics.join('\n• ')}`);
      } else {
        dayDiv.setAttribute('title', `Subject: ${subjectNames}`);
      }

      examsOnThisDay.forEach(e => {
        monthExams.push({ ...e, day });
      });
    }

    calendarGrid.appendChild(dayDiv);
  }

  // Populate Monthly Exam List
  if (monthExams.length > 0) {
    monthExams.sort((a, b) => a.day - b.day).forEach(e => {
      const item = document.createElement('div');
      item.classList.add('exam-list-item');
      item.innerHTML = `
        <span class="exam-list-date">${monthNames[month]} ${e.day}</span>
        <span class="exam-list-name">${e.name}</span>
      `;
      monthlyExamList.appendChild(item);
    });
  } else {
    monthlyExamList.innerHTML = '<p style="font-size: 0.85rem; color: #666;">No exams scheduled this month.</p>';
  }
}

function toggleCalendarModal() {
  toggleModal('calendarModal');
  renderCalendar(currentMonth, currentYear);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('prevMonth')?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  document.getElementById('nextMonth')?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });
});

function toggleModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.topic-toggle-btn').forEach(button => {
    attachToggleListener(button);
  });

  // Delegated listener for edit topic buttons
  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-topic-btn');
    if (editBtn) {
      e.preventDefault();
      const id = editBtn.getAttribute('data-id');
      const title = editBtn.getAttribute('data-title');
      const description = editBtn.getAttribute('data-description');
      openEditTopicModal(id, title, description);
    }
  });
});

function attachToggleListener(button) {
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    const topicId = button.getAttribute('data-topic-id');
    const currentStatus = button.getAttribute('data-status');

    try {
      const res = await fetch('/topics/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `topic_id=${topicId}&status=${currentStatus}`
      });

      if (res.ok) {
        const topicItem = button.closest('.topic-item');
        const isNowDone = currentStatus === 'done';
        
        topicItem.classList.toggle('done', isNowDone);
        button.setAttribute('data-status', isNowDone ? 'todo' : 'done');
        button.setAttribute('title', isNowDone ? 'Undo' : 'Mark as done');
        button.className = `topic-toggle-btn ${isNowDone ? 'done' : 'todo'}`;

        updateProgress(button.closest('.card'));
      } else {
        alert('Failed to update topic.');
      }
    } catch (err) {
      console.error('Error toggling topic:', err);
    }
  });
}

function updateProgress(card) {
  if (!card) return;

  const topics = card.querySelectorAll('.topic-item');
  const doneTopics = card.querySelectorAll('.topic-item.done');
  const total = topics.length;
  const done = doneTopics.length;
  const remaining = total - done;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const progressBar = card.querySelector('.progress-bar-inner');
  const progressText = card.querySelector('small');
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (progressText) progressText.textContent = `Progress: ${percent}%`;

  const countDone = card.querySelector('.count-done');
  const countRem = card.querySelector('.count-rem');
  const countTotal = card.querySelector('.count-total');
  if (countDone) countDone.textContent = done;
  if (countRem) countRem.textContent = remaining;
  if (countTotal) countTotal.textContent = total;

  const allTopics = document.querySelectorAll('.topic-item').length;
  const allDone = document.querySelectorAll('.topic-item.done').length;
  const overallPercent = allTopics > 0 ? Math.round((allDone / allTopics) * 100) : 0;

  const circle = document.querySelector('.navbar .circle');
  const navPercentText = document.querySelector('.navbar .nav-percent');
  if (circle) circle.setAttribute('stroke-dasharray', `${overallPercent}, 100`);
  if (navPercentText) navPercentText.textContent = `${overallPercent}%`;
}

function openEditSubjectModal(id, name, exam_date) {
  document.getElementById('edit-subject-id').value = id;
  document.getElementById('edit-subject-name').value = name;
  document.getElementById('edit-subject-exam-date').value = new Date(exam_date).toISOString().slice(0, 10);
  toggleModal('editSubjectModal');
}

function openEditTopicModal(id, title, description) {
  document.getElementById('edit-topic-id').value = id;
  document.getElementById('edit-topic-title').value = title;
  document.getElementById('edit-topic-description').value = description || '';
  toggleModal('editTopicModal');
}

function openAddTopicModalForSubject(subjectId) {
  const addTopicSubjectIdInput = document.getElementById('addTopicSubjectId');
  if (addTopicSubjectIdInput) {
    addTopicSubjectIdInput.value = subjectId;
  }
  toggleModal('addTopicModal');
}

document.addEventListener('DOMContentLoaded', () => {
  const addTopicForm = document.getElementById('addTopicForm');
  if (addTopicForm) {
    addTopicForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const subjectId = document.getElementById('addTopicSubjectId').value;
      const titleInput = addTopicForm.querySelector('input[name="title"]');
      const title = titleInput.value;

      try {
        const response = await fetch('/topics/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `subject_id=${subjectId}&title=${encodeURIComponent(title)}`
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const card = document.getElementById(`subject-card-${subjectId}`);
            const topicList = card.querySelector('.topic-list');
            
            const li = document.createElement('li');
            li.className = 'topic-item';
            li.setAttribute('data-topic-id', data.id);
            li.innerHTML = `
              <div class="topic-content">
                <span class="topic-title">${data.title}</span>
                <p class="topic-description"></p>
              </div>
              <div class="topic-actions">
                <button class="topic-action-btn edit-topic-btn" 
                        data-id="${data.id}" 
                        data-title="${data.title}" 
                        data-description="" 
                        title="Edit Topic">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <form action="/topics/delete" method="POST" style="display: inline;">
                  <input type="hidden" name="id" value="${data.id}">
                  <button type="submit" class="topic-action-btn delete" onclick="return confirm('Are you sure you want to delete this topic?')" title="Delete Topic">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </form>
                <form action="/topics/toggle" method="POST" style="display: inline;">
                  <input type="hidden" name="topic_id" value="${data.id}" />
                  <input type="hidden" name="status" value="done" />
                  <button class="topic-toggle-btn todo" 
                          data-topic-id="${data.id}" 
                          data-status="done"
                          title="Mark as done">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </button>
                </form>
              </div>
            `;
            
            topicList.appendChild(li);
            attachToggleListener(li.querySelector('.topic-toggle-btn'));
            updateProgress(card);
            titleInput.value = '';
            toggleModal('addTopicModal');
          }
        }
      } catch (err) {
        console.error('Error adding topic:', err);
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const editTopicForm = document.querySelector('#editTopicModal form');
  if (editTopicForm) {
    editTopicForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-topic-id').value;
      const title = document.getElementById('edit-topic-title').value;
      const description = document.getElementById('edit-topic-description').value;

      try {
        const response = await fetch('/topics/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `id=${id}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
        });

        if (response.ok) {
          const topicItem = document.querySelector(`.topic-item[data-topic-id="${id}"]`);
          if (topicItem) {
            topicItem.querySelector('.topic-title').textContent = title;
            topicItem.querySelector('.topic-description').textContent = description;
            const editBtn = topicItem.querySelector('.edit-topic-btn');
            if (editBtn) {
              editBtn.setAttribute('data-title', title);
              editBtn.setAttribute('data-description', description);
            }
          }
          toggleModal('editTopicModal');
        } else {
          alert('Failed to update topic.');
        }
      } catch (err) {
        console.error('Error updating topic:', err);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const subjectCards = document.querySelectorAll(".card");
  const hoverSubjectName = document.getElementById("hoverSubjectName");

  subjectCards.forEach(card => {
    const subjectName = card.querySelector("h3")?.textContent;
    card.addEventListener("mouseenter", () => { hoverSubjectName.textContent = subjectName; });
    card.addEventListener("mouseleave", () => { hoverSubjectName.textContent = ""; });
  });
});

function toggleFilter(subjectId, button) {
  const card = document.getElementById(`subject-card-${subjectId}`);
  if (!card) return;

  const isActive = card.classList.toggle('filter-active');
  button.classList.toggle('active', isActive);
  
  // Update title to reflect state
  button.setAttribute('title', isActive ? 'Show All Topics' : 'Show Remaining Only');
}

function toggleCard(subjectId) {
  const card = document.getElementById(`subject-card-${subjectId}`);
  if (card) {
    const isFolding = !card.classList.contains('collapsed');
    card.classList.toggle('collapsed');
    if (isFolding) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

window.onclick = function(event) {
  if (!event.target.closest('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dropdown .dropbtn').forEach(button => {
    button.addEventListener('click', function(event) {
      event.stopPropagation();
      const dropdownContent = this.nextElementSibling;
      document.querySelectorAll('.dropdown-content').forEach(content => {
        if (content !== dropdownContent) content.classList.remove('show');
      });
      dropdownContent.classList.toggle('show');
    });
  });
});