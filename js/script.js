// book class tha represent every book data.
class Book {
    constructor(title, category, author, isbn) {
        this.title = title;
        this.category = category;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI class that handle user book data.
class UI {
    static displayBook() {
        const storedbooks = store.getBook();
        storedbooks.forEach((book) => UI.addBook(book));
    }
    static addBook(book) {
        const list = document.querySelector('#book_list_body');
        const row = document.createElement('tr');
        row.classList.add('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.category}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><button class="btn btn-danger delete" id="delete"><i class="fas fa-times"></i></button></td>
            <td><button class="btn btn-success edit" id="edit"><i class="fas fa-edit"></i></button></td>`;
        list.appendChild(row); 
    }
    static checkbook(book)
    {
        const getbooks = store.getBook();
        getbooks.forEach(getbook => {
            if(getbook.isbn === book.isbn)
            {
                this.clearForm();
                throw UI.showalert(`Your Book already Added can't add twice` , 'success');
            }
        });  
    }
    static clearForm() {

        var inputs = document.getElementsByClassName("form-control");

        for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
    }
    static DeleteData(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
            UI.showalert('Your Book Removed' , 'success')
        }
    }
    static showalert (mesaage , className)
    {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${className}`;
        alertDiv.appendChild(document.createTextNode(mesaage));
        const alertparent = document.querySelector('.alert-parent');
        alertparent.appendChild(alertDiv)
        setTimeout(()=>document.querySelector('.alert').remove(),4000)
    }
    static getDataFromLocalStr (el)
    {
        if (el.classList.contains('edit'))
            {
                let targetbooks = store.getBook();
                const isbnget = el.parentElement.previousElementSibling.previousElementSibling.innerHTML;
                targetbooks.forEach((targetbook)=>{
                    if (targetbook.isbn === isbnget)
                    {
                        document.querySelector('#title').value = targetbook.title;
                        document.querySelector('#category').value = targetbook.category;
                        document.querySelector('#author').value = targetbook.author;
                        document.querySelector('#ISBN').value = targetbook.isbn;
                    }
                });
            }
    }
}
// localstorage class book 
class store {
    static getBook()
    {
        let books;
        if(localStorage.getItem('books') === null)
        {
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }   
        return books;
    }
    static addBook (book)
    {
        const books = this.getBook();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static editBook()
    {
        const books = this.getBook();
        const getisbn = document.querySelector('#ISBN').value;
        books.forEach(book => {
            if(book.isbn === getisbn)
            {
                book.title = document.querySelector('#title').value;
                book.category = document.querySelector('#category').value;
                book.author = document.querySelector('#author').value;
                book.isbn = document.querySelector('#ISBN').value;
                localStorage.setItem('books', JSON.stringify(books));
            }
        });
    }
    static removeBook (isbn)
    {
        const books = this.getBook();
        books.forEach((book)=>{
            if (book.isbn === isbn)
            {
                books.splice(books.indexOf(book),1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books))
    }
}
// event display the book 
document.addEventListener('DOMContentLoaded', UI.displayBook());
//event add the book
const addBookBtn = document.querySelector('#add-book');
addBookBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const title = document.querySelector('#title').value;
    const category = document.querySelector('#category').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#ISBN').value;
    if (title === '' || category === '' || author === '' || isbn === '')
    {
        UI.showalert('please insert all data' , 'danger')
    }
    else 
    {
        var book = new Book(title, category, author, isbn)
        UI.checkbook(book);
        store.addBook(book);
        UI.clearForm();
        UI.addBook(book);
        UI.showalert('Your Book Added' , 'success');
    }
});
// event edit on data in UI and localstorage
var edity = document.querySelector('#edit-book');
edity.addEventListener('click', (e) => {
    e.preventDefault();
    store.editBook();
    const title = document.querySelector('#title').value;
    const category = document.querySelector('#category').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#ISBN').value;
    if (title === '' || category === '' || author === '' || isbn === '')
    {
        UI.showalert(`can't edit on empty field` , 'danger')
    }
    else
    {
        const getisbn = document.querySelector('#ISBN').value;
        const getbooks = store.getBook();
        getbooks.forEach(getbook => {
            if (getbook.isbn === getisbn)
            {
                const rowtr = document.querySelector('.tr')
                const rowchilds = rowtr.children;
                for(let i = 0; i < rowchilds.length; i++)
                {
                    const sbnNo = rowchilds[3].innerHTML;
                    if(getbook.isbn == sbnNo)
                    {
                        rowchilds[0].innerHTML = document.querySelector('#title').value;
                        rowchilds[1].innerHTML = document.querySelector('#category').value
                        rowchilds[3].innerHTML = document.querySelector('#author').value;
                        rowchilds[3].innerHTML = getbook.isbn;
                    }
                }
                UI.showalert('Your Book Edited successfully' , 'success') 
                UI.clearForm();       
            }
        });
    }
});
// event remove the book
const ListData = document.querySelector('#book_list_body');
ListData.addEventListener('click', (e) => {
    UI.DeleteData(e.target);
    store.removeBook(e.target.parentElement.previousElementSibling.textContent) 
});
// event get data of the book
var Btn = document.querySelector('#edit')
ListData.addEventListener('click', (e)=>{ 
    e.preventDefault();
    UI.getDataFromLocalStr(e.target);
});
// media changes 
document.addEventListener('DOMContentLoaded', ()=>{
    if(window.matchMedia('(max-width: 767px)').matches)
        {
            console.log(window.matchMedia('(max-width: 600px)').matches);
            UI.showalert(`Rotate Your Device For Best Use`, `success`)
        }
})