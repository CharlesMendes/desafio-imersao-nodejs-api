class CompanyEntity {
  constructor(company) {
    this.name = company.name;
    this.cnpj = company.cnpj;
    this.employees = company.employees;
  }
}

module.exports = CompanyEntity;
