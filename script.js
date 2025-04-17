
document.addEventListener('DOMContentLoaded', function() {
    const noteList = document.getElementById('notes');
    const noteForm = document.getElementById('note-form');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const cancelButton = document.getElementById('cancel-button');

    let notes = [];
    let editingNoteId = null;

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getCurrentDate() {
        return formatDate(new Date());
    }

    function renderNotes() {
        noteList.innerHTML = '';
        notes.forEach(note => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${note.title}</strong> - ${note.date}
                <div class="note-details" id="note-details-${note.id}" style="display: none;">
                    <p>${note.content}</p>
                    <button class="edit-button" data-id="${note.id}">Редактировать</button>
                    <button class="delete-button" data-id="${note.id}">Удалить</button>
                </div>
            `;
            li.addEventListener('click', () => toggleNoteDetails(note.id));

            const editButton = li.querySelector('.edit-button');
            editButton.addEventListener('click', (event) => {
                event.stopPropagation();
                editNote(note.id);
            });

            const deleteButton = li.querySelector('.delete-button');
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteNote(note.id);
            });

            noteList.appendChild(li);
        });
    }

    function toggleNoteDetails(id) {
        const details = document.getElementById(`note-details-${id}`);
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
    }

    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function loadNotes() {
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
            notes = JSON.parse(storedNotes);
            renderNotes();
        }
    }

    function saveNote(title, content) {
        const date = getCurrentDate(); 
        if (editingNoteId) {

            notes = notes.map(note =>
                note.id === editingNoteId ? { ...note, title, date, content } : note
            );
            editingNoteId = null;
        } else {

            const newNote = {
                id: Date.now(),
                title: title,
                date: date,
                content: content
            };
            notes.push(newNote);
        }
        saveNotes();
        renderNotes();
    }

    function editNote(id) {
        event.stopPropagation();
        const noteToEdit = notes.find(note => note.id === id);
        if (noteToEdit) {
            editingNoteId = id;
            titleInput.value = noteToEdit.title;
            contentInput.value = noteToEdit.content;
        }
    }

    function deleteNote(id) {
        event.stopPropagation();
        notes = notes.filter(note => note.id !== id);
        saveNotes();
        renderNotes();
    }

    noteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (title && content) {
            saveNote(title, content);
            titleInput.value = '';
            contentInput.value = '';
        } else {
            alert('Пожалуйста, заполните все поля.');
        }
    });

    cancelButton.addEventListener('click', function() {
        titleInput.value = '';
        contentInput.value = '';
        editingNoteId = null;
    });

    loadNotes();
});