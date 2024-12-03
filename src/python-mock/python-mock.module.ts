import { Module } from '@nestjs/common';
import { PythonMockService } from './python-mock.service';
import { PythonMockController } from './python-mock.controller';

@Module({
  controllers: [PythonMockController],
  providers: [PythonMockService],
  exports: [PythonMockService],
})
export class PythonMockModule {}
