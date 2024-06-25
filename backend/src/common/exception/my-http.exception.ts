import { ApiProperty } from '@nestjs/swagger';

export class MyHttpException {
  @ApiProperty()
  statusCode: number;
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string;
  @ApiProperty()
  error: string;
}
