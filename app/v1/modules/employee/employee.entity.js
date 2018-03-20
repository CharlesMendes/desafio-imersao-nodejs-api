class EmployeeEntity {
  constructor({ name, age, birthdate, office, userId, userEmail }) {
    this.name = name;
    this.age = age;
    this.birthdate = birthdate;
    this.office = office;
    this.userId = userId;
    this.userEmail = userEmail;
  }
}

module.exports = EmployeeEntity;
