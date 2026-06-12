export interface IBaseRepository<T, CreateInput, UpdateInput, WhereInput = object> {
  findById(id: string): Promise<T | null>;
  findMany(where?: WhereInput, skip?: number, take?: number, orderBy?: object): Promise<T[]>;
  count(where?: WhereInput): Promise<number>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  softDelete(id: string): Promise<T>;
}
