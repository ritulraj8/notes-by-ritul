document.addEventListener('DOMContentLoaded', () => {
    const saveNoteButton = document.querySelector('.save');
    const titleInput = document.querySelector('#title');
    const contentInput = document.querySelector('#content');
    const searchInput = document.querySelector('#search');
    const notesContainer = document.querySelector('#notesContainer');
    const paginationContainer = document.querySelector('#pagination');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentPage = 1;
    const notesPerPage = 10;
    let isEditing = false;
    let editingNoteId = null;

    const saveNote = () => {
        const title = titleInput.value;
        const content = contentInput.value;
        if (title && content) {
            const date = new Date();
            if (isEditing) {
                const note = notes.find(note => note.id === editingNoteId);
                if (note) {
                    note.title = title;
                    note.content = content;
                    note.updatedDate = date;
                    isEditing = false;
                    editingNoteId = null;
                }
            } else {
                const note = {
                    id: Date.now(),
                    title,
                    content,
                    createdDate: date,
                    updatedDate: date
                };
                notes.push(note);
            }
            localStorage.setItem('notes', JSON.stringify(notes));
            titleInput.value = '';
            contentInput.value = '';
            createNotes();
        }
    };
    const editNote = (id) => {
        const note = notes.find(note => note.id === id);
        if (note) {
            titleInput.value = note.title;
            contentInput.value = note.content;
            isEditing = true;
            editingNoteId = id;
        }
    };


    const deleteNote = (id) => {
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        createNotes();
    };

    const searchNotes = () => {
        const query = searchInput.value.toLowerCase();
        return notes.filter(note => note.title.toLowerCase().includes(query));
    };

    const paginateNotes = (notes) => {
        const start = (currentPage - 1) * notesPerPage;
        const end = start + notesPerPage;
        return notes.slice(start, end);
    };

    const createNotes = () => {
        notesContainer.innerHTML = '';
        let filteredNotes = searchNotes();
        filteredNotes.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
        let paginatedNotes = paginateNotes(filteredNotes);

        paginatedNotes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <p class="date">Created: ${new Date(note.createdDate).toLocaleString()}</p>
                <p class="date">Updated: ${new Date(note.updatedDate).toLocaleString()}</p>
                <button class="delete-btn" onclick="deleteNoteHandler(${note.id})">Delete</button>
                <button class="edit-btn" onclick="editNoteHandler(${note.id})">Edit</button>
            `;
            notesContainer.appendChild(noteElement);
        });

        createPagination(filteredNotes.length);
    };

    const createPagination = (totalNotes) => {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalNotes / notesPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.classList.add("pagination-number");
            button.textContent = i;
            button.addEventListener('click', () => {
                currentPage = i;
                createNotes();
            });
            paginationContainer.appendChild(button);
        }
    };

    saveNoteButton.addEventListener('click', saveNote);
    searchInput.addEventListener('input', createNotes);
    window.deleteNoteHandler = deleteNote;
    window.editNoteHandler = editNote;

    createNotes();
});
