
    CREATE TABLE users
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE products
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE categories
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE orders
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE order_items
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE cart_items
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE product_images
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE gemstones
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE materials
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE reviews
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE wishlists
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE addresses
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE payments
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );


    CREATE TABLE inventory
    (
      ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
      value jsonb NOT NULL,
      PRIMARY KEY(ID)
    );
