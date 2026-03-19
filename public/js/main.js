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
      dayDiv.setAttribute('data-subject', examsOnThisDay.map(e => e.name).join(', '));
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
  // Calendar rendering moved to toggleCalendarModal function
  
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
  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const topicId = button.getAttribute('data-topic-id');
      const newStatus = button.getAttribute('data-status');

      const res = await fetch('/topics/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `topic_id=${topicId}&status=${newStatus}`
      });

      if (res.ok) {
        location.reload();
      } else {
        alert('Failed to update topic.');
      }
    });
  });
});

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
          // Update the DOM
          const topicItem = document.querySelector(`.topic-item[data-topic-id="${id}"]`);
          if (topicItem) {
            topicItem.querySelector('.topic-title').textContent = title;
            topicItem.querySelector('.topic-description').textContent = description;
            
            // Also update the onclick attribute of the edit button to reflect the new values
            const editBtn = topicItem.querySelector('button[onclick^="openEditTopicModal"]');
            if (editBtn) {
              const escapedDesc = description.replace(/'/g, "\\'");
              editBtn.setAttribute('onclick', `openEditTopicModal('${id}', '${title}', '${escapedDesc}')`);
            }
          }
          toggleModal('editTopicModal');
        } else {
          alert('Failed to update topic.');
        }
      } catch (err) {
        console.error('Error updating topic:', err);
        alert('An error occurred.');
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const subjectCards = document.querySelectorAll(".card");
  const hoverSubjectName = document.getElementById("hoverSubjectName");

  subjectCards.forEach(card => {
    const subjectName = card.querySelector("h3")?.textContent;

    card.addEventListener("mouseenter", () => {
      hoverSubjectName.textContent = subjectName;
    });

    card.addEventListener("mouseleave", () => {
      hoverSubjectName.textContent = "";
    });
  });
});

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
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
      event.stopPropagation(); // Stop event from propagating to window.onclick
      const dropdownContent = this.nextElementSibling;
      dropdownContent.classList.toggle('show');
    });
  });
});