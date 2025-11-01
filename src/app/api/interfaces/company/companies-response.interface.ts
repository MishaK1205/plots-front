import { PaginationResponseInterface } from "../pagination-response.interface";
import { CompanyResponseInterface } from "./company-response.interface";

export interface CompaniesResponseInterface {
  data: CompanyResponseInterface[];
  pagination: PaginationResponseInterface;
}