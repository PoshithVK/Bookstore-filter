// srv/admin-service.js
const cds = require('@sap/cds');

module.exports = function () {

  // ═══════════════════════════════════════════════
  //  BOOKS — Validation & Logic
  // ═══════════════════════════════════════════════

  // --- Before CREATE: Validate input ---
  this.before('CREATE', 'Books', async (req) => {
    const { title, price, stock, isbn, author_ID } = req.data;

    // Required fields
    if (!title || title.trim() === '') {
      req.error(400, 'Title is required', 'title');
    }
    if (price === undefined || price === null) {
      req.error(400, 'Price is required', 'price');
    }

    // Range validation
    if (price !== undefined && price <= 0) {
      req.error(400, 'Price must be greater than zero', 'price');
    }
    if (stock !== undefined && stock < 0) {
      req.error(400, 'Stock cannot be negative', 'stock');
    }

    // Format validation
    if (isbn && !/^\d{13}$/.test(isbn)) {
      req.error(400, 'ISBN must be exactly 13 digits', 'isbn');
    }

    // Referential integrity
    if (author_ID) {
      const { Authors } = cds.entities;
      const author = await SELECT.one.from(Authors).where({ ID: author_ID });
      if (!author) {
        req.error(404, 'Author not found', 'author_ID');
      }
    }

    // Clean input
    if (title) req.data.title = title.trim();
  });

  // --- Before UPDATE: Same validations for changed fields ---
  this.before('UPDATE', 'Books', (req) => {
    const { price, stock, isbn } = req.data;

    if (price !== undefined && price <= 0) {
      req.error(400, 'Price must be greater than zero', 'price');
    }
    if (stock !== undefined && stock < 0) {
      req.error(400, 'Stock cannot be negative', 'stock');
    }
    if (isbn !== undefined && !/^\d{13}$/.test(isbn)) {
      req.error(400, 'ISBN must be exactly 13 digits', 'isbn');
    }
  });

  // --- After READ: Add computed fields ---
  this.after('READ', 'Books', (results) => {
    const books = Array.isArray(results) ? results : [results];

    for (const book of books) {
      if (book.price) {
        book.priceWithTax = +(book.price * 1.18).toFixed(2);
      }
      if (book.stock !== undefined) {
        book.availability = book.stock > 10 ? 'In Stock'
                          : book.stock > 0  ? 'Low Stock'
                          : 'Out of Stock';
      }
    }
  });

  // --- Before DELETE: Check dependencies ---
  this.before('DELETE', 'Books', async (req) => {
    const ID = req.params[0]?.ID || req.params[0];
    // In a real app, check if this book is referenced in any orders
    console.log(`[INFO] Deleting book ${ID}`);
  });

  // ═══════════════════════════════════════════════
  //  AUTHORS — Validation & Logic
  // ═══════════════════════════════════════════════

  this.before('CREATE', 'Authors', (req) => {
    const { name, email } = req.data;

    if (!name || name.trim() === '') {
      req.error(400, 'Author name is required', 'name');
    }

    if (email && !email.includes('@')) {
      req.error(400, 'Please provide a valid email address', 'email');
    }

    if (name) req.data.name = name.trim();
  });

  this.before('DELETE', 'Authors', async (req) => {
    const ID = req.params[0]?.ID || req.params[0];
    const { Books } = cds.entities;
    const books = await SELECT.from(Books).where({ author_ID: ID });

    if (books.length > 0) {
      req.reject(409,
        `Cannot delete author: ${books.length} book(s) reference this author. Delete or reassign books first.`
      );
    }
  });

};