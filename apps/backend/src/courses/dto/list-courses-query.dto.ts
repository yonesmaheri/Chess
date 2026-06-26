import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CourseLevel } from '../../generated/prisma/client';

export enum CourseSortOption {
  newest = 'newest',
  popular = 'popular',
  rating = 'rating',
}

export class ListCoursesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  limit?: number = 6;

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(CourseSortOption)
  sort?: CourseSortOption = CourseSortOption.newest;

  @IsOptional()
  @IsString()
  search?: string;
}
