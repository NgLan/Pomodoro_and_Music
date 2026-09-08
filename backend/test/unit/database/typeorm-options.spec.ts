import { createNestTypeOrmOptions } from '../../../src/infrastructure/database/typeorm-options.js';

describe('TypeORM runtime options', () => {
  const database = { url: 'postgresql://localhost/application' };

  it('reserves production migrations for the release job', () => {
    expect(createNestTypeOrmOptions(database, 'production')).toMatchObject({
      migrationsRun: false,
      synchronize: false,
    });
  });
});
