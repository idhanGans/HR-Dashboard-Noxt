import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  StreamableFile,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PayslipsService } from "@/payroll/payslips/payslips.service";
import { PayrollPeriodDto } from "@/payroll/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { SelfOrRoles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";
import { SelfOrRolesGuard } from "@/auth/guards/self-or-roles.guard";

@ApiTags("payroll")
@Controller("payroll")
@UseGuards(JwtAuthGuard, SelfOrRolesGuard, RolesGuard)
@ApiBearerAuth()
export class PayslipsController {
  constructor(private readonly payslipsService: PayslipsService) {}

  @Get(":userId/payslip")
  @ApiOperation({ summary: "Download payslip PDF for a user by period" })
  @SelfOrRoles("userId", Role.SUPERADMIN)
  @ApiParam({
    name: "userId",
    description: "User ID",
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: "month",
    description: "Payroll Month",
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: "year",
    description: "Payroll Year",
    example: 2024,
    type: Number,
  })
  @ApiProduces("application/pdf")
  @ApiResponse({
    status: 200,
    description: "Payslip PDF generated successfully",
  })
  @ApiResponse({ status: 400, description: "Invalid month/year parameters" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Payroll not found" })
  @ApiResponse({ status: 500, description: "Payslip generation failed" })
  async downloadPayslip(
    @Param("userId", ParseIntPipe) userId: number,
    @Query() period: PayrollPeriodDto,
  ): Promise<StreamableFile> {
    const pdfBuffer = await this.payslipsService.generatePayslipPdf(
      userId,
      period.month,
      period.year,
    );
    const filename = `payslip_${userId}_${period.year}_${period.month}.pdf`;

    return new StreamableFile(pdfBuffer, {
      type: "application/pdf",
      disposition: `attachment; filename="${filename}"`,
    });
  }
}
