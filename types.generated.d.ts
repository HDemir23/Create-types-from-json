type Root = {
  users: User[];
  admins: number[];
};


type UserInner0 = {
  age: number;
  active: boolean;
};

type User = {
  id: number;
  name: string;
  profile: UserInner0;
};