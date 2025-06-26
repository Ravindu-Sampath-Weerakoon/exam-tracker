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

function toggleModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
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