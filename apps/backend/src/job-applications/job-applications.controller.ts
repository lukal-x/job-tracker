import { Controller, Get } from '@nestjs/common';

@Controller('jobs')
export class JobApplicationsController {
    @Get()
    async getJobs() {
        return 'Hello'
    }
}
