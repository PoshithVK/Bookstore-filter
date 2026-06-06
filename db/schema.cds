namespace com.bookshop;

using { cuid } from '@sap/cds/common';

entity Authors : cuid {
  name    : String;
  country : String;

  books   : Association to many Books on books.author = $self;
}

entity Books : cuid {
  title       : String;
  genre       : String;
  price       : Decimal(9,2);
  rating      : Decimal(2,1);
  stock       : Integer;
  isbn        : String;
  publishDate : Date;

  author      : Association to Authors;
}