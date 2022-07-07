const bookShelf = [];
const RENDER_EVENT = "render-book-shelf";
const SAVE_EVENT = "saved-book-shelf";
const STORAGE_KEY = "BOOK-SHELF-APP";

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookShelfLists = document.getElementById(
    "uncompletedBookShelfLists"
  );
  uncompletedBookShelfLists.innerHTML = "";

  const completedBookShelfLists = document.getElementById(
    "completedBookShelfLists"
  );
  completedBookShelfLists.innerHTML = "";

  for (bookShelfItem of bookShelf) {
    const bookShelfElement = makeBook(bookShelfItem);

    if (!bookShelfItem.isComplete) {
      uncompletedBookShelfLists.append(bookShelfElement);
    } else {
      completedBookShelfLists.append(bookShelfElement);
    }
  }
});

function generatedId() {
  return +new Date();
}

function generatedBookShelfObjects(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser yang Anda gunakan tidak mendukung local storage!");
    return false;
  }
  return true;
}

document.addEventListener(SAVE_EVENT, function () {
  const save = localStorage.getItem(STORAGE_KEY);
  console.log(save);
});

// Menyimpan Data Buku
function saveData() {
  if (isStorageExist()) {
    const parseBookShelf = JSON.stringify(bookShelf);
    localStorage.setItem(STORAGE_KEY, parseBookShelf);
    document.dispatchEvent(new Event(SAVE_EVENT));
  }
}

function loadDataFromStorage() {
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializeData);

  if (data !== null) {
    for (const book of data) {
      bookShelf.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Tambahkan Data Buku
function addBook() {
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = document.getElementById("inputBookYear").value;

  const generatedID = generatedId();
  const bookShelfObjects = generatedBookShelfObjects(
    generatedID,
    inputBookTitle,
    inputBookAuthor,
    inputBookYear,
    false
  );
  bookShelf.push(bookShelfObjects);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Buat Data Buku
function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book_item");
  textContainer.setAttribute("id", `book_${bookObject.id}`);
  textContainer.append(textTitle, textAuthor, textYear);

  // const container = document.createElement("div");
  // container.append(textContainer);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.innerText = "Unfinished Reading";
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoUnreadBookComplete(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete Book";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function () {
      deleteBookFromComplete(bookObject.id);
    });

    textContainer.append(undoButton, deleteButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.innerText = "Finished Reading";
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addReadBookToComplete(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete Book";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function () {
      deleteBookFromComplete(bookObject.id);
    });

    textContainer.append(checkButton, deleteButton);
  }

  return textContainer;
}

function undoUnreadBookComplete(bookID) {
  const bookTarget = findBook(bookID);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBookFromComplete(bookID) {
  const bookTarget = findBookIndex(bookID);

  if (bookTarget === -1) {
    return;
  }
  // splice(start, deleteCount)
  bookShelf.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addReadBookToComplete(bookID) {
  const bookTarget = findBook(bookID);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookID) {
  for (const index in bookShelf) {
    if (bookShelf[index].id === bookID) {
      return index;
    }
  }
  return -1;
}

function findBook(bookID) {
  for (const bookItem of bookShelf) {
    if (bookItem.id === bookID) {
      return bookItem;
    }
  }
  return null;
}

const searchButton = document.getElementById("searchSubmit");
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  const searchBook = document.getElementById("searchBookTitle").value;
  const book = searchBook.toLowerCase();
  const bookLists = document.querySelectorAll(".book_item h3");

  for (whatBook of bookLists) {
    if (book === whatBook.innerText.toLowerCase()) {
      whatBook.parentElement.style.display = "block";
    } else {
      whatBook.parentElement.style.display = "none";
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const submitFormInputBook = document.getElementById("inputBook");
  submitFormInputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
