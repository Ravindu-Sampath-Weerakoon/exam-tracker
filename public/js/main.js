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

function openEditTopicModal(id, title) {
  document.getElementById('edit-topic-id').value = id;
  document.getElementById('edit-topic-title').value = title;
  toggleModal('editTopicModal');
}

function openAddTopicModalForSubject(subjectId) {
  const addTopicSubjectIdInput = document.getElementById('addTopicSubjectId');
  if (addTopicSubjectIdInput) {
    addTopicSubjectIdInput.value = subjectId;
  }
  toggleModal('addTopicModal');
}


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