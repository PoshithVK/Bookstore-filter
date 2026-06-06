// srv/admin-service.js
const cds = require('@sap/cds');

module.exports = class AdminService extends cds.ApplicationService {
  async init() {

    // ✅ BEFORE CREATE
    this.before('CREATE', 'Books', async (req) => {

      const { title, price, stock, isbn, genre, author_ID } = req.data;

      console.log('Creating book:', req.data);

      // --- Required field checks ---
      if (!title || title.trim().length === 0) {
        req.error(400, 'Title is required and cannot be empty', 'title');
      }

      if (price === undefined || price === null) {
        req.error(400, 'Price is required', 'price');
      }

      // --- Value checks ---
      if (price !== undefined && price <= 0) {
        req.error(400, 'Price must be greater than zero', 'price');
      }

      if (price !== undefined && price > 9999.99) {
        req.error(400, 'Price cannot exceed 9999.99', 'price');
      }

      if (stock !== undefined && stock < 0) {
        req.error(400, 'Stock cannot be negative', 'stock');
      }

      // --- Format check ---
      if (isbn && isbn.length !== 13) {
        req.error(400, 'ISBN must be exactly 13 characters', 'isbn');
      }

      // --- Business rules ---
      const validGenres = [
        'Fantasy', 'Fiction', 'Mystery', 'Thriller',
        'Science Fiction', 'Romance', 'Non-Fiction',
        'Biography', 'Dystopian', 'Literary Fiction'
      ];

      if (genre && !validGenres.includes(genre)) {
        req.error(400, `Invalid genre. Must be one of: ${validGenres.join(', ')}`, 'genre');
      }

      // --- Foreign key check ---
      if (author_ID) {
        const author = await SELECT.one.from('com.bookshop.Authors')
          .where({ ID: author_ID });

        if (!author) {
          req.error(400, 'Author not found. Provide valid author_ID', 'author_ID');
        }
      }
    });


    // ✅ BEFORE UPDATE
    this.before('UPDATE', 'Books', (req) => {

      const { price, stock, isbn } = req.data;

      if (price !== undefined && price <= 0) {
        req.error(400, 'Price must be greater than zero', 'price');
      }

      if (stock !== undefined && stock < 0) {
        req.error(400, 'Stock cannot be negative', 'stock');
      }

      if (isbn !== undefined && isbn.length !== 13) {
        req.error(400, 'ISBN must be exactly 13 characters', 'isbn');
      }
    });

    return super.init();
  }
};