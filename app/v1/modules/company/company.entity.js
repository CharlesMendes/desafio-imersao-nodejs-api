class CompanyEntity {
  constructor({ name, cnpj, employeeList }) {
    this.name = name;
    this.cnpj = cnpj;
    this.employeeList = employeeList;
  }
}

module.exports = CompanyEntity;
