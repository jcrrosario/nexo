import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ListTeamDto } from './dto/list-team.dto';

import { Tenant } from '../../shared/decorators/tenant.decorator';
import { User } from '../../shared/decorators/user.decorator';

import { PdfService } from '../../shared/services/pdf.service';
import { ExcelService } from '../../shared/services/excel.service';
import { reportTemplate } from '../../shared/templates/report.template';

@UseGuards(AuthGuard('jwt'))
@Controller('team')
export class TeamController {
  constructor(private readonly service: TeamService) {}

  @Post()
  create(
    @Body() dto: CreateTeamDto,
    @Tenant() tenantId: string,
    @User() user: any,
  ) {
    return this.service.create(dto, tenantId, user.email);
  }

  @Get()
  findAll(
    @Query() query: ListTeamDto,
    @Tenant() tenantId: string,
  ) {
    return this.service.findAll(query, tenantId);
  }

  // =========================
  // EXPORT PDF
  // =========================
  @Get('export/pdf')
  async exportPdf(
    @Query() query: ListTeamDto,
    @Tenant() tenantId: string,
    @Res() res: Response,
  ) {
    const result = await this.service.findAll(
      { ...query, page: undefined, limit: undefined },
      tenantId,
    );

    const teams = result.data;

    const html = reportTemplate({
      title: 'Relatório de Times',
      columns: ['Nome do time'],
      rows: teams.map(team => [team.name]),
    });

    const buffer = await PdfService.generate(html);

    res
      .setHeader('Content-Type', 'application/pdf')
      .setHeader(
        'Content-Disposition',
        'attachment; filename=times.pdf',
      )
      .send(buffer);
  }

  // =========================
  // EXPORT EXCEL
  // =========================
  @Get('export/excel')
  async exportExcel(
    @Query() query: ListTeamDto,
    @Tenant() tenantId: string,
    @Res() res: Response,
  ) {
    const result = await this.service.findAll(
      { ...query, page: undefined, limit: undefined },
      tenantId,
    );

    const teams = result.data;

    const buffer = await ExcelService.generate({
      title: 'Times',
      columns: ['Nome do time'],
      rows: teams.map(team => [team.name]),
    });

    res
      .setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      .setHeader(
        'Content-Disposition',
        'attachment; filename=times.xlsx',
      )
      .send(buffer);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTeamDto,
    @Tenant() tenantId: string,
    @User() user: any,
  ) {
    return this.service.update(id, dto, tenantId, user.email);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Tenant() tenantId: string,
  ) {
    return this.service.remove(id, tenantId);
  }
}
