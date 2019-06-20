// Book Class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class
class UI {
  static displayBooks() {
    const storedBooks = Store.getBooks();

    const books = storedBooks;

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const singleBook = document.querySelector("#my-books");
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td class="book-isbn">${book.isbn}</td>
    <button class="booklist__remove">Delete</button>
    `;

    singleBook.appendChild(row);
  }

  static showAlert() {
    //tbd custom alert
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static deleteBook(element) {
    Store.deleteBook(
      element.parentElement.querySelector(".book-isbn").textContent
    );
    if (element.classList.contains("booklist__remove")) {
      element.parentElement.remove();
    }
  }

  static deleteBooks() {
    Store.deleteBooks();
    const allBooks = document.querySelector("#my-books");

    while (allBooks.firstChild) {
      allBooks.removeChild(allBooks.firstChild);
    }
  }
}

// Class Store
class Store {
  static getBooks() {
    let books;
    if (!localStorage.getItem("books")) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    console.log(books);
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static deleteBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }

  static deleteBooks(isbn) {
    localStorage.removeItem("books");
  }
}

// EVENTS
// Event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: add books
document.querySelector(".booklist__form").addEventListener("submit", e => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  const isbnNumber = parseFloat(isbn);

  if (!title || !author || !isbn) {
    alert("Complete the form before submission");
    return;
  }

  if (isNaN(isbnNumber)) {
    alert("ISBN must be a number");
    return;
  }

  const newBook = new Book(title, author, isbn);

  Store.addBook(newBook);

  UI.addBookToList(newBook);

  UI.clearFields();
});

// Event: remove single book
document.querySelector("#my-books").addEventListener("click", e => {
  UI.deleteBook(e.target);
});

// Event: remove all books
document
  .querySelector(".booklist__remove--all")
  .addEventListener("click", UI.deleteBooks);
