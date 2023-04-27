import { AppDataSource } from "../data_source";

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
});

afterAll(async () => {
  AppDataSource.entityMetadatas.forEach(async (entity) => {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.schema || "public"}.${entity.tableName}`);
  });

  await AppDataSource.destroy();
});
