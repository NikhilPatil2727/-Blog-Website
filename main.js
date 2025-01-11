// Storage Constants and Utilities
const StorageKeys = {
  POSTS: 'posts',
  DRAFTS: 'drafts',
  NOTES: 'notes'
};

//This function retrieves data from localStorage for the given key.
function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

//This function saves data to localStorage for the given key.
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}


// Post Management
function savePost(title, content) {
  //get the array from the LocalStorage
  const posts = getFromStorage(StorageKeys.POSTS);
  const post = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString()
  };
  //and add this data 
  posts.unshift(post);
  //and store to the loacl storage 
  saveToStorage(StorageKeys.POSTS, posts);
}

// The line const updatedPosts = posts.filter(post => post.id !== id);
// creates a new array that excludes the post with the given id.
function deletePost(id) {
  //get the data from the locastorage 
  const posts = getFromStorage(StorageKeys.POSTS);
  const updatedPosts = posts.filter(post => post.id !== id);
  saveToStorage(StorageKeys.POSTS, updatedPosts);
}

//The getPosts function retrieves and returns stored
//"posts" data using a key (StorageKeys.POSTS
function getPosts() {
  return getFromStorage(StorageKeys.POSTS);
}

// Draft Management
function saveDraft(title, content) {
  const drafts = getFromStorage(StorageKeys.DRAFTS);
  const draft = {
      id: Date.now(),
      title,
      content,
      lastModified: new Date().toLocaleString()
  };
  drafts.unshift(draft);
  saveToStorage(StorageKeys.DRAFTS, drafts);
  return draft;
}
//getFromStorage("DRAFTS") retrieves the array of drafts: from the LocalStorage
function getDrafts() {
  return getFromStorage(StorageKeys.DRAFTS);
}

//delet the drafts
function deleteDraft(id) {
  const drafts = getFromStorage(StorageKeys.DRAFTS);
  const updatedDrafts = drafts.filter(draft => draft.id !== id);
  saveToStorage(StorageKeys.DRAFTS, updatedDrafts);
}

function getDraft(id) {
  const drafts = getFromStorage(StorageKeys.DRAFTS); // Retrieve drafts from storage
  return drafts.find(draft => draft.id === id);// Find and return the draft with the matching id
}

// Note Management
function saveNote(content) {
  const notes = getFromStorage(StorageKeys.NOTES);
  const note = {
      id: Date.now(),
      content,
      date: new Date().toLocaleDateString()
  };
  notes.unshift(note);
  saveToStorage(StorageKeys.NOTES, notes);
}

function deleteNote(id) {
  const notes = getFromStorage(StorageKeys.NOTES);
  const updatedNotes = notes.filter(note => note.id !== id);
  saveToStorage(StorageKeys.NOTES, updatedNotes);
}

function getNotes() {
  return getFromStorage(StorageKeys.NOTES);
}

// UI Rendering Functions
//To dynamically create and display a list of drafts based on data.
function createDraftsList(drafts) {
  return drafts.map(draft => `
      <div class="draft-item">
          <div class="draft-content" onclick="handleDraftClick(${draft.id})">
              <h3>${draft.title || 'Untitled Draft'}</h3>
              <small>Last modified: ${draft.lastModified}</small>
          </div>
          <button onclick="handleDraftDelete(${draft.id})" class="btn-secondary">
              <i class="fas fa-trash"></i>
          </button>
      </div>
  `).join('');
}

function createPostsList(posts) {
  return posts.map(post => `
      <article class="post-card">
          <h2>${post.title}</h2>
          <div class="post-content">${post.content}</div>
          <div class="post-meta">
              <small>Posted on ${post.date}</small>
              <button onclick="handlePostDelete(${post.id})" class="btn-secondary">
                  <i class="fas fa-trash"></i>
              </button>
          </div>
      </article>
  `).join('');
}

function createNotesList(notes) {
  return notes.map(note => `
      <div class="note-item">
          <p>${note.content}</p>
          <small>Created on ${note.date}</small>
          <button onclick="handleNoteDelete(${note.id})" class="btn-secondary">
              <i class="fas fa-trash"></i>
          </button>
      </div>
  `).join('');
}

// DOM Elements
const newPostBtn = document.getElementById('new-post-btn');
const draftsBtn = document.getElementById('drafts-btn');
const notesBtn = document.getElementById('notes-btn');
const editorModal = document.getElementById('editor-modal');
const draftsModal = document.getElementById('drafts-modal');
const notesModal = document.getElementById('notes-modal');
const closeEditor = document.getElementById('close-editor');
const closeDrafts = document.getElementById('close-drafts');
const closeNotes = document.getElementById('close-notes');
const savePostBtn = document.getElementById('save-post');
const saveDraftBtn = document.getElementById('save-draft');
const saveNoteBtn = document.getElementById('save-note');
const editor = document.getElementById('editor');
const postTitle = document.getElementById('post-title');
const notesArea = document.getElementById('notes-area');
const notesList = document.querySelector('.notes-list');
const draftsList = document.querySelector('.drafts-list');
const postsContainer = document.querySelector('.posts-container');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

let currentDraftId = null;


// Event Listeners
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});


//++++++++++++++++++++++only click header++++++++++++++++
//clear the content
newPostBtn.addEventListener('click', () => {
  currentDraftId = null;
  editorModal.style.display = 'block';
  //Clears the content of the editor so the user can start with a blank slate.
  editor.innerHTML = '';
  //Clears the content of the editor so the user can start with a blank slate.
  postTitle.value = '';
});


//get data form Loacal storage and dispaly the drafts
draftsBtn.addEventListener('click', () => {
  draftsModal.style.display = 'block';
  //this is funtion to disply the drafts get from the local storage and display
  displayDrafts();
});


notesBtn.addEventListener('click', () => {
  notesModal.style.display = 'block';
  displayNotes();
});


// Close modal handlers
//When you click the "close" button (e.g., closeEditor),
//it removes the modal's visibility by setting its style.display to 'none'
//effectively hiding the modal (like canceling or closing it).

//Closes the modal when clicking a close button (e.g., closeEditor, closeDrafts).
[
  [closeEditor, editorModal],
  [closeDrafts, draftsModal],
  [closeNotes, notesModal]
].forEach(([btn, modal]) => {
  btn.addEventListener('click', () => {
      modal.style.display = 'none';
  });
});

//Closes the modal when clicking outside the content (background).in window 
window.addEventListener('click', (e) => {
  [editorModal, draftsModal, notesModal].forEach(modal => {
      if (e.target === modal) modal.style.display = 'none';
  });
});


// Text Editor Functions
//When you select text in the editor and click "Bold"
//The formatText('bold') function is called, making the selected text bold.
window.formatText = (command) => {
  document.execCommand(command, false, null);
  editor.focus();
};

//this is for formating 
//the text become a large size lik <h2>
window.formatHeading = () => {
  document.execCommand('formatBlock', false, '<h2>');
  editor.focus();
};

window.formatList = () => {
  document.execCommand('insertUnorderedList', false, null);
  editor.focus();
};


//+++++++++click on buttons +++++++++++++++++++++++
// Save Button Handlers
//when we click on save buttion save the post and disply to fornt side page 
savePostBtn.addEventListener('click', () => {
  const title = postTitle.value.trim();
  const content = editor.innerHTML;
  
  if (!title || !content) {
      alert('Please fill in both title and content');
      return;
  }
 //save the post above is savePost()  function to save the post into localstorage 
  savePost(title, content);
  if (currentDraftId) {
      deleteDraft(currentDraftId);
  }
  //disply all the posts using 
  displayPosts();
  //hide the editorModel 
  editorModal.style.display = 'none';
});

//when we click on save button so it save the drafts
saveDraftBtn.addEventListener('click', () => {
  //get the content like title and content 
  const title = postTitle.value.trim();
  const content = editor.innerHTML;
  
  if (!content) {
      alert('Cannot save empty draft');
      return;
  }

  if (currentDraftId) {
      deleteDraft(currentDraftId);
  }
  //save the draft into LocalStorage 
  saveDraft(title, content);
  editorModal.style.display = 'none';
});

//when we click on saveNotes buttuon save into locastorage 
saveNoteBtn.addEventListener('click', () => {
  const content = notesArea.value.trim();
  
  if (!content) {
      alert('Please enter a note');
      return;
  }
//save the content into loacal storage
  saveNote(content);
  notesArea.value = '';
  //display the notes using Map() Function 
  displayNotes();
});

// Display Functions
function displayPosts() {
  postsContainer.innerHTML = createPostsList(getPosts());
}

function displayDrafts() {
  draftsList.innerHTML = createDraftsList(getDrafts());
}

function displayNotes() {
  notesList.innerHTML = createNotesList(getNotes());
}


// Global Handle Functions
//The code opens the selected draft in an editor so you can see and edit its title and content.
window.handleDraftClick = (id) => {
  //get the perticluer draft with id 
  //fetch the draft array wiht perticluer id 
  const draft = getDraft(id);
  if (draft) {
    
      currentDraftId = draft.id;
     // The title input is filled with "some text the user is enterd ":
      postTitle.value = draft.title || '';
      //The content editor is filled with some main contend":
      editor.innerHTML = draft.content;
      draftsModal.style.display = 'none';
      editorModal.style.display = 'block';
  }
};


//Each function deletes a draft, post, or note based on the id.
// It asks for confirmation before deleting.
// Once deleted, the list (drafts, posts, or notes) refreshes to reflect the changes.


//Deletes the draft using deleteDraft(id).
// Refreshes the draft list by calling displayDrafts().
window.handleDraftDelete = (id) => {
  if (confirm('Are you sure you want to delete this draft?')) {
      deleteDraft(id);
      displayDrafts();
  }
};

// Deletes the post using deletePost(id).
// Refreshes the post list with displayPosts().

window.handlePostDelete = (id) => {
  if (confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      displayPosts();
  }
};

// Deletes the note using deleteNote(id).
// Refreshes the note list by calling displayNotes().

window.handleNoteDelete = (id) => {
  if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      displayNotes();
  }
};

// Initialize
displayPosts();





