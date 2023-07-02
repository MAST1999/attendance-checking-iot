/// <reference types="lucia" />
declare namespace Lucia {
  // ...
  type UserAttributes = {
    // some_column: SomeType;
    personnel_id: string;
    role: "admin" | "user";
  };
}
