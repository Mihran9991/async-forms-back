class User {
    public constructor(uuid: String, name: String, surname: String, email: String, password: String, salt: String) {
        this.uuid = uuid;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.salt = salt;
    }

    uuid: String;
    name: String;
    surname: String;
    email: String;
    password: String;
    salt: String;
}
