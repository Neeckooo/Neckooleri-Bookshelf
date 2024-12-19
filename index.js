const RENDER_EVENT = "render-book";
const STORAGE_KEY = "Bookshelf";
const form = document.getElementById("inputBook");
const inputSearchBook = document.getElementById("searchBookTitle");
const formSearchBook = document.getElementById("searchBook");
const buku2 = [];

const generateId = () => +new Date();

function isStorageExist() {
    if (typeof Storage === "undefined") {
        swal("Browser anda tidak mendukung");
        return false;
    }
    return true;
}

function generateBookItem(id, title, author, year, publisher, isCompleted) {
    return {
        id: id,
        title: title,
        author: author,
        year: year,
        publisher: publisher,
        isCompleted: isCompleted,
    };
}

const checkStatusBook = () => {
    const isCheckComplete = document.getElementById("inputBookIsComplete");
    return isCheckComplete.checked;
}

function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = parseInt(document.getElementById("inputBookYear").value);
    const publisher = document.getElementById("inputPublisher").value;
    const isCompleted = checkStatusBook();

    const id = generateId();
    const newBook = generateBookItem(id, title, author, year, publisher, isCompleted);

    buku2.unshift(newBook);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const findBookIndex = (bookId) => {
    return buku2.findIndex(book => book.id === bookId);
}

const removeBook = (bookId) => {
    const bookIndex = buku2.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            buku2.splice(bookIndex, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }
}

function changeBookStatus(bookId) {
    const bookIndex = findBookIndex(bookId);
        if (bookIndex !== null) {
            if (buku2[bookIndex].isCompleted === true) {
                buku2[bookIndex].isCompleted = false;
                swal("Lanjut Baca", "Jan berenti ampe kelar bukunya", "success");
            } else {
                buku2[bookIndex].isCompleted = true;
                swal("Mangteep", "Jan lupa baca buku yang lainnya", "success");
            }

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }
}

const searchBooks = () => {
    const inputSearchValue = document.getElementById("searchBookTitle").value.toLowerCase();
    const incompleteBookShelf = document.getElementById("incompleteBookshelfList");
    const completeBookShelf = document.getElementById("completeBookshelfList");
    incompleteBookShelf.innerHTML = "";
    completeBookShelf.innerHTML = "";
  
    if (inputSearchValue == "") {
        document.dispatchEvent(new Event(RENDER_EVENT));
        return;
    }
  
    const filteredBooks = buku2.filter(book => book.title.toLowerCase().includes(inputSearchValue));
  
    filteredBooks.forEach((book) => {
      const { id, title, author, year, publisher, isCompleted } = book;
      const buttonStatusText = isCompleted ? "Belum kelar baca" : "Kelar baca";
      const buttonStatusClass = isCompleted ? "btn-green" : "btn-red";
  
      let lng = `
        <article class="book_item">
          <h3>${title}</h3>
          <p>Penulis : ${author}</p>
          <p>Penerbit : ${publisher}</p>
          <p>Tahun Terbit : ${year}</p>
  
          <div class="action">
            <button class="${buttonStatusClass}" onclick="changeBookStatus(${id})">${buttonStatusText}</button>
            <button class="btn-red" onclick="removeBook(${id})">Hapus Buku</button>
          </div>
        </article>
      `;
  
        if (isCompleted) {
            completeBookShelf.innerHTML += lng;
        } else {
            incompleteBookShelf.innerHTML += lng;
        }
    });
}
  

const showBook = (buku2 = []) => {
    const incompleteBookShelf = document.getElementById("incompleteBookshelfList");
    const completeBookShelf = document.getElementById("completeBookshelfList");

    incompleteBookShelf.innerHTML = "";
    completeBookShelf.innerHTML = "";

    buku2.forEach((book) => {
        if (book.isCompleted == false) {
            let lng = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Penerbit : ${book.publisher}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="btn-green" onclick="changeBookStatus(${book.id})">Kelar baca</button>
                  <button class="btn-red" onclick="removeBook(${book.id})">Hapus Buku</button>
               </div>
            </article>
            `;

            incompleteBookShelf.innerHTML += lng;
        } else {
            let lng = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Penerbit : ${book.publisher}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="btn-green" onclick="changeBookStatus(${book.id})">Belum kelar baca</button>
                  <button class="btn-red" onclick="removeBook(${book.id})">Hapus Buku</button>
                  </div>
            </article>
            `;

            completeBookShelf.innerHTML += lng;
        }
    });
}

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(buku2);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
}
  

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

        if (data !== null) {
            data.forEach((book) => {
                buku2.unshift(book);
            });
        }
        
    document.dispatchEvent(new Event(RENDER_EVENT));
    return buku2;
}

inputSearchBook.addEventListener("input", (event) => {
    event.preventDefault();
    searchBooks();
});

formSearchBook.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBooks();
});

document.addEventListener("DOMContentLoaded", function () {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();

        form.reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, () => {
    showBook(buku2);
});
