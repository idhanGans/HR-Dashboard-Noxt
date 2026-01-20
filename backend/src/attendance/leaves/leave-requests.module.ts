import { Module } from "@nestjs/common";
import { PrismaModule } from "@/prisma/prisma.module";
import { LeaveRequestsController } from "@/attendance/leaves/leave-requests.controller";
import { LeaveRequestsService } from "@/attendance/leaves/leave-requests.service";

@Module({
  imports: [PrismaModule],
  controllers: [LeaveRequestsController],
  providers: [LeaveRequestsService],
  exports: [LeaveRequestsService],
})
export class LeaveRequestsModule {}
