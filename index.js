const readline = require('readline');
const assert = require('assert');

class Book {
  constructor(title, author, pages) {
    assert(typeof title == 'string', "Title must be a string");
    assert(typeof author == 'string', "Author must be a string");
    assert(typeof pages == 'number', "Pages must be a number");

    this.id = Math.trunc(new Date() * Math.random());
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.borrower = null;

    console.log(`new Book created with id: ${this.id}`);
  }

  lend(borrower) {
    if (this.borrower) {
      throw new Error("Book is not avaible");
    }

    this.borrower = borrower;
    borrower.books.push(this);
  }

  retract() {
    if (!this.borrower) {
      throw new Error("Book is avaible");
    }

    this.borrower = null;
  }
}

class Borrower {
  constructor(name) {
    this.name = name;
    this.id = Math.trunc(new Date() * Math.random());
    this.books = [];
  }

  getBooks() {
    return this.books;
  }

  returnBook(id) {
    const index = this.books.findIndex(book => book.id == id);
    assert(index > -1, `${this.name} does not have book with id: ${id}`);
    this.books.splice(index, 1);
  }
}

// Singleton class
class Library {

  constructor() {
    this.books = [];
  }

  static instance = null;

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new Library();
    return this.instance;
  }

  get bookCount() {
    return this.books.length;
  }

  get allBooks() {
    return this.books;
  }

  get borrowedBookCount() {
    return this.books.filter(book => book.borrower != null).length;
  }

  get availableBookCount() {
    return this.books.filter(book => book.borrower == null).length;
  }


  add(book) {
    assert(book instanceof Book, `${book} must be an instance of Book`);

    this.books.push(book);
    return book.id;
  }


  remove(id) {
    assert(typeof id == 'number', "id must be a number");
    const bookIndex = this.books.findIndex(book => book.id == id);
    this.books.splice(bookIndex, 1);
  }


  lend(borrower, id) {
    if (!(borrower instanceof Borrower)) {
      throw new Error(`${borrower} must be an instance of borrower`);
    }

    assert(typeof id == "number", "id must be a number");

    const book = this.books.find(book => book.id == id);
    try {
      book.lend(borrower);
    } catch (err) {
      console.log(err);
    }
  }


  retract(id) {
    assert(typeof id == 'number', "id must be a number");
    const book = this.books.find(book => book.id == id);
    book.borrower.returnBook(id);
    book.borrower = null;
  }

  findById(id) {
    assert(typeof id == 'number', "id must be a number");

    return this.books.find(book => book.id == id);
  }
}


const lib = Library.getInstance();

let id1 = lib.add(new Book("Rich dad", "Robert Kiyosaki", 400));
let id2 = lib.add(new Book("Things fall apart", "Chinua Achebe", 200));
let id3 = lib.add(new Book("Half of a yeloow sun", "Chimamanda", 170));

const lib2 = Library.getInstance(); // returns same instance as in lib.

console.log(lib2);
console.log(lib);

console.log(lib.borrowedBookCount);

lib.lend(new Borrower("Vic"), id1);
console.log("Number of borrowed books: " + lib.borrowedBookCount);

lib2.lend(new Borrower("Chijioke"), id3);

console.log(lib2);

console.log(`Borrower of book with id: ${id3} is ${lib.findById(id3).borrower.name}`);

lib.retract(id1);

console.log(lib);

