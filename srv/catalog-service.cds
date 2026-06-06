using { com.bookshop as db } from '../db/schema';

service CatalogService @(path: '/catalog') {

  @readonly
  entity Books as projection on db.Books;

  @readonly
  entity Authors as projection on db.Authors;

}